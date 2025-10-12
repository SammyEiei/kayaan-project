<script setup lang="ts">
// นำเข้าคอมโพเนนต์หรือเมธอดที่จำเป็นสำหรับหน้าปฏิทิน
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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

// Form data สำหรับเพิ่ม event ใหม่
const newEvent = ref({
  title: '',
  date: '',
  time: '',
  endTime: '',
  description: '',
  location: '',
  type: 'assignment' as 'assignment' | 'exam' | 'meeting' | 'class' | 'other'
})

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

// ฟังก์ชันสำหรับไปยังวันนี้
function goToToday() {
  selectedDate.value = new Date()
  currentDate.value = new Date()
}

// ฟังก์ชันสำหรับเปิด/ปิดฟอร์มเพิ่มกิจกรรม
function toggleEventForm() {
  showEventForm.value = !showEventForm.value
  if (showEventForm.value) {
    // ตั้งค่าเริ่มต้นเป็นวันที่เลือกอยู่
    const year = selectedDate.value.getFullYear()
    const month = String(selectedDate.value.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate.value.getDate()).padStart(2, '0')
    newEvent.value.date = `${year}-${month}-${day}`
  }
}

// ฟังก์ชันสำหรับบันทึก event ใหม่
function saveEvent() {
  if (!newEvent.value.title || !newEvent.value.date || !newEvent.value.time) {
    alert('Please fill in required fields: Title, Date, and Time')
    return
  }

  // สร้าง event ใหม่
  const [year, month, day] = newEvent.value.date.split('-').map(Number)
  const eventDate = new Date(year, month - 1, day)

  const event: Event = {
    id: events.value.length + 1,
    title: newEvent.value.title,
    date: eventDate,
    time: newEvent.value.time,
    endTime: newEvent.value.endTime || undefined,
    description: newEvent.value.description,
    location: newEvent.value.location,
    type: newEvent.value.type,
    isCompleted: false
  }

  events.value.push(event)

  // ปิด modal และ reset form
  showEventForm.value = false
  resetEventForm()
}

// ฟังก์ชันสำหรับ reset form
function resetEventForm() {
  newEvent.value = {
    title: '',
    date: '',
    time: '',
    endTime: '',
    description: '',
    location: '',
    type: 'assignment'
  }
}

