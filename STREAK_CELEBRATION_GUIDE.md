# 🎉 Streak Celebration Popup - คู่มือการใช้งาน

## ภาพรวม

ระบบ Streak Celebration Popup แบบ Duolingo ที่สร้างขึ้นเพื่อแสดง animation popup สวยงามเมื่อผู้ใช้ได้รับ streak count!

## คุณสมบัติหลัก

### 🎨 Animation Effects
- ✨ **Confetti Animation** - ปล่อยกระดาษสีสันสะพรึงตาเมื่อแสดง popup
- 🎯 **Bounce Animation** - Popup จะ bounce เข้ามาแบบสนุกสนาน
- 🔥 **Fire Icon Animation** - ไอคอนเปลวไฟมีการเคลื่อนไหวและเรืองแสง
- 📊 **Progress Bar Animation** - แถบความคืบหน้าแสดงแบบ smooth
- 🎪 **Scale & Rotation Effects** - การแสดงผลที่มีชีวิตชีวา

### 🏆 Milestone Detection
ระบบจะตรวจจับและแสดง milestone พิเศษ:
- **1 วัน** - เริ่มต้น streak แรก! 
- **5 วัน** - เริ่มต้นได้ดี! 🌟
- **10 วัน** - สุดยอด! 🎯
- **30 วัน** - ผู้ชนะ! 🏆
- **100 วัน** - ตำนาน! 👑
- **ทุก 7 วัน** - ครบสัปดาห์! 🔥

## การติดตั้งและการใช้งาน

### 1. Components ที่สร้างขึ้น

```
src/components/
├── StreakCelebrationPopup.vue      # Component หลักสำหรับแสดง popup
└── StreakCelebrationContainer.vue  # Container สำหรับจัดการ popups

src/composables/
└── useStreakCelebrations.ts        # Composable สำหรับจัดการ state
```

### 2. การทำงานอัตโนมัติ

Celebration popup จะแสดงโดยอัตโนมัติเมื่อ:
- ผู้ใช้ทำ daily task สำเร็จ (เช่น สร้าง flashcard, ทำแบบทดสอบ)
- Streak count เพิ่มขึ้น
- ถึง milestone สำคัญ

### 3. การทดสอบ

#### วิธีที่ 1: ใช้งานปกติ
1. เข้าสู่ระบบ
2. สร้าง content หรือทำกิจกรรมการเรียนรู้
3. Streak popup จะแสดงขึ้นมาพร้อม confetti! 🎉

#### วิธีที่ 2: ทดสอบด้วย Development Mode
เพิ่ม code นี้ใน component ใดก็ได้เพื่อทดสอบ:

```vue
<template>
  <button @click="testCelebration">ทดสอบ Celebration Popup</button>
</template>

<script setup lang="ts">
import { useStreakCelebrations } from '@/composables/useStreakCelebrations'

const { showStreakCelebration } = useStreakCelebrations()

const testCelebration = () => {
  // ทดสอบ streak 10 วัน
  showStreakCelebration({
    success: true,
    message: 'Daily task completed!',
    streakCount: 10,
    freezingCount: 0,
    lastActivityTime: new Date().toISOString()
  })
}
</script>
```

#### วิธีที่ 3: ทดสอบผ่าน Console
เปิด Developer Console และรัน:

```javascript
// ทดสอบ streak 1 วัน (เริ่มต้น)
const { showStreakCelebration } = useStreakCelebrations()
showStreakCelebration({
  success: true,
  message: 'Started streak!',
  streakCount: 1,
  freezingCount: 0,
  lastActivityTime: new Date().toISOString()
})

// ทดสอบ streak 100 วัน (ตำนาน!)
showStreakCelebration({
  success: true,
  message: 'Legendary streak!',
  streakCount: 100,
  freezingCount: 0,
  lastActivityTime: new Date().toISOString()
})
```

## การปรับแต่ง

### เปลี่ยนระยะเวลาแสดง popup

แก้ไขใน `useStreakCelebrations.ts`:

