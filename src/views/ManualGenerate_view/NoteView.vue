<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <button @click="goBack" class="mr-4 p-2 text-gray-600 hover:text-gray-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <h2 class="text-2xl font-bold text-gray-900">
          {{ isEditing ? 'Edit Note' : 'Create Notes' }}
        </h2>
      </div>
      <button
        @click="saveNote"
        :disabled="isLoading"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {{ isLoading ? 'Saving...' : isEditing ? 'Update Note' : 'Save Notes' }}
      </button>
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
    <div class="bg-white rounded-lg p-6 shadow-sm">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Note Information</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            v-model="noteData.subject"
            type="text"
            placeholder="Enter subject name"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
          <input
            v-model="noteData.tags"
            type="text"
            placeholder="biology, cells, study guide"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
          <select
            v-model="noteData.difficulty"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Note Title</label>
          <input
            v-model="noteData.title"
            type="text"
            placeholder="Enter note title"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <!-- Note Editor -->
    <div class="bg-white rounded-lg p-6 shadow-sm">
      <div class="notion-editor space-y-2">
        <div
          v-for="(block, index) in noteData.blocks"
          :key="block.id"
          class="notion-block group flex items-start space-x-2 min-h-[2.5rem]"
        >
          <!-- Block Type Selector -->
          <div class="flex-shrink-0 w-8 pt-2">
            <select
              :value="block.type"
              @change="changeBlockType(block.id, $event.target.value)"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createNote, updateNote, getNoteById } from '@/service/NoteService'

const router = useRouter()
const route = useRoute()
const emit = defineEmits(['save', 'back'])

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const editingId = ref<number | null>(null)

const noteData = reactive({
  subject: '',
  tags: '',
  difficulty: 'medium',
  title: '',
  blocks: [
    {
      id: 1,
      type: 'paragraph',
      content: '',
      placeholder: 'Start writing...',
    },
  ],
})

// Load note for editing if edit parameter exists
onMounted(async () => {
  const editId = route.query.edit
  if (editId) {
    editingId.value = Number(editId)
    try {
      const note = await getNoteById(editingId.value)
      noteData.title = note.title
      noteData.subject = note.subject || ''
      noteData.difficulty = note.difficulty || 'medium'
      noteData.tags = note.tags?.join(', ') || ''

      // Parse content into blocks
      const contentLines = note.content.split('\n')
      noteData.blocks = contentLines.map((line, index) => ({
        id: index + 1,
        type: 'paragraph',
        content: line,
        placeholder: 'Start writing...',
      }))
    } catch (error) {
      errorMessage.value = 'Failed to load note'
      console.error(error)
    }
  }
})

const isEditing = computed(() => editingId.value !== null)

const addBlock = (type = 'paragraph') => {
  const newId = Math.max(...noteData.blocks.map((b) => b.id)) + 1
  const placeholders = {
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
    type: type,
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
    block.type = newType
    const placeholders = {
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
  const classes = {
    paragraph: 'text-base text-gray-900',
    heading1: 'text-3xl font-bold text-gray-900',
    heading2: 'text-2xl font-semibold text-gray-900',
    heading3: 'text-xl font-medium text-gray-900',
    bullet: 'text-base text-gray-900',
    numbered: 'text-base text-gray-900',
    quote: 'text-lg italic text-gray-700 border-l-4 border-gray-300 pl-4',
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

  const content = noteData.blocks
    .map((block) => block.content)
    .filter((text) => text.trim())
    .join('\n')

  if (!content.trim()) {
    errorMessage.value = 'Please enter note content'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const tagsArray = noteData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag)

    const notePayload = {
      title: noteData.title,
      content: content,
      subject: noteData.subject,
      difficulty: noteData.difficulty,
      tags: tagsArray,
    }

    if (editingId.value) {
      await updateNote(editingId.value, notePayload)
      successMessage.value = 'Note updated successfully!'
    } else {
      await createNote(notePayload)
      successMessage.value = 'Note created successfully!'
    }

    setTimeout(() => {
      router.push('/MyContentView')
    }, 1000)
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message || 'Failed to save note'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/MyContentView')
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
