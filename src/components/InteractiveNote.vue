<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  content: string
  title: string
}

const props = defineProps<Props>()

// Reading state
const fontSize = ref(16)
const lineHeight = ref(1.6)
const theme = ref<'light' | 'dark' | 'sepia'>('light')
const showTableOfContents = ref(true)
const readingProgress = ref(0)
const activeSection = ref('')

// Try to parse JSON content first, then fallback to markdown
const parseContent = (content: string) => {
  if (!content || typeof content !== 'string') {
    return [{
      level: 1,
      title: 'No content',
      content: ['There is no content in this note yet']
    }]
  }

  try {
    // Try to parse as JSON
    const jsonData = JSON.parse(content)

    // If it's a note object with structured data
    if (jsonData.topic || jsonData.content || jsonData.sections) {
      return parseJsonNote(jsonData)
    }
  } catch {
    // Not JSON, continue with regular parsing
  }

  // Regular markdown parsing with better handling
  const lines = content.split('\n')
  const sections: { level: number; title: string; content: string[] }[] = []
  let currentSection: { level: number; title: string; content: string[] } | null = null

  // If no headers found, treat entire content as single section
  let hasHeaders = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith('#')) {
      hasHeaders = true
      // Save previous section
      if (currentSection && currentSection.content.length > 0) {
        sections.push(currentSection)
      }

      // Start new section
      const level = trimmedLine.match(/^#+/)?.[0].length || 1
      const title = trimmedLine.replace(/^#+\s*/, '').trim()
      if (title) {
        currentSection = { level, title, content: [] }
      }
    } else if (currentSection && trimmedLine) {
      currentSection.content.push(trimmedLine)
    } else if (!hasHeaders && trimmedLine) {
      // If no headers, collect all content
      if (!currentSection) {
        currentSection = { level: 1, title: 'Content', content: [] }
      }
      currentSection.content.push(trimmedLine)
    }
  }

  // Add last section
  if (currentSection && currentSection.content.length > 0) {
    sections.push(currentSection)
  }

  // If no sections found, create a default one
  if (sections.length === 0) {
    sections.push({
      level: 1,
      title: 'Content',
      content: lines.filter(l => l.trim())
    })
  }

  return sections
}

// Parse JSON note content with better structure
const parseJsonNote = (jsonData: Record<string, unknown>) => {
  const sections: { level: number; title: string; content: string[] }[] = []

  // Check if new API format (with metadata) or current API format
  const isNewFormat = !!(jsonData.metadata && jsonData.content)

  if (isNewFormat) {
    // New API format
    const contentData = jsonData.content as Record<string, unknown>

    // Main topic section with introduction if available
    if (contentData.topic && typeof contentData.topic === 'string') {
      const introContent: string[] = []
      if (contentData.introduction && typeof contentData.introduction === 'string') {
        introContent.push(contentData.introduction)
      }
      sections.push({
        level: 1,
        title: contentData.topic,
        content: introContent
      })
    }

    // Content sections
    if (contentData.sections && Array.isArray(contentData.sections)) {
      contentData.sections.forEach((item: Record<string, unknown>) => {
        if (item.title && typeof item.title === 'string') {
          const contentLines: string[] = []

          // Handle different content formats
          if (typeof item.content === 'string') {
            contentLines.push(item.content)
          } else if (Array.isArray(item.content)) {
            item.content.forEach((line: unknown) => {
              if (typeof line === 'string' && line.trim()) {
                contentLines.push(line)
              }
            })
          } else if (typeof item.description === 'string') {
            contentLines.push(item.description)
          }

          if (contentLines.length > 0) {
            sections.push({
              level: 2,
              title: item.title,
              content: contentLines
            })
          }
        }
      })
    }
  } else {
    // Current API format: { title, content: [{ feature, description }] }

    // Main title section with overview if available
    if (jsonData.title && typeof jsonData.title === 'string') {
      const overviewContent: string[] = []
      if (jsonData.overview && typeof jsonData.overview === 'string') {
        overviewContent.push(jsonData.overview)
      }
      sections.push({
        level: 1,
        title: jsonData.title,
        content: overviewContent
      })
    }

    // Content sections (features)
    if (jsonData.content && Array.isArray(jsonData.content)) {
      jsonData.content.forEach((item: Record<string, unknown>) => {
        const title = (item.feature || item.title || item.section) as string
        const description = (item.description || item.content || item.text) as string

        if (title && description) {
          const contentLines: string[] = []
          if (typeof description === 'string') {
            // Split long descriptions into paragraphs
            const paragraphs = description.split(/\n\n|\. (?=[A-Z])/)
            paragraphs.forEach(p => {
              if (p.trim()) contentLines.push(p.trim())
            })
          }

          if (contentLines.length > 0) {
            sections.push({
              level: 2,
              title: title,
              content: contentLines
            })
          }
        }
      })
    }
  }

  // If no sections created, add default
  if (sections.length === 0) {
    sections.push({
      level: 1,
      title: 'Content',
      content: ['Content cannot be displayed at the moment']
    })
  }

  return sections
}

