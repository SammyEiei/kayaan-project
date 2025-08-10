import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AvatarUploader from '@/components/profile/AvatarUploader.vue'
import * as avatarSvc from '@/services/avatarService'
import { useAuthStore } from '@/stores/auth'

// Mock avatar service
vi.mock('@/services/avatarService', () => ({
  uploadAvatar: vi.fn()
}))

// Mock URL.createObjectURL and revokeObjectURL
const mockCreateObjectURL = vi.fn()
const mockRevokeObjectURL = vi.fn()

Object.defineProperty(global, 'URL', {
  value: {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL
  }
})

describe('AvatarUploader', () => {
  let pinia: any
  let authStore: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    authStore = useAuthStore()

    // Mock auth store
    authStore.user = { id: 1, email: 'test@example.com' }
    authStore.setAvatarUrl = vi.fn()
    authStore.fetchUserInfo = vi.fn()

    vi.resetAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render upload area', () => {
      const wrapper = mount(AvatarUploader, {
        props: { userId: 1 },
        global: { plugins: [pinia] }
      })

      expect(wrapper.find('.border-dashed').exists()).toBe(true)
      expect(wrapper.text()).toContain('Drop image here or click to upload')
    })

    it('should show file size limit', () => {
      const wrapper = mount(AvatarUploader, {
        props: { userId: 1, maxSizeMb: 10 },
        global: { plugins: [pinia] }
      })

      expect(wrapper.text()).toContain('up to 10MB')
    })
  })

  describe('File Validation', () => {
    it('should validate image files', async () => {
      const wrapper = mount(AvatarUploader, {
        props: { userId: 1 },
        global: { plugins: [pinia] }
      })

      const file = new File(['test'], 'test.txt', { type: 'text/plain' })

      // Call the validation function directly
      expect(() => wrapper.vm.validate(file)).toThrow('Only image files are allowed')
    })

    it('should validate file size', async () => {
      const wrapper = mount(AvatarUploader, {
        props: { userId: 1, maxSizeMb: 1 },
        global: { plugins: [pinia] }
      })

      // Create a file larger than 1MB
      const largeFile = new File(['x'.repeat(2 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })

      expect(() => wrapper.vm.validate(largeFile)).toThrow('File too large (>1 MB)')
    })
  })

  describe('Upload Flow', () => {
    it('should handle successful upload', async () => {
      const wrapper = mount(AvatarUploader, {
        props: { userId: 1 },
        global: { plugins: [pinia] }
      })

      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      const mockResult = { avatarUrl: 'https://example.com/avatar.jpg', path: 'users/1/avatar.jpg' }

      mockCreateObjectURL.mockReturnValue('blob:preview')
      ;(avatarSvc.uploadAvatar as any).mockResolvedValue(mockResult)

      // Call doUpload directly
      await wrapper.vm.doUpload(file)

      expect(avatarSvc.uploadAvatar).toHaveBeenCalledWith(1, file)
      expect(authStore.setAvatarUrl).toHaveBeenCalledWith(mockResult.avatarUrl)
      expect(wrapper.emitted('updated')).toBeTruthy()
      expect(wrapper.emitted('updated')?.[0]).toEqual([mockResult.avatarUrl])
    })

    it('should handle upload errors', async () => {
      const wrapper = mount(AvatarUploader, {
        props: { userId: 1 },
        global: { plugins: [pinia] }
      })

      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      const error = new Error('Upload failed')

      mockCreateObjectURL.mockReturnValue('blob:preview')
      ;(avatarSvc.uploadAvatar as any).mockRejectedValue(error)

      await wrapper.vm.doUpload(file)

      expect(wrapper.vm.errorMsg).toBe('Upload failed')
    })

    it('should fallback to fetchUserInfo when no avatarUrl returned', async () => {
      const wrapper = mount(AvatarUploader, {
        props: { userId: 1 },
        global: { plugins: [pinia] }
      })

      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      const mockResult = { path: 'users/1/avatar.jpg' } // No avatarUrl

      mockCreateObjectURL.mockReturnValue('blob:preview')
      ;(avatarSvc.uploadAvatar as any).mockResolvedValue(mockResult)
      authStore.fetchUserInfo.mockResolvedValue(undefined)
      authStore.user = { id: 1, avatarUrl: 'https://example.com/avatar.jpg' }

      await wrapper.vm.doUpload(file)

      expect(authStore.fetchUserInfo).toHaveBeenCalled()
      expect(wrapper.emitted('updated')).toBeTruthy()
    })
  })

  describe('Drag and Drop', () => {
    it('should handle file drop', async () => {
      const wrapper = mount(AvatarUploader, {
        props: { userId: 1 },
        global: { plugins: [pinia] }
      })

      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      const mockResult = { avatarUrl: 'https://example.com/avatar.jpg', path: 'users/1/avatar.jpg' }

      mockCreateObjectURL.mockReturnValue('blob:preview')
      ;(avatarSvc.uploadAvatar as any).mockResolvedValue(mockResult)

      // Simulate drop event
      const dropEvent = {
        preventDefault: vi.fn(),
        dataTransfer: { files: [file] }
      }

      await wrapper.vm.onDrop(dropEvent)

      expect(avatarSvc.uploadAvatar).toHaveBeenCalledWith(1, file)
    })

    it('should prevent default on dragover', async () => {
      const wrapper = mount(AvatarUploader, {
        props: { userId: 1 },
        global: { plugins: [pinia] }
      })

      const event = { preventDefault: vi.fn() }

      wrapper.vm.onDragOver(event)

      expect(event.preventDefault).toHaveBeenCalled()
    })
  })

  describe('Loading States', () => {
    it('should show loading state during upload', async () => {
      const wrapper = mount(AvatarUploader, {
        props: { userId: 1 },
        global: { plugins: [pinia] }
      })

      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })

      // Create a promise that doesn't resolve immediately
      let resolveUpload: (value: any) => void
      const uploadPromise = new Promise(resolve => {
        resolveUpload = resolve
      })

      mockCreateObjectURL.mockReturnValue('blob:preview')
      ;(avatarSvc.uploadAvatar as any).mockReturnValue(uploadPromise)

      // Start upload
      const uploadPromise2 = wrapper.vm.doUpload(file)

      await wrapper.vm.$nextTick()

      // Should show loading state
      expect(wrapper.vm.busy).toBe(true)

      // Resolve the upload
      resolveUpload!({ avatarUrl: 'https://example.com/avatar.jpg', path: 'users/1/avatar.jpg' })
      await uploadPromise2
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.busy).toBe(false)
    })
  })

  describe('Cleanup', () => {
    it('should revoke object URL on unmount', () => {
      const wrapper = mount(AvatarUploader, {
        props: { userId: 1 },
        global: { plugins: [pinia] }
      })

      // Set a preview URL
      wrapper.vm.previewUrl = 'blob:test'

      wrapper.unmount()

      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test')
    })
  })
})
