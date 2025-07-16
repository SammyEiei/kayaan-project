# Pomodoro Timer Testing

ไฟล์ test script สำหรับทดสอบฟีเจอร์ Pomodoro Timer ตาม test plan ที่กำหนด

## โครงสร้างไฟล์

- `pomodoro.spec.ts` - ไฟล์ test script หลัก
- `pomodoro.helper.ts` - ไฟล์ helper functions และ interfaces
- `README.md` - ไฟล์นี้

## Test Cases ที่ครอบคลุม

### UTC-16: Configure Focus Timer Testing

1. **UTC-16-TC-01**: ทดสอบการดึงค่า preset durations [25, 50, 75] นาที
2. **UTC-16-TC-02**: ทดสอบการตั้งค่า custom duration ภายในขีดจำกัด (120 นาที)
3. **UTC-16-TC-03**: ทดสอบการจัดการ error เมื่อ custom duration เกินขีดจำกัด
4. **UTC-16-TC-04**: ทดสอบการเริ่มต้น timer
5. **UTC-16-TC-05**: ทดสอบการหยุดชั่วคราว timer
6. **UTC-16-TC-06**: ทดสอบการเริ่มต้นใหม่ timer
7. **UTC-16-TC-07**: ทดสอบการหยุด timer
8. **UTC-16-TC-08**: ทดสอบการ tag session
9. **UTC-16-TC-09**: ทดสอบการบันทึก session ในประวัติ

### UTC-17: Reset Timer Testing

1. **UTC-17-TC-01**: ทดสอบการ reset timer จากสถานะ running
2. **UTC-17-TC-02**: ทดสอบการ reset timer จากสถานะ paused
3. **UTC-17-TC-03**: ทดสอบการล้าง session data เมื่อ reset
4. **UTC-17-TC-04**: ทดสอบการ reset timer ที่มี custom duration

### UTC-18: Session End Alert Testing

1. **UTC-18-TC-01**: ทดสอบการสร้าง alert เมื่อ timer เสร็จสิ้น
2. **UTC-18-TC-02**: ทดสอบการบันทึก session end
3. **UTC-18-TC-03**: ทดสอบการ dismiss alert แบบ manual
4. **UTC-18-TC-04**: ทดสอบการ auto-dismiss alert หลัง 30 วินาที

## การรัน Test

```bash
# รัน test ทั้งหมด
npm run test

# รันเฉพาะ Pomodoro tests
npm run test pomodoro.spec.ts

# รัน test พร้อม coverage
npm run test:coverage
```

## Dependencies

- `vitest` - Testing framework
- `@vue/test-utils` - Vue component testing
- `pinia` - State management
- `@types/node` - TypeScript types

## Helper Functions

ไฟล์ `pomodoro.helper.ts` มี helper functions ต่างๆ:

- `getPresetDurations()` - ดึงค่า preset durations
- `setCustomDuration(duration)` - ตั้งค่า custom duration
- `generateAlert()` - สร้าง alert response
- `logSessionEnd(sessionId)` - บันทึก session end
- `tagSession(tag)` - tag session
- `recordSession(tag)` - บันทึก session ในประวัติ

## Interfaces

- `TimerRequest` - สำหรับ timer requests
- `TimerResponse` - สำหรับ timer responses
- `TimerConfig` - สำหรับ timer configuration
- `SessionRecord` - สำหรับ session records
- `SessionHistory` - สำหรับ session history
- `AlertResponse` - สำหรับ alert responses
- `SessionEndLog` - สำหรับ session end logs

## การเพิ่ม Test Cases ใหม่

1. เพิ่ม test case ในไฟล์ `pomodoro.spec.ts`
2. เพิ่ม helper functions ที่จำเป็นใน `pomodoro.helper.ts`
3. อัปเดต README นี้ถ้าจำเป็น

## หมายเหตุ

- ใช้ `vi.useFakeTimers()` เพื่อ mock timer functions
- ใช้ `vi.advanceTimersByTime()` เพื่อจำลองการผ่านของเวลา
- ทุก test case มีการ reset state ใน `beforeEach()`
- ใช้ TypeScript interfaces เพื่อ type safety
