<template>
  <div class="space-y-8 p-6" style="background: var(--background); color: var(--text)">
    <!-- Quick Actions -->
    <div
      class="rounded-xl border p-6 shadow-sm"
      style="background: var(--surface); border-color: var(--border)"
    >
      <div class="flex items-center gap-2 mb-6">
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center"
          style="background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)"
        >
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h3 class="text-lg font-semibold" style="color: var(--text)">Quick Create</h3>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Create Quiz Button -->
        <button
          @click="() => navigateToCreate('quiz')"
          class="group p-16 flex flex-col items-center justify-center rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
          style="
            background: linear-gradient(135deg, var(--primary) 10%, var(--accent) 100%);
            border: 1px solid var(--primary);
          "
        >
          <div
            class="w-32 h-32 rounded-3xl flex items-center justify-center mb-8 transition-colors duration-200"
            :style="{ background: 'var(--primary)' }"
          >
            <svg class="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <span class="font-bold text-2xl mt-4" style="color: var(--text)">Create Quiz</span>
          <span class="text-lg mt-2" style="color: var(--text-secondary)">Interactive questions</span>
        </button>

        <!-- Create Flashcards Button -->
        <button
          @click="() => navigateToCreate('flashcard')"
          class="group p-16 flex flex-col items-center justify-center rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
          style="
            background: linear-gradient(135deg, var(--secondary) 10%, var(--accent) 100%);
            border: 1px solid var(--secondary);
          "
        >
          <div
            class="w-32 h-32 rounded-3xl flex items-center justify-center mb-8 transition-colors duration-200"
            :style="{ background: 'var(--secondary)' }"
          >
            <svg class="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <span class="font-bold text-2xl mt-4" style="color: var(--text)">Create Flashcards</span>
          <span class="text-lg mt-2" style="color: var(--text-secondary)">Study deck builder</span>
        </button>

        <!-- Create Notes Button -->
        <button
          @click="() => navigateToCreate('note')"
          class="group p-16 flex flex-col items-center justify-center rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
          style="
            background: linear-gradient(135deg, var(--primary) 10%, var(--accent) 100%);
            border: 1px solid var(--primary);
          "
        >
          <div
            class="w-32 h-32 rounded-3xl flex items-center justify-center mb-8 transition-colors duration-200"
            :style="{ background: 'var(--secondary)' }"
          >
            <svg class="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
               d="m7.8 2.25h-.0321-.00002c-.81283-.00001-1.46844-.00001-1.99935.04336-.54663.04467-1.02678.13903-1.47099.36537-.70561.35952-1.27929.9332-1.63881 1.63881-.22634.44421-.3207.92436-.36537 1.47099-.04337.53091-.04337 1.18652-.04336 1.99935v.00002.0321 8.4.0321c-.00001.8129-.00001 1.4685.04336 1.9994.04467.5466.13903 1.0267.36537 1.471.35952.7056.9332 1.2792 1.63881 1.6388.44421.2263.92436.3207 1.47099.3653.53091.0434 1.18652.0434 1.99935.0434h.03212 3.3965.0775c.5929.0002 1.0034.0003 1.4012-.0869.3517-.077.6905-.2043 1.0059-.3779.3567-.1964.6656-.4668 1.1118-.8574l.0583-.051 5.0035-4.3781.0705-.0617c.5354-.4682.9059-.7921 1.1775-1.1921.2398-.3533.4175-.745.5255-1.1581.1222-.4678.122-.9599.1218-1.6712v-.0937-4.0219-.03212c0-.81283 0-1.46844-.0434-1.99935-.0446-.54663-.139-1.02678-.3653-1.47099-.3596-.70561-.9332-1.27929-1.6388-1.63881-.4443-.22634-.9244-.3207-1.471-.36537-.5309-.04337-1.1865-.04337-1.9994-.04336h-.0321zm-2.82148 1.74524c.19752-.10064.45829-.16977.91216-.20686.46263-.0378 1.05687-.03838 1.90932-.03838h8.4c.8525 0 1.4467.00058 1.9093.03838.4539.03709.7147.10622.9122.20686.4233.21571.7675.55992.9833.98328.1006.19752.1697.45829.2068.91216.0378.46263.0384 1.05687.0384 1.90932v4.0219c0 .8408-.0057 1.1277-.0731 1.3856-.0052.02-.0107.0399-.0165.0597-.0517-.0113-.1053-.0172-.1604-.0172h-2.2-.0321c-.8128 0-1.4685 0-1.9994.0434-.5466.0446-1.0267.139-1.471.3653-.7056.3596-1.2792.9332-1.6388 1.6388-.2263.4443-.3207.9244-.3653 1.471-.0434.5309-.0434 1.1866-.0434 1.9994v.0321 1.4171c-.1996.03-.4615.0329-1.0535.0329h-3.3965c-.85245 0-1.44669-.0006-1.90932-.0384-.45387-.0371-.71464-.1062-.91216-.2068-.42336-.2158-.76757-.56-.98328-.9833-.10064-.1975-.16977-.4583-.20686-.9122-.0378-.4626-.03838-1.0568-.03838-1.9093v-8.4c0-.85245.00058-1.44669.03838-1.90932.03709-.45387.10622-.71464.20686-.91216.21571-.42336.55992-.76757.98328-.98328zm8.77148 15.35186c.0359-.0314.0737-.0644.1134-.0992l5.0035-4.3781c.048-.0419.0935-.0818.1368-.1198h-1.2037c-.8525 0-1.4467.0006-1.9093.0384-.4539.0371-.7147.1062-.9122.2068-.4233.2158-.7675.56-.9833.9833-.1006.1975-.1697.4583-.2068.9122-.0378.4626-.0384 1.0568-.0384 1.9093z" fill="#000000" fill-rule="evenodd">
               </path>
            </svg>
          </div>
          <span class="font-bold text-2xl mt-4" style="color: var(--text)">Create Notes</span>
          <span class="text-lg mt-2" style="color: var(--text-secondary)">Rich text editor</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['edit-content'])