```typescript
addCelebration({
  streakCount,
  title: '🎉 เริ่มต้นสายเรียนรู้!',
  message: 'ยินดีด้วย!',
  showProgress: true,
  autoClose: true,
  autoCloseDelay: 6000  // <-- เปลี่ยนเป็น milliseconds ที่ต้องการ
})
```

### เปลี่ยนข้อความแสดง

แก้ไข title และ message ใน `useStreakCelebrations.ts`:

```typescript
if (streakCount === 1) {
  addCelebration({
    streakCount,
    title: '🎉 ข้อความของคุณ!',        // <-- แก้ที่นี่
    message: 'รายละเอียดของคุณ!',      // <-- แก้ที่นี่
    ...
  })
}
```

### เพิ่ม/ลด confetti

แก้ไขใน `StreakCelebrationPopup.vue`:

```typescript
const confettiCount = 50  // <-- เปลี่ยนจำนวน confetti (ค่าเริ่มต้น 50)
```

### ปิด/เปิด progress bar

```typescript
addCelebration({
  ...
  showProgress: false,  // <-- เปลี่ยนเป็น false เพื่อซ่อน progress bar
})
```

## การทำงานร่วมกับ Toast Notification

ระบบนี้ทำงานควบคู่กับ Toast Notification เดิม:
- **Celebration Popup** - แสดงเมื่อ streak เพิ่มขึ้น (แบบกลางจอ, มี animation ครบ)
- **Toast Notification** - แสดงเตือนอื่นๆ เช่น streak ใกล้หมดอายุ (มุมหน้าจอ)

คุณสามารถปิด Celebration Popup และใช้แค่ Toast ได้โดยการไปที่ `studyStreak.ts` และคอมเมนต์บรรทัดนี้:

```typescript
// แสดง celebration popup แบบ Duolingo! 🎉
// showStreakCelebration(response);  // <-- คอมเมนต์บรรทัดนี้
```

## Troubleshooting

### Popup ไม่แสดง
1. ตรวจสอบว่า `StreakCelebrationContainer` ถูก mount ใน App.vue แล้ว
2. เช็ค Console สำหรับ error messages
3. ตรวจสอบว่า `useStreakCelebrations` ถูก import ถูกต้อง

### Animation ช้าหรือสะดุด
1. ลดจำนวน confetti (แก้ไข `confettiCount`)
2. ตรวจสอบ performance ของ browser
3. ลด duration ของ animation ใน CSS

### Popup ทับซ้อนกัน
ระบบจะแสดง popup ทีละ 1 อัน โดยอัตโนมัติ (มีการ clear popup เก่าก่อนแสดงใหม่)

## API Reference

### `useStreakCelebrations()`

```typescript
interface StreakCelebration {
  id: string
  streakCount: number
  title: string
  message: string
  showProgress: boolean
  autoClose: boolean
  autoCloseDelay: number
}

const {
  celebrations,              // Ref<StreakCelebration[]>
  addCelebration,           // (celebration: Omit<StreakCelebration, 'id'>) => string
  removeCelebration,        // (id: string) => void
  clearCelebrations,        // () => void
  showStreakCelebration,    // (result: TaskCompletionResponse) => void
  showDailyTaskCelebration, // (taskType, streakCount) => void
  showStreakMilestone       // (streakCount) => void
} = useStreakCelebrations()
```

### Props สำหรับ `StreakCelebrationPopup`

```typescript
interface Props {
  streakCount: number        // จำนวน streak (required)
  title?: string            // หัวข้อ popup
  message?: string          // ข้อความ popup
  showProgress?: boolean    // แสดง progress bar หรือไม่
  autoClose?: boolean       // ปิดอัตโนมัติหรือไม่
  autoCloseDelay?: number   // ระยะเวลาก่อนปิด (ms)
}
```

## สรุป

ระบบ Streak Celebration Popup นี้ถูกออกแบบมาเพื่อ:
- ✅ สร้างแรงจูงใจให้ผู้ใช้เรียนรู้ต่อเนื่อง
- ✅ แสดง animation สวยงามแบบ Duolingo
- ✅ ใช้งานง่าย ทำงานอัตโนมัติ
- ✅ ปรับแต่งได้ตามต้องการ

Happy Learning! 🎓✨

