<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGroupStore } from '@/stores/group'
import ResourceCard from '@/components/group/ResourceCard.vue'
import UploadResourceForm from '@/components/group/UploadResourceForm.vue'
import ImportAIContent from '@/components/group/ImportAIContent.vue'
import ShareStudyContentModal from '@/components/group/ShareStudyContentModal.vue'
import type { GroupResource } from '@/types/group'

interface Props {
  groupId: string
}

const props = defineProps<Props>()
const groupStore = useGroupStore()

const showUploadForm = ref(false)
const showImportForm = ref(false)
const showShareStudyContent = ref(false)
const selectedResourceType = ref<'all' | 'note' | 'file' | 'link' | 'imported_content'>('all')
const searchQuery = ref('')

const resources = computed(() => {
  let filtered = groupStore.currentGroupResources

  // Filter by type
  if (selectedResourceType.value !== 'all') {
    filtered = filtered.filter((r) => r.type === selectedResourceType.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (r) => r.title.toLowerCase().includes(query) || r.uploaderName.toLowerCase().includes(query),
    )
  }

  return filtered
})

const resourceTypeOptions = [
  { value: 'all', label: 'All Resources', icon: 'grid' },
  { value: 'note', label: 'Notes', icon: 'document-text' },
  { value: 'file', label: 'Files', icon: 'document' },
  { value: 'link', label: 'Links', icon: 'link' },
  { value: 'imported_content', label: 'AI Content', icon: 'sparkles' },
]

const getResourceTypeIcon = (icon: string) => {
  const icons = {
    grid: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    'document-text':
      'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    document:
      'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    link: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    sparkles:
      'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  }
  return icons[icon as keyof typeof icons] || icons.grid
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
        <button
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
        </button>
        <button
          @click="showImportForm = true"
          class="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          Import AI Content
        </button>
        <button
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
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 p-4">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search -->
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

        <!-- Type Filter -->
        <div class="flex gap-2">
          <button
            v-for="option in resourceTypeOptions"
            :key="option.value"
            @click="selectedResourceType = option.value"
            class="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200"
            :class="
              selectedResourceType === option.value
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-white/60 text-gray-600 hover:bg-white/80 border border-gray-200'
            "
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="getResourceTypeIcon(option.icon)"
              />
            </svg>
            <span class="hidden sm:inline">{{ option.label }}</span>
          </button>
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
          searchQuery || selectedResourceType !== 'all'
            ? 'Try adjusting your search or filters'
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