// ฟังก์ชันสำหรับปิด modal
function closeEventForm() {
  showEventForm.value = false
  resetEventForm()
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

// ฟังก์ชันสำหรับกลับไป Dashboard
function goToDashboard() {
  router.push('/dashboard')
}

onMounted(() => {
  // ตรงนี้จะเป็นลอจิกสำหรับดึงข้อมูลจริงเมื่อคอมโพเนนต์ถูกโหลด
  console.log('ปฏิทินถูกโหลด')
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back to Dashboard Button -->
      <div class="mb-6">
        <button
          @click="goToDashboard"
          class="group flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
        >
          <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
      </div>

      <!-- Header Section -->
      <div class="mb-8">
        <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
            <div class="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-48 -translate-x-48"></div>
          </div>

          <div class="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-4 ring-white ring-opacity-30 shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-bold mb-1">Activity Calendar</h1>
                <p class="text-blue-100">Manage your schedule and events</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button
                class="px-5 py-2.5 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg flex items-center gap-2 ring-2 ring-white ring-opacity-30"
                @click="toggleEventForm"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Event
              </button>
              <div class="flex bg-white bg-opacity-20 backdrop-blur-sm rounded-xl overflow-hidden ring-2 ring-white ring-opacity-30">
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
          </div>
        </div>
      </div>

      <!-- การควบคุมปฏิทิน -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <button
              class="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border-2 border-blue-200 hover:border-blue-400 hover:shadow-md group"
              @click="changeMonth(-1)"
            >
              <svg class="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 class="text-2xl font-bold text-gray-900">{{ formatMonthYear(currentDate) }}</h2>
            <button
              class="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border-2 border-blue-200 hover:border-blue-400 hover:shadow-md group"
              @click="changeMonth(1)"
            >
              <svg class="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <button
            class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
            @click="goToToday"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Today
          </button>
        </div>
      </div>

      <!-- มุมมองเดือน -->
      <div v-if="viewMode === 'month'" class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div class="grid grid-cols-7 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
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
                +{{ day.events.length - 2 }} more
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- มุมมองสัปดาห์ -->
      <div v-else-if="viewMode === 'week'" class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div class="grid grid-cols-1 md:grid-cols-7 gap-1 bg-gray-100 p-1">
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
      <div v-else class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow duration-300">
        <div class="mb-6">
          <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            {{ formatDate(selectedDate) }}
          </h3>
        </div>

        <div class="space-y-4">
          <div v-if="eventsOnSelectedDay.length === 0" class="text-center py-12">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg class="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No events today</h3>
            <p class="text-gray-600 text-sm">Enjoy your free time!</p>
          </div>

          <div
            v-for="event in eventsOnSelectedDay"
            :key="event.id"
            class="day-event group"
            :style="{ borderLeftColor: eventTypes.find((t) => t.value === event.type)?.color }"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ event.time }}{{ event.endTime ? ` - ${event.endTime}` : '' }}
              </div>
              <span
                class="text-xs px-3 py-1 rounded-full font-medium"
                :style="{
                  backgroundColor: eventTypes.find((t) => t.value === event.type)?.color + '20',
                  color: eventTypes.find((t) => t.value === event.type)?.color
                }"
              >
                {{ eventTypes.find((t) => t.value === event.type)?.label }}
              </span>
            </div>

            <h4 :class="['text-xl font-bold text-gray-900 mb-2', event.isCompleted ? 'line-through text-gray-400' : '']">
              {{ event.title }}
            </h4>

            <div class="flex items-start gap-2 text-sm text-gray-600 mb-2">
              <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ event.location }}</span>
            </div>

            <p class="text-gray-700 mb-4">{{ event.description }}</p>

            <div v-if="event.type === 'assignment'" class="pt-4 border-t border-gray-200">
              <button
                :class="[
                  'w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105',
                  event.isCompleted
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg'
                ]"
                @click="toggleEventCompletion(event.id)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ event.isCompleted ? 'Completed' : 'Mark as Complete' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Event Form Modal -->
    <div
      v-if="showEventForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
      @click.self="closeEventForm"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold">Add New Event</h2>
            </div>
            <button
              @click="closeEventForm"
              class="w-8 h-8 flex items-center justify-center hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-5">
          <!-- Event Type -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Event Type <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                v-for="type in eventTypes"
                :key="type.value"
                @click="newEvent.type = type.value as 'assignment' | 'exam' | 'meeting' | 'class' | 'other'"
                :class="[
                  'p-3 rounded-xl border-2 font-medium transition-all duration-200 text-sm',
                  newEvent.type === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                ]"
              >
                <div class="flex items-center justify-center gap-2">
                  <div
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: type.color }"
                  ></div>
                  {{ type.label }}
                </div>
              </button>
            </div>
          </div>

          <!-- Title -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Event Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="newEvent.title"
              type="text"
              placeholder="Enter event title"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <!-- Date and Time Row -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- Date -->
            <div class="sm:col-span-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Date <span class="text-red-500">*</span>
              </label>
              <input
                v-model="newEvent.date"
                type="date"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <!-- Start Time -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Start Time <span class="text-red-500">*</span>
              </label>
              <input
                v-model="newEvent.time"
                type="time"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <!-- End Time -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                End Time
              </label>
              <input
                v-model="newEvent.endTime"
                type="time"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <!-- Location -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Location
            </label>
            <input
              v-model="newEvent.location"
              type="text"
              placeholder="Enter location"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              v-model="newEvent.description"
              rows="4"
              placeholder="Enter event description"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
            ></textarea>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            @click="closeEventForm"
            class="px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 rounded-xl font-medium transition-all duration-200 border border-gray-300"
          >
            Cancel
          </button>
          <button
            @click="saveEvent"
            class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Save Event
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* View selector buttons */
.view-btn {
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: white;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn.active {
  background-color: white;
  color: #4f46e5;
}

/* Weekday headers */
.weekday {
  padding: 1rem 0.75rem;
  text-align: center;
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

/* Calendar days grid */
.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  background-color: #f8fafc;
}

.calendar-day {
  min-height: 120px;
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: white;
}

.calendar-day:hover {
  background-color: #f8fafc;
  transform: scale(1.02);
  z-index: 10;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.calendar-day.other-month {
  background-color: #f8fafc;
  color: #94a3b8;
}

.calendar-day.today {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 2px solid #3b82f6;
}

.calendar-day.selected {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  border: 2px solid #6366f1;
}

.day-number {
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #1e293b;
}

.day-events {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.event-indicator {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.more-events {
  font-size: 0.75rem;
  color: #64748b;
  text-align: center;
  margin-top: 0.25rem;
  font-weight: 500;
}

/* Week view styles */
.week-day {
  background-color: white;
  min-height: 400px;
  padding: 0.75rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
  cursor: pointer;
}

.week-day:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.week-day.today {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.week-day.selected {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
}

.week-day-header {
  text-align: center;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 0.75rem;
}

.weekday-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.date-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-top: 0.25rem;
}

.day-schedule {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.week-event {
  padding: 0.75rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-left: 4px solid;
  font-size: 0.875rem;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.week-event:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.event-time {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.event-title {
  font-weight: 600;
  color: #1e293b;
}

/* Day view styles */
.day-event {
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-left: 6px solid;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.day-event:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
}

/* Custom animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .calendar-days {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .calendar-day {
    min-height: auto;
    padding: 1rem;
  }

  .week-day {
    min-height: auto;
    padding: 1rem;
  }

  .day-event {
    padding: 1rem;
  }
}
</style>