const router = useRouter()
const searchQuery = ref('')
const selectedSubject = ref('all')
const selectedTags = ref<string[]>([])

const subjects = ['all', 'Programming', 'Mathematics', 'Science', 'History']
const allTags = ['javascript', 'react', 'hooks', 'basics', 'web', 'best-practices']

const getDifficultyColor = (level: string) => {
  switch (level) {
    case 'easy':
      return 'bg-green-100 text-green-700 border border-green-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
    case 'hard':
      return 'bg-red-100 text-red-700 border border-red-200'
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200'
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'quiz':
      return 'bg-blue-500'
    case 'flashcard':
      return 'bg-indigo-500'
    case 'note':
      return 'bg-purple-500'
    default:
      return 'bg-gray-500'
  }
}

const getContentIcon = (type: string) => {
  const icons = {
    quiz: () =>
      h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
        }),
      ]),
    flashcard: () =>
      h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253',
        }),
      ]),
    note: () =>
      h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
        }),
      ]),
  }
  return icons[type as keyof typeof icons] || icons.note
}

const filteredContent = computed(() => {
  return mockContent.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchSubject = selectedSubject.value === 'all' || item.subject === selectedSubject.value
    const matchTags =
      selectedTags.value.length === 0 || selectedTags.value.some((tag) => item.tags.includes(tag))
    return matchSearch && matchSubject && matchTags
  })
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const toggleTag = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((t) => t !== tag)
  } else {
    selectedTags.value.push(tag)
  }
}

const navigateToCreate = (type: string) => {
  switch (type) {
    case 'quiz':
      router.push('/QuizView')
      break
    case 'flashcard':
      router.push('/FlashcardView')
      break
    case 'note':
      router.push('/NoteView')
      break
  }
}

const emitEdit = (content: any, type: string) => {
  emit('edit-content', content, type)
}

// Mock content for testing - you can remove this if you have real data
const mockContent = [
  {
    id: 1,
    title: 'Sample Quiz',
    subject: 'Programming',
    tags: ['javascript', 'basics'],
    difficulty: 'easy',
    type: 'quiz',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    title: 'Sample Flashcard',
    subject: 'Mathematics',
    tags: ['algebra', 'basics'],
    difficulty: 'medium',
    type: 'flashcard',
    createdAt: '2024-01-16',
  },
  {
    id: 3,
    title: 'Sample Note',
    subject: 'Science',
    tags: ['biology', 'basics'],
    difficulty: 'easy',
    type: 'note',
    createdAt: '2024-01-17',
  },
]
</script>
