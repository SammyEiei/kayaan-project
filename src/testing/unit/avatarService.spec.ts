import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as avatarSvc from '@/services/avatarService'
import { api, plainFetch } from '@/services/api'

// Mock the API module
vi.mock('@/services/api', async (orig) => {
  const actual = await (orig as any).default?.() ?? {}
  return {
    ...actual,
    api: {
      post: vi.fn(),
      put: vi.fn()
    },
    plainFetch: vi.fn(),
  }
})

describe('avatarService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getSignedUploadUrl', () => {
    it('should request signed upload URL successfully', async () => {
      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      const mockResponse = {
        signedUrl: 'https://signed.put.url',
        path: 'users/1/avatar.jpg',
        expiresIn: 3600
      }

      ;(api.post as any).mockResolvedValueOnce({ data: mockResponse })

      const result = await avatarSvc.getSignedUploadUrl(1, file)

      expect(api.post).toHaveBeenCalledWith('/api/users/1/avatar-upload-url', {
        fileName: 'avatar.jpg',
        contentType: 'image/jpeg'
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      const error = new Error('API Error')

      ;(api.post as any).mockRejectedValueOnce(error)

      await expect(avatarSvc.getSignedUploadUrl(1, file)).rejects.toThrow('API Error')
    })
  })

  describe('uploadToSignedUrl', () => {
    it('should upload file to signed URL successfully', async () => {
      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      const signedUrl = 'https://signed.put.url'

      ;(plainFetch as any).mockResolvedValueOnce(new Response(null, { status: 200 }))

      await avatarSvc.uploadToSignedUrl(signedUrl, file)

      expect(plainFetch).toHaveBeenCalledWith(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: file
      })
    })

    it('should handle upload errors', async () => {
      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      const signedUrl = 'https://signed.put.url'

      ;(plainFetch as any).mockResolvedValueOnce(new Response('Upload failed', { status: 500 }))

      await expect(avatarSvc.uploadToSignedUrl(signedUrl, file)).rejects.toThrow('Upload failed: 500 Upload failed')
    })
  })

  describe('saveAvatarPath', () => {
    it('should save avatar path successfully', async () => {
      const mockResponse = {
        avatarUrl: 'https://cdn.example.com/avatar.jpg',
        path: 'users/1/avatar.jpg'
      }

      ;(api.put as any).mockResolvedValueOnce({ data: mockResponse })

      const result = await avatarSvc.saveAvatarPath(1, 'users/1/avatar.jpg')

      expect(api.put).toHaveBeenCalledWith('/api/users/1/avatar-url', {
        path: 'users/1/avatar.jpg'
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')

      ;(api.put as any).mockRejectedValueOnce(error)

      await expect(avatarSvc.saveAvatarPath(1, 'users/1/avatar.jpg')).rejects.toThrow('API Error')
    })
  })

  describe('uploadAvatar', () => {
    it('should complete full upload flow successfully', async () => {
      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      const signedResponse = {
        signedUrl: 'https://signed.put.url',
        path: 'users/1/avatar.jpg'
      }
      const saveResponse = {
        avatarUrl: 'https://cdn.example.com/avatar.jpg',
        path: 'users/1/avatar.jpg'
      }

      ;(api.post as any).mockResolvedValueOnce({ data: signedResponse })
      ;(plainFetch as any).mockResolvedValueOnce(new Response(null, { status: 200 }))
      ;(api.put as any).mockResolvedValueOnce({ data: saveResponse })

      const result = await avatarSvc.uploadAvatar(1, file)

      expect(result).toEqual(saveResponse)
      expect(api.post).toHaveBeenCalledTimes(1)
      expect(plainFetch).toHaveBeenCalledTimes(1)
      expect(api.put).toHaveBeenCalledTimes(1)
    })

    it('should handle missing signed URL', async () => {
      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      const signedResponse = {
        path: 'users/1/avatar.jpg'
      }

      ;(api.post as any).mockResolvedValueOnce({ data: signedResponse })

      await expect(avatarSvc.uploadAvatar(1, file)).rejects.toThrow('No signed upload URL returned from server')
    })

    it('should handle uploadUrl instead of signedUrl', async () => {
      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      const signedResponse = {
        uploadUrl: 'https://upload.put.url',
        path: 'users/1/avatar.jpg'
      }
      const saveResponse = {
        avatarUrl: 'https://cdn.example.com/avatar.jpg',
        path: 'users/1/avatar.jpg'
      }

      ;(api.post as any).mockResolvedValueOnce({ data: signedResponse })
      ;(plainFetch as any).mockResolvedValueOnce(new Response(null, { status: 200 }))
      ;(api.put as any).mockResolvedValueOnce({ data: saveResponse })

      const result = await avatarSvc.uploadAvatar(1, file)

      expect(result).toEqual(saveResponse)
      expect(plainFetch).toHaveBeenCalledWith('https://upload.put.url', expect.any(Object))
    })

    it('should fallback to legacy upload when signed URL endpoint returns 400', async () => {
      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      const legacyResponse = {
        avatarUrl: 'https://cdn.example.com/avatar.jpg',
        path: 'users/1/avatar.jpg'
      }

      // Mock signed URL endpoint returning 400
      ;(api.post as any).mockRejectedValueOnce({
        response: { status: 400 }
      })
      // Mock legacy upload endpoint working
      ;(api.post as any).mockResolvedValueOnce({ data: legacyResponse })

      const result = await avatarSvc.uploadAvatar(1, file)

      expect(result).toEqual(legacyResponse)
      expect(api.post).toHaveBeenCalledTimes(2) // Once for signed URL, once for legacy
    })

    it('should fallback to legacy upload when signed URL endpoint returns 404', async () => {
      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      const legacyResponse = {
        avatarUrl: 'https://cdn.example.com/avatar.jpg',
        path: 'users/1/avatar.jpg'
      }

      // Mock signed URL endpoint returning 404
      ;(api.post as any).mockRejectedValueOnce({
        response: { status: 404 }
      })
      // Mock legacy upload endpoint working
      ;(api.post as any).mockResolvedValueOnce({ data: legacyResponse })

      const result = await avatarSvc.uploadAvatar(1, file)

      expect(result).toEqual(legacyResponse)
      expect(api.post).toHaveBeenCalledTimes(2) // Once for signed URL, once for legacy
    })

    it('should show user-friendly error when both endpoints fail', async () => {
      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })

      // Mock signed URL endpoint returning 400
      ;(api.post as any).mockRejectedValueOnce({
        response: { status: 400 }
      })
      // Mock legacy upload endpoint returning 410 (removed)
      ;(api.post as any).mockRejectedValueOnce({
        response: { status: 410 }
      })

      await expect(avatarSvc.uploadAvatar(1, file)).rejects.toThrow(
        'Avatar upload is not available. Please contact support or try again later.'
      )
      expect(api.post).toHaveBeenCalledTimes(2) // Once for signed URL, once for legacy
    })
  })
})
