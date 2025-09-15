/**
 * Markdown Converter Utility
 * แปลง Note editor blocks เป็น Markdown syntax
 */

export interface NoteBlock {
  id: number
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bullet' | 'numbered' | 'quote' | 'code'
  content: string
  placeholder: string
}

/**
 * แปลง Note blocks เป็น Markdown syntax
 */
export function convertBlocksToMarkdown(blocks: NoteBlock[]): string {
  return blocks
    .map(block => convertBlockToMarkdown(block))
    .filter(markdown => markdown.trim()) // ลบ empty blocks
    .join('\n\n') // เพิ่ม spacing ระหว่าง blocks
}

/**
 * แปลง block เดียวเป็น Markdown syntax
 */
function convertBlockToMarkdown(block: NoteBlock): string {
  const content = block.content.trim()

  if (!content) return ''

  switch (block.type) {
    case 'heading1':
      return `# ${content}`

    case 'heading2':
      return `## ${content}`

    case 'heading3':
      return `### ${content}`

    case 'bullet':
      return `- ${content}`

    case 'numbered':
      return `1. ${content}`

    case 'quote':
      return `> ${content}`

    case 'code':
      return `\`\`\`\n${content}\n\`\`\``

    case 'paragraph':
    default:
      return content
  }
}

/**
 * แปลง Markdown เป็น HTML (สำหรับ preview) - Enhanced Version
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return ''
  }

  let html = markdown

  // ✅ Code blocks (ต้องทำก่อน inline code)
  html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
    const trimmedCode = code.trim()
    return `<pre class="bg-slate-100 text-slate-800 p-4 rounded-lg overflow-x-auto my-4 border border-slate-200"><code class="text-sm font-mono">${trimmedCode}</code></pre>`
  })

  // ✅ Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm font-mono border">$1</code>')

  // ✅ Blockquotes (ต้องทำก่อน headers)
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-slate-600 my-4 bg-blue-50 py-2 rounded-r">$1</blockquote>')

  // ✅ Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-slate-900 mb-3 mt-6">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-slate-900 mb-4 mt-8">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-slate-900 mb-6 mt-10">$1</h1>')

  // ✅ Bold and Italic (ต้องทำก่อน lists)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>')

  // ✅ Unordered lists
  html = html.replace(/^[\s]*[-*+] (.+)$/gm, '<li class="ml-6 mb-2 text-slate-700">$1</li>')

  // ✅ Ordered lists
  html = html.replace(/^[\s]*\d+\. (.+)$/gm, '<li class="ml-6 mb-2 text-slate-700">$1</li>')

  // ✅ Wrap lists in ul/ol tags
  html = html.replace(/(<li class="ml-6 mb-2 text-slate-700">.*<\/li>)/gs, (match) => {
    // Check if it's ordered list (contains numbers)
    if (match.match(/\d+\./)) {
      return `<ol class="list-decimal list-inside mb-4 space-y-1">${match}</ol>`
    } else {
      return `<ul class="list-disc list-inside mb-4 space-y-1">${match}</ul>`
    }
  })

  // ✅ Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="my-8 border-slate-300">')

  // ✅ Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')

  // ✅ Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-sm my-4">')

  // ✅ Line breaks and paragraphs
  html = html
    .replace(/\n\n/g, '</p><p class="mb-4 text-slate-700 leading-relaxed">')
    .replace(/\n/g, '<br>')

  // ✅ Wrap in paragraphs
  html = html.replace(/^(?!<[h1-6]|<blockquote|<pre|<ul|<ol|<li|<hr)(.*)$/gm, '<p class="mb-4 text-slate-700 leading-relaxed">$1</p>')

  // ✅ Clean up empty paragraphs and fix nested tags
  html = html
    .replace(/<p class="mb-4 text-slate-700 leading-relaxed"><\/p>/g, '')
    .replace(/<p class="mb-4 text-slate-700 leading-relaxed"><br><\/p>/g, '')
    .replace(/<p class="mb-4 text-slate-700 leading-relaxed">(<[^>]+>.*<\/[^>]+>)<\/p>/g, '$1')
    .replace(/<p class="mb-4 text-slate-700 leading-relaxed">(<blockquote[^>]*>.*<\/blockquote>)<\/p>/g, '$1')
    .replace(/<p class="mb-4 text-slate-700 leading-relaxed">(<pre[^>]*>.*<\/pre>)<\/p>/g, '$1')
    .replace(/<p class="mb-4 text-slate-700 leading-relaxed">(<ul[^>]*>.*<\/ul>)<\/p>/g, '$1')
    .replace(/<p class="mb-4 text-slate-700 leading-relaxed">(<ol[^>]*>.*<\/ol>)<\/p>/g, '$1')

  return html
}

/**
 * แปลง Markdown เป็น plain text (สำหรับ search/preview)
 */
export function markdownToPlainText(markdown: string): string {
  return markdown
    // Remove headers
    .replace(/^#{1,6} /gm, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove quotes
    .replace(/^> /gm, '')
    // Remove list markers
    .replace(/^[-*+] /gm, '')
    .replace(/^\d+\. /gm, '')
    // Remove bold/italic
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Clean up whitespace
    .replace(/\n+/g, ' ')
    .trim()
}

/**
 * สร้าง Markdown preview สำหรับ Note editor
 */
export function createMarkdownPreview(blocks: NoteBlock[]): string {
  const markdown = convertBlocksToMarkdown(blocks)
  return markdownToHtml(markdown)
}

/**
 * ตรวจสอบว่า content มี Markdown syntax หรือไม่
 */
export function hasMarkdownSyntax(content: string): boolean {
  const markdownPatterns = [
    /^#{1,6} /m,        // Headers
    /```[\s\S]*?```/,   // Code blocks
    /`[^`]+`/,          // Inline code
    /^> /m,             // Quotes
    /^[-*+] /m,         // Bullet lists
    /^\d+\. /m,         // Numbered lists
    /\*\*.*?\*\*/,      // Bold
    /\*.*?\*/           // Italic
  ]

  return markdownPatterns.some(pattern => pattern.test(content))
}
