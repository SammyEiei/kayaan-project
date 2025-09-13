<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGroupStore } from '@/stores/group'
import ResourceCard from '@/components/group/ResourceCard.vue'
import UploadResourceForm from '@/components/group/UploadResourceForm.vue'
import ImportAIContent from '@/components/group/ImportAIContent.vue'
import ShareStudyContentModal from '@/components/group/ShareStudyContentModal.vue'
interface Props {
  groupId: string
}

defineProps<Props>()
const groupStore = useGroupStore()

const showUploadForm = ref(false)
const showImportForm = ref(false)
const showShareStudyContent = ref(false)
const selectedFormat = ref<'all' | 'quiz' | 'note' | 'flashcard'>('all')
const searchQuery = ref('')

const resources = computed(() => {
  let filtered = groupStore.currentGroupResources

  // Debug: Log all resources to see their structure
  console.log('All resources:', filtered)
  console.log('Selected format:', selectedFormat.value)
  console.log('Search query:', searchQuery.value)

  // Filter by study content type
  if (selectedFormat.value !== 'all') {
    filtered = filtered.filter((r) => {
      console.log(`Checking resource ${r.id}:`, {
        type: r.type,
        contentType: r.contentType,
        title: r.title,
        description: r.description
      })

      // Check if resource has contentType property (for imported content)
      if (r.contentType) {
        const matches = r.contentType === selectedFormat.value
        console.log(`ContentType match: ${matches}`)
        return matches
      }

      // Check if resource type matches the selected format
      if (r.type === selectedFormat.value) {
        console.log(`Resource type match: ${r.type} === ${selectedFormat.value}`)
        return true
      }

      // Fallback: check if title or description contains format keywords
      const title = r.title.toLowerCase()
      const description = r.description?.toLowerCase() || ''
      const searchText = `${title} ${description}`

      let matches = false
      switch (selectedFormat.value) {
        case 'quiz':
          matches = searchText.includes('quiz') || searchText.includes('question') || searchText.includes('test')
          break
        case 'note':
          matches = searchText.includes('note') || searchText.includes('summary') || searchText.includes('study')
          break
        case 'flashcard':
          matches = searchText.includes('flashcard') || searchText.includes('card') || searchText.includes('memory')
          break
        default:
          matches = false
      }
      console.log(`Text search match for ${selectedFormat.value}: ${matches}`)
      return matches
    })
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((r) => {
      const titleMatch = r.title.toLowerCase().includes(query)
      const uploaderMatch = r.uploaderName?.toLowerCase().includes(query) || false
      const descriptionMatch = r.description?.toLowerCase().includes(query) || false
      return titleMatch || uploaderMatch || descriptionMatch
    })
  }

  console.log('Final filtered resources:', filtered)
  return filtered
})

const formatOptions = [
  { value: 'all', label: 'All Study Content', icon: 'Cards' },
  { value: 'quiz', label: 'Quiz', icon: 'List' },
  { value: 'note', label: 'Note', icon: 'FileText' },
  { value: 'flashcard', label: 'Flashcards', icon: 'HelpCircle' },
]

const clearFilters = () => {
  searchQuery.value = ''
  selectedFormat.value = 'all'
}

