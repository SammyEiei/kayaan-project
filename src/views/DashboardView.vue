<script setup lang="ts">
// Import necessary components or methods for dashboard
import { ref, onMounted } from 'vue'

// Sample data for dashboard
const user = ref({
  name: 'Student',
})

// Study stats
const studyStreak = ref(7)
const focusTime = ref({
  hours: 12,
  minutes: 30,
})
const flashcardsReviewed = ref(42)
const lastReviewTime = ref('3 hours ago')

// Study progress data (for chart)
const studyProgressDays = ref(14)
const studyHoursData = ref([
  { day: 'Mon', hours: 2 },
  { day: 'Tue', hours: 3 },
  { day: 'Wed', hours: 4 },
  { day: 'Thu', hours: 1.5 },
  { day: 'Fri', hours: 1.5 },
  { day: 'Sat', hours: 3.5 },
  { day: 'Sun', hours: 5 },
  { day: 'Mon', hours: 4 },
  { day: 'Tue', hours: 2 },
  { day: 'Wed', hours: 3.5 },
  { day: 'Thu', hours: 1 },
  { day: 'Fri', hours: 3.5 },
  { day: 'Sat', hours: 4 },
  { day: 'Sun', hours: 5 },
])

// Study groups
const studyGroups = ref([
  { id: 1, name: 'Biology 101', members: 5, letter: 'B' },
  { id: 2, name: 'Calculus II', members: 5, letter: 'C' },
  { id: 3, name: 'History Group', members: 5, letter: 'H' },
])

// Learning progress
const learningProgress = ref([
  { id: 1, subject: 'Biology Fundamentals', progress: 85, daysLeft: 2 },
  { id: 2, subject: 'Chemistry Equations', progress: 45, daysLeft: 5 },
  { id: 3, subject: 'World History', progress: 20, daysLeft: 7 },
])

// AI-generated content
const aiContent = ref([
  { id: 1, title: 'Biology Summary', daysAgo: 2, type: 'summary' },
  { id: 2, title: 'Chemistry Flashcards', daysAgo: 2, type: 'flashcards' },
  { id: 3, title: 'History Quiz', daysAgo: 2, type: 'quiz' },
])

onMounted(() => {
  // Logic to fetch actual data when component is loaded
  console.log('Dashboard loaded')
})
</script>

