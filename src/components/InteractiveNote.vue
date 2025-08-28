<script setup lang="ts">
import { ref, computed } from 'vue'

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

// Try to parse JSON content first, then fallback to markdown
const parseContent = (content: string) => {
  try {
    // Try to parse as JSON
    const jsonData = JSON.parse(content)

    // If it's a note object with structured data
    if (jsonData.topic || jsonData.content) {
      return parseJsonNote(jsonData)
    }
  } catch {
    // Not JSON, continue with regular parsing
  }

  // Regular markdown parsing
  const lines = content.split('\n')
  const sections: { level: number; title: string; content: string[] }[] = []
  let currentSection: { level: number; title: string; content: string[] } | null = null

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith('#')) {
      // Save previous section
      if (currentSection) {
        sections.push(currentSection)
      }

      // Start new section
      const level = trimmedLine.match(/^#+/)?.[0].length || 1
      const title = trimmedLine.replace(/^#+\s*/, '')
      currentSection = { level, title, content: [] }
    } else if (currentSection && trimmedLine) {
      currentSection.content.push(line)
    }
  }

  // Add last section
  if (currentSection) {
    sections.push(currentSection)
  }

  return sections
}

// Parse JSON note content
const parseJsonNote = (jsonData: Record<string, unknown>) => {
  const sections: { level: number; title: string; content: string[] }[] = []

  // Check if new API format (with metadata) or current API format
  const isNewFormat = !!(jsonData.metadata && jsonData.content)

  if (isNewFormat) {
    // New API format
    const contentData = jsonData.content as Record<string, unknown>

    // Main topic section
    if (contentData.topic && typeof contentData.topic === 'string') {
      sections.push({
        level: 1,
        title: contentData.topic,
        content: []
      })
    }

    // Content sections
    if (contentData.sections && Array.isArray(contentData.sections)) {
      contentData.sections.forEach((item: Record<string, unknown>) => {
        if (item.title && typeof item.title === 'string') {
          const contentLines: string[] = []
          if (Array.isArray(item.content)) {
            item.content.forEach((line: unknown) => {
              if (typeof line === 'string') {
                contentLines.push(line)
              }
            })
          }

          sections.push({
            level: 2,
            title: item.title,
            content: contentLines
          })
        }
      })
    }
  } else {
    // Current API format: { title, content: [{ feature, description }] }

    // Main title section
    if (jsonData.title && typeof jsonData.title === 'string') {
      sections.push({
        level: 1,
        title: jsonData.title,
        content: []
      })
    }

    // Content sections (features)
    if (jsonData.content && Array.isArray(jsonData.content)) {
      jsonData.content.forEach((item: Record<string, unknown>) => {
        const title = (item.feature || item.title) as string
        const description = item.description as string

        if (title) {
          const contentLines: string[] = []
          if (description) {
            contentLines.push(description)
          }

          sections.push({
            level: 2,
            title: title,
            content: contentLines
          })
        }
      })
    }
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
  }
}
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
        <nav class="space-y-2">
          <button
            v-for="section in tableOfContents"
            :key="section.title"
            @click="scrollToSection(section.title)"
            class="block w-full text-left p-2 rounded-lg hover:bg-slate-100 transition-colors"
            :class="{
              'pl-2': section.level === 1,
              'pl-4': section.level === 2,
              'pl-6': section.level === 3,
            }"
          >
            <span class="text-sm font-medium text-slate-700">{{ section.title }}</span>
          </button>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="flex-1 p-8 max-w-4xl mx-auto">
        <!-- Title -->
        <header class="mb-8">
          <h1 class="text-4xl font-bold text-slate-900 mb-4">{{ props.title }}</h1>
          <div class="flex items-center gap-4 text-sm text-slate-600">
            <span>{{ sections.length }} sections</span>
            <span>•</span>
            <span>{{ props.content.split(' ').length }} words</span>
            <span>•</span>
            <span>{{ Math.ceil(props.content.split(' ').length / 200) }} min read</span>
          </div>
        </header>

        <!-- Content -->
        <article class="prose prose-slate max-w-none" :style="contentStyle">
          <div
            v-for="section in sections"
            :key="section.title"
            :id="`section-${section.title.replace(/\s+/g, '-').toLowerCase()}`"
            class="mb-8"
          >
            <component
              :is="`h${section.level}`"
              class="font-bold text-slate-900 mb-4"
              :class="{
                'text-3xl': section.level === 1,
                'text-2xl': section.level === 2,
                'text-xl': section.level === 3,
              }"
            >
              {{ section.title }}
            </component>

            <div
              v-for="(paragraph, index) in section.content"
              :key="index"
              class="mb-4 leading-relaxed"
            >
              <p v-if="paragraph.trim()" class="text-slate-700">
                {{ paragraph }}
              </p>
            </div>
          </div>
        </article>

        <!-- Reading Progress -->
        <div class="fixed bottom-8 right-8 bg-white rounded-lg shadow-lg p-4 border border-slate-200">
          <div class="text-sm font-medium text-slate-700 mb-2">Reading Progress</div>
          <div class="w-32 h-2 bg-slate-200 rounded-full">
            <div
              class="h-2 bg-blue-600 rounded-full transition-all duration-300"
              :style="{ width: '75%' }"
            ></div>
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
