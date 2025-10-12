import api from './api'

export type SignedUrlResponse = { path: string; expiresIn: number; signedUrl: string }
export type AvatarResponse   = { avatarUrl?: string; path: string }

export async function requestSignedUrl(userId: number, file: File): Promise<SignedUrlResponse> {
  console.log('🔍 requestSignedUrl - userId:', userId, 'fileName:', file.name)
  console.log('🔍 requestSignedUrl - baseURL:', import.meta.env.VITE_BACKEND_URL)
  console.log('🔍 requestSignedUrl - full URL:', `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/avatar-upload-url`)

  const { data } = await api.post(`/users/${userId}/avatar-upload-url`, {
    fileName: file.name,
    contentType: file.type || 'application/octet-stream',
  })
  if (!data?.signedUrl) throw new Error('No signedUrl from server')
  return data
}

export async function uploadViaBackendProxy(signedUrl: string, file: File): Promise<void> {
  console.log('🔧 uploadViaBackendProxy - START');
  console.log('🔍 SignedUrl:', signedUrl.substring(0, 50) + '...');
  console.log('🔍 File:', file.name, file.type, file.size);

  const formData = new FormData()
  formData.append('file', file)
  formData.append('signedUrl', signedUrl)

  console.log('📤 Sending FormData to /avatar/upload-proxy...');

  // ส่ง FormData โดยไม่ระบุ config เลย ให้:
  // - axios set Content-Type เป็น multipart/form-data อัตโนมัติ
  // - interceptor เพิ่ม Authorization header
  const resp = await api.post('/avatar/upload-proxy', formData)

  console.log('✅ uploadViaBackendProxy - Response:', resp.status);

  if (resp.status < 200 || resp.status >= 300) {
    throw new Error(`Backend proxy upload failed: ${resp.status}`)
  }
}

export async function saveAvatarUrl(userId: number, path: string): Promise<AvatarResponse> {
  const { data } = await api.put(`/users/${userId}/avatar-url`, { path })
  return data
}

export async function uploadAvatar(userId: number, file: File): Promise<AvatarResponse> {
  const { signedUrl, path } = await requestSignedUrl(userId, file)
  // อัปโหลดผ่าน Backend proxy เพื่อหลีกเลี่ยง CORS
  await uploadViaBackendProxy(signedUrl, file)
  return await saveAvatarUrl(userId, path)
}

// 🆕 Function สำหรับ DiceBear avatar - ไม่ผ่าน Supabase storage
export async function generateDiceBearAvatar(userId: number, style: string, seed: string): Promise<AvatarResponse> {
  console.log('🎨 Generating DiceBear avatar:', { userId, style, seed })

  const { data } = await api.post(`/users/${userId}/avatar/dicebear`, {
    style,
    seed
  })

  console.log('✅ DiceBear avatar generated:', data)
  return data
}