<template>
  <main class="p-6 min-h-screen bg-gray-50">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Welcome back, {{ user.name }}!</h1>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-3 gap-6 mb-6">
      <!-- Study Streak -->
      <div class="bg-white p-5 rounded-lg shadow-sm relative overflow-hidden">
        <div class="flex flex-col">
          <h3 class="text-sm text-gray-600 font-medium mb-1">Study Streak</h3>
          <div class="flex flex-row items-center">
            <div>
              <p class="text-3xl font-bold">7</p>
              <p class="text-sm text-gray-500">Days</p>
            </div>
            <div class="absolute right-4 top-4 text-xl text-yellow-500">🏆</div>
          </div>
          <p class="text-xs text-gray-500 mt-1">Keep going strong!</p>
        </div>
      </div>

      <!-- Focus Time -->
      <div class="bg-white p-5 rounded-lg shadow-sm relative overflow-hidden">
        <div class="flex flex-col">
          <h3 class="text-sm text-gray-600 font-medium mb-1">Focus Time</h3>
          <div class="flex flex-row items-center">
            <div>
              <p class="text-3xl font-bold">12h 30m</p>
              <p class="text-sm text-gray-500">This week</p>
            </div>
            <div class="absolute right-4 top-4 text-xl text-gray-400">⏱️</div>
          </div>
        </div>
      </div>

      <!-- Flashcards Reviewed -->
      <div class="bg-white p-5 rounded-lg shadow-sm relative overflow-hidden">
        <div class="flex flex-col">
          <h3 class="text-sm text-gray-600 font-medium mb-1">Flashcards Reviewed</h3>
          <div class="flex flex-row items-center">
            <div>
              <p class="text-3xl font-bold">42</p>
              <p class="text-sm text-gray-500">cards</p>
            </div>
            <div class="absolute right-4 top-4 text-xl text-green-500">📚</div>
          </div>
          <p class="text-xs text-gray-500 mt-1">3 hours ago</p>
        </div>
      </div>
    </div>

    <!-- Study Progress and Study Groups -->
    <div class="grid grid-cols-3 gap-6 mb-6">
      <!-- Study Progress -->
      <div class="bg-white p-5 rounded-lg shadow-sm col-span-2">
        <div class="flex items-start mb-3">
          <div class="text-gray-600 text-xl mr-2">📊</div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Study Progress</h2>
            <p class="text-sm text-gray-600">
              Your learning activity over the past {{ studyProgressDays }} days
            </p>
          </div>
        </div>

        <!-- Bar Chart -->
        <div class="h-40 flex items-end justify-between mt-4">
          <div
            v-for="(day, index) in studyHoursData.slice(0, 14)"
            :key="index"
            class="flex flex-col items-center"
            style="width: 24px"
          >
            <div class="bg-purple-500 w-6" :style="{ height: day.hours * 10 + 'px' }"></div>
            <span class="text-xs text-gray-500 mt-1">{{ day.day }}</span>
          </div>
        </div>
      </div>

      <!-- Study Groups -->
      <div class="bg-white p-5 rounded-lg shadow-sm">
        <div class="flex items-start mb-3">
          <div class="text-gray-600 text-xl mr-2">👥</div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Study Groups</h2>
            <p class="text-sm text-gray-600">Your active study groups</p>
          </div>
        </div>

        <ul class="space-y-3 mt-4">
          <li
            v-for="group in studyGroups"
            :key="group.id"
            class="flex justify-between items-center py-1"
          >
            <div class="flex items-center">
              <div
                class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-sm"
              >
                {{ group.letter }}
              </div>
              <div>
                <h4 class="font-medium text-sm">{{ group.name }}</h4>
                <p class="text-xs text-gray-500">{{ group.members }} members</p>
              </div>
            </div>
            <button class="text-blue-600 text-xs px-2 hover:underline">View</button>
          </li>
        </ul>

        <button class="w-full mt-3 text-center text-blue-600 text-sm py-1 hover:underline">
          View All Groups
        </button>
      </div>
    </div>

    <!-- Learning Progress and AI-Generated Content -->
    <div class="grid grid-cols-2 gap-6">
      <!-- Learning Progress -->
      <div class="bg-white p-5 rounded-lg shadow-sm">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-start">
            <div class="text-gray-600 text-xl mr-2">📚</div>
            <div>
              <h2 class="text-lg font-semibold text-gray-800">Learning Progress</h2>
            </div>
          </div>
          <button class="text-blue-600 text-xs hover:underline">View All</button>
        </div>

        <div class="space-y-5 mt-4">
          <div v-for="subject in learningProgress" :key="subject.id">
            <div class="flex justify-between mb-1">
              <h4 class="font-medium text-sm">{{ subject.subject }}</h4>
              <span class="text-gray-500 text-xs">{{ subject.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div
                class="bg-purple-600 h-2 rounded-full"
                :style="{ width: subject.progress + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-500">{{ subject.daysLeft }} days left</p>
          </div>
        </div>
      </div>

      <!-- AI-Generated Content -->
      <div class="bg-white p-5 rounded-lg shadow-sm">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-start">
            <div class="text-gray-600 text-xl mr-2">🤖</div>
            <div>
              <h2 class="text-lg font-semibold text-gray-800">AI-Generated Content</h2>
            </div>
          </div>
          <button
            class="text-blue-600 text-xs px-3 py-1 border border-blue-600 rounded-md hover:bg-blue-50"
          >
            Generate New
          </button>
        </div>

        <ul class="space-y-3 mt-4">
          <li v-for="item in aiContent" :key="item.id" class="flex items-center">
            <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <span v-if="item.type === 'summary'">📝</span>
              <span v-else-if="item.type === 'flashcards'">🃏</span>
              <span v-else-if="item.type === 'quiz'">❓</span>
            </div>
            <div>
              <h4 class="font-medium text-sm">{{ item.title }}</h4>
              <p class="text-xs text-gray-500">Generated {{ item.daysAgo }} days ago</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Create New Content Button -->
    <div class="fixed bottom-4 right-4">
      <button
        class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-md flex items-center"
      >
        <span class="mr-2">✨</span>
        <span>Create New Content</span>
      </button>
    </div>
  </main>
</template>

<style scoped>
.dashboard {
  padding: 2rem;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e1e4e8;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
}

.user-info h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.user-info p {
  margin: 0;
  color: #666;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  padding: 0.5rem 1rem;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-action:hover {
  background-color: #f3f3f3;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.dashboard-section h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.25rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  padding: 1rem;
  background-color: #f5f7fa;
  border-radius: 6px;
  text-align: center;
}

.stat-card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  color: #4caf50;
}

.dashboard-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.activity-list,
.events-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.activity-item p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.status-success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-pending {
  background-color: #fff8e1;
  color: #f57c00;
}

.event-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.event-item:last-child {
  border-bottom: none;
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  height: 50px;
  background-color: #4caf50;
  color: white;
  border-radius: 6px;
  text-align: center;
}

.day {
  font-size: 1.2rem;
  font-weight: bold;
}

.month {
  font-size: 0.8rem;
}

.event-details h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.event-details p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .dashboard-columns {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
