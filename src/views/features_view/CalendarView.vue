<script setup lang="ts">
// นำเข้าคอมโพเนนต์หรือเมธอดที่จำเป็นสำหรับหน้าปฏิทิน
import { ref, computed, onMounted } from 'vue'

// กำหนด interface สำหรับข้อมูลกิจกรรม
interface Event {
  id: number
  title: string
  date: Date
  endDate?: Date
  time: string
  endTime?: string
  description: string
  location: string
  type: 'assignment' | 'exam' | 'meeting' | 'class' | 'other'
  isCompleted?: boolean
}

// ข้อมูลตัวอย่างสำหรับปฏิทิน
const currentDate = ref(new Date())
const selectedDate = ref(new Date())
const viewMode = ref<'month' | 'week' | 'day'>('month')
const showEventForm = ref(false)
const eventTypes = [
  { value: 'assignment', label: 'Assignment/Work', color: '#4CAF50' },
  { value: 'exam', label: 'Exam', color: '#f44336' },
  { value: 'meeting', label: 'Meeting', color: '#2196F3' },
  { value: 'class', label: 'Class', color: '#FF9800' },
  { value: 'other', label: 'Other', color: '#9C27B0' },
]

const events = ref<Event[]>([
  {
    id: 1,
    title: 'Submit Math Assignment',
    date: new Date(2024, 2, 15),
    time: '23:59',
    description: 'Submit homework chapters 5-6 Basic Calculus',
    location: 'Online',
    type: 'assignment',
    isCompleted: true,
  },
  {
    id: 2,
    title: 'Physics Midterm Exam',
    date: new Date(2024, 2, 20),
    time: '09:00',
    endTime: '12:00',
    description: 'Midterm exam chapters 1-4',
    location: 'Room SC 101',
    type: 'exam',
  },
  {
    id: 3,
    title: 'Project Group Meeting',
    date: new Date(2024, 2, 18),
    time: '13:30',
    endTime: '15:30',
    description: 'Meeting to plan and assign tasks for web application project',
    location: 'Conference Room EN 204',
    type: 'meeting',
  },
  {
    id: 4,
    title: 'English Class',
    date: new Date(2024, 2, 22),
    time: '10:00',
    endTime: '12:00',
    description: 'Lesson on Academic Writing',
    location: 'Room LA 305',
    type: 'class',
  },
  {
    id: 5,
    title: 'Submit Biology Report',
    date: new Date(2024, 2, 25),
    time: '23:59',
    description: 'Submit lab report on plant cells',
    location: 'Online',
    type: 'assignment',
  },
])

// คำนวณวันในเดือนปัจจุบัน
const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  // สร้างอาร์เรย์ของวันในเดือน
  const firstDay = new Date(year, month, 1)

  // หาวันแรกของเดือนในปฏิทิน (ถ้าไม่ใช่วันอาทิตย์ให้ย้อนไปเดือนก่อนหน้า)
  const startDay = new Date(firstDay)
  const dayOfWeek = startDay.getDay()
  startDay.setDate(startDay.getDate() - dayOfWeek)

  // สร้างอาร์เรย์ของวันในปฏิทิน (6 สัปดาห์)
  const calendarDays = []
  const currentMonth = month

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDay)
    const isCurrentMonth = date.getMonth() === currentMonth

    // หากิจกรรมสำหรับวันนี้
    const dayEvents = events.value.filter(
      (event) =>
        date.getDate() === event.date.getDate() &&
        date.getMonth() === event.date.getMonth() &&
        date.getFullYear() === event.date.getFullYear(),
    )

    calendarDays.push({
      date,
      isCurrentMonth,
      events: dayEvents,
      isToday: isDateEqual(date, new Date()),
      isSelected: isDateEqual(date, selectedDate.value),
    })

    startDay.setDate(startDay.getDate() + 1)
  }

  return calendarDays
})

// คำนวณวันในสัปดาห์ที่เลือก
const daysInWeek = computed(() => {
  const date = new Date(selectedDate.value)
  const day = date.getDay()
  date.setDate(date.getDate() - day) // ย้อนไปวันอาทิตย์

  const weekDays = []

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(date)

    // หากิจกรรมสำหรับวันนี้
    const dayEvents = events.value.filter(
      (event) =>
        currentDate.getDate() === event.date.getDate() &&
        currentDate.getMonth() === event.date.getMonth() &&
        currentDate.getFullYear() === event.date.getFullYear(),
    )

    weekDays.push({
      date: currentDate,
      events: dayEvents,
      isToday: isDateEqual(currentDate, new Date()),
      isSelected: isDateEqual(currentDate, selectedDate.value),
    })

    date.setDate(date.getDate() + 1)
  }

  return weekDays
})

