import { api, plainFetch } from './api'

export type SignedUpload = {
  signedUrl?: string // server may return 'signedUrl' or 'uploadUrl'
  uploadUrl?: string
  path: string
  expiresIn?: number
}

export type AvatarResponse = {
  avatarUrl?: string
  path: string
}

/**
 * Request signed upload URL from backend
 */
export async function getSignedUploadUrl(userId: number, file: File): Promise<SignedUpload> {
  try {
    const { data } = await api.post(`/api/users/${userId}/avatar-upload-url`, {
      fileName: file.name,
      contentType: file.type || 'application/octet-stream',
    })
    return data
  } catch (error: unknown) {
    // If signed URL endpoint is not available (404/400), fall back to legacy upload
        if (error && typeof error === 'object' && 'response' in error &&
        (error as { response?: { status?: number } }).response?.status === 404 ||
        (error as { response?: { status?: number } }).response?.status === 400) {
      console.warn('⚠️ Signed URL endpoint not available, falling back to legacy upload')
      throw new Error('SIGNED_URL_NOT_AVAILABLE')
    }
    throw error
  }
}

/**
 * Upload file to signed URL using plain fetch
 */
export async function uploadToSignedUrl(url: string, file: File): Promise<void> {
  const res = await plainFetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Upload failed: ${res.status} ${text}`)
  }
}

/**
 * Save avatar path to backend and get display URL
 */
export async function saveAvatarPath(userId: number, path: string): Promise<AvatarResponse> {
  const { data } = await api.put(`/api/users/${userId}/avatar-url`, { path })
  return data
}

/**
 * Legacy multipart upload fallback
 */
export async function legacyUploadAvatar(userId: number, file: File): Promise<AvatarResponse> {
  try {
    const formData = new FormData()
    formData.append('avatar', file)

    const { data } = await api.post(`/api/users/${userId}/avatar-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return data
  } catch (error: unknown) {
    // If legacy endpoint is also not available (410 Gone), throw specific error
        if (error && typeof error === 'object' && 'response' in error &&
        (error as { response?: { status?: number } }).response?.status === 410) {
      throw new Error('LEGACY_ENDPOINT_REMOVED')
    }
    throw error
  }
}

/**
 * Complete avatar upload flow with fallback
 */
export async function uploadAvatar(userId: number, file: File): Promise<AvatarResponse> {
  try {
    // Step 1: Try signed URL flow first
    const signed = await getSignedUploadUrl(userId, file)
    const putUrl = signed.signedUrl ?? signed.uploadUrl

    if (!putUrl) {
      throw new Error('No signed upload URL returned from server')
    }

    // Step 2: Upload to signed URL
    await uploadToSignedUrl(putUrl, file)

    // Step 3: Save path and get display URL
    return await saveAvatarPath(userId, signed.path)
  } catch (error: unknown) {
    // If signed URL flow fails, fall back to legacy upload
    if (error instanceof Error && error.message === 'SIGNED_URL_NOT_AVAILABLE') {
      console.log('🔄 Falling back to legacy multipart upload')
      try {
        return await legacyUploadAvatar(userId, file)
      } catch (legacyError: unknown) {
        if (legacyError instanceof Error && legacyError.message === 'LEGACY_ENDPOINT_REMOVED') {
          throw new Error('Avatar upload is not available. Please contact support or try again later.')
        }
        throw legacyError
      }
    }
    throw error
  }
}
