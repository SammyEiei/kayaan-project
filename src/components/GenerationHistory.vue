<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAIContentStore } from '@/stores/aiContent'
import type { GenerationStatusDTO } from '@/service/AIContentService'

const aiStore = useAIContentStore()
const router = useRouter()

// UI state
const selectedStatus = ref<string>('all')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Status options
const statusOptions = [
  { value: 'all', label: 'All Status', icon: 'List' },
  { value: 'pending', label: 'Pending', icon: 'Clock', color: 'text-yellow-600 bg-yellow-50' },
  { value: 'processing', label: 'Processing', icon: 'Loader', color: 'text-blue-600 bg-blue-50' },
  { value: 'completed', label: 'Completed', icon: 'CheckCircle', color: 'text-green-600 bg-green-50' },
  { value: 'failed', label: 'Failed', icon: 'XCircle', color: 'text-red-600 bg-red-50' },
  { value: 'cancelled', label: 'Cancelled', icon: 'X', color: 'text-slate-600 bg-slate-50' },
]

// Computed properties
const filteredRequests = computed(() => {
  let filtered = aiStore.getGenerationRequests

  // Filter by status
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(request => request.status === selectedStatus.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(request =>
      request.requestId.toString().includes(query) ||
      request.status.toLowerCase().includes(query)
    )
  }

  return filtered
})

const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRequests.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredRequests.value.length / itemsPerPage.value)
})

// Methods
const handleStatusChange = (status: string) => {
  selectedStatus.value = status
  currentPage.value = 1
}

const handleSearch = () => {
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const handleCancel = async (requestId: number) => {
  try {
    await aiStore.cancelGeneration(requestId)
  } catch (error) {
    console.error('Failed to cancel generation:', error)
  }
}

const handleRetry = async (requestId: number) => {
  try {
    await aiStore.retryGeneration(requestId)
  } catch (error) {
    console.error('Failed to retry generation:', error)
  }
}

const handleViewDetails = async (request: GenerationStatusDTO) => {
  aiStore.setCurrentRequest(request)

  // ถ้า request เสร็จแล้ว ให้ไปหน้า AI Content Generator และเปิด tab "My Content"
  if (request.status === 'completed') {
    try {
      // Load saved content เพื่อให้แน่ใจว่าข้อมูลล่าสุด
      await aiStore.loadSavedContent()
      // Navigate ไปหน้า AI Content Generator และใช้ query parameter เพื่อเปิด saved tab
      router.push({ name: 'ai-content-generator', query: { tab: 'saved' } })
    } catch (error) {
      console.error('Failed to load saved content:', error)
      // ถึงแม้จะ error ก็ยังไปหน้า AI Content Generator ได้
      router.push({ name: 'ai-content-generator', query: { tab: 'saved' } })
    }
  } else {
    // ถ้า request ยังไม่เสร็จ แสดง status details
    console.log('Request status:', request.status)
    console.log('Progress:', request.progress + '%')
    console.log('Request details:', request)

    // TODO: อาจจะเพิ่ม modal หรือ toast notification ในอนาคต
    alert(`Request ${request.requestId} is ${request.status} (${request.progress}% complete)`)
  }
}

const getStatusIcon = (status: string) => {
  const statusOption = statusOptions.find(option => option.value === status)
  return statusOption?.icon || 'Circle'
}

const getStatusColor = (status: string) => {
  const statusOption = statusOptions.find(option => option.value === status)
  return statusOption?.color || 'text-slate-600 bg-slate-50'
}

// Load data on mount
onMounted(async () => {
  try {
    await aiStore.loadGenerationRequests()
  } catch (error) {
    console.error('Failed to load generation requests:', error)
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">Generation History</h1>
      <p class="text-slate-600">Track and manage your AI content generation requests</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div class="bg-white rounded-lg border border-slate-200 p-4">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-slate-600">Total Requests</p>
            <p class="text-lg font-semibold text-slate-900">{{ aiStore.getGenerationRequests.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-slate-200 p-4">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-slate-600">Completed</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ aiStore.getGenerationRequests.filter(r => r.status === 'completed').length }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-slate-200 p-4">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-slate-600">Pending</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ aiStore.getGenerationRequests.filter(r => r.status === 'pending').length }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-slate-200 p-4">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-slate-600">Processing</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ aiStore.getGenerationRequests.filter(r => r.status === 'processing').length }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-slate-200 p-4">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-slate-600">Failed</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ aiStore.getGenerationRequests.filter(r => r.status === 'failed').length }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border border-slate-200 p-6 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Status Filter -->
        <div class="flex-1">
          <label class="block text-sm font-medium text-slate-700 mb-2">Status Filter</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in statusOptions"
              :key="option.value"
              @click="handleStatusChange(option.value)"
              :class="
                selectedStatus === option.value
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              "
              class="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="option.icon === 'List'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                <path v-else-if="option.icon === 'Clock'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else-if="option.icon === 'Loader'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                <path v-else-if="option.icon === 'CheckCircle'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else-if="option.icon === 'XCircle'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {{ option.label }}
            </button>
          </div>
        </div>

        <!-- Search -->
        <div class="flex-1">
          <label class="block text-sm font-medium text-slate-700 mb-2">Search</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Search by request ID or status..."
              class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg class="absolute left-3 top-2.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Requests Table -->
    <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900">Generation Requests</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Request ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Progress</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr v-for="request in paginatedRequests" :key="request.requestId" class="hover:bg-slate-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                #{{ request.requestId }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusColor(request.status)" class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="getStatusIcon(request.status) === 'List'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    <path v-else-if="getStatusIcon(request.status) === 'Clock'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path v-else-if="getStatusIcon(request.status) === 'Loader'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    <path v-else-if="getStatusIcon(request.status) === 'CheckCircle'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path v-else-if="getStatusIcon(request.status) === 'XCircle'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {{ request.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-16 bg-slate-200 rounded-full h-2 mr-2">
                    <div
                      class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${request.progress}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-slate-600">{{ Math.round(request.progress) }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {{ new Date(request.createdAt).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <button
                    @click="handleViewDetails(request)"
                    class="text-blue-600 hover:text-blue-900 transition-colors"
                    title="View details"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                                     <button
                     v-if="request.status === 'pending' || request.status === 'processing'"
                     @click="handleCancel(request.requestId)"
                     class="text-red-600 hover:text-red-900 transition-colors"
                     title="Cancel generation"
                   >
                     <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                     </svg>
                   </button>

                   <button
                     v-if="request.status === 'failed'"
                     @click="handleRetry(request.requestId)"
                     class="text-green-600 hover:text-green-900 transition-colors"
                     title="Retry generation"
                   >
                     <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                     </svg>
                   </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="paginatedRequests.length === 0" class="text-center py-12">
        <svg class="w-12 h-12 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-slate-900 mb-2">No generation requests found</h3>
        <p class="text-slate-500">Start creating content to see your generation history here.</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div class="flex items-center gap-1">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="handlePageChange(page)"
            :class="
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 bg-white hover:bg-slate-50'
            "
            class="px-3 py-2 text-sm font-medium border border-slate-300 rounded-lg transition-colors"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>

      <div class="text-sm text-slate-500">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredRequests.length) }} of {{ filteredRequests.length }} results
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles */
.transition-colors {
  transition: all 0.2s ease-in-out;
}
</style>