// คำนวณกิจกรรมในวันที่เลือก
const eventsOnSelectedDay = computed(() => {
  return events.value
    .filter(
      (event) =>
        selectedDate.value.getDate() === event.date.getDate() &&
        selectedDate.value.getMonth() === event.date.getMonth() &&
        selectedDate.value.getFullYear() === event.date.getFullYear(),
    )
    .sort((a, b) => {
      return a.time.localeCompare(b.time)
    })
})

// ฟังก์ชันสำหรับตรวจสอบว่าวันเท่ากันหรือไม่
function isDateEqual(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

// ฟังก์ชันสำหรับเปลี่ยนเดือน
function changeMonth(increment: number) {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + increment)
  currentDate.value = newDate
}

// ฟังก์ชันสำหรับเลือกวัน
function selectDate(date: Date) {
  selectedDate.value = new Date(date)
}

// ฟังก์ชันสำหรับเปลี่ยนโหมดการดู
function changeViewMode(mode: 'month' | 'week' | 'day') {
  viewMode.value = mode
}

// ฟังก์ชันสำหรับเปิด/ปิดฟอร์มเพิ่มกิจกรรม
function toggleEventForm() {
  showEventForm.value = !showEventForm.value
}

// ฟอร์แมตวันที่
function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return date.toLocaleDateString('en-US', options)
}

// Format short date
function formatShortDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

// Format month and year
function formatMonthYear(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' }
  return date.toLocaleDateString('en-US', options)
}

// ฟังก์ชันสำหรับสลับสถานะเสร็จสิ้นของกิจกรรม
function toggleEventCompletion(eventId: number) {
  const event = events.value.find((e) => e.id === eventId)
  if (event && event.type === 'assignment') {
    event.isCompleted = !event.isCompleted
  }
}

onMounted(() => {
  // ตรงนี้จะเป็นลอจิกสำหรับดึงข้อมูลจริงเมื่อคอมโพเนนต์ถูกโหลด
  console.log('ปฏิทินถูกโหลด')
})
</script>

