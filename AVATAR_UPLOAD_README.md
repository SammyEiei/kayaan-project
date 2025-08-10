# Avatar Upload Feature - Signed URL Flow

## ภาพรวม

Avatar Upload feature ได้รับการ refactor จาก legacy multipart upload เป็น signed URL flow ที่ปลอดภัยและมีประสิทธิภาพมากขึ้น โดยไม่ต้องเปิดเผย Supabase keys ใน frontend

## 🔄 Migration Summary

### ❌ Legacy (Removed)
- `POST /api/users/{id}/avatar-upload` (multipart/form-data)
- FormData uploads
- Direct file upload to backend

### ✅ New Signed URL Flow
- `POST /api/users/{id}/avatar-upload-url` → Get signed URL
- `PUT {signedUrl}` → Direct upload to Supabase
- `PUT /api/users/{id}/avatar-url` → Save path and get display URL

## ฟีเจอร์

- ✅ Drag & Drop upload
- ✅ Image preview
- ✅ File validation (type, size)
- ✅ Progress indicator
- ✅ Error handling
- ✅ Real-time avatar update
- ✅ Responsive design
- ✅ Secure signed URL flow

## การใช้งาน

### 1. เข้าถึง Settings
```
URL: /settings
หรือคลิกปุ่ม Settings ใน navigation
```

### 2. อัปโหลด Avatar
- คลิกที่พื้นที่ "Drop image here or click to upload"
- หรือลากไฟล์รูปภาพมาวาง
- รองรับ PNG, JPG, WEBP ขนาดไม่เกิน 5MB

### 3. ดูผลลัพธ์
- รูปภาพจะแสดง preview ทันที
- หลังอัปโหลดสำเร็จ avatar จะอัปเดตในหน้าจอ
- ไม่ต้อง refresh หน้า

## API Flow

### 1. ขอ Signed URL
```
POST /api/users/{id}/avatar-upload-url
Body: { fileName, contentType }
Response: { signedUrl, path, expiresIn }
```

### 2. อัปโหลดไฟล์
```
PUT {signedUrl}
Headers: { Content-Type: image/jpeg }
Body: file binary
```

### 3. บันทึก Path
```
PUT /api/users/{id}/avatar-url
Body: { path }
Response: { avatarUrl, path }
```

## Files Changed

### ✅ New Files
- `src/services/api.ts` - API client with JWT interceptors
- `src/services/avatarService.ts` - Signed URL upload service
- `src/components/profile/AvatarUploader.vue` - Upload component
- `src/testing/unit/avatarService.spec.ts` - Service tests
- `src/testing/unit/AvatarUploader.spec.ts` - Component tests

### 🔄 Updated Files
- `src/service/AvatarService.ts` - Removed multipart upload method
- `src/components/AvatarEditor.vue` - Updated to use signed URL flow
- `src/views/features_view/SettingsView.vue` - Integrated AvatarUploader

### ❌ Removed
- Legacy multipart upload code
- FormData usage for avatar uploads
- Direct file upload to backend

## Manual Test Checklist

### ✅ Prerequisites
- [ ] Login เข้าระบบแล้ว (มี JWT token)
- [ ] Backend API พร้อมใช้งาน
- [ ] Supabase bucket ตั้งค่าแล้ว

### ✅ Basic Upload Test
- [ ] เปิดหน้า Settings
- [ ] เลือกไฟล์รูปภาพ (~500KB)
- [ ] ตรวจสอบ preview แสดง
- [ ] รอการอัปโหลดเสร็จ
- [ ] ตรวจสอบ avatar อัปเดตในหน้าจอ

### ✅ Network Verification
- [ ] เปิด Developer Tools > Network
- [ ] อัปโหลดรูปภาพ
- [ ] ตรวจสอบ API calls:
  - `POST /api/users/{id}/avatar-upload-url` → 200
  - `PUT {signedUrl}` → 200
  - `PUT /api/users/{id}/avatar-url` → 200
- [ ] ตรวจสอบ avatar อัปเดตโดยไม่ refresh หน้า

### ✅ Error Handling Test
- [ ] ลองอัปโหลดไฟล์ที่ไม่ใช่รูปภาพ → ควรแสดง error
- [ ] ลองอัปโหลดไฟล์ใหญ่เกิน 5MB → ควรแสดง error
- [ ] ลองอัปโหลดเมื่อไม่มี internet → ควรแสดง error
- [ ] ลองอัปโหลดเมื่อ token หมดอายุ → ควร redirect ไป login

