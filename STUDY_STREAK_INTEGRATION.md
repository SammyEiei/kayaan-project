# 🔥 Study Streak Frontend Integration

## 📋 Overview

Study Streak system ใหม่ตาม flowchart logic ที่ใช้ **Freezing Count system** แทน Grace Period สำหรับการติดตามการเรียนต่อเนื่องของผู้ใช้

## 🎯 Key Concepts

### Daily Tasks ที่นับเป็น Streak:
- ✅ **CREATED_CONTENT** - สร้าง content (Manual หรือ AI Generation)
- ✅ **INTERACTIVE_MODE** - ทำ interactive content (Quiz, Flashcard, Note)

### Freezing Count System:
- **Freezing Count** = จำนวนวันที่ไม่ได้ทำ daily task
- **Reset Conditions:**
  - 2 freezes ใน 1 สัปดาห์ → Reset Streak
  - 3 freezes ใน 1 เดือน → Reset Streak

## 🏗️ Architecture

### 1. **StudyStreakService** (`/src/services/StudyStreakService.ts`)
- จัดการ API calls ไปยัง Study Streak Backend
- Support ทั้ง development และ production modes
- Error handling และ retry logic

### 2. **StudyStreakStore** (`/src/stores/studyStreak.ts`)
- Pinia store สำหรับ state management
- Reactive data และ computed properties
- Integration กับ notification system

### 3. **StudyStreakWidget** (`/src/components/StudyStreakWidget.vue`)
- UI component สำหรับแสดง streak status
- Real-time updates และ auto-refresh
- Progress indicators และ motivational messages

### 4. **Notification System**
- **StreakNotificationToast** - Individual notification component
- **StreakNotificationContainer** - Global notification container
- **useStreakNotifications** - Composable สำหรับจัดการ notifications

## 🔌 Integration Points

### 1. **Manual Content Creation**
```typescript
// ใน ManualContentService.ts
await streakStore.completeContentCreation(
  contentId, 
  `Created ${request.contentType}: ${request.contentTitle}`
)
```

### 2. **Interactive Content Completion**
```typescript
// ใน InteractiveQuiz.vue, InteractiveFlashcard.vue, InteractiveNote.vue
await streakStore.completeInteractiveMode(
  props.contentId,
  `Completed quiz: ${totalQuestions.value} questions, Score: ${score.value}%`
)
```

### 3. **Dashboard Integration**
```vue
<!-- ใน DashboardView.vue -->
<StudyStreakWidget :user-id="authStore.user?.id" />
```

## 🎨 UI Components

### StudyStreakWidget Features:
- 🔥 **Fire emoji** สำหรับ streak count
- ✅ **Checkmark** สำหรับ completed today
- ⚠️ **Warning** สำหรับ missed days
- 💡 **Lightbulb** สำหรับ motivational quotes
- 📊 **Progress bar** สำหรับ weekly progress
- 🔄 **Auto-refresh** ทุก 30 วินาที

### Notification Types:
- **Success**: Task completed successfully
- **Warning**: Streak in danger (freezing count ≥ 2)
- **Info**: Motivational messages
- **Streak**: Milestone achievements

## 📱 API Endpoints

### Base URL
```
https://your-api-domain.com/api/users/{userId}/streak
```

### Endpoints:
1. `POST /complete-task` - บันทึกการทำ daily task
2. `GET /` - ดูข้อมูล streak พื้นฐาน
3. `GET /status` - ดูสถานะ streak รายละเอียด
4. `POST /daily-check` - เรียกใช้ daily check manually (testing)
5. `DELETE /` - รีเซ็ต streak (admin only)

## 🔧 Configuration

### Environment Variables:
```env
VITE_BACKEND_URL=http://localhost:8080/api
VITE_API_BASE_URL=http://localhost:8080/api
```

### Auto-refresh Settings:
```typescript
// ใน StudyStreakWidget.vue
const props = withDefaults(defineProps<Props>(), {
  autoRefresh: true,
  refreshInterval: 30000 // 30 seconds
});
```

## 🚀 Usage Examples

### 1. Basic Integration:
```vue
<template>
  <StudyStreakWidget :user-id="userId" />
</template>

<script setup>
import StudyStreakWidget from '@/components/StudyStreakWidget.vue'
</script>
```

### 2. Manual Streak Update:
```typescript
import { useStudyStreakStore } from '@/stores/studyStreak'

const streakStore = useStudyStreakStore()

// Complete content creation task
await streakStore.completeContentCreation(contentId, metadata)

// Complete interactive mode task
await streakStore.completeInteractiveMode(contentId, metadata)
```

### 3. Notification Handling:
```typescript
import { useStreakNotifications } from '@/composables/useStreakNotifications'

const { showStreakUpdate, showFreezingWarning } = useStreakNotifications()

// Show streak update notification
showStreakUpdate(result)

// Show freezing warning
showFreezingWarning(freezingCount)
```

## 🧪 Testing

### Test Scenarios:
1. **Content Creation** - สร้าง content และตรวจสอบ streak update
2. **Interactive Completion** - ทำ quiz/flashcard/note และตรวจสอบ streak
3. **Notification Display** - ตรวจสอบการแสดง notifications
4. **Auto-refresh** - ตรวจสอบการ refresh อัตโนมัติ
5. **Error Handling** - ทดสอบเมื่อ API ไม่พร้อมใช้งาน

### Mock Data:
```typescript
// สำหรับ development/testing
const mockStreakData = {
  streakCount: 5,
  freezingCount: 0,
  hasCompletedToday: true,
  statusMessage: "Great job! You've completed your daily task today."
}
```

## 🔒 Security