</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-xl font-bold text-gray-900">Group Library</h3>
        <p class="text-gray-500">{{ resources.length }} resources shared</p>
      </div>
      <div class="flex gap-3">
        <!-- <button
          @click="showShareStudyContent = true"
          class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
          Share Study Content
        </button> -->
        <button
          @click="showImportForm = true"
          class="relative px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-800 rounded-xl font-semibold transition-all duration-200 hover:shadow-md hover:scale-105 flex items-center gap-3 border border-blue-300 shadow-sm"
        >
          <!-- Animated sparkle effect -->
          <div class="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          <div class="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>

          <!-- AI Icon with glow effect -->
          <div class="relative">
            <svg class="w-5 h-5 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
              <g fill="none">
                <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/>
                <path fill="currentColor" d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM11 6.094l-.806 2.36a6 6 0 0 1-3.49 3.649l-.25.091l-2.36.806l2.36.806a6 6 0 0 1 3.649 3.49l.091.25l.806 2.36l.806-2.36a6 6 0 0 1 3.49-3.649l.25-.09l2.36-.807l-2.36-.806a6 6 0 0 1-3.649-3.49l-.09-.25zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"/>
              </g>
            </svg>
          </div>

          <!-- Text -->
          <span>
            Import AI Content
          </span>
        </button>
        <!-- <button
          @click="showUploadForm = true"
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Upload File
        </button> -->
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 p-4">
      <div class="flex flex-col gap-4">
        <!-- Search and Clear Filters -->
        <div class="flex gap-3">
          <div class="flex-1">
            <div class="relative">
              <svg
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search resources..."
                class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/60 backdrop-blur-sm"
              />
            </div>
          </div>
          <button
            v-if="searchQuery || selectedFormat !== 'all'"
            @click="clearFilters"
            class="px-4 py-2 text-gray-600 bg-white/60 border border-gray-200 rounded-lg hover:bg-white/80 transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </button>
        </div>

        <!-- Study Content Type Filter -->
        <div class="flex flex-col gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-slate-700 mb-2">Study Content Type</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in formatOptions"
                :key="option.value"
                @click="selectedFormat = option.value as any"
                :class="
                  selectedFormat === option.value
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                "
                class="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
              >

                <!-- All Resource Icon -->
                <svg v-if="option.icon === 'Cards'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-2-6H6v-2h12v2zm-4 4H6v-2h8v2z"/>
                </svg>
                <!-- Quiz Icon -->
                <svg v-else-if="option.icon === 'List'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                    <path d="M7.5 3.5c-1.556.047-2.483.22-3.125.862c-.879.88-.879 2.295-.879 5.126v6.506c0 2.832 0 4.247.879 5.127C5.253 22 6.668 22 9.496 22h5c2.829 0 4.243 0 5.121-.88c.88-.879.88-2.294.88-5.126V9.488c0-2.83 0-4.246-.88-5.126c-.641-.642-1.569-.815-3.125-.862"/>
                    <path d="M7.496 3.75c0-.966.784-1.75 1.75-1.75h5.5a1.75 1.75 0 1 1 0 3.5h-5.5a1.75 1.75 0 0 1-1.75-1.75M6.5 10h4m3 1s.5 0 1 1c0 0 1.588-2.5 3-3m-11 7h4m3 1s.5 0 1 1c0 0 1.588-2.5 3-3"/>
                  </g>
                </svg>

                <!-- Note Icon -->
                <svg v-else-if="option.icon === 'FileText'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                    <path d="M16.5 4H8a4 4 0 0 0-4 4v8.5a4 4 0 0 0 4 4h6.843a4 4 0 0 0 2.829-1.172l1.656-1.656a4 4 0 0 0 1.172-2.829V8a4 4 0 0 0-4-4"/>
                    <path d="M20.5 14H17a3 3 0 0 0-3 3v3.5M8 8h7.5M8 12h5"/>
                  </g>
                </svg>
                <!-- Flashcard Icon -->
                <svg v-else-if="option.icon === 'HelpCircle'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2 16c0 2.21 0 3.316.702 4.054q.169.178.37.327C3.908 21 5.16 21 7.667 21h.666c2.506 0 3.759 0 4.595-.62q.201-.147.37-.326C14 19.316 14 18.211 14 16c0-2.21 0-3.316-.702-4.054a3 3 0 0 0-.37-.327C12.092 11 10.84 11 8.333 11h-.666c-2.506 0-3.759 0-4.595.62a3 3 0 0 0-.37.326C2 12.684 2 13.789 2 16m8-8c0-2.21 0-3.316.702-4.054q.168-.178.37-.327C11.908 3 13.16 3 15.667 3h.666c2.506 0 3.759 0 4.595.62q.201.148.37.326C22 4.684 22 5.789 22 8c0 2.21 0 3.316-.702 4.054a3 3 0 0 1-.37.327c-.758.562-1.86.614-3.928.618M2 15h12m-4-8h12M2 9c0-3.317 2.683-6 6-6l-.857 1.714M22 15c0 3.317-2.683 6-6 6l.857-1.714"/>
                </svg>


                {{ option.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resources Grid -->
    <div v-if="resources.length === 0" class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
      <p class="text-gray-500 mb-4">
        {{
          searchQuery || selectedFormat !== 'all'
            ? 'No resources match your current filters. Try adjusting your search or filter criteria.'
            : 'Be the first to share a resource with your group'
        }}
      </p>
      <button
        @click="showUploadForm = true"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Share First Resource
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ResourceCard
        v-for="resource in resources"
        :key="resource.id"
        :resource="resource"
        :group-id="groupId"
      />
    </div>

    <!-- Upload Modal -->
    <UploadResourceForm
      v-if="showUploadForm"
      :group-id="groupId"
      @close="showUploadForm = false"
      @uploaded="showUploadForm = false"
    />

    <!-- Import Modal -->
    <ImportAIContent
      v-if="showImportForm"
      :group-id="groupId"
      @close="showImportForm = false"
      @imported="showImportForm = false"
    />

    <!-- Share Study Content Modal -->
    <ShareStudyContentModal
      v-if="showShareStudyContent"
      :group-id="groupId"
      :group-name="groupStore.currentGroup?.name || 'this group'"
      @close="showShareStudyContent = false"
      @shared="showShareStudyContent = false"
    />
  </div>
</template>
