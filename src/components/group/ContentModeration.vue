<template>
  <div class="space-y-6">
    <!-- Report Content Button -->
    <div class="flex justify-end">
      <button
        @click="showReportModal = true"
        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        Report Content
      </button>
    </div>

    <!-- Reported Content List (for admins) -->
    <div v-if="isAdmin && reportedContent.length > 0" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Reported Content</h3>

      <div class="space-y-4">
        <div
          v-for="report in reportedContent"
          :key="report.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getReportStatusClass(report.status)">
                  {{ report.status }}
                </span>
                <span class="text-sm text-gray-500">
                  Reported {{ formatTime(report.reportedAt) }}
                </span>
              </div>

              <p class="text-sm text-gray-700 mb-2">
                <strong>Content:</strong> {{ report.contentTitle }}
              </p>

              <p class="text-sm text-gray-600 mb-2">
                <strong>Reason:</strong> {{ report.reason }}
              </p>

              <p class="text-sm text-gray-600">
                <strong>Reporter:</strong> {{ report.reporterName }}
              </p>
            </div>

            <div class="flex gap-2">
              <button
                @click="approveContent(report.id)"
                class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded transition-colors"
                :disabled="report.status !== 'pending'"
              >
                Approve
              </button>
              <button
                @click="removeContent(report.id)"
                class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                :disabled="report.status !== 'pending'"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Modal -->
    <div
      v-if="showReportModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900">Report Content</h3>
          </div>
          <button
            @click="closeReportModal"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- Content Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Select Content to Report
            </label>
            <select
              v-model="selectedContentId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose content...</option>
              <option
                v-for="content in availableContent"
                :key="content.id"
                :value="content.id"
              >
                {{ content.title }} ({{ content.type }})
              </option>
            </select>
          </div>

          <!-- Reason Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Reason for Report
            </label>
            <select
              v-model="selectedReason"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a reason...</option>
              <option
                v-for="reason in reportReasons"
                :key="reason.value"
                :value="reason.value"
              >
                {{ reason.label }}
              </option>
            </select>
          </div>

          <!-- Additional Details -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Additional Details (Optional)
            </label>
            <textarea
              v-model="additionalDetails"
              rows="3"
              placeholder="Please provide any additional context..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            ></textarea>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            @click="closeReportModal"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            @click="submitReport"
            :disabled="!canSubmitReport"
            class="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'

interface Props {
  groupId: string
  isAdmin: boolean
  availableContent: Array<{
    id: string
    title: string
    type: string
  }>
}

const props = defineProps<Props>()
const notificationStore = useNotificationStore()

// Modal state
const showReportModal = ref(false)

// Form state
const selectedContentId = ref('')
const selectedReason = ref('')
const additionalDetails = ref('')

// Report reasons
const reportReasons = [
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'spam', label: 'Spam or irrelevant content' },
  { value: 'copyright', label: 'Copyright violation' },
  { value: 'harassment', label: 'Harassment or bullying' },
  { value: 'misinformation', label: 'False or misleading information' },
  { value: 'other', label: 'Other' }
]

// Mock reported content data (in real app, this would come from API)
const reportedContent = ref([
  {
    id: '1',
    contentTitle: 'Sample Note',
    reason: 'Inappropriate content',
    reporterName: 'John Doe',
    reportedAt: '2024-01-15T10:30:00Z',
    status: 'pending'
  }
])

// Computed properties
const canSubmitReport = computed(() => {
  return selectedContentId.value && selectedReason.value
})

// Methods
const closeReportModal = () => {
  showReportModal.value = false
  resetForm()
}

const resetForm = () => {
  selectedContentId.value = ''
  selectedReason.value = ''
  additionalDetails.value = ''
}

const submitReport = async () => {
  if (!canSubmitReport.value) return

  try {
    // In real app, this would call an API
    const report = {
      contentId: selectedContentId.value,
      reason: selectedReason.value,
      details: additionalDetails.value,
      groupId: props.groupId,
      reportedAt: new Date().toISOString()
    }

    console.log('Submitting report:', report)

    // Show success notification
    notificationStore.addNotification({
      type: 'success',
      title: 'Report Submitted',
      message: 'Your report has been submitted and will be reviewed by moderators.',
      groupId: props.groupId
    })

    closeReportModal()
  } catch (error) {
    console.error('Failed to submit report:', error)

    notificationStore.addNotification({
      type: 'error',
      title: 'Report Failed',
      message: 'Failed to submit report. Please try again.',
      groupId: props.groupId
    })
  }
}

const approveContent = async (reportId: string) => {
  try {
    // In real app, this would call an API
    console.log('Approving content for report:', reportId)

    // Update local state
    const report = reportedContent.value.find(r => r.id === reportId)
    if (report) {
      report.status = 'approved'
    }

    notificationStore.addNotification({
      type: 'success',
      title: 'Content Approved',
      message: 'Content has been approved and restored.',
      groupId: props.groupId
    })
  } catch (error) {
    console.error('Failed to approve content:', error)
  }
}

const removeContent = async (reportId: string) => {
  try {
    // In real app, this would call an API
    console.log('Removing content for report:', reportId)

    // Update local state
    const report = reportedContent.value.find(r => r.id === reportId)
    if (report) {
      report.status = 'removed'
    }

    notificationStore.addNotification({
      type: 'success',
      title: 'Content Removed',
      message: 'Content has been removed due to violation.',
      groupId: props.groupId
    })
  } catch (error) {
    console.error('Failed to remove content:', error)
  }
}

const getReportStatusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'removed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return date.toLocaleDateString()
}
</script>

<style scoped>
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
