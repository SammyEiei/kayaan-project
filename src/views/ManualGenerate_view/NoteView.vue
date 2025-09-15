<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Progress Steps -->
    <div class="mb-8">
      <div class="flex items-center justify-center">
        <div class="flex items-center">
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center bg-green-500 text-white"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="ml-2 text-sm font-medium text-green-600">Manual Creation</span>
            <div class="ml-4 w-12 h-0.5 bg-green-500"></div>
          </div>
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center bg-green-500 text-white">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="ml-2 text-sm font-medium text-green-600">Notes Selected</span>
            <div class="ml-4 w-12 h-0.5 bg-green-500"></div>
          </div>
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="ml-2 text-sm font-medium text-blue-600">Create Notes</span>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">
          {{ isEditing ? 'Edit Note' : 'Create Notes' }}
        </h2>
        <p class="text-sm text-slate-600 mt-1">
          {{ isEditing ? 'Update your note content' : 'Write comprehensive study notes with rich formatting' }}
        </p>
      </div>
      <div class="flex gap-3">
        <button
          class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-150 font-medium"
          @click="goBack"
        >
          Cancel
        </button>
        <button
          @click="saveNote"
          :disabled="isLoading"
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-150 font-medium shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span v-if="!isLoading">{{ isEditing ? 'Update Note' : 'Save Notes' }}</span>
          <span v-else>Saving...</span>
        </button>
      </div>
    </div>

    <!-- Error/Success Messages -->
    <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ errorMessage }}
    </div>
    <div
      v-if="successMessage"
      class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded"
    >
      {{ successMessage }}
    </div>

    <!-- Note Settings -->
    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <h2 class="text-xl font-semibold text-slate-900 mb-4">Note Configuration</h2>

      <!-- Note Information -->
      <div class="mb-8">
        <label class="block text-sm font-medium text-slate-700 mb-4">Note Information</label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Subject</label>
          <input
            v-model="noteData.subject"
            type="text"
            placeholder="Enter subject name"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
          <input
            v-model="noteData.tags"
            type="text"
            placeholder="biology, cells, study guide"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
          <select
            v-model="noteData.difficulty"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Note Title</label>
          <input
            v-model="noteData.title"
            type="text"
            placeholder="Enter note title"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        </div>
      </div>
    </div>

    <!-- Note Editor -->
    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-slate-900">Note Content</h2>
        <div class="flex items-center gap-2">
          <button
            @click="showPreview = !showPreview"
            :class="showPreview ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'"
            class="px-3 py-1 text-sm rounded-lg transition-colors"
          >
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ showPreview ? 'Hide Preview' : 'Show Preview' }}
          </button>
        </div>
      </div>
      <div class="notion-editor space-y-2">
        <div
          v-for="block in noteData.blocks"
          :key="block.id"
          class="notion-block group flex items-start space-x-2 min-h-[2.5rem]"
        >
          <!-- Block Type Selector -->
          <div class="flex-shrink-0 w-8 pt-2">
            <select
              :value="block.type"
              @change="changeBlockType(block.id, ($event.target as HTMLSelectElement)?.value || '')"
              class="w-8 h-6 text-xs border-none bg-transparent text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
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
              class="w-6 h-6 text-gray-400 hover:text-red-600 disabled:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
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
      <div class="mt-4 pt-4 border-t border-gray-100">
        <div class="flex flex-wrap gap-2">
          <button
            @click="addBlock('paragraph')"
            class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          >
            + Text
          </button>
          <button
            @click="addBlock('heading1')"
            class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          >
            + Heading 1
          </button>
          <button
            @click="addBlock('heading2')"
            class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          >
            + Heading 2
          </button>
          <button
            @click="addBlock('bullet')"
            class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          >
            + Bullet List
          </button>
          <button
            @click="addBlock('numbered')"
            class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          >
            + Numbered List
          </button>
          <button
            @click="addBlock('quote')"
            class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          >
            + Quote
          </button>
          <button
            @click="addBlock('code')"
            class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          >
            + Code
          </button>
        </div>
      </div>

      <!-- Markdown Preview -->
      <div v-if="showPreview" class="mt-6 pt-6 border-t border-gray-200">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Markdown Preview</h3>
        <MarkdownRenderer
          :content="markdownContent"
          mode="preview"
          class="border border-gray-200 rounded-lg p-4 bg-gray-50"
        />
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
        noteData.blocks = noteContent.blocks.map((block: any, index: number) => ({
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