// Computed properties
const sections = computed(() => parseContent(props.content))
const tableOfContents = computed(() =>
  sections.value.filter(section => section.level <= 3)
)

const contentStyle = computed(() => ({
  fontSize: `${fontSize.value}px`,
  lineHeight: lineHeight.value,
}))

const themeClasses = computed(() => {
  switch (theme.value) {
    case 'dark':
      return 'bg-slate-900 text-slate-100'
    case 'sepia':
      return 'bg-amber-50 text-slate-800'
    default:
      return 'bg-white text-slate-900'
  }
})

// Methods
const increaseFontSize = () => {
  if (fontSize.value < 24) fontSize.value += 2
}

const decreaseFontSize = () => {
  if (fontSize.value > 12) fontSize.value -= 2
}

const toggleTheme = () => {
  const themes: ('light' | 'dark' | 'sepia')[] = ['light', 'dark', 'sepia']
  const currentIndex = themes.indexOf(theme.value)
  const nextIndex = (currentIndex + 1) % themes.length
  theme.value = themes[nextIndex]
}

const scrollToSection = (title: string) => {
  const element = document.getElementById(`section-${title.replace(/\s+/g, '-').toLowerCase()}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = title
  }
}

// Update reading progress on scroll
const updateReadingProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
  readingProgress.value = Math.round(progress)

  // Update active section
  const sectionElements = document.querySelectorAll('[id^="section-"]')
  let currentSection = ''

  sectionElements.forEach((element) => {
    const rect = element.getBoundingClientRect()
    if (rect.top <= 100 && rect.bottom > 100) {
      const id = element.getAttribute('id') || ''
      currentSection = id.replace('section-', '').replace(/-/g, ' ')
    }
  })

  if (currentSection) {
    activeSection.value = currentSection
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateReadingProgress)
  updateReadingProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateReadingProgress)
})
</script>

<template>
  <div class="max-w-6xl mx-auto" :class="themeClasses">
    <!-- Reading Controls -->
    <div class="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- Font Size Controls -->
          <div class="flex items-center gap-2">
            <button
              @click="decreaseFontSize"
              class="p-2 text-slate-600 hover:text-slate-900 transition-colors"
              title="Decrease font size"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            <span class="text-sm font-medium text-slate-700">{{ fontSize }}px</span>
            <button
              @click="increaseFontSize"
              class="p-2 text-slate-600 hover:text-slate-900 transition-colors"
              title="Increase font size"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <!-- Line Height Controls -->
          <div class="flex items-center gap-2">
            <button
              @click="lineHeight = Math.max(1.2, lineHeight - 0.1)"
              class="p-2 text-slate-600 hover:text-slate-900 transition-colors"
              title="Decrease line height"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8l4-4 4 4M7 16l4 4 4-4" />
              </svg>
            </button>
            <span class="text-sm font-medium text-slate-700">{{ lineHeight.toFixed(1) }}</span>
            <button
              @click="lineHeight = Math.min(2.0, lineHeight + 0.1)"
              class="p-2 text-slate-600 hover:text-slate-900 transition-colors"
              title="Increase line height"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l4-4 4 4M7 8l4 4 4-4" />
              </svg>
            </button>
          </div>

          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-2 text-slate-600 hover:text-slate-900 transition-colors"
            :title="`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'sepia' : 'light'} theme`"
          >
            <svg v-if="theme === 'light'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg v-else-if="theme === 'dark'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
            </svg>
          </button>
        </div>

        <!-- Table of Contents Toggle -->
        <button
          @click="showTableOfContents = !showTableOfContents"
          class="p-2 text-slate-600 hover:text-slate-900 transition-colors"
          title="Toggle table of contents"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex">
      <!-- Table of Contents -->
      <div
        v-if="showTableOfContents"
        class="w-64 p-6 border-r border-slate-200 min-h-screen"
      >
        <h3 class="font-semibold text-slate-900 mb-4">Table of Contents</h3>
        <nav class="space-y-1">
          <button
            v-for="section in tableOfContents"
            :key="section.title"
            @click="scrollToSection(section.title)"
            class="block w-full text-left px-3 py-2 rounded-lg transition-all duration-200"
            :class="[
              activeSection === section.title
                ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900',
              {
                'pl-3': section.level === 1,
                'pl-6': section.level === 2,
                'pl-9': section.level === 3,
              }
            ]"
          >
            <span class="text-sm" :class="{ 'font-semibold': section.level === 1, 'font-medium': section.level === 2 }">
              {{ section.title }}
            </span>
            <div v-if="section.content.length > 0" class="text-xs text-slate-500 mt-1">
              {{ section.content.length }} paragraphs
            </div>
          </button>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="flex-1 p-8 max-w-4xl mx-auto">
        <!-- Title -->
        <header class="mb-12 pb-6 border-b-2 border-slate-200">
          <h1 class="text-4xl font-bold text-slate-900 mb-4">{{ props.title }}</h1>
          <div class="flex items-center gap-4 text-sm text-slate-600">
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ sections.length }} sections
            </span>
            <span>•</span>
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {{ props.content.split(' ').length }} words
            </span>
            <span>•</span>
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ Math.ceil(props.content.split(' ').length / 200) }} min
            </span>
          </div>
        </header>

        <!-- Content -->
        <article class="prose prose-slate max-w-none" :style="contentStyle">
          <!-- Empty State -->
          <div v-if="sections.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-slate-500">There is no content in this note yet</p>
          </div>

          <!-- Sections -->
          <div
            v-for="(section, sectionIndex) in sections"
            :key="section.title"
            :id="`section-${section.title.replace(/\s+/g, '-').toLowerCase()}`"
            class="mb-12 scroll-mt-20"
          >
            <!-- Section Header with visual separator -->
            <div class="relative mb-6">
              <h1
                v-if="section.level === 1"
                class="font-bold text-slate-900 text-3xl flex items-center gap-3"
              >
                <span class="text-blue-500 font-normal">{{ String(sectionIndex + 1).padStart(2, '0') }}</span>
                {{ section.title }}
              </h1>
              <h2
                v-else-if="section.level === 2"
                class="font-bold text-slate-800 text-2xl flex items-center gap-3"
              >
                <span class="w-8 h-1 bg-blue-500 rounded"></span>
                {{ section.title }}
              </h2>
              <h3
                v-else-if="section.level === 3"
                class="font-semibold text-slate-700 text-xl"
              >
                {{ section.title }}
              </h3>
              <h4
                v-else
                class="font-medium text-slate-600 text-lg"
              >
                {{ section.title }}
              </h4>
            </div>

            <!-- Section Content with better spacing -->
            <div v-if="section.content.length > 0" class="space-y-4">
              <div
                v-for="(paragraph, index) in section.content"
                :key="index"
                class="relative"
              >
                <!-- Check if paragraph is a list item -->
                <div v-if="paragraph.startsWith('•') || paragraph.startsWith('-') || paragraph.match(/^\d+\./)"
                     class="flex gap-3 items-start">
                  <span class="text-blue-500 mt-1">•</span>
                  <p class="text-slate-700 leading-relaxed flex-1">
                    {{ paragraph.replace(/^[•\-]\s*|^\d+\.\s*/, '') }}
                  </p>
                </div>
                <!-- Regular paragraph -->
                <p v-else-if="typeof paragraph === 'string' && paragraph.trim()"
                   class="text-slate-700 leading-relaxed text-base">
                  {{ paragraph }}
                </p>
              </div>
            </div>

            <!-- Empty section indicator -->
            <div v-else class="text-slate-400 italic">
              (No content in this section)
            </div>

            <!-- Section separator -->
            <div v-if="sectionIndex < sections.length - 1" class="mt-8 border-b border-slate-200"></div>
          </div>
        </article>

        <!-- Reading Progress -->
        <div class="fixed bottom-8 right-8 bg-white rounded-lg shadow-lg p-4 border border-slate-200">
          <div class="text-sm font-medium text-slate-700 mb-2">Read {{ readingProgress }}%</div>
          <div class="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              class="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
              :style="{ width: `${readingProgress}%` }"
            ></div>
          </div>
          <div v-if="activeSection" class="text-xs text-slate-500 mt-2 truncate max-w-[128px]">
            Reading: {{ activeSection }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  max-width: none;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: inherit;
  font-weight: inherit;
  margin-top: 0;
  margin-bottom: 0;
}

.prose p {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
