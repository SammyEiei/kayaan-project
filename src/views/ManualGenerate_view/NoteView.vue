<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back Button -->
      <div class="mb-6">
        <button
          @click="goBack"
          class="group flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
        >
          <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
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

          <div class="relative z-10">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-4 ring-white ring-opacity-30 shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-bold mb-1">
                  {{ isEditing ? 'Edit Note' : 'Create Notes' }}
                </h1>
                <p class="text-blue-100">
                  {{ isEditing ? 'Update your note content' : 'Write comprehensive study notes with rich formatting' }}
                </p>
              </div>
            </div>

            <!-- Progress Steps -->
            <div class="flex items-center justify-center gap-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 mt-6">
              <div class="flex items-center">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center bg-white text-green-600 shadow-md">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-white hidden sm:inline">Manual Creation</span>
                </div>
                <div class="mx-2 w-8 sm:w-12 h-1 bg-white bg-opacity-50 rounded-full"></div>
              </div>
              <div class="flex items-center">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center bg-white text-green-600 shadow-md">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-white hidden sm:inline">Notes Selected</span>
                </div>
                <div class="mx-2 w-8 sm:w-12 h-1 bg-white bg-opacity-50 rounded-full"></div>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full flex items-center justify-center bg-white text-blue-600 shadow-md">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span class="text-sm font-semibold text-white hidden sm:inline">Create Notes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Action Buttons -->
        <div class="flex justify-end gap-3">
          <button
            class="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
            @click="goBack"
          >
            Cancel
          </button>
          <button
            @click="saveNote"
            :disabled="isLoading"
            class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2 transform hover:scale-105"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span v-if="!isLoading">{{ isEditing ? 'Update Note' : 'Save Notes' }}</span>
            <span v-else>Saving...</span>
          </button>
        </div>

        <!-- Error/Success Messages -->
        <div v-if="errorMessage" class="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl shadow-md flex items-center gap-3">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>
        <div v-if="successMessage" class="bg-green-50 border-2 border-green-200 text-green-700 px-5 py-4 rounded-xl shadow-md flex items-center gap-3">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Note Settings -->
        <div class="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-200">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">Note Configuration</h2>
          </div>

          <!-- Note Information -->
          <div class="space-y-6">
            <div>
              <label class="block text-base font-semibold text-gray-800 mb-4">Note Information</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    v-model="noteData.subject"
                    type="text"
                    placeholder="Enter subject name"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                  <input
                    v-model="noteData.tags"
                    type="text"
                    placeholder="biology, cells, study guide"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400"
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    v-model="noteData.difficulty"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 appearance-none bg-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Note Title</label>
                  <input
                    v-model="noteData.title"
                    type="text"
                    placeholder="Enter note title"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Note Editor -->
        <div class="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-200">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Note Content</h2>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="showPreview = !showPreview"
                :class="showPreview ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' : 'bg-white text-gray-700 border-2 border-gray-300'"
                class="px-4 py-2.5 text-sm rounded-xl transition-all duration-200 font-medium flex items-center gap-2 hover:shadow-lg transform hover:scale-105"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ showPreview ? 'Hide Preview' : 'Show Preview' }}
              </button>
            </div>
          </div>
          <div class="notion-editor space-y-3 bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <div
              v-for="block in noteData.blocks"
              :key="block.id"
              class="notion-block group flex items-start space-x-2 min-h-[2.5rem] bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <!-- Block Type Selector -->
              <div class="flex-shrink-0 w-8 pt-2">
                <select
                  :value="block.type"
                  @change="changeBlockType(block.id, ($event.target as HTMLSelectElement)?.value || '')"
                  class="w-8 h-6 text-xs border-none bg-transparent text-gray-400 hover:text-blue-600 focus:outline-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <option value="paragraph">¶</option>
                  <option value="heading1">H1</option>
                  <option value="heading2">H2</option>
                  <option value="heading3">H3</option>
                  <option value="bullet">•</option>
                  <option value="numbered">1.</option>
                  <option value="quote">"</option>
                  <option value="code">&lt;&gt;</option>
                </select>
              </div>

              <!-- Content Input -->
              <div class="flex-1">
                <input
                  v-if="getInputType(block.type) === 'input'"
                  v-model="block.content"
                  :placeholder="block.placeholder"
                  :class="getBlockClasses(block.type)"
                  class="w-full border-none focus:outline-none bg-transparent resize-none"
                />
                <textarea
                  v-else
                  v-model="block.content"
                  :placeholder="block.placeholder"
                  :class="getBlockClasses(block.type)"
                  class="w-full border-none focus:outline-none bg-transparent resize-none min-h-[2rem]"
                  rows="1"
                  @input="autoResize($event)"
                ></textarea>
              </div>

              <!-- Delete Button -->
              <div class="flex-shrink-0 w-8 pt-2">
                <button
                  @click="removeBlock(block.id)"
                  :disabled="noteData.blocks.length === 1"
                  class="w-6 h-6 text-gray-400 hover:text-red-600 disabled:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Add Block Menu -->
          <div class="mt-6 pt-6 border-t-2 border-gray-200">
            <p class="text-sm font-semibold text-gray-700 mb-3">Add Block</p>
            <div class="flex flex-wrap gap-2">
              <button
                @click="addBlock('paragraph')"
                class="px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white border-2 border-gray-300 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
              >
                + Text
              </button>
              <button
                @click="addBlock('heading1')"
                class="px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white border-2 border-gray-300 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
              >
                + Heading 1
              </button>
              <button
                @click="addBlock('heading2')"
                class="px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white border-2 border-gray-300 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
              >
                + Heading 2
              </button>
              <button
                @click="addBlock('bullet')"
                class="px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white border-2 border-gray-300 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
              >
                + Bullet List
              </button>
              <button
                @click="addBlock('numbered')"
                class="px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white border-2 border-gray-300 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
              >
                + Numbered List
              </button>
              <button
                @click="addBlock('quote')"
                class="px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white border-2 border-gray-300 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
              >
                + Quote
              </button>
              <button
                @click="addBlock('code')"
                class="px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white border-2 border-gray-300 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
              >
                + Code
              </button>
            </div>
          </div>

          <!-- Markdown Preview -->
          <div v-if="showPreview" class="mt-6 pt-6 border-t-2 border-gray-200">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900">Markdown Preview</h3>
            </div>
            <MarkdownRenderer
              :content="markdownContent"
              mode="preview"
              class="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-blue-50 shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ManualContentService from '@/service/ManualContentService'
