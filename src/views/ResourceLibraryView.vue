<script setup lang="ts">
// นำเข้าคอมโพเนนต์หรือเมธอดที่จำเป็นสำหรับหน้าคลังทรัพยากร
import { ref, computed, onMounted } from 'vue'

// กำหนด interface สำหรับข้อมูลทรัพยากร
interface Resource {
  id: number
  title: string
  type: string
  subject: string
  description: string
  author: string
  date: string
  url: string
  thumbnail: string
  isSaved: boolean
}

// ข้อมูลตัวอย่างสำหรับคลังทรัพยากร
const searchQuery = ref('')
const selectedType = ref('all')
const selectedSubject = ref('all')

const resourceTypes = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'ebook', label: 'หนังสืออิเล็กทรอนิกส์' },
  { value: 'video', label: 'วิดีโอ' },
  { value: 'document', label: 'เอกสาร' },
  { value: 'article', label: 'บทความ' },
]

const subjects = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'math', label: 'คณิตศาสตร์' },
  { value: 'science', label: 'วิทยาศาสตร์' },
  { value: 'language', label: 'ภาษา' },
  { value: 'computer', label: 'คอมพิวเตอร์' },
  { value: 'social', label: 'สังคมศึกษา' },
]

const resources = ref<Resource[]>([
  {
    id: 1,
    title: 'พื้นฐานแคลคูลัสสำหรับนักศึกษาปี 1',
    type: 'ebook',
    subject: 'math',
    description: 'หนังสืออิเล็กทรอนิกส์ที่รวบรวมเนื้อหาพื้นฐานแคลคูลัสสำหรับนักศึกษาปี 1',
    author: 'ดร. สมชาย มีสุข',
    date: '10 มกราคม 2023',
    url: '#',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    isSaved: true,
  },
  {
    id: 2,
    title: 'การเขียนโปรแกรมภาษา Python สำหรับผู้เริ่มต้น',
    type: 'video',
    subject: 'computer',
    description: 'วิดีโอสอนการเขียนโปรแกรมภาษา Python สำหรับผู้เริ่มต้น ครอบคลุมพื้นฐานทั้งหมด',
    author: 'อาจารย์วิชัย เทคโนโลยี',
    date: '15 กุมภาพันธ์ 2023',
    url: '#',
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
    isSaved: false,
  },
  {
    id: 3,
    title: 'เอกสารสรุปวิชาฟิสิกส์',
    type: 'document',
    subject: 'science',
    description: 'เอกสารสรุปเนื้อหาวิชาฟิสิกส์ทั้งหมดในระดับมหาวิทยาลัย',
    author: 'รศ.ดร. นภา ดาวเด่น',
    date: '5 มีนาคม 2023',
    url: '#',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
    isSaved: true,
  },
  {
    id: 4,
    title: 'เทคนิคการเรียนภาษาอังกฤษให้ได้ผล',
    type: 'article',
    subject: 'language',
    description: 'บทความแนะนำเทคนิคการเรียนภาษาอังกฤษอย่างมีประสิทธิภาพ',
    author: 'อาจารย์สุดา ภาษาดี',
    date: '20 เมษายน 2023',
    url: '#',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
    isSaved: false,
  },
  {
    id: 5,
    title: 'ประวัติศาสตร์ไทยสมัยอยุธยา',
    type: 'ebook',
    subject: 'social',
    description: 'หนังสืออิเล็กทรอนิกส์เกี่ยวกับประวัติศาสตร์ไทยสมัยอยุธยา',
    author: 'ผศ.ดร. ประวิทย์ อดีตศึกษา',
    date: '8 พฤษภาคม 2023',
    url: '#',
    thumbnail: 'https://images.unsplash.com/photo-1614107151491-6876eecbff89',
    isSaved: true,
  },
  {
    id: 6,
    title: 'การแก้โจทย์ปัญหาคณิตศาสตร์ขั้นสูง',
    type: 'video',
    subject: 'math',
    description: 'วิดีโอสอนเทคนิคการแก้โจทย์ปัญหาคณิตศาสตร์ขั้นสูง',
    author: 'อาจารย์คณิต คิดเลข',
    date: '12 มิถุนายน 2023',
    url: '#',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
    isSaved: false,
  },
])

