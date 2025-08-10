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
  const { data } = await api.post(`/api/users/${userId}/avatar-upload-url`, {
    fileName: file.name,
    contentType: file.type || 'application/octet-stream',
  })
  return data
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
 * Complete avatar upload flow
 */
export async function uploadAvatar(userId: number, file: File): Promise<AvatarResponse> {
  // Step 1: Get signed URL
  const signed = await getSignedUploadUrl(userId, file)
  const putUrl = signed.signedUrl ?? signed.uploadUrl

  if (!putUrl) {
    throw new Error('No signed upload URL returned from server')
  }

  // Step 2: Upload to signed URL
  await uploadToSignedUrl(putUrl, file)

  // Step 3: Save path and get display URL
  return await saveAvatarPath(userId, signed.path)
}