import { useAuthStore } from '@/stores/auth'
import { convertBlocksToMarkdown, type NoteBlock } from '@/utils/markdownConverter'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const editingId = ref<number | null>(null)
const showPreview = ref(false)

const noteData = reactive({
  subject: '',
  tags: '',
  difficulty: 'medium',
  title: '',
  blocks: [
    {
      id: 1,
      type: 'paragraph' as const,
      content: '',
      placeholder: 'Start writing...',
    },
  ] as NoteBlock[],
})

// Load note for editing if edit parameter exists
onMounted(async () => {
  const editId = route.query.edit
  if (editId) {
    editingId.value = Number(editId)
    try {
      const note = await ManualContentService.getContentById(editingId.value)
      const noteContent = JSON.parse(note.contentData)
      noteData.title = note.contentTitle
      noteData.subject = note.subject || ''
      noteData.difficulty = note.difficulty || 'medium'
      noteData.tags = note.tags?.join(', ') || ''

      // ✅ ตรวจสอบว่ามี blocks data หรือไม่ (สำหรับ Markdown format ใหม่)
      if (noteContent.blocks && Array.isArray(noteContent.blocks)) {
        console.log('✅ Loading note with blocks data:', noteContent.blocks)
        noteData.blocks = noteContent.blocks.map((block: Partial<NoteBlock>, index: number) => ({
          id: block.id || index + 1,
          type: (block.type || 'paragraph') as NoteBlock['type'],
          content: block.content || '',
          placeholder: block.placeholder || 'Start writing...',
        }))
      } else {
        // ✅ Fallback: แปลง Markdown content กลับเป็น blocks
        const markdownContent = noteContent.markdown || noteContent.content?.[0]?.description || ''
        console.log('🔄 Converting Markdown to blocks:', markdownContent)

        if (markdownContent) {
          noteData.blocks = parseMarkdownToBlocks(markdownContent)
        } else {
          // Legacy fallback
          const contentLines = noteContent.content?.[0]?.description?.split('\n') || []
          noteData.blocks = contentLines.map((line: string, index: number) => ({
            id: index + 1,
            type: 'paragraph' as const,
            content: line,
            placeholder: 'Start writing...',
          }))
        }
      }
    } catch (error) {
      errorMessage.value = 'Failed to load note'
      console.error(error)
    }
  }
})

const isEditing = computed(() => editingId.value !== null)

// Computed property สำหรับ Markdown content
const markdownContent = computed(() => {
  return convertBlocksToMarkdown(noteData.blocks)
})

const addBlock = (type = 'paragraph') => {
  const newId = Math.max(...noteData.blocks.map((b) => b.id)) + 1
  const placeholders: Record<string, string> = {
    paragraph: 'Start writing...',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    bullet: 'List item',
    numbered: 'List item',
    quote: 'Quote',
    code: 'Code block',
  }

  noteData.blocks.push({
    id: newId,
    type: type as NoteBlock['type'],
    content: '',
    placeholder: placeholders[type] || 'Start writing...',
  })
}

const removeBlock = (id: number) => {
  const index = noteData.blocks.findIndex((b) => b.id === id)
  if (index > -1 && noteData.blocks.length > 1) {
    noteData.blocks.splice(index, 1)
  }
}

const changeBlockType = (id: number, newType: string) => {
  const block = noteData.blocks.find((b) => b.id === id)
  if (block) {
    block.type = newType as NoteBlock['type']
    const placeholders: Record<string, string> = {
      paragraph: 'Start writing...',
      heading1: 'Heading 1',
      heading2: 'Heading 2',
      heading3: 'Heading 3',
      bullet: 'List item',
      numbered: 'List item',
      quote: 'Quote',
      code: 'Code block',
    }
    block.placeholder = placeholders[newType] || 'Start writing...'
  }
}