<template>
  <main class="calendar-page">
    <header class="page-header">
      <h1>Activity Calendar</h1>
      <div class="header-actions">
        <button class="btn-add-event" @click="toggleEventForm">Add Event</button>
        <div class="view-selector">
          <button
            :class="['view-btn', viewMode === 'month' ? 'active' : '']"
            @click="changeViewMode('month')"
          >
            Month
          </button>
          <button
            :class="['view-btn', viewMode === 'week' ? 'active' : '']"
            @click="changeViewMode('week')"
          >
            Week
          </button>
          <button
            :class="['view-btn', viewMode === 'day' ? 'active' : '']"
            @click="changeViewMode('day')"
          >
            Day
          </button>
        </div>
      </div>
    </header>

    <!-- การควบคุมปฏิทิน -->
    <div class="calendar-controls">
      <div class="month-selector">
        <button class="btn-arrow" @click="changeMonth(-1)">&lt;</button>
        <h2>{{ formatMonthYear(currentDate) }}</h2>
        <button class="btn-arrow" @click="changeMonth(1)">&gt;</button>
      </div>
      <button
        class="btn-today"
        @click="
          selectedDate = new Date()
          currentDate = new Date()
        "
      >
        Today
      </button>
    </div>

    <!-- มุมมองเดือน -->
    <div v-if="viewMode === 'month'" class="calendar-month-view">
      <div class="calendar-weekdays">
        <div class="weekday">Sun</div>
        <div class="weekday">Mon</div>
        <div class="weekday">Tue</div>
        <div class="weekday">Wed</div>
        <div class="weekday">Thu</div>
        <div class="weekday">Fri</div>
        <div class="weekday">Sat</div>
      </div>
      <div class="calendar-days">
        <div
          v-for="(day, index) in daysInMonth"
          :key="index"
          :class="[
            'calendar-day',
            !day.isCurrentMonth ? 'other-month' : '',
            day.isToday ? 'today' : '',
            day.isSelected ? 'selected' : '',
          ]"
          @click="selectDate(day.date)"
        >
          <div class="day-number">{{ formatShortDate(day.date) }}</div>
          <div class="day-events">
            <div
              v-for="event in day.events.slice(0, 2)"
              :key="event.id"
              class="event-indicator"
              :style="{ backgroundColor: eventTypes.find((t) => t.value === event.type)?.color }"
            >
              {{ event.title }}
            </div>
            <div v-if="day.events.length > 2" class="more-events">
              +{{ day.events.length - 2 }} เพิ่มเติม
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- มุมมองสัปดาห์ -->
    <div v-else-if="viewMode === 'week'" class="calendar-week-view">
      <div class="week-days">
        <div
          v-for="(day, index) in daysInWeek"
          :key="index"
          :class="['week-day', day.isToday ? 'today' : '', day.isSelected ? 'selected' : '']"
          @click="selectDate(day.date)"
        >
          <div class="week-day-header">
            <div class="weekday-name">
              {{ day.date.toLocaleDateString('en-US', { weekday: 'short' }) }}
            </div>
            <div class="date-number">{{ formatShortDate(day.date) }}</div>
          </div>
          <div class="day-schedule">
            <div
              v-for="event in day.events"
              :key="event.id"
              class="week-event"
              :style="{ borderLeftColor: eventTypes.find((t) => t.value === event.type)?.color }"
            >
              <div class="event-time">{{ event.time }}</div>
              <div class="event-title">{{ event.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- มุมมองวัน -->
    <div v-else class="calendar-day-view">
      <h3>{{ formatDate(selectedDate) }}</h3>
      <div class="day-schedule">
        <div v-if="eventsOnSelectedDay.length === 0" class="no-events">ไม่มีกิจกรรมในวันนี้</div>
        <div
          v-for="event in eventsOnSelectedDay"
          :key="event.id"
          class="day-event"
          :style="{ borderLeftColor: eventTypes.find((t) => t.value === event.type)?.color }"
        >
          <div class="event-time">
            {{ event.time }}{{ event.endTime ? ` - ${event.endTime}` : '' }}
          </div>
          <div class="event-header">
            <h4 :class="['event-title', event.isCompleted ? 'completed' : '']">
              {{ event.title }}
            </h4>
            <div class="event-type">
              {{ eventTypes.find((t) => t.value === event.type)?.label }}
            </div>
          </div>
          <div class="event-location"><strong>สถานที่:</strong> {{ event.location }}</div>
          <div class="event-description">{{ event.description }}</div>
          <div v-if="event.type === 'assignment'" class="event-actions">
            <button
              :class="['btn-complete', event.isCompleted ? 'completed' : '']"
              @click="toggleEventCompletion(event.id)"
            >
              {{ event.isCompleted ? 'เสร็จสิ้นแล้ว' : 'ทำเครื่องหมายว่าเสร็จสิ้น' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.calendar-page {
  padding: 2rem;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  font-size: 1.75rem;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-add-event {
  padding: 0.6rem 1.2rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-add-event:hover {
  background-color: #45a049;
}

.view-selector {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.view-btn {
  padding: 0.5rem 1rem;
  background-color: white;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn.active {
  background-color: #e8f5e9;
  color: #4caf50;
}

.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.month-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.month-selector h2 {
  margin: 0;
  font-size: 1.2rem;
}

.btn-arrow {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.btn-arrow:hover {
  background-color: #f5f5f5;
}

.btn-today {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-today:hover {
  background-color: #f5f5f5;
}

/* มุมมองเดือน */
.calendar-month-view {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.weekday {
  padding: 0.75rem;
  text-align: center;
  font-weight: 500;
  color: #555;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
}

.calendar-day {
  min-height: 100px;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.calendar-day:hover {
  background-color: #f9f9f9;
}

.calendar-day.other-month {
  background-color: #f8f9fa;
  color: #aaa;
}

.calendar-day.today {
  background-color: #e8f5e9;
}

.calendar-day.selected {
  background-color: #e3f2fd;
}

.day-number {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.day-events {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.event-indicator {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-events {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
}

/* มุมมองสัปดาห์ */
.calendar-week-view {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.week-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #eee;
}

.week-day {
  background-color: white;
  min-height: 400px;
  padding: 0.5rem;
}

.week-day.today {
  background-color: #e8f5e9;
}

.week-day.selected {
  background-color: #e3f2fd;
}

.week-day-header {
  text-align: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 0.5rem;
}

.weekday-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.date-number {
  font-size: 1.2rem;
  font-weight: bold;
}

.week-event {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #f8f9fa;
  border-left: 4px solid;
  font-size: 0.9rem;
}

.event-time {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.event-title {
  font-weight: 500;
}

/* มุมมองวัน */
.calendar-day-view {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.calendar-day-view h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
}

.no-events {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

.day-event {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 4px;
  background-color: #f8f9fa;
  border-left: 4px solid;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.event-header h4 {
  margin: 0;
  font-size: 1.2rem;
}

.event-title.completed {
  text-decoration: line-through;
  color: #999;
}

.event-type {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  background-color: #f1f1f1;
  color: #555;
}

.event-location,
.event-description {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.event-actions {
  margin-top: 1rem;
}

.btn-complete {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-complete:hover {
  background-color: #f5f5f5;
}

.btn-complete.completed {
  background-color: #e8f5e9;
  border-color: #4caf50;
  color: #4caf50;
}

@media (max-width: 768px) {
  .calendar-days,
  .week-days {
    grid-template-columns: 1fr;
  }

  .calendar-weekdays {
    display: none;
  }

  .page-header,
  .calendar-controls,
  .header-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-actions,
  .view-selector {
    width: 100%;
  }

  .view-btn {
    flex: 1;
  }

  .calendar-day {
    min-height: auto;
    padding: 1rem;
  }

  .week-day {
    min-height: auto;
    padding: 1rem;
    margin-bottom: 1rem;
  }
}
</style>