const filteredResources = computed(() => {
  return resources.value.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = selectedType.value === 'all' || resource.type === selectedType.value
    const matchesSubject =
      selectedSubject.value === 'all' || resource.subject === selectedSubject.value

    return matchesSearch && matchesType && matchesSubject
  })
})

const toggleSave = (resourceId: number) => {
  const resource = resources.value.find((r) => r.id === resourceId)
  if (resource) {
    resource.isSaved = !resource.isSaved
  }
}

const openResource = (url: string) => {
  // ตรงนี้จะเป็นลอจิกสำหรับเปิดทรัพยากร
  console.log('เปิดทรัพยากร URL:', url)
}

onMounted(() => {
  // ตรงนี้จะเป็นลอจิกสำหรับดึงข้อมูลจริงเมื่อคอมโพเนนต์ถูกโหลด
  console.log('คลังทรัพยากรถูกโหลด')
})
</script>

<template>
  <main class="resource-library">
    <header class="page-header">
      <h1>คลังทรัพยากรการเรียนรู้</h1>
      <button class="btn-upload">อัพโหลดทรัพยากร</button>
    </header>

    <div class="filters">
      <div class="search-bar">
        <input v-model="searchQuery" type="text" placeholder="ค้นหาทรัพยากร..." />
      </div>
      <div class="filter-controls">
        <div class="filter-group">
          <label>ประเภท:</label>
          <select v-model="selectedType">
            <option v-for="type in resourceTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label>วิชา:</label>
          <select v-model="selectedSubject">
            <option v-for="subject in subjects" :key="subject.value" :value="subject.value">
              {{ subject.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="resources-grid">
      <div v-for="resource in filteredResources" :key="resource.id" class="resource-card">
        <div class="resource-thumbnail">
          <img :src="resource.thumbnail" :alt="resource.title" />
          <div class="resource-type">
            {{ resourceTypes.find((t) => t.value === resource.type)?.label }}
          </div>
        </div>
        <div class="resource-content">
          <h3>{{ resource.title }}</h3>
          <p class="resource-subject">
            {{ subjects.find((s) => s.value === resource.subject)?.label }}
          </p>
          <p class="resource-description">{{ resource.description }}</p>
          <div class="resource-meta">
            <p><strong>ผู้สร้าง:</strong> {{ resource.author }}</p>
            <p><strong>วันที่:</strong> {{ resource.date }}</p>
          </div>
          <div class="resource-actions">
            <button class="btn-view" @click="openResource(resource.url)">เปิดดู</button>
            <button
              :class="['btn-save', resource.isSaved ? 'saved' : '']"
              @click="toggleSave(resource.id)"
            >
              {{ resource.isSaved ? 'บันทึกแล้ว' : 'บันทึก' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.resource-library {
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

.btn-upload {
  padding: 0.6rem 1.2rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-upload:hover {
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

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.resource-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.resource-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.resource-thumbnail {
  height: 180px;
  position: relative;
  overflow: hidden;
}

.resource-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.resource-type {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 0.3rem 0.6rem;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 12px;
  font-size: 0.8rem;
}

.resource-content {
  padding: 1.5rem;
}

.resource-content h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  color: #333;
}

.resource-subject {
  color: #4caf50;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.resource-description {
  margin-bottom: 1rem;
  color: #555;
  font-size: 0.9rem;
  line-height: 1.5;
}

.resource-meta {
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.resource-meta p {
  margin: 0.3rem 0;
}

.resource-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-view,
.btn-save {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-view {
  background-color: #4caf50;
  color: white;
  border: none;
}

.btn-view:hover {
  background-color: #45a049;
}

.btn-save {
  background-color: transparent;
  border: 1px solid #ddd;
  color: #555;
}

.btn-save:hover {
  background-color: #f5f5f5;
}

.btn-save.saved {
  background-color: #e8f5e9;
  border-color: #4caf50;
  color: #4caf50;
}

@media (max-width: 768px) {
  .resources-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .filter-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
