<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white rounded-xl shadow-lg border border-gray-200">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">สถานะการสร้างเนื้อหา</h2>
            <p class="text-gray-600 mt-1">Request ID: {{ requestId }}</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <div class="text-sm text-gray-500">WebSocket</div>
              <div class="flex items-center gap-1">
                <div
                  class="w-2 h-2 rounded-full"
                  :class="{
                    'bg-green-500': webSocketStatus === 'OPEN',
                    'bg-yellow-500': webSocketStatus === 'CONNECTING',
                    'bg-red-500': webSocketStatus === 'DISCONNECTED' || webSocketStatus === 'CLOSED'
                  }"
                ></div>
                <span class="text-xs text-gray-500">{{ webSocketStatus }}</span>
              </div>
            </div>
            <button
              @click="goBack"
              class="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              กลับ
            </button>
          </div>
        </div>
      </div>

      <!-- Status Content -->
      <div class="p-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <svg class="animate-spin mx-auto h-8 w-8 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
          <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <div class="flex justify-center gap-3">
            <button
              @click="retryGeneration"
              :disabled="retrying"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <span v-if="retrying" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังลองใหม่...
              </span>
              <span v-else>ลองใหม่</span>
            </button>
            <button
              @click="goBack"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              กลับ
            </button>
          </div>
        </div>

        <!-- Status Content -->
        <div v-else-if="currentRequest" class="space-y-6">
          <!-- Status Badge -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="{
                  'bg-yellow-100 text-yellow-800': currentRequest.status === 'PENDING',
                  'bg-blue-100 text-blue-800': currentRequest.status === 'PROCESSING',
                  'bg-green-100 text-green-800': currentRequest.status === 'COMPLETED',
                  'bg-red-100 text-red-800': currentRequest.status === 'FAILED',
                  'bg-gray-100 text-gray-800': currentRequest.status === 'CANCELLED'
                }"
              >
                {{ getStatusText(currentRequest.status) }}
              </div>
              <div v-if="currentRequest.status === 'PROCESSING'" class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm text-gray-600">กำลังประมวลผล...</span>
              </div>
            </div>
            <div class="text-sm text-gray-500">
              {{ formatDate(currentRequest.createdAt) }}
            </div>
          </div>

          <!-- Progress Bar -->
          <div v-if="currentRequest.status === 'PROCESSING' || currentRequest.status === 'PENDING'">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700">ความคืบหน้า</span>
              <span class="text-sm text-gray-500">{{ currentRequest.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div
                class="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                :style="{ width: currentRequest.progress + '%' }"
              ></div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="currentRequest.status === 'FAILED' && currentRequest.errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 class="text-sm font-medium text-red-800">ข้อผิดพลาด</h4>
                <p class="text-sm text-red-700 mt-1">{{ currentRequest.errorMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Request Details -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-3">รายละเอียดการร้องขอ</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">Request ID:</span>
                <span class="ml-2 font-medium">{{ currentRequest.requestId }}</span>
              </div>
              <div>
                <span class="text-gray-500">สถานะ:</span>
                <span class="ml-2 font-medium">{{ getStatusText(currentRequest.status) }}</span>
              </div>
              <div>
                <span class="text-gray-500">ความคืบหน้า:</span>
                <span class="ml-2 font-medium">{{ currentRequest.progress }}%</span>
              </div>
              <div>
                <span class="text-gray-500">จำนวนครั้งที่ลองใหม่:</span>
                <span class="ml-2 font-medium">{{ currentRequest.retryCount }}/{{ currentRequest.maxRetries }}</span>
              </div>
              <div v-if="currentRequest.startedAt">
                <span class="text-gray-500">เริ่มต้น:</span>
                <span class="ml-2 font-medium">{{ formatDate(currentRequest.startedAt) }}</span>
              </div>
              <div v-if="currentRequest.completedAt">
                <span class="text-gray-500">เสร็จสิ้น:</span>
                <span class="ml-2 font-medium">{{ formatDate(currentRequest.completedAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3">
            <button
              v-if="currentRequest.status === 'PROCESSING'"
              @click="cancelGeneration"
              :disabled="cancelling"
              class="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50"
            >
              <span v-if="cancelling" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังยกเลิก...
              </span>
              <span v-else>ยกเลิก</span>
            </button>

            <button
              v-if="currentRequest.status === 'FAILED' && currentRequest.retryCount < currentRequest.maxRetries"
              @click="retryGeneration"
              :disabled="retrying"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <span v-if="retrying" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังลองใหม่...
              </span>
              <span v-else>ลองใหม่</span>
            </button>

            <button
              v-if="currentRequest.status === 'COMPLETED'"
              @click="viewContent"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              ดูเนื้อหา
            </button>

            <button
              @click="goBack"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              กลับ
            </button>
          </div>
        </div>

        <!-- Not Found -->
        <div v-else class="text-center py-8">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">ไม่พบข้อมูล</h3>
          <p class="text-gray-600 mb-4">ไม่พบข้อมูลการร้องขอที่ระบุ</p>
          <button
            @click="goBack"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            กลับ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAIGenerationStore } from '@/stores/aiGeneration'
import { aiGenerationWebSocket } from '@/service/aiGenerationWebSocket'
import type { GenerationStatus } from '@/service/AIContentService'

const route = useRoute()
const router = useRouter()
const aiGenerationStore = useAIGenerationStore()

// Props
const requestId = computed(() => Number(route.params.id))

// State
const loading = ref(true)
const error = ref('')
const currentRequest = ref<GenerationStatus | null>(null)
const retrying = ref(false)
const cancelling = ref(false)

// Computed
const webSocketStatus = computed(() => aiGenerationWebSocket.getConnectionStatus())

// Methods
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'PENDING': 'รอดำเนินการ',
    'PROCESSING': 'กำลังประมวลผล',
    'COMPLETED': 'เสร็จสิ้น',
    'FAILED': 'ล้มเหลว',
    'CANCELLED': 'ยกเลิก'
  }
  return statusMap[status] || status
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadRequestStatus = async () => {
  try {
    loading.value = true
    error.value = ''

    const status = await aiGenerationStore.getGenerationStatus(requestId.value)
    currentRequest.value = status

    // Subscribe to WebSocket updates
    if (aiGenerationWebSocket.isConnected()) {
      aiGenerationWebSocket.subscribeToGeneration(requestId.value)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลได้'
  } finally {
    loading.value = false
  }
}

const retryGeneration = async () => {
  try {
    retrying.value = true
    await aiGenerationStore.retryGeneration(requestId.value)
    await loadRequestStatus()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'ไม่สามารถลองใหม่ได้'
  } finally {
    retrying.value = false
  }
}

const cancelGeneration = async () => {
  try {
    cancelling.value = true
    await aiGenerationStore.cancelGeneration(requestId.value)
    await loadRequestStatus()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'ไม่สามารถยกเลิกได้'
  } finally {
    cancelling.value = false
  }
}

const viewContent = () => {
  router.push(`/ai-generation/content/${requestId.value}`)
}

const goBack = () => {
  router.push('/ai-generation')
}

// Lifecycle
onMounted(async () => {
  await loadRequestStatus()

  // Set up polling for status updates
  const pollInterval = setInterval(async () => {
    if (currentRequest.value &&
        (currentRequest.value.status === 'PENDING' || currentRequest.value.status === 'PROCESSING')) {
      await loadRequestStatus()
    } else {
      clearInterval(pollInterval)
    }
  }, 5000) // Poll every 5 seconds

  // Clean up interval on unmount
  onUnmounted(() => {
    clearInterval(pollInterval)
    if (aiGenerationWebSocket.isConnected()) {
      aiGenerationWebSocket.unsubscribeFromGeneration(requestId.value)
    }
  })
})
</script>

<style scoped>
/* Custom styles for better UX */
.transition-all {
  transition: all 0.3s ease-in-out;
}

/* Progress bar animation */
.bg-gradient-to-r {
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
