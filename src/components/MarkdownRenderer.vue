<template>
  <div class="markdown-renderer">
    <!-- Live Preview Mode -->
    <div v-if="mode === 'preview'" class="markdown-preview">
      <div
        class="prose prose-slate max-w-none"
        v-html="renderedHtml"
      ></div>
    </div>

    <!-- Split View Mode -->
    <div v-else-if="mode === 'split'" class="markdown-split-view">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <!-- Editor Side -->
        <div class="markdown-editor-side">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-900">Markdown Source</h3>
            <button
              @click="copyMarkdown"
              class="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
          </div>
          <textarea
            v-model="markdownSource"
            @input="updateMarkdown"
            class="w-full h-96 p-4 border border-slate-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your markdown content here..."
          ></textarea>
        </div>

        <!-- Preview Side -->
        <div class="markdown-preview-side">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-900">Preview</h3>
            <div class="flex items-center gap-2">
              <button
                @click="toggleFullscreen"
                class="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Fullscreen
              </button>
            </div>
          </div>
          <div
            class="h-96 overflow-y-auto p-4 border border-slate-300 rounded-lg bg-white"
            v-html="renderedHtml"
          ></div>
        </div>
      </div>
    </div>

    <!-- Fullscreen Mode -->
    <div v-else-if="mode === 'fullscreen'" class="markdown-fullscreen fixed inset-0 bg-white z-50 overflow-hidden">
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
          <h2 class="text-xl font-semibold text-slate-900">Markdown Preview</h2>
          <div class="flex items-center gap-3">
            <button
              @click="copyMarkdown"
              class="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Markdown
            </button>
            <button
              @click="toggleFullscreen"
              class="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full p-6">
            <!-- Editor -->
            <div class="flex flex-col">
              <h3 class="text-lg font-semibold text-slate-900 mb-4">Markdown Source</h3>
              <textarea
                v-model="markdownSource"
                @input="updateMarkdown"
                class="flex-1 p-4 border border-slate-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your markdown content here..."
              ></textarea>
            </div>

            <!-- Preview -->
            <div class="flex flex-col">
              <h3 class="text-lg font-semibold text-slate-900 mb-4">Preview</h3>
              <div
                class="flex-1 overflow-y-auto p-4 border border-slate-300 rounded-lg bg-white"
                v-html="renderedHtml"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Simple Render Mode (default) -->
    <div v-else class="markdown-simple">
      <div
        class="prose prose-slate max-w-none"
        v-html="renderedHtml"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { markdownToHtml } from '@/utils/markdownConverter'

// Props
interface Props {
  content?: string
  mode?: 'simple' | 'preview' | 'split' | 'fullscreen'
  editable?: boolean
  showSource?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  mode: 'simple',
  editable: false,
  showSource: false
})

// Emits
const emit = defineEmits<{
  'update:content': [content: string]
  'markdown-changed': [markdown: string]
}>()

// State
const markdownSource = ref(props.content)
const isFullscreen = ref(false)

// Computed
const renderedHtml = computed(() => {
  return markdownToHtml(markdownSource.value)
})

// Methods
const updateMarkdown = () => {
  emit('update:content', markdownSource.value)
  emit('markdown-changed', markdownSource.value)
}

const copyMarkdown = async () => {
  try {
    await navigator.clipboard.writeText(markdownSource.value)
    // You could add a toast notification here
    console.log('Markdown copied to clipboard')
  } catch (error) {
    console.error('Failed to copy markdown:', error)
  }
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// Watchers
watch(() => props.content, (newContent) => {
  markdownSource.value = newContent
})

// Lifecycle
onMounted(() => {
  markdownSource.value = props.content
})

// Cleanup
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.markdown-renderer {
  @apply w-full;
}

/* Prose styling for better readability */
.prose {
  @apply text-slate-800 leading-relaxed;
}

.prose h1 {
  @apply text-3xl font-bold text-slate-900 mb-4 mt-6;
}

.prose h2 {
  @apply text-2xl font-semibold text-slate-900 mb-3 mt-5;
}

.prose h3 {
  @apply text-xl font-medium text-slate-900 mb-2 mt-4;
}

.prose p {
  @apply mb-4 text-slate-700;
}

.prose ul, .prose ol {
  @apply mb-4 pl-6;
}

.prose li {
  @apply mb-2;
}

.prose blockquote {
  @apply border-l-4 border-slate-300 pl-4 italic text-slate-600 my-4;
}

.prose code {
  @apply bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-sm font-mono;
}

.prose pre {
  @apply bg-slate-100 text-slate-800 p-4 rounded-lg overflow-x-auto my-4;
}

.prose pre code {
  @apply bg-transparent p-0;
}

/* Split view styling */
.markdown-split-view {
  @apply h-full;
}

.markdown-editor-side,
.markdown-preview-side {
  @apply flex flex-col;
}

/* Fullscreen styling */
.markdown-fullscreen {
  @apply z-50;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .markdown-split-view .grid {
    @apply grid-cols-1;
  }

  .markdown-split-view .markdown-editor-side,
  .markdown-split-view .markdown-preview-side {
    @apply h-96;
  }
}
</style>