const getBlockClasses = (type: string) => {
  const classes: Record<string, string> = {
    paragraph: 'text-base text-slate-900',
    heading1: 'text-3xl font-bold text-slate-900',
    heading2: 'text-2xl font-semibold text-slate-900',
    heading3: 'text-xl font-medium text-slate-900',
    bullet: 'text-base text-slate-900',
    numbered: 'text-base text-slate-900',
    quote: 'text-lg italic text-slate-700 border-l-4 border-slate-300 pl-4',
    code: 'text-sm font-mono bg-gray-100 text-gray-800 p-3 rounded',
  }
  return classes[type] || classes.paragraph
}

const getInputType = (type: string) => {
  return ['heading1', 'heading2', 'heading3'].includes(type) ? 'input' : 'textarea'
}

const saveNote = async () => {
  if (!noteData.title.trim()) {
    errorMessage.value = 'Please enter a note title'
    return
  }

  // ใช้ Markdown content แทน plain text
  const markdownContent = convertBlocksToMarkdown(noteData.blocks)

  if (!markdownContent.trim()) {
    errorMessage.value = 'Please enter note content'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Check if user is authenticated
    if (!authStore.isAuthenticated || !authStore.user?.username) {
      throw new Error('Please log in to save notes')
    }

    const tagsArray = noteData.tags
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag)

    // สร้าง JSON format ที่มี Markdown content
    const jsonNoteData = {
      type: "note",
      content: [
        {
          feature: noteData.title,
          description: markdownContent // ✅ ใช้ Markdown content
        }
      ],
      markdown: markdownContent, // ✅ เพิ่ม Markdown field แยกต่างหาก
      blocks: noteData.blocks, // ✅ เก็บ original blocks สำหรับ editing
      metadata: {
        subject: noteData.subject,
        difficulty: noteData.difficulty,
        tags: tagsArray,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }

    const requestData = {
      contentTitle: noteData.title,
      contentType: "note" as const,
      contentData: JSON.stringify(jsonNoteData),
      subject: noteData.subject,
      difficulty: noteData.difficulty,
      tags: tagsArray
    }

    console.log('💾 Saving note with Markdown content:', {
      title: noteData.title,
      markdownLength: markdownContent.length,
      blocksCount: noteData.blocks.length,
      jsonData: jsonNoteData
    })

    if (editingId.value) {
      await ManualContentService.updateContent(editingId.value, requestData)
      successMessage.value = 'Note updated successfully!'
    } else {
      await ManualContentService.createContent(requestData)
      successMessage.value = 'Note created successfully!'
    }

    setTimeout(() => {
      router.push('/create-content')
    }, 1000)
  } catch (error: unknown) {
    errorMessage.value = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save note'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/create-content')
}

/**
 * แปลง Markdown กลับเป็น blocks สำหรับ editing
 */
const parseMarkdownToBlocks = (markdown: string): NoteBlock[] => {
  const lines = markdown.split('\n')
  const blocks: NoteBlock[] = []
  let currentId = 1

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (!trimmedLine) {
      // Empty line - skip
      continue
    }

    let blockType: NoteBlock['type'] = 'paragraph'
    let content = trimmedLine

    // Detect block type from Markdown syntax
    if (trimmedLine.startsWith('### ')) {
      blockType = 'heading3'
      content = trimmedLine.substring(4)
    } else if (trimmedLine.startsWith('## ')) {
      blockType = 'heading2'
      content = trimmedLine.substring(3)
    } else if (trimmedLine.startsWith('# ')) {
      blockType = 'heading1'
      content = trimmedLine.substring(2)
    } else if (trimmedLine.startsWith('- ')) {
      blockType = 'bullet'
      content = trimmedLine.substring(2)
    } else if (trimmedLine.match(/^\d+\. /)) {
      blockType = 'numbered'
      content = trimmedLine.replace(/^\d+\. /, '')
    } else if (trimmedLine.startsWith('> ')) {
      blockType = 'quote'
      content = trimmedLine.substring(2)
    } else if (trimmedLine.startsWith('```')) {
      blockType = 'code'
      content = trimmedLine.substring(3)
    }

    blocks.push({
      id: currentId++,
      type: blockType,
      content: content,
      placeholder: getPlaceholderForType(blockType)
    })
  }

  // ถ้าไม่มี blocks ให้สร้าง paragraph เปล่า
  if (blocks.length === 0) {
    blocks.push({
      id: 1,
      type: 'paragraph',
      content: '',
      placeholder: 'Start writing...'
    })
  }

  return blocks
}

/**
 * Get placeholder text for block type
 */
const getPlaceholderForType = (type: NoteBlock['type']): string => {
  const placeholders: Record<NoteBlock['type'], string> = {
    paragraph: 'Start writing...',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    bullet: 'List item',
    numbered: 'List item',
    quote: 'Quote',
    code: 'Code block',
  }
  return placeholders[type] || 'Start writing...'
}

/**
 * Automatically adjusts a textarea's height to its scrollHeight.
 */
const autoResize = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = `${target.scrollHeight}px`
}
</script>