### Authentication:
- ใช้ JWT token จาก auth store
- Auto-logout เมื่อ token หมดอายุ
- Error handling สำหรับ 401/403 responses

### Authorization:
- Users สามารถเข้าถึงข้อมูล streak ของตัวเองเท่านั้น
- Admin สามารถรีเซ็ต streak ของ user อื่นได้

## 📊 Performance

### Optimization:
- **Caching**: ข้อมูล streak ถูก cache ใน store
- **Auto-refresh**: Refresh เฉพาะเมื่อจำเป็น
- **Error Recovery**: Graceful fallback เมื่อ API ไม่พร้อม
- **Memory Management**: Cleanup notifications อัตโนมัติ

### Monitoring:
- Console logging สำหรับ debugging
- Error tracking และ reporting
- Performance metrics

## 🐛 Troubleshooting

### Common Issues:

1. **Streak ไม่อัปเดต**
   - ตรวจสอบ API endpoint และ authentication
   - ตรวจสอบ console logs สำหรับ errors

2. **Authentication Errors (403 Forbidden)**
   - ตรวจสอบว่า user ได้ login แล้วหรือไม่
   - ตรวจสอบ JWT token ใน localStorage
   - ตรวจสอบ token expiration
   - ตรวจสอบ API base URL configuration

3. **Server Errors (500 Internal Server Error)**
   - Backend API มีแล้วแต่ยังมีปัญหาในการประมวลผล
   - Frontend จะใช้ development fallback โดยอัตโนมัติ
   - แสดงข้อความ "Study Streak feature is under development"
   - Task completion จะทำงานใน development mode

4. **Notifications ไม่แสดง**
   - ตรวจสอบ StreakNotificationContainer ใน App.vue
   - ตรวจสอบ useStreakNotifications composable

5. **Auto-refresh ไม่ทำงาน**
   - ตรวจสอบ refreshInterval settings
   - ตรวจสอบ component lifecycle

6. **Error Messages ไม่เหมาะสม**
   - ตรวจสอบ error handling ใน StudyStreakService
   - ตรวจสอบ error mapping ใน components

### Debug Commands:
```typescript
// ตรวจสอบ streak data
console.log('Current streak:', streakStore.currentStreak)
console.log('Streak data:', streakStore.streakData)

// ตรวจสอบ notifications
console.log('Notifications:', notifications.value)

// ตรวจสอบ authentication
const authStore = useAuthStore()
console.log('User logged in:', !!authStore.user)
console.log('Token exists:', !!authStore.token)
console.log('User ID:', authStore.user?.id)

// ตรวจสอบ API configuration
console.log('API Base URL:', import.meta.env.VITE_BACKEND_URL)

// ตรวจสอบ development mode
console.log('Study Streak Enabled:', import.meta.env.VITE_STUDY_STREAK_ENABLED)
console.log('Backend Ready:', !error.includes('500'))
```

## 📋 **สถานะการพัฒนา**

### ✅ **เสร็จสิ้นแล้ว**
- StudyStreakService สำหรับ API interactions พร้อม authentication check
- StudyStreakWidget component สำหรับแสดง streak status พร้อม error handling
- StudyStreakStore สำหรับ state management พร้อม error management
- Integration ใน ManualContentService
- Integration ใน Interactive components (Quiz, Flashcard, Note)
- Integration ใน DashboardView
- Notification system สำหรับ streak updates
- Error handling และ loading states
- Authentication validation และ user-friendly error messages

### 🔄 **รอ Backend**
- API endpoints มีแล้วแต่ยังมี 500 errors (backend กำลังพัฒนา)
- Database tables สำหรับ Study Streak
- Authentication และ authorization system
- Scheduled jobs สำหรับ daily checks

### 🛠️ **Development Mode**
- Frontend มี development fallback เมื่อ backend ส่ง 500 error
- แสดงข้อมูล mock data เพื่อให้ UI ทำงานได้
- แสดงข้อความ "Study Streak feature is under development"
- Task completion จะทำงานใน development mode

### 🔐 **Authentication Requirements**
ระบบ Study Streak ต้องการ authentication ที่ถูกต้อง:
- **Bearer Token**: ทุก API calls ต้องมี valid JWT token
- **User Authorization**: Users สามารถเข้าถึงข้อมูลของตนเองเท่านั้น
- **Error Handling**: แสดง error messages ที่เหมาะสมเมื่อ authentication ล้มเหลว
- **Session Management**: จัดการ session expiration และ re-authentication

## 📈 Future Enhancements

### Planned Features:
1. **Streak Challenges** - Weekly/Monthly challenges
2. **Social Features** - Share streak achievements
3. **Analytics Dashboard** - Detailed streak analytics
4. **Custom Notifications** - User-configurable notifications
5. **Offline Support** - Cache streak data for offline use

### API Improvements:
1. **WebSocket Support** - Real-time streak updates
2. **Batch Operations** - Multiple task completion
3. **Advanced Analytics** - Detailed streak metrics
4. **Export Features** - Export streak data

## 📝 Changelog

### v1.0.0 (2024-01-15)
- ✅ Initial Study Streak implementation
- ✅ Freezing Count system
- ✅ Daily task completion tracking
- ✅ Interactive content integration
- ✅ Notification system
- ✅ Dashboard widget
- ✅ Auto-refresh functionality

---

**Study Streak system พร้อมใช้งานแล้ว!** 🎉

ระบบนี้จะช่วยให้ผู้ใช้สามารถติดตามการเรียนต่อเนื่องได้อย่างมีประสิทธิภาพ และได้รับแรงจูงใจจากการเห็น streak count ที่เพิ่มขึ้นเรื่อยๆ
