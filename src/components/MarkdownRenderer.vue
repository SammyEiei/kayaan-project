<template>
  <div
    class="markdown-content prose prose-sm max-w-none"
    v-html="renderedMarkdown"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'

interface Props {
  content: string
}

const props = defineProps<Props>()

// Configure marked options
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true, // GitHub Flavored Markdown
})

const renderedMarkdown = computed(() => {
  if (!props.content) return ''

  try {
    return marked(props.content)
  } catch (error) {
    console.error('Markdown rendering error:', error)
    return props.content // Fallback to plain text
  }
})
</script>

<style scoped>
/* Markdown content styling with Kayaan theme - Darker colors */
.markdown-content {
  @apply text-theme-text leading-relaxed;
  color: #1a202c; /* Darker text */
}

.markdown-content :deep(h1) {
  @apply text-2xl font-bold mt-6 mb-4;
  color: #1e40af; /* Darker blue */
}

.markdown-content :deep(h2) {
  @apply text-xl font-semibold mt-5 mb-3;
  color: #1e40af; /* Darker blue */
}

.markdown-content :deep(h3) {
  @apply text-lg font-semibold mt-4 mb-2;
  color: #1e40af; /* Darker blue */
}

.markdown-content :deep(h4) {
  @apply text-base font-semibold mt-3 mb-2;
  color: #1e40af; /* Darker blue */
}

.markdown-content :deep(p) {
  @apply mb-4;
  color: #1a202c; /* Darker text */
}

.markdown-content :deep(ul) {
  @apply list-disc list-inside mb-4 space-y-1;
}

.markdown-content :deep(ol) {
  @apply list-decimal list-inside mb-4 space-y-1;
}

.markdown-content :deep(li) {
  @apply ml-4;
  color: #1a202c; /* Darker text */
}

.markdown-content :deep(blockquote) {
  @apply border-l-4 pl-4 italic my-4 rounded-r-lg;
  border-left-color: #1e40af; /* Darker blue */
  background-color: #f1f5f9; /* Darker surface */
  color: #475569; /* Darker secondary text */
  padding: 1rem;
}

.markdown-content :deep(code) {
  @apply px-2 py-1 rounded text-sm font-mono;
  background-color: #f1f5f9; /* Darker surface */
  color: #1e40af; /* Darker blue */
  border: 1px solid #cbd5e1; /* Darker border */
}

.markdown-content :deep(pre) {
  @apply p-4 rounded-lg overflow-x-auto my-4;
  background-color: #1e293b; /* Dark background for code */
  border: 1px solid #334155; /* Darker border */
}

.markdown-content :deep(pre code) {
  @apply bg-transparent p-0 border-0;
  color: #e2e8f0; /* Light text on dark background */
}

.markdown-content :deep(a) {
  @apply underline transition-colors duration-200;
  color: #1e40af; /* Darker blue */
}

.markdown-content :deep(a:hover) {
  color: #7c3aed; /* Darker purple */
}

.markdown-content :deep(strong) {
  @apply font-semibold;
  color: #0f172a; /* Very dark text */
}

.markdown-content :deep(em) {
  @apply italic;
  color: #475569; /* Darker secondary text */
}

.markdown-content :deep(hr) {
  @apply my-6;
  border-color: #cbd5e1; /* Darker border */
}

.markdown-content :deep(table) {
  @apply w-full border-collapse my-4 rounded-lg overflow-hidden;
  border: 1px solid #cbd5e1; /* Darker border */
}

.markdown-content :deep(th) {
  @apply px-4 py-3 text-left font-semibold;
  background-color: #f1f5f9; /* Darker surface */
  color: #0f172a; /* Very dark text */
  border-bottom: 1px solid #cbd5e1; /* Darker border */
}

.markdown-content :deep(td) {
  @apply px-4 py-3;
  border-bottom: 1px solid #cbd5e1; /* Darker border */
  color: #1a202c; /* Darker text */
}

.markdown-content :deep(tr:last-child td) {
  border-bottom: none;
}

.markdown-content :deep(img) {
  @apply max-w-full h-auto rounded-lg my-4 shadow-sm;
  border: 1px solid #cbd5e1; /* Darker border */
}

/* Syntax highlighting for code blocks */
.markdown-content :deep(pre[class*="language-"]) {
  @apply relative;
}

.markdown-content :deep(pre[class*="language-"]::before) {
  content: attr(class);
  @apply absolute top-2 right-2 text-xs px-2 py-1 rounded;
  background-color: #1e40af; /* Darker blue */
  color: white;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Custom scrollbar for code blocks */
.markdown-content :deep(pre) {
  scrollbar-width: thin;
  scrollbar-color: #475569 transparent; /* Darker scrollbar */
}

.markdown-content :deep(pre::-webkit-scrollbar) {
  height: 6px;
}

.markdown-content :deep(pre::-webkit-scrollbar-track) {
  background: transparent;
}

.markdown-content :deep(pre::-webkit-scrollbar-thumb) {
  background-color: #475569; /* Darker scrollbar */
  border-radius: 3px;
}

.markdown-content :deep(pre::-webkit-scrollbar-thumb:hover) {
  background-color: #334155; /* Even darker on hover */
}
</style>