### ✅ Drag & Drop Test
- [ ] ลากไฟล์รูปภาพมาวางใน upload area
- [ ] ตรวจสอบ preview แสดง
- [ ] ตรวจสอบการอัปโหลดสำเร็จ

### ✅ Responsive Test
- [ ] ทดสอบบน mobile device
- [ ] ทดสอบบน tablet
- [ ] ตรวจสอบ UI ปรับตัวตามขนาดหน้าจอ

## Troubleshooting

### ปัญหาที่พบบ่อย

#### 1. 403 Forbidden Error
**สาเหตุ**: Backend API ยังไม่พร้อม หรือ CORS ไม่ถูกต้อง
**วิธีแก้**:
- ตรวจสอบ backend API endpoints
- ตรวจสอบ CORS configuration
- ตรวจสอบ JWT token

#### 2. Upload Failed
**สาเหตุ**: Supabase signed URL หมดอายุ หรือ bucket ไม่ถูกต้อง
**วิธีแก้**:
- ตรวจสอบ Supabase bucket configuration
- ตรวจสอบ signed URL expiration
- ตรวจสอบ file permissions

#### 3. Avatar ไม่อัปเดต
**สาเหตุ**: API response ไม่มี avatarUrl
**วิธีแก้**:
- ตรวจสอบ backend response format
- ตรวจสอบ CDN configuration
- ตรวจสอบ image URL accessibility

### Debug Steps

1. **เปิด Developer Tools**
   ```
   F12 > Console
   ```

2. **ตรวจสอบ Network Requests**
   ```
   F12 > Network > XHR
   ```

3. **ตรวจสอบ Local Storage**
   ```
   F12 > Application > Local Storage
   ```

4. **ตรวจสอบ Auth Store**
   ```javascript
   // ใน browser console
   const auth = useAuthStore()
   console.log(auth.user)
   ```

## Backend Requirements

### API Endpoints

```typescript
// 1. Get signed upload URL
POST /api/users/{id}/avatar-upload-url
Request: { fileName: string, contentType: string }
Response: { signedUrl: string, path: string, expiresIn?: number }

// 2. Save avatar path
PUT /api/users/{id}/avatar-url
Request: { path: string }
Response: { avatarUrl: string, path: string }

// 3. Get user profile
GET /api/users/me
Response: { id: number, email: string, avatarUrl?: string, ... }
```

### CORS Configuration

```javascript
// Backend CORS setup
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type']
}))
```

### Supabase Configuration

```sql
-- Create avatar bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', false);

-- Set up RLS policies
CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own avatar" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Performance Considerations

### Optimization Tips

1. **Image Compression**
   - ใช้ WebP format
   - Compress ก่อนอัปโหลด
   - จำกัดขนาดไฟล์

2. **Caching**
   - Cache avatar URLs
   - ใช้ CDN สำหรับ delivery
   - Implement cache headers

3. **Error Recovery**
   - Retry mechanism
   - Fallback to default avatar
   - Graceful degradation

## Security Considerations

### Best Practices

1. **No Supabase Keys in Frontend**
   - ใช้ signed URLs เท่านั้น
   - Backend จัดการ authentication

2. **File Validation**
   - ตรวจสอบ file type
   - จำกัด file size
   - Scan for malware

3. **Access Control**
   - JWT authentication
   - User-specific uploads
   - RLS policies

## Testing

### Unit Tests
```bash
# Run avatar tests
npm run test avatarService.spec.ts
npm run test AvatarUploader.spec.ts
```

### Integration Tests
```bash
# Run all tests
npm run test:run
```

### E2E Tests
```bash
# Manual testing checklist (see above)
```

## Deployment

### Environment Variables
```bash
# .env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_BACKEND_URL=https://api.yourdomain.com
```

### Build
```bash
npm run build
```

### Production Checklist
- [ ] Backend API deployed
- [ ] Supabase configured
- [ ] CORS settings correct
- [ ] SSL certificates valid
- [ ] CDN configured
- [ ] Monitoring setup

## Migration Notes

### Breaking Changes
- Legacy multipart upload endpoint removed
- FormData usage for avatars removed
- AvatarService store updated

### Backward Compatibility
- Preset avatar URLs still work
- Auth store interface unchanged
- Component props remain the same

---

**หมายเหตุ**: ฟีเจอร์นี้ต้องการ backend API ที่รองรับ signed URL upload และ Supabase storage bucket ที่ตั้งค่าแล้ว
