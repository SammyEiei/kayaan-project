<script setup lang="ts">
// นำเข้าคอมโพเนนต์หรือเมธอดที่จำเป็นสำหรับหน้ากลุ่มเรียน
import { ref, onMounted } from 'vue'

// กำหนด interface สำหรับข้อมูลกลุ่มเรียน
interface StudyGroup {
  id: number
  name: string
  subject: string
  members: number
  description: string
  schedule: string
  image: string
  isJoined: boolean
}

// ข้อมูลตัวอย่างสำหรับกลุ่มเรียน
const searchQuery = ref('')
const activeFilter = ref('all')

const studyGroups = ref<StudyGroup[]>([
  {
    id: 1,
    name: 'กลุ่มเรียนคณิตศาสตร์ขั้นสูง',
    subject: 'คณิตศาสตร์',
    members: 15,
    description: 'กลุ่มสำหรับนักศึกษาที่สนใจเรียนคณิตศาสตร์ขั้นสูง แคลคูลัส และพีชคณิต',
    schedule: 'ทุกวันอังคารและพฤหัสบดี 15:00-17:00 น.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    isJoined: true,
  },
  {
    id: 2,
    name: 'กลุ่มติวสอบภาษาอังกฤษ',
    subject: 'ภาษาอังกฤษ',
    members: 25,
    description: 'กลุ่มติวสอบภาษาอังกฤษสำหรับการสอบ TOEIC, TOEFL และ IELTS',
    schedule: 'ทุกวันเสาร์ 10:00-12:00 น.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
    isJoined: false,
  },
  {
    id: 3,
    name: 'กลุ่มการเขียนโปรแกรม',
    subject: 'คอมพิวเตอร์',
    members: 18,
    description: 'กลุ่มสำหรับผู้สนใจเรียนรู้การเขียนโปรแกรมภาษา Python และ JavaScript',
    schedule: 'ทุกวันพุธ 18:00-20:00 น.',
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
    isJoined: true,
  },
  {
    id: 4,
    name: 'กลุ่มชีววิทยา',
    subject: 'วิทยาศาสตร์',
    members: 12,
    description: 'กลุ่มศึกษาชีววิทยาระดับโมเลกุลและเซลล์',
    schedule: 'ทุกวันจันทร์และศุกร์ 14:00-16:00 น.',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557',
    isJoined: false,
  },
])

const filteredGroups = ref<StudyGroup[]>([])

const filterGroups = () => {
  if (activeFilter.value === 'joined') {
    filteredGroups.value = studyGroups.value.filter(
      (group) =>
        group.isJoined && group.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  } else if (activeFilter.value === 'available') {
    filteredGroups.value = studyGroups.value.filter(
      (group) =>
        !group.isJoined && group.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  } else {
    filteredGroups.value = studyGroups.value.filter((group) =>
      group.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }
}

const joinGroup = (groupId: number) => {
  const group = studyGroups.value.find((g) => g.id === groupId)
  if (group) {
    group.isJoined = true
    filterGroups()
  }
}

const leaveGroup = (groupId: number) => {
  const group = studyGroups.value.find((g) => g.id === groupId)
  if (group) {
    group.isJoined = false
    filterGroups()
  }
}

onMounted(() => {
  filterGroups()
})
</script>

<template>
  <main class="study-group-page">
    <header class="page-header">
      <h1>กลุ่มเรียน</h1>
      <button class="btn-create">สร้างกลุ่มเรียนใหม่</button>
    </header>

    <div class="filters">
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหากลุ่มเรียน..."
          @input="filterGroups"
        />
      </div>
      <div class="filter-buttons">
        <button
          :class="['filter-btn', activeFilter === 'all' ? 'active' : '']"
          @click="
            activeFilter = 'all'
            filterGroups()
          "
        >
          ทั้งหมด
        </button>
        <button
          :class="['filter-btn', activeFilter === 'joined' ? 'active' : '']"
          @click="
            activeFilter = 'joined'
            filterGroups()
          "
        >
          กลุ่มที่เข้าร่วมแล้ว
        </button>
        <button
          :class="['filter-btn', activeFilter === 'available' ? 'active' : '']"
          @click="
            activeFilter = 'available'
            filterGroups()
          "
        >
          กลุ่มที่ยังไม่ได้เข้าร่วม
        </button>
      </div>
    </div>

    <div class="group-grid">
      <div v-for="group in filteredGroups" :key="group.id" class="group-card">
        <div class="group-image">
          <img :src="group.image" :alt="group.name" />
        </div>
        <div class="group-content">
          <h3>{{ group.name }}</h3>
          <p class="group-subject">{{ group.subject }}</p>
          <p class="group-description">{{ group.description }}</p>
          <div class="group-details">
            <p><strong>ตารางเรียน:</strong> {{ group.schedule }}</p>
            <p><strong>สมาชิก:</strong> {{ group.members }} คน</p>
          </div>
          <div class="group-actions">
            <button v-if="!group.isJoined" class="btn-join" @click="joinGroup(group.id)">
              เข้าร่วมกลุ่ม
            </button>
            <button v-else class="btn-leave" @click="leaveGroup(group.id)">ออกจากกลุ่ม</button>
            <button class="btn-details">ดูรายละเอียด</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.study-group-page {
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

.btn-create {
  padding: 0.6rem 1.2rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-create:hover {
  background-color: #45a049;
}

.filters {
  margin-bottom: 2rem;
}

.search-bar {
  margin-bottom: 1rem;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn.active {
  background-color: #e8f5e9;
  border-color: #4caf50;
  color: #4caf50;
}

.group-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.group-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.group-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.group-image {
  height: 180px;
  overflow: hidden;
}

.group-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.group-content {
  padding: 1.5rem;
}

.group-content h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  color: #333;
}

.group-subject {
  color: #4caf50;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.group-description {
  margin-bottom: 1rem;
  color: #555;
  font-size: 0.9rem;
  line-height: 1.5;
}

.group-details {
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.group-details p {
  margin: 0.3rem 0;
}

.group-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-join,
.btn-details,
.btn-leave {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-join {
  background-color: #4caf50;
  color: white;
  border: none;
}

.btn-join:hover {
  background-color: #45a049;
}

.btn-leave {
  background-color: #f44336;
  color: white;
  border: none;
}

.btn-leave:hover {
  background-color: #d32f2f;
}

.btn-details {
  background-color: transparent;
  border: 1px solid #ddd;
  color: #555;
}

.btn-details:hover {
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .group-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .filter-buttons {
    flex-wrap: wrap;
  }
}
</style>
