<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAIGenerationStore } from '@/stores/aiGeneration'
// import { useAIContentStore } from '@/stores/aiContent'
import { ApiTestUtil } from '@/utils/apiTestUtil'
import { PathTestUtil } from '@/utils/pathTestUtil'

// Define emits for parent communication
const emit = defineEmits<{
  switchTab: [tab: 'chat' | 'history' | 'saved']
}>()

const aiGenerationStore = useAIGenerationStore()
// const aiContentStore = useAIContentStore()
const router = useRouter()
const route = useRoute()

// Step management
const currentStep = ref<'prompt' | 'preview' | 'generating' | 'result'>('prompt')

// Form data
const promptText = ref('')
const outputFormat = ref<'quiz' | 'flashcard' | 'note'>('note')
const attachedFile = ref<File | null>(null)
const generationProgress = ref(0)
const generationStatus = ref('Initializing...')

// Track if prompt has been modified from default
const initialPromptText = ref('')
const isPromptModified = ref(false)

// Kayaan Animation State
const currentGenerationMessage = ref('<svg class="w-5 h-5 inline text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path></svg> Kayaan is thinking...')
const currentFunFact = ref('Kayaan uses AI to create personalized content just for you')
const animationTimer = ref<NodeJS.Timeout | null>(null)

// Generation Messages
const generationMessages = [
  '<svg class="w-5 h-5 inline text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path></svg> Kayaan is thinking...',
  '<svg class="w-5 h-5 inline text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path></svg> Preparing content...',
  '<svg class="w-5 h-5 inline text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path></svg> Creating amazing content...',
  '<svg class="w-5 h-5 inline text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg> Fine-tuning details...',
  '<svg class="w-5 h-5 inline text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg> Quality checking...',
  '<svg class="w-5 h-5 inline text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg> Almost ready!'
]

// Fun Facts
const funFacts = [
  'Kayaan uses AI to create personalized content just for you',
  'Generated content can be customized to your preferences',
  'AI continuously learns and improves over time',
  'Kayaan supports creating various types of educational content',
  'You can save and share your content with others',
  'Learning with AI makes studying faster and more effective!'
]
const showPreview = ref(false)
const previewContent = ref('')

// Preset system state
const selectedPreset = ref<string | null>(null)
const showPresetModal = ref(false)
const customFields = ref<Record<string, string>>({})

// Auto-redirect settings
const autoRedirectToContent = ref(true) // สามารถเปลี่ยนเป็น false ถ้าไม่ต้องการ auto-redirect
// const showBackendIntegrationWarning = ref(true)
const redirectTimeoutId = ref<NodeJS.Timeout | null>(null)
const redirectCountdown = ref(2) // Countdown timer for redirect

// Methods for warnings
// const hideBackendIntegrationWarning = () => {
//   showBackendIntegrationWarning.value = false
// }
const redirectCountdownInterval = ref<NodeJS.Timeout | null>(null)

// Rate limiting
const lastRequestTime = ref<number>(0)
const MIN_REQUEST_INTERVAL = 3000 // 3 seconds between requests

// Animation Functions
const startKayaanAnimation = () => {
  let messageIndex = 0
  let factIndex = 0

  animationTimer.value = setInterval(() => {
    // Update message every 3 seconds
    currentGenerationMessage.value = generationMessages[messageIndex]
    messageIndex = (messageIndex + 1) % generationMessages.length

    // Update fun fact every 5 seconds
    if (Math.random() > 0.4) {
      currentFunFact.value = funFacts[factIndex]
      factIndex = (factIndex + 1) % funFacts.length
    }
  }, 3000)
}

const stopKayaanAnimation = () => {
  if (animationTimer.value) {
    clearInterval(animationTimer.value)
    animationTimer.value = null
  }
}

// File upload
const fileInput = ref<HTMLInputElement>()

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    attachedFile.value = target.files[0]
    // Auto-update prompt when file is attached
    updatePromptBasedOnFileStatus()
  }
}

const removeFile = () => {
  attachedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  // Auto-update prompt when file is removed
  updatePromptBasedOnFileStatus()
}

// Function to update prompt based on file attachment status
const updatePromptBasedOnFileStatus = () => {
  const currentPrompts = getCurrentPrompts()
  promptText.value = currentPrompts[outputFormat.value]
  // Update initial prompt and reset modification status
  initialPromptText.value = promptText.value
  isPromptModified.value = false
}

// Default prompts - different versions for with/without file attachment
const defaultPromptsWithFile = {
  quiz: 'Generate an educational quiz in English based on the attached content. Create multiple choice questions, true/false questions, and short answer questions. Focus on key concepts, important details, and critical thinking skills from the provided material. Ensure all questions and answers are in clear, academic English suitable for study purposes.',
  flashcard: 'Create educational flashcards in English from the attached content. Cover key terms, concepts, definitions, and important facts from the provided material. Each flashcard should have a clear question or term in English on the front and a concise, accurate answer in English on the back. Use academic vocabulary appropriate for study and learning.',
  note: 'Transform the attached content into well-organized study notes in English. Use clear headings, bullet points, and structured information from the provided material. Include key concepts, definitions, examples, and important details in proper academic English. Format the notes for easy review and comprehension in an educational context.'
}

const defaultPromptsWithoutFile = {
  quiz: 'Generate an educational quiz in English on a specific topic of your choice. Create multiple choice questions, true/false questions, and short answer questions. Please specify the subject area, academic level, and key topics you want covered. Example: "Create a high school level biology quiz covering photosynthesis, cellular respiration, and plant structure with 10 questions total."',
  flashcard: 'Create educational flashcards in English on a specific topic of your choice. Please specify the subject area, academic level, and key concepts you want covered. Example: "Create intermediate-level Spanish vocabulary flashcards for common verbs and adjectives used in daily conversation, with 10 cards total."',
  note: 'Create well-organized study notes in English on a specific topic of your choice. Please specify the subject area, academic level, and key concepts you want covered. Example: "Create comprehensive study notes for high school chemistry covering atomic structure, chemical bonding, and periodic table trends with clear explanations and examples."'
}

// Icon mapping for presets
const getPresetIcon = (presetId: string) => {
  const iconMap: Record<string, string> = {
    // Study Notes icons
    'summarize-topic': 'BookOpen',
    'compare-contrast': 'Scale',
    'timeline-style': 'Clock',
    'concept-map': 'Map',
    // Quiz icons
    'multiple-choice': 'CheckCircle',
    'short-answer': 'Edit3',
    'mixed-format': 'Shuffle',
    'critical-thinking': 'Brain',
    // Flashcard icons
    'definition-based': 'FileText',
    'qa-style': 'MessageCircle',
    'examples-based': 'Globe',
    'visual-memory': 'Eye'
  }
  return iconMap[presetId] || 'FileText'
}

// Prompt Presets for each content type (when no file attached)
const promptPresets = {
  note: [
    {
      id: 'summarize-topic',
      title: 'Summarize by Topic',
      description: 'Structured notes with clear organization',
      template: 'Create comprehensive study notes in English for [LEVEL] level [SUBJECT] covering [TOPICS]. Include clear headings, bullet points, key definitions, and practical examples. Format for easy review and understanding.',
      placeholders: ['LEVEL', 'SUBJECT', 'TOPICS'],
      example: 'university level Biology covering photosynthesis, cellular respiration, and mitosis'
    },
    {
      id: 'compare-contrast',
      title: 'Compare & Contrast',
      description: 'Side-by-side comparison with tables',
      template: 'Create study notes in English that compare and contrast [TOPIC_A] and [TOPIC_B] for [LEVEL] level study. Use tables, bullet points, and clear examples to highlight similarities and differences.',
      placeholders: ['TOPIC_A', 'TOPIC_B', 'LEVEL'],
      example: 'mitosis and meiosis for high school level study'
    },
    {
      id: 'timeline-style',
      title: 'Timeline Style',
      description: 'Chronological organization with dates',
      template: 'Create chronological study notes in English about [HISTORICAL_TOPIC] for [LEVEL] level. Include important dates, events in order, key figures, and cause-effect relationships.',
      placeholders: ['HISTORICAL_TOPIC', 'LEVEL'],
      example: 'World War II for university level'
    },
    {
      id: 'concept-map',
      title: 'Concept Mapping',
      description: 'Interconnected concepts and relationships',
      template: 'Create study notes in English for [SUBJECT] that show how [MAIN_CONCEPTS] are interconnected. Include concept relationships, hierarchies, and practical applications for [LEVEL] level understanding.',
      placeholders: ['SUBJECT', 'MAIN_CONCEPTS', 'LEVEL'],
      example: 'Chemistry showing how atomic structure, bonding, and reactions are interconnected for high school level'
    }
  ],
  quiz: [
    {
      id: 'multiple-choice',
      title: 'Multiple Choice Quiz',
      description: 'Standard multiple choice format',
      template: 'Generate [NUMBER] multiple-choice questions in English about [TOPIC] for [LEVEL] level. Each question should have 4 options (A, B, C, D) with only one correct answer. Include the correct answer and brief explanations.',
      placeholders: ['NUMBER', 'TOPIC', 'LEVEL'],
      example: '10 questions about cellular biology for university level'
    },
    {
      id: 'short-answer',
      title: 'Short Answer Quiz',
      description: 'Open-ended questions requiring brief responses',
      template: 'Generate [NUMBER] short-answer questions in English about [TOPIC] suitable for [LEVEL] level students. Questions should test understanding, application, and analysis skills. Provide sample answers.',
      placeholders: ['NUMBER', 'TOPIC', 'LEVEL'],
      example: '8 questions about environmental science for high school level'
    },
    {
      id: 'mixed-format',
      title: 'Mixed Format Quiz',
      description: 'Combination of question types',
      template: 'Create a mixed-format quiz in English about [TOPIC] for [LEVEL] level with [MC_COUNT] multiple-choice, [TF_COUNT] true/false, and [SA_COUNT] short-answer questions. Include answer key with explanations.',
      placeholders: ['TOPIC', 'LEVEL', 'MC_COUNT', 'TF_COUNT', 'SA_COUNT'],
      example: 'Physics for university level with 5 multiple-choice, 3 true/false, and 2 short-answer questions'
    },
    {
      id: 'critical-thinking',
      title: 'Critical Thinking Quiz',
      description: 'Higher-order thinking questions',
      template: 'Generate [NUMBER] critical thinking questions in English about [TOPIC] for [LEVEL] level. Focus on analysis, synthesis, evaluation, and application. Include scenario-based questions and detailed sample responses.',
      placeholders: ['NUMBER', 'TOPIC', 'LEVEL'],
      example: '6 questions about ethical dilemmas in business for university level'
    }
  ],
  flashcard: [
    {
      id: 'definition-based',
      title: 'Definition Flashcards',
      description: 'Term on front, definition on back',
      template: 'Generate [NUMBER] definition-based flashcards in English for [SUBJECT] at [LEVEL] level. Each card should have a key term on the front and a clear, concise definition with an example on the back. Focus on [TOPIC_AREA].',
      placeholders: ['NUMBER', 'SUBJECT', 'LEVEL', 'TOPIC_AREA'],
      example: '20 flashcards for Psychology at university level focusing on cognitive processes'
    },
    {
      id: 'qa-style',
      title: 'Q&A Flashcards',
      description: 'Question on front, answer on back',
      template: 'Create [NUMBER] Q&A flashcards in English about [TOPIC] for [LEVEL] level study. Each card should have a clear question on the front and a comprehensive answer on the back with key points and examples.',
      placeholders: ['NUMBER', 'TOPIC', 'LEVEL'],
      example: '15 flashcards about calculus for university level'
    },
    {
      id: 'examples-based',
      title: 'Example-Based Cards',
      description: 'Concept with real-world examples',
      template: 'Generate [NUMBER] example-based flashcards in English for [SUBJECT] concepts at [LEVEL] level. Each card should have a concept or principle on the front and real-world examples with applications on the back.',
      placeholders: ['NUMBER', 'SUBJECT', 'LEVEL'],
      example: '12 flashcards for Economics concepts at high school level'
    },
    {
      id: 'visual-memory',
      title: 'Visual Memory Cards',
      description: 'Description-based visual learning',
      template: 'Create [NUMBER] visual memory flashcards in English for [TOPIC] at [LEVEL] level. Each card should have a descriptive prompt on the front and detailed visual descriptions, characteristics, or processes on the back.',
      placeholders: ['NUMBER', 'TOPIC', 'LEVEL'],
      example: '10 flashcards for Art History at university level'
    }
  ]
}

// Dynamic prompt selector based on file attachment
const getCurrentPrompts = () => {
  return attachedFile.value ? defaultPromptsWithFile : defaultPromptsWithoutFile
}

// Content type options
const outputFormats = [
  { value: 'note', label: 'Notes', icon: 'FileText', description: 'Organized study notes in English' },
  { value: 'quiz', label: 'Quiz', icon: 'List', description: 'Interactive quiz questions in English' },
  { value: 'flashcard', label: 'Flashcards', icon: 'HelpCircle', description: 'Study flashcards in English' }
]

// Helper function to check if content is primarily in English (optional enhancement)
const hasEnglishContent = (text: string): boolean => {
  const totalChars = text.replace(/\s/g, '').length
  const englishChars = (text.match(/[a-zA-Z]/g) || []).length

  // At least 70% should be English characters for meaningful content
  return totalChars === 0 || (englishChars / totalChars) > 0.7
}

// Validation
const isValid = computed(() => {
  const trimmedText = promptText.value.trim()
  const hasValidPrompt = trimmedText.length >= 10 &&
                        trimmedText.length <= 2000 &&
                        hasEnglishContent(trimmedText)

  // If file is attached, allow using default prompt
  // If no file attached, require prompt modification
  return hasValidPrompt && (attachedFile.value || isPromptModified.value)
})

const characterCount = computed(() => promptText.value.length)

// Validation message
const validationMessage = computed(() => {
  const trimmedText = promptText.value.trim()

  if (trimmedText.length === 0) return 'Please enter a prompt to continue'

  // If no file attached and prompt not modified, show customization message
  if (!attachedFile.value && !isPromptModified.value) {
    return 'Please customize the prompt or select a template to continue'
  }

  if (trimmedText.length < 10) return 'Please enter at least 10 characters'
  if (trimmedText.length > 2000) return 'Please keep within 2000 characters'
  if (!hasEnglishContent(trimmedText)) return 'Please write primarily in English for best results'

  return ''
})

// Watch for prompt text changes to track if user has modified it
watch(promptText, (newValue) => {
  if (initialPromptText.value && newValue !== initialPromptText.value) {
    isPromptModified.value = true
  }
})

// Navigation
const handleNext = () => {
  if (currentStep.value === 'prompt') {
    currentStep.value = 'preview'
  } else if (currentStep.value === 'preview') {
    handleGenerate()
  }
}

const handleBack = () => {
  if (currentStep.value === 'preview') {
    currentStep.value = 'prompt'
  }
}

// Preset management functions
const getCurrentPresets = () => {
  return promptPresets[outputFormat.value] || []
}

const handlePresetSelect = (presetId: string) => {
  const presets = getCurrentPresets()
  const preset = presets.find(p => p.id === presetId)

  if (!preset) return

  selectedPreset.value = presetId

  // Reset custom fields
  customFields.value = {}
  preset.placeholders.forEach(placeholder => {
    customFields.value[placeholder] = ''
  })

  // Show preset modal for customization
  showPresetModal.value = true
}

const applyPreset = () => {
  const presets = getCurrentPresets()
  const preset = presets.find(p => p.id === selectedPreset.value)

  if (!preset) return

  let finalPrompt = preset.template

  // Replace placeholders with user values
  preset.placeholders.forEach(placeholder => {
    const value = customFields.value[placeholder] || `[${placeholder}]`
    finalPrompt = finalPrompt.replace(new RegExp(`\\[${placeholder}\\]`, 'g'), value)
  })

  promptText.value = finalPrompt
  // Mark as modified since user applied a preset
  isPromptModified.value = true
  showPresetModal.value = false
}

const usePresetExample = () => {
  const presets = getCurrentPresets()
  const preset = presets.find(p => p.id === selectedPreset.value)

  if (!preset) return

  // Parse example and fill custom fields
  const example = preset.example

  // Smart parsing based on placeholders
  if (preset.placeholders.includes('LEVEL')) {
    const levelMatch = example.match(/(high school|university|college|elementary|middle school|professional)/i)
    if (levelMatch) customFields.value['LEVEL'] = levelMatch[1]
  }

  if (preset.placeholders.includes('SUBJECT')) {
    const subjectMatch = example.match(/(Biology|Chemistry|Physics|History|Math|English|Science)/i)
    if (subjectMatch) customFields.value['SUBJECT'] = subjectMatch[1]
  }

  if (preset.placeholders.includes('NUMBER')) {
    const numberMatch = example.match(/(\d+)/i)
    if (numberMatch) {
      const num = parseInt(numberMatch[1])
      customFields.value['NUMBER'] = validateNumberInput(num.toString())
    }
  }

  // Parse MC_COUNT, TF_COUNT, SA_COUNT for mixed format
  if (preset.placeholders.includes('MC_COUNT')) {
    const mcMatch = example.match(/(\d+)\s*multiple[-\s]choice/i)
    if (mcMatch) customFields.value['MC_COUNT'] = validateNumberInput(mcMatch[1])
  }

  if (preset.placeholders.includes('TF_COUNT')) {
    const tfMatch = example.match(/(\d+)\s*true[-/\s]false/i)
    if (tfMatch) customFields.value['TF_COUNT'] = validateNumberInput(tfMatch[1])
  }

  if (preset.placeholders.includes('SA_COUNT')) {
    const saMatch = example.match(/(\d+)\s*(?:short[-\s]answer|open[-\s]ended)/i)
    if (saMatch) customFields.value['SA_COUNT'] = validateNumberInput(saMatch[1])
  }

  // Apply the example
  applyPreset()
}

// Helper function for placeholder hints
const getPlaceholderHint = (placeholder: string): string => {
  const hints: Record<string, string> = {
    'LEVEL': 'e.g., high school, university, professional',
    'SUBJECT': 'e.g., Biology, Chemistry, History, Math',
    'TOPIC': 'e.g., photosynthesis, World War II, calculus',
    'TOPICS': 'e.g., cell structure, DNA replication, enzymes',
    'NUMBER': 'Number of questions/cards (1-10)',
    'TOPIC_A': 'e.g., mitosis',
    'TOPIC_B': 'e.g., meiosis',
    'HISTORICAL_TOPIC': 'e.g., World War II, Industrial Revolution',
    'MAIN_CONCEPTS': 'e.g., atomic structure, chemical bonding, reactions',
    'TOPIC_AREA': 'e.g., cognitive processes, learning theories',
    'MC_COUNT': 'Multiple choice questions (1-10)',
    'TF_COUNT': 'True/false questions (1-10)',
    'SA_COUNT': 'Short answer questions (1-10)'
  }
  return hints[placeholder] || `Enter ${placeholder.toLowerCase().replace('_', ' ')}`
}

// Helper function to get field label with description
const getFieldLabel = (placeholder: string): string => {
  const labels: Record<string, string> = {
    'NUMBER': 'Number of Questions/Cards',
    'MC_COUNT': 'Multiple Choice Questions',
    'TF_COUNT': 'True/False Questions',
    'SA_COUNT': 'Short Answer Questions',
    'LEVEL': 'Academic Level',
    'SUBJECT': 'Subject',
    'TOPIC': 'Topic',
    'TOPICS': 'Topics',
    'TOPIC_A': 'First Topic',
    'TOPIC_B': 'Second Topic',
    'HISTORICAL_TOPIC': 'Historical Topic',
    'MAIN_CONCEPTS': 'Main Concepts',
    'TOPIC_AREA': 'Topic Area'
  }
  return labels[placeholder] || placeholder.replace('_', ' ').toLowerCase()
}

// Helper function to check if field is number type
const isNumberField = (placeholder: string): boolean => {
  return ['NUMBER', 'MC_COUNT', 'TF_COUNT', 'SA_COUNT'].includes(placeholder)
}

// Validation for number fields
const validateNumberInput = (value: string): string => {
  if (!value) return ''

  // Remove non-digit characters
  const numericValue = value.replace(/\D/g, '')

  // Convert to number and limit to 1-10
  const num = parseInt(numericValue)
  if (isNaN(num)) return ''
  if (num < 1) return '1'
  if (num > 10) return '10'

  return num.toString()
}

// Update prompt when content type changes
const handleContentTypeChange = (type: 'quiz' | 'flashcard' | 'note') => {
  outputFormat.value = type
  selectedPreset.value = null // Reset preset selection

  if (attachedFile.value) {
    // If file is attached, use file-based prompt
    const currentPrompts = getCurrentPrompts()
    promptText.value = currentPrompts[type]
  } else {
    // If no file, use default prompt or keep current
    const currentPrompts = getCurrentPrompts()
    promptText.value = currentPrompts[type]
  }

  // Update initial prompt and reset modification status
  initialPromptText.value = promptText.value
  isPromptModified.value = false
}



// Debug mode
const DEBUG_MODE = true
// const isDevelopment = import.meta.env.MODE === 'development' || import.meta.env.DEV

// Debug API connection
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debugApi = async (): Promise<void> => {
  console.log('🧪 Debug: Testing API connection...')
  const result = await ApiTestUtil.runFullTest()
  console.log('🧪 Debug results:', result)

  if (result.overall.success) {
    alert('✅ API connection test passed!')
  } else {
    alert(`❌ API connection test failed:\n${result.overall.message}\n\nCheck console for details.`)
  }
}

// Debug path detection
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debugPaths = async (): Promise<void> => {
  console.log('🔍 Debug: Detecting backend structure...')
  const result = await PathTestUtil.detectBackendStructure()
  console.log('🔍 Backend structure results:', result)

  const summary = `Backend Detection Results:
✅ Working paths: ${result.workingPaths.length}
❌ Failed paths: ${result.failedPaths.length}

Recommendation: ${result.recommendation}

Working paths:
${result.workingPaths.map(p => `• ${p.path} (${p.status})`).join('\n')}

Check console for full details.`

  alert(summary)
}

// Debug URL structure
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debugUrls = (): void => {
  console.log('🔍 Debug: URL Structure Analysis')

  // Import AxiosClient to check its config
  import('@/service/AxiosClient').then(({ default: AxiosClient }) => {
    const baseURL = AxiosClient.defaults.baseURL
    const testPaths = [
      '/ai/generation/request',
      '/ai/generation/requests',
      '/users/me'
    ]

    console.log('🔧 AxiosClient BaseURL:', baseURL)
    console.log('🌐 Full URLs will be:')
    testPaths.forEach(path => {
      const fullUrl = `${baseURL}${path}`
      console.log(`  • ${path} → ${fullUrl}`)
    })

    const summary = `URL Structure:
Base URL: ${baseURL}

Full URLs:
${testPaths.map(path => `• ${path} → ${baseURL}${path}`).join('\n')}

This shows exact URLs that will be sent to backend.`

    alert(summary)
  })
}

// Navigation function removed - using auto-redirect instead

// Test navigation function for debugging
// const testNavigation = async () => {
//   console.log('🧪 Testing navigation manually...')
//   console.log('📍 Current route before test:', router.currentRoute.value.fullPath)

//   try {
//     // Test Method 1: router.replace
//     console.log('🔄 Testing router.replace...')
//     await router.replace({
//       name: 'ai-content-generator',
//       query: { tab: 'saved' }
//     })
//     console.log('✅ Manual navigation test successful!')
//     console.log('📍 Route after test:', router.currentRoute.value.fullPath)

//     // Test content loading
//     setTimeout(async () => {
//       try {
//         await aiGenerationStore.loadSavedContent()
//         console.log('✅ Content loaded after test navigation')
//       } catch (error) {
//         console.error('❌ Failed to load content after test:', error)
//       }
//     }, 200)

//   } catch (error) {
//     console.error('❌ Manual navigation test failed:', error)
//     alert('Navigation test failed. Check console for details.')
//   }
// }

// Test navigation with window.location
// const testNavigationWithLocation = () => {
//   console.log('🧪 Testing navigation with window.location...')
//   const currentUrl = new URL(window.location.href)
//   currentUrl.searchParams.set('tab', 'saved')
//   currentUrl.searchParams.set('_t', Date.now().toString())
//   console.log('🔄 Redirecting to:', currentUrl.toString())
//   window.location.href = currentUrl.toString()
// }

// Test direct navigation to saved content
// const testDirectNavigation = () => {
//   console.log('🧪 Testing direct navigation to saved content...')
//   console.log('📍 Current route:', router.currentRoute.value.fullPath)
//   console.log('📍 Current route name:', router.currentRoute.value.name)
//   console.log('📍 Current route params:', router.currentRoute.value.params)
//   console.log('📍 Current route query:', router.currentRoute.value.query)

//   // Try to navigate to the same route but with different query
//   router.push({
//     name: 'ai-content-generator',
//     query: {
//       tab: 'saved',
//       test: 'direct',
//       timestamp: Date.now()
//     }
//   }).then(() => {
//     console.log('✅ Direct navigation completed')
//     console.log('📍 New route:', router.currentRoute.value.fullPath)
//   }).catch((error) => {
//     console.error('❌ Direct navigation failed:', error)
//   })
// }

// Cancel auto-redirect
const cancelAutoRedirect = () => {
  if (redirectTimeoutId.value) {
    clearTimeout(redirectTimeoutId.value)
    redirectTimeoutId.value = null
    console.log('🚫 Auto-redirect cancelled')
  }

  if (redirectCountdownInterval.value) {
    clearInterval(redirectCountdownInterval.value)
    redirectCountdownInterval.value = null
  }

  redirectCountdown.value = 2 // Reset countdown
}

// Generation
const handleGenerate = async () => {
  if (!isValid.value) return

  // Check if already generating to prevent duplicate requests
  if (currentStep.value === 'generating') {
    console.warn('⚠️ Generation already in progress, ignoring duplicate request')
    return
  }

  // Check rate limiting
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime.value

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const remainingTime = Math.ceil((MIN_REQUEST_INTERVAL - timeSinceLastRequest) / 1000)
    console.warn(`⚠️ Rate limit: Please wait ${remainingTime} more seconds`)
    generationStatus.value = `🚫 Please wait ${remainingTime} more seconds before making another request.`

    setTimeout(() => {
      generationStatus.value = ''
    }, 3000)
    return
  }

  // Update last request time
  lastRequestTime.value = now

  if (DEBUG_MODE) {
    console.log('🔍 DEBUG: Starting generation...')
    console.log('🔍 DEBUG: Prompt:', promptText.value)
    console.log('🔍 DEBUG: Format:', outputFormat.value)
    console.log('🔍 DEBUG: File:', attachedFile.value?.name || 'none')
    console.log('🔍 DEBUG: Valid:', isValid.value)
  }

  currentStep.value = 'generating'
  startKayaanAnimation()
  generationProgress.value = 0
  generationStatus.value = 'Initializing...'

  try {
    // ✅ แก้ไข structure ให้ตรงกับ Backend API
    const requestData = {
      promptText: promptText.value.trim(),
      outputFormat: outputFormat.value,
      maxRetries: 3,
      useTemplate: false
    }

    console.log('🎯 Starting generation with data:', {
      requestData,
      file: attachedFile.value ? attachedFile.value.name : 'none'
    })

    // สร้าง generation request
    console.log('📝 Creating generation request...')
    const requestId = await aiGenerationStore.createGenerationRequest(
      requestData,                    // ส่ง object โดยตรง
      attachedFile.value || undefined // ส่งไฟล์แยก
    )

    console.log('✅ Request created with ID:', requestId)

    // ✅ เพิ่มการตรวจสอบ requestId ที่ดีขึ้น
    if (requestId === null || requestId === undefined) {
      throw new Error('Failed to get request ID from server')
    }

    if (typeof requestId !== 'number' || requestId <= 0) {
      throw new Error(`Invalid request ID: ${requestId}`)
    }

    // เริ่ม generation
    console.log('🚀 Starting generation for ID:', requestId)
    generationStatus.value = 'Starting generation...'
    await aiGenerationStore.startGeneration(requestId)

    console.log('📊 Generation started, monitoring progress...')

    // Simulate generation progress (replace with real WebSocket later)
    const progressInterval = setInterval(() => {
      if (generationProgress.value < 90) {
        generationProgress.value += Math.random() * 10
        if (generationProgress.value < 30) {
          generationStatus.value = 'Analyzing content...'
        } else if (generationProgress.value < 60) {
          generationStatus.value = 'Generating content...'
        } else {
          generationStatus.value = 'Finalizing...'
        }
      }
    }, 1000)

    // Simulate completion
    setTimeout(() => {
      clearInterval(progressInterval)
      generationProgress.value = 100
      generationStatus.value = 'Complete!'
      setTimeout(() => {
        currentStep.value = 'result'
    stopKayaanAnimation()

        // Auto-redirect to AI Content Generator View if enabled
        if (autoRedirectToContent.value) {
          console.log('⚙️ Setting up auto-redirect to My Content...')
          redirectCountdown.value = 2

          // Start countdown interval
          redirectCountdownInterval.value = setInterval(() => {
            redirectCountdown.value--
            if (redirectCountdown.value <= 0) {
              if (redirectCountdownInterval.value) {
                clearInterval(redirectCountdownInterval.value)
                redirectCountdownInterval.value = null
              }
            }
          }, 1000)

                              redirectTimeoutId.value = setTimeout(async () => {
            console.log('🚀 Auto-redirecting to My Content tab...')
            console.log('📍 Current route:', router.currentRoute.value.fullPath)

            try {
              // Clear countdown interval since redirect is successful
              if (redirectCountdownInterval.value) {
                clearInterval(redirectCountdownInterval.value)
                redirectCountdownInterval.value = null
                console.log('🔄 Countdown interval cleared')
              }

              // Emit event to parent to switch to saved tab
              console.log('🔄 Emitting switchTab event to parent...')
              emit('switchTab', 'saved')
              console.log('✅ Switch tab event emitted')

              // Use nextTick to ensure DOM updates before loading content
              await nextTick()
              console.log('✅ NextTick completed')

              // Force refresh content after tab switch
              setTimeout(async () => {
                try {
                  console.log('🔄 Starting content refresh...')
                  await aiGenerationStore.loadSavedContent()
                  console.log('✅ Content refreshed after auto-redirect, total items:', aiGenerationStore.savedContent.length)
                } catch (loadError) {
                  console.warn('⚠️ Failed to refresh content after redirect:', loadError)
                }
              }, 300)

            } catch (error) {
              console.error('❌ Auto-redirect failed:', error)
            }
          }, 2000) // รอ 2 วินาทีเพื่อให้เห็นข้อความ success ก่อน
        }
      }, 1000)
    }, 8000)

  } catch (error) {
    console.error('💥 Generation failed:', error)

    // Enhanced error handling for different error types
    let errorMessage = 'Unknown error occurred'
    let showRetryHint = false

        if (error instanceof Error) {
      const errorText = error.message.toLowerCase()

      // Handle specific error types from AIContentService
      if (error.message.startsWith('RATE_LIMIT_EXCEEDED:')) {
        errorMessage = '🚫 Rate limit exceeded. Please wait before making another request.'
        showRetryHint = true
        console.warn('⚠️ Rate limit hit - user should wait before retrying')
      } else if (error.message.startsWith('GENERATION_FAILED:')) {
        errorMessage = '❌ Generation request failed. Please try again.'
        console.warn('⚠️ Generation request failed')
      } else if (errorText.includes('rate limit') || errorText.includes('rate') || errorText.includes('limit')) {
        errorMessage = '🚫 Rate limit exceeded. Please wait a moment before trying again.'
        showRetryHint = true
        console.warn('⚠️ Rate limit hit - user should wait before retrying')
      } else if (errorText.includes('network') || errorText.includes('connection')) {
        errorMessage = '🌐 Network error. Please check your connection and try again.'
      } else if (errorText.includes('authentication') || errorText.includes('unauthorized')) {
        errorMessage = '🔐 Authentication error. Please login again.'
      } else {
        // Extract clean message (remove prefix if present)
        const cleanMessage = error.message.replace(/^(Backend error: |GENERATION_FAILED: |RATE_LIMIT_EXCEEDED: )/i, '')
        errorMessage = cleanMessage
      }
    } else if (typeof error === 'string') {
      errorMessage = error
    }

    generationStatus.value = `Generation failed: ${errorMessage}`

    // For rate limit errors, reset after longer time to discourage rapid retries
    const resetTimeout = showRetryHint ? 10000 : 5000
    setTimeout(() => {
      currentStep.value = 'prompt'
      generationStatus.value = ''
    }, resetTimeout)
  }
}

const resetGeneration = () => {
  console.log('🔄 Resetting generation - going back to prompt step')
  stopKayaanAnimation()
  currentStep.value = 'prompt'

  // Reset to default prompt
  const currentPrompts = getCurrentPrompts()
  promptText.value = currentPrompts[outputFormat.value]
  initialPromptText.value = promptText.value
  isPromptModified.value = false

  attachedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  generationProgress.value = 0
  generationStatus.value = ''
  showPreview.value = false
  previewContent.value = ''

  // Cancel any pending auto-redirect
  if (redirectTimeoutId.value) {
    clearTimeout(redirectTimeoutId.value)
    redirectTimeoutId.value = null
  }

  // Cancel countdown interval
  if (redirectCountdownInterval.value) {
    clearInterval(redirectCountdownInterval.value)
    redirectCountdownInterval.value = null
  }

  // Reset countdown
  redirectCountdown.value = 2
  console.log('✅ Generation reset completed - back to prompt step')
}

onMounted(() => {
  // Check query parameter for content type selection from Dashboard
  const typeFromQuery = route.query.type as string
  if (typeFromQuery && ['note', 'flashcard', 'quiz'].includes(typeFromQuery)) {
    outputFormat.value = typeFromQuery as 'quiz' | 'flashcard' | 'note'
    console.log('🎯 Content type set from Dashboard:', outputFormat.value)
  }

  // Set default prompt based on file attachment status
  const currentPrompts = getCurrentPrompts()
  promptText.value = currentPrompts[outputFormat.value]
  // Store initial prompt for comparison
  initialPromptText.value = currentPrompts[outputFormat.value]
  isPromptModified.value = false
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-bold mb-1">AI Content Generator</h1>
                <p class="text-blue-100">Create intelligent study materials with AI assistance</p>
              </div>
            </div>

            <!-- Progress Steps -->
            <div class="flex items-center justify-center gap-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 mt-6">
              <div
                v-for="(step, index) in ['Prompt', 'Preview', 'Generating', 'Result']"
                :key="step"
                class="flex items-center"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 shadow-md"
                    :class="
                      currentStep === step.toLowerCase() as any
                        ? 'bg-white text-blue-600 scale-110'
                        : index < ['prompt', 'preview', 'generating', 'result'].indexOf(currentStep)
                        ? 'bg-white text-green-600'
                        : 'bg-white bg-opacity-40 text-white'
                    "
                  >
                    {{ index + 1 }}
                  </div>
                  <span
                    class="text-sm font-semibold hidden sm:inline transition-all duration-200"
                    :class="
                      currentStep === step.toLowerCase() as any
                        ? 'text-white scale-105'
                        : index < ['prompt', 'preview', 'generating', 'result'].indexOf(currentStep)
                        ? 'text-white'
                        : 'text-white text-opacity-60'
                    "
                  >
                    {{ step }}
                  </span>
                </div>
                <div
                  v-if="index < 3"
                  class="mx-2 w-8 sm:w-12 h-1 rounded-full transition-all duration-200"
                  :class="index < ['prompt', 'preview', 'generating', 'result'].indexOf(currentStep) ? 'bg-white' : 'bg-white bg-opacity-30'"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- Backend Status Warning for Manual Content Integration -->
    <!-- <div v-if="showBackendIntegrationWarning" class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-blue-700">
            <strong>Feature Integration:</strong> AI Generation และ Manual Content จะสามารถแสดงผลร่วมกันใน "My Content" เร็วๆ นี้!
            ตอนนี้ Manual content ยังใช้ mock data สำหรับการพัฒนา.
            <button @click="hideBackendIntegrationWarning" class="ml-2 underline">Dismiss</button>
          </p>
        </div>
      </div>
    </div> -->

    <!-- Development Mode Controls -->
    <!-- <div v-if="isDevelopment" class="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="text-sm font-medium text-yellow-800">Development Mode</h3>
            <p class="text-xs text-yellow-700 mt-1">Rate limiting is disabled. Clear limits if needed.</p>
          </div>
        </div>

      </div>
    </div> -->

      <!-- Step 1: Prompt Configuration -->
      <div v-if="currentStep === 'prompt'" class="space-y-6">
        <div class="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-200">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">Step 1: Configure Your Content</h2>
          </div>

          <!-- Content Type Selection -->
          <div class="mb-8">
            <label class="block text-base font-semibold text-gray-800 mb-4">Content Type</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                v-for="format in outputFormats"
                :key="format.value"
                @click="handleContentTypeChange(format.value as 'quiz' | 'flashcard' | 'note')"
                class="group p-6 border-2 rounded-2xl text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 transform"
                :class="
                  outputFormat === format.value
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-105'
                    : 'border-gray-300 hover:border-blue-400 bg-white'
                "
              >
              <div class="flex flex-col items-center text-center space-y-3">
                <div class="p-3 rounded-lg"
                     :class="outputFormat === format.value ? 'bg-blue-100' : 'bg-slate-100 group-hover:bg-blue-50'"
                >
                  <!-- All Resource Icon -->
                  <svg v-if="format.icon === 'Cards'" class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"
                       :class="outputFormat === format.value ? 'text-blue-600' : 'text-slate-600 group-hover:text-blue-500'">
                    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-2-6H6v-2h12v2zm-4 4H6v-2h8v2z"/>
                  </svg>
                  <!-- Quiz Icon -->
                  <svg v-else-if="format.icon === 'List'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"
                       :class="outputFormat === format.value ? 'text-blue-600' : 'text-slate-600 group-hover:text-blue-500'">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                      <path d="M7.5 3.5c-1.556.047-2.483.22-3.125.862c-.879.88-.879 2.295-.879 5.126v6.506c0 2.832 0 4.247.879 5.127C5.253 22 6.668 22 9.496 22h5c2.829 0 4.243 0 5.121-.88c.88-.879.88-2.294.88-5.126V9.488c0-2.83 0-4.246-.88-5.126c-.641-.642-1.569-.815-3.125-.862"/>
                      <path d="M7.496 3.75c0-.966.784-1.75 1.75-1.75h5.5a1.75 1.75 0 1 1 0 3.5h-5.5a1.75 1.75 0 0 1-1.75-1.75M6.5 10h4m3 1s.5 0 1 1c0 0 1.588-2.5 3-3m-11 7h4m3 1s.5 0 1 1c0 0 1.588-2.5 3-3"/>
                    </g>
                  </svg>
                  <!-- Note Icon -->
                  <svg v-else-if="format.icon === 'FileText'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"
                       :class="outputFormat === format.value ? 'text-blue-600' : 'text-slate-600 group-hover:text-blue-500'">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                      <path d="M16.5 4H8a4 4 0 0 0-4 4v8.5a4 4 0 0 0 4 4h6.843a4 4 0 0 0 2.829-1.172l1.656-1.656a4 4 0 0 0 1.172-2.829V8a4 4 0 0 0-4-4"/>
                      <path d="M20.5 14H17a3 3 0 0 0-3 3v3.5M8 8h7.5M8 12h5"/>
                    </g>
                  </svg>
                  <!-- Flashcard Icon -->
                  <svg v-else-if="format.icon === 'HelpCircle'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"
                       :class="outputFormat === format.value ? 'text-blue-600' : 'text-slate-600 group-hover:text-blue-500'">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2 16c0 2.21 0 3.316.702 4.054q.169.178.37.327C3.908 21 5.16 21 7.667 21h.666c2.506 0 3.759 0 4.595-.62q.201-.147.37-.326C14 19.316 14 18.211 14 16c0-2.21 0-3.316-.702-4.054a3 3 0 0 0-.37-.327C12.092 11 10.84 11 8.333 11h-.666c-2.506 0-3.759 0-4.595.62a3 3 0 0 0-.37.326C2 12.684 2 13.789 2 16m8-8c0-2.21 0-3.316.702-4.054q.168-.178.37-.327C11.908 3 13.16 3 15.667 3h.666c2.506 0 3.759 0 4.595.62q.201.148.37.326C22 4.684 22 5.789 22 8c0 2.21 0 3.316-.702 4.054a3 3 0 0 1-.37.327c-.758.562-1.86.614-3.928.618M2 15h12m-4-8h12M2 9c0-3.317 2.683-6 6-6l-.857 1.714M22 15c0 3.317-2.683 6-6 6l.857-1.714"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-slate-900 mb-1">{{ format.label }}</h3>
                  <p class="text-sm text-slate-500 leading-relaxed">{{ format.description }}</p>
                </div>
              </div>
            </button>
          </div>
        </div>

          <!-- File Upload -->
          <div class="mb-8">
            <label class="block text-base font-semibold text-gray-800 mb-3">Attach File (Optional)</label>
            <div class="border-2 border-dashed border-blue-300 bg-blue-50 bg-opacity-30 rounded-2xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
              <input
                ref="fileInput"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.md"
                @change="handleFileUpload"
                class="hidden"
              />
              <button
                @click="fileInput?.click()"
                class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Choose File
              </button>
              <p class="text-sm text-gray-600 mt-3 leading-relaxed">Support: PDF, DOC, DOCX, TXT, MD (Max 10MB) - Optional<br/>Content will be processed to generate English study materials</p>
            </div>

            <!-- Attached File -->
            <div v-if="attachedFile" class="mt-4">
              <h4 class="text-sm font-semibold text-gray-700 mb-3">Attached File:</h4>
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-sm">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ attachedFile.name }}</p>
                    <p class="text-xs text-gray-600">{{ (attachedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
                  </div>
                </div>
                <button
                  @click="removeFile()"
                  class="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                  title="Remove file"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Prompt Presets (only show when no file attached) -->
          <div v-if="!attachedFile" class="mb-8">
            <label class="flex items-center gap-3 text-base font-semibold text-gray-800 mb-4">
              <div class="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              Quick Start Templates
              <span class="text-xs text-gray-500 ml-2">(Choose a template to get started faster)</span>
            </label>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                v-for="preset in getCurrentPresets()"
                :key="preset.id"
                @click="handlePresetSelect(preset.id)"
                class="p-5 border-2 border-gray-300 rounded-2xl text-left hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group hover:shadow-lg transform hover:-translate-y-0.5"
              >
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-slate-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <!-- BookOpen Icon -->
                  <svg v-if="getPresetIcon(preset.id) === 'BookOpen'" class="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z" />
                  </svg>
                  <!-- Scale Icon -->
                  <svg v-else-if="getPresetIcon(preset.id) === 'Scale'" class="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <!-- Clock Icon -->
                  <svg v-else-if="getPresetIcon(preset.id) === 'Clock'" class="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <!-- Map Icon -->
                  <svg v-else-if="getPresetIcon(preset.id) === 'Map'" class="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <!-- CheckCircle Icon -->
                  <svg v-else-if="getPresetIcon(preset.id) === 'CheckCircle'" class="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <!-- Edit3 Icon -->
                  <svg v-else-if="getPresetIcon(preset.id) === 'Edit3'" class="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <!-- Shuffle Icon -->
                  <svg v-else-if="getPresetIcon(preset.id) === 'Shuffle'" class="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4l11.733 16h4.267m-4.267 0L16 16m-1.733 4L16 16m0 0L4 4h4.267M16 16L4 4m0 0L16 16M4 4l11.733 16" />
                  </svg>
                  <!-- Brain Icon (using Lightbulb as alternative) -->
                  <svg v-else-if="getPresetIcon(preset.id) === 'Brain'" class="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <!-- FileText Icon -->
                  <svg v-else-if="getPresetIcon(preset.id) === 'FileText'" class="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <!-- MessageCircle Icon -->
                  <svg v-else-if="getPresetIcon(preset.id) === 'MessageCircle'" class="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <!-- Globe Icon -->
                  <svg v-else-if="getPresetIcon(preset.id) === 'Globe'" class="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <!-- Eye Icon -->
                  <svg v-else-if="getPresetIcon(preset.id) === 'Eye'" class="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <!-- Default FileText Icon -->
                  <svg v-else class="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-slate-900 group-hover:text-blue-900 mb-1">
                    {{ preset.title }}
                  </h4>
                  <p class="text-xs text-slate-600 group-hover:text-blue-800 mb-2">{{ preset.description }}</p>
                  <p class="text-xs text-slate-500 italic">Example: {{ preset.example }}</p>
                </div>
              </div>
            </button>
          </div>

            <div class="mt-4 text-center">
              <span class="text-sm text-gray-500 font-medium">Or write your own custom prompt below ↓</span>
            </div>
          </div>

          <!-- Prompt Input -->
          <div class="mb-8">
            <label class="block text-base font-semibold text-gray-800 mb-3">
              {{ attachedFile ? 'File Processing Instructions' : 'Custom Prompt' }}
              <span v-if="!attachedFile" class="text-xs text-blue-600 ml-2 font-normal">(Or use a template above)</span>
              <span v-else class="text-xs text-green-600 ml-2 font-normal">(Describe how to process your attached file)</span>
            </label>
            <textarea
              v-model="promptText"
              rows="7"
              class="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 hover:border-blue-400"
              :placeholder="attachedFile ?
                'Describe how you want to process your attached file. Be specific about the output format and academic requirements. The AI will analyze your file and generate content accordingly.' :
                'Describe what educational content you want to generate in English. Be specific about the subject, academic level, and key topics. Example: Create high school biology quiz on photosynthesis with 10 multiple choice questions.'"
              :class="{ 'border-red-400 focus:ring-red-500 focus:border-red-500': promptText.length > 0 && !isValid }"
            ></textarea>
            <div class="flex justify-between items-start mt-3 text-sm">
              <div class="flex-1">
                <span class="text-gray-600">
                  Minimum 10 characters, maximum 2000 characters. Please write in English for best results.
                </span>
                <div v-if="validationMessage" class="text-red-600 text-xs mt-2 font-medium">
                  {{ validationMessage }}
                </div>
              </div>
              <span
                :class="
                  characterCount > 2000
                    ? 'text-red-600'
                    : isValid
                    ? 'text-green-600'
                    : 'text-gray-400'
                "
                class="ml-4 whitespace-nowrap font-semibold"
              >
                {{ characterCount }}/2000
              </span>
            </div>
          </div>

          <!-- Dynamic Help Section -->
          <div v-if="!attachedFile" class="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 mb-6 shadow-sm">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span>No File Attached</span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-200 text-amber-800">
                    Required Info
                  </span>
                </h4>
                <p class="text-sm text-gray-700 leading-relaxed">
                  <span class="font-semibold text-gray-800">Please specify the following in your prompt:</span> subject area, academic level, and key topics you want covered.
                  <span class="font-semibold text-gray-800">Be as specific as possible for better results.</span>
                </p>
              </div>
            </div>
          </div>

          <div v-else class="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-2xl p-5 mb-6 shadow-sm">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span>File Attached: {{ attachedFile.name }}</span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-200 text-emerald-800">
                    Ready to Process
                  </span>
                </h4>
                <p class="text-sm text-gray-700 leading-relaxed">
                  <span class="font-semibold text-gray-800">Your file will be analyzed and processed.</span> Please describe how you want the AI to transform this content into study materials
                  <span class="font-semibold text-gray-800">(e.g., difficulty level, specific focus areas, question types).</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-end">
          <button
            @click="handleNext"
            :disabled="!isValid"
            class="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            Next: Preview
          </button>
        </div>
      </div>

      <!-- Step 2: Preview -->
      <div v-if="currentStep === 'preview'" class="space-y-6">
        <div class="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-200">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">Step 2: Preview & Generate</h2>
          </div>

          <!-- Settings Summary -->
          <div class="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-sm">
            <h3 class="font-bold text-gray-900 mb-4 text-lg">Generation Settings</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div>
                  <span class="text-sm text-gray-600 font-medium">Content Type:</span>
                  <p class="font-bold text-gray-900">{{ outputFormats.find(f => f.value === outputFormat)?.label }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </div>
                <div>
                  <span class="text-sm text-gray-600 font-medium">File Attached:</span>
                  <p class="font-bold text-gray-900">{{ attachedFile ? '1 file' : 'No file' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Prompt Preview -->
          <div class="mb-8">
            <h3 class="font-bold text-gray-900 mb-3 text-lg">Prompt Preview</h3>
            <div class="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl shadow-sm">
              <p class="text-gray-900 leading-relaxed">{{ promptText }}</p>
            </div>
          </div>

          <!-- File Preview -->
          <div v-if="attachedFile" class="mb-8">
            <h3 class="font-bold text-gray-900 mb-3 text-lg">Attached File</h3>
            <div class="flex items-center gap-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl shadow-sm">
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900">{{ attachedFile.name }}</p>
                <p class="text-xs text-gray-600">{{ (attachedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
              </div>
            </div>
          </div>
          <div v-else class="mb-8">
            <h3 class="font-bold text-gray-900 mb-3 text-lg">Attached File</h3>
            <div class="p-6 bg-gray-100 border-2 border-gray-300 rounded-2xl text-center">
              <p class="text-gray-500 font-medium">No file attached</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between">
          <button
            @click="handleBack"
            class="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
          >
            Back
          </button>
          <button
            @click="handleGenerate"
            :disabled="!isValid || (currentStep as string) === 'generating'"
            class="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {{ (currentStep as string) === 'generating' ? 'Generating...' : 'Generate Content' }}
          </button>
        </div>
      </div>

      <!-- Step 3: Generating -->
      <div v-if="currentStep === 'generating'" class="space-y-6">
        <div class="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg text-center">
          <div class="flex items-center justify-center gap-3 mb-8">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md animate-pulse">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">Generating Your Content</h2>
          </div>

        <!-- Kayaan Cute Loading Animation -->
        <div class="relative mb-8">
          <!-- Main Kayaan Character -->
          <div class="flex justify-center mb-6">
            <div class="relative">
              <!-- Kayaan Avatar with Pulse -->
              <div class="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <!-- Kayaan Face -->
                  <div class="relative">
                    <!-- Eyes -->
                    <div class="flex gap-2 mb-1">
                      <div class="w-2 h-2 bg-slate-700 rounded-full animate-blink"></div>
                      <div class="w-2 h-2 bg-slate-700 rounded-full animate-blink"></div>
                    </div>
                    <!-- Smile -->
                    <div class="w-4 h-2 border-b-2 border-slate-700 rounded-full"></div>
                  </div>
                </div>
              </div>

              <!-- Floating Particles Around Kayaan -->
              <div class="absolute inset-0">
                <div class="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-float-1"></div>
                <div class="absolute top-8 left-1 w-1.5 h-1.5 bg-pink-400 rounded-full animate-float-2"></div>
                <div class="absolute bottom-4 right-6 w-1 h-1 bg-green-400 rounded-full animate-float-3"></div>
                <div class="absolute bottom-2 left-4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-float-1"></div>
              </div>
            </div>
          </div>

          <!-- Dynamic Generation Messages -->
          <div class="text-center space-y-3">
            <h3 class="text-lg font-semibold text-slate-800 animate-fade-in" v-html="currentGenerationMessage">
            </h3>

            <!-- Progress Dots -->
            <div class="flex justify-center gap-1">
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0s"></div>
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>

            <!-- Progress Bar -->
            <div class="w-full max-w-md mx-auto">
              <div class="bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  class="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out"
                  :style="{ width: generationProgress + '%' }"
                ></div>
              </div>
              <p class="text-xs text-slate-500 mt-1">{{ Math.round(generationProgress) }}% Complete</p>
            </div>

            <!-- Fun Facts -->
            <div class="mt-4 p-3 bg-slate-50 rounded-lg max-w-md mx-auto">
              <p class="text-xs text-slate-600">
                <svg class="w-4 h-4 inline text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> <span class="font-medium">{{ currentFunFact }}</span>
              </p>
            </div>
          </div>
        </div>

          <!-- Rate Limit Warning (if applicable) -->
          <div v-if="generationStatus.includes('Rate limit') || generationStatus.includes('rate limit')" class="mb-6 p-5 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-2xl shadow-sm">
            <div class="flex items-center justify-center gap-3">
              <div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div class="text-center">
                <p class="text-orange-900 text-base font-bold">
                  Rate Limit Exceeded
                </p>
                <p class="text-orange-800 text-sm mt-1">
                  The server is temporarily limiting requests. Please wait a moment before trying again.
                </p>
              </div>
            </div>
          </div>

          <!-- Cancel Button -->
          <button
            @click="resetGeneration"
            class="px-8 py-4 text-red-600 bg-white border-2 border-red-400 rounded-xl hover:bg-red-50 hover:border-red-500 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Cancel Generation
          </button>
        </div>
      </div>

      <!-- Step 4: Result -->
      <div v-if="currentStep === 'result'" class="space-y-6">
        <div class="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
          <div class="text-center mb-8">
            <!-- Success Icon -->
            <div class="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg border-4 border-green-200 animate-bounce">
              <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 class="text-3xl font-bold text-gray-900 mb-3">Generation Complete!</h2>
            <p class="text-lg text-gray-700">
              Your <span class="font-bold text-green-600">{{ outputFormats.find(f => f.value === outputFormat)?.label }}</span> has been created successfully
            </p>
          </div>

          <!-- Generation Summary -->
          <div class="mb-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-300 rounded-2xl shadow-sm">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 class="font-bold text-gray-900 text-xl">Generation Summary</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div>
                  <span class="text-sm text-gray-600 font-medium">Content Type:</span>
                  <p class="font-bold text-gray-900">{{ outputFormats.find(f => f.value === outputFormat)?.label }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <span class="text-sm text-gray-600 font-medium">Source Material:</span>
                  <p class="font-bold text-gray-900">{{ attachedFile ? attachedFile.name : 'Custom Prompt' }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span class="text-sm text-gray-600 font-medium">Generated At:</span>
                  <p class="font-bold text-gray-900">{{ new Date().toLocaleString() }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span class="text-sm text-gray-600 font-medium">Status:</span>
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span class="font-bold text-green-700">Ready to Use</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Auto-redirect info (only show if auto-redirect is enabled) -->
          <div v-if="autoRedirectToContent && redirectTimeoutId" class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl shadow-sm">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold text-blue-900 text-lg">Redirecting to My Content</h4>
                  <p class="text-sm text-blue-700">
                    Taking you to view your saved content in
                    <span class="font-bold">{{ redirectCountdown }}</span>
                    second{{ redirectCountdown !== 1 ? 's' : '' }}...
                  </p>
                </div>
              </div>
              <button
                @click="cancelAutoRedirect"
                class="px-5 py-2.5 text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
            </div>

            <!-- Progress Bar -->
            <div class="mt-4">
              <div class="w-full bg-blue-200 rounded-full h-3">
                <div
                  class="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-linear"
                  :style="{ width: `${((2 - redirectCountdown) / 2) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Quick Action: Generate New Content -->
          <div class="text-center mb-8">
            <button
              @click="resetGeneration"
              class="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto transform hover:scale-105"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Generate New Content
            </button>

          <!-- Debug: Manual Test Navigation Buttons -->
          <!-- <div class="flex gap-2 justify-center mt-3">
            <button
              @click="testNavigation"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Test Router
            </button>
            <button
              @click="testNavigationWithLocation"
              class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Test Location
            </button>
          </div> -->
        </div>

          <!-- Success Information -->
          <div class="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl shadow-sm">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 class="font-bold text-green-900 text-lg mb-2">Content Ready!</h4>
                <p class="text-sm text-green-800 leading-relaxed">
                  Your generated content has been automatically saved and you'll be redirected to the "My Content" section shortly.
                  You can also generate more content anytime using the button above!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preset Customization Modal -->
      <div v-if="showPresetModal" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-2 border-gray-200">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Customize Template</h3>
                <p class="text-sm text-gray-600 font-medium">
                  {{ getCurrentPresets().find(p => p.id === selectedPreset)?.title }}
                </p>
              </div>
            </div>
            <button
              @click="showPresetModal = false"
              class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6 overflow-y-auto max-h-[60vh]">
            <div v-if="selectedPreset" class="space-y-6">
              <!-- Template Preview -->
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-5 rounded-2xl shadow-sm">
                <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Template Preview:
                </h4>
                <p class="text-sm text-gray-800 leading-relaxed">
                  {{ getCurrentPresets().find(p => p.id === selectedPreset)?.template }}
                </p>
              </div>

              <!-- Custom Fields -->
              <div class="space-y-5">
                <h4 class="font-bold text-gray-900 text-lg">Fill in the details:</h4>

                <div
                  v-for="placeholder in getCurrentPresets().find(p => p.id === selectedPreset)?.placeholders || []"
                  :key="placeholder"
                  class="space-y-2"
                >
                  <label class="block text-sm font-semibold text-gray-700">
                    {{ getFieldLabel(placeholder) }}
                    <span class="text-red-600 ml-1">*</span>
                    <span v-if="isNumberField(placeholder)" class="text-xs text-gray-500 ml-2 font-normal">
                      (Enter whole number 1-10)
                    </span>
                  </label>

                  <!-- Number Input Fields -->
                  <div v-if="isNumberField(placeholder)" class="relative">
                    <input
                      v-model="customFields[placeholder]"
                      type="text"
                      inputmode="numeric"
                      pattern="[1-9]|10"
                      maxlength="2"
                      :placeholder="getPlaceholderHint(placeholder)"
                      @input="customFields[placeholder] = validateNumberInput(customFields[placeholder])"
                      @blur="customFields[placeholder] = customFields[placeholder] || '5'"
                      class="w-full px-4 py-3 pr-24 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <span class="text-gray-500 text-sm font-medium">questions</span>
                    </div>
                    <div class="mt-2 text-xs text-gray-600">
                      How many {{ placeholder === 'NUMBER' ? 'questions or cards' :
                                   placeholder === 'MC_COUNT' ? 'multiple choice questions' :
                                   placeholder === 'TF_COUNT' ? 'true/false questions' :
                                   'short answer questions' }} to generate
                    </div>
                  </div>

                  <!-- Text Input Fields -->
                  <input
                    v-else
                    v-model="customFields[placeholder]"
                    type="text"
                    :placeholder="getPlaceholderHint(placeholder)"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              <!-- Example Section -->
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-5 rounded-2xl shadow-sm">
                <h4 class="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Example:
                </h4>
                <p class="text-sm text-blue-800 leading-relaxed mb-3">
                  {{ getCurrentPresets().find(p => p.id === selectedPreset)?.example }}
                </p>
                <button
                  @click="usePresetExample"
                  class="text-sm text-blue-600 hover:text-blue-800 font-semibold underline hover:no-underline transition-all duration-200"
                >
                  Use this example
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-between p-6 border-t-2 border-gray-200 bg-gray-50">
            <button
              @click="showPresetModal = false"
              class="px-5 py-2.5 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <div class="flex gap-3">
              <button
                @click="usePresetExample"
                class="px-5 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                Use Example
              </button>
              <button
                @click="applyPreset"
                class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Apply Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Kayaan Animation Styles */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

@keyframes float-1 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
  25% { transform: translate(10px, -15px) scale(1.1); opacity: 1; }
  50% { transform: translate(-5px, -25px) scale(0.9); opacity: 0.8; }
  75% { transform: translate(-10px, -10px) scale(1.05); opacity: 0.9; }
}

@keyframes float-2 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
  33% { transform: translate(-15px, -10px) scale(1.2); opacity: 1; }
  66% { transform: translate(5px, -20px) scale(0.8); opacity: 0.7; }
}

@keyframes float-3 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
  40% { transform: translate(8px, -18px) scale(1.15); opacity: 0.9; }
  80% { transform: translate(-12px, -8px) scale(0.85); opacity: 0.6; }
}

@keyframes fade-in {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-blink {
  animation: blink 2s infinite;
}

.animate-float-1 {
  animation: float-1 4s ease-in-out infinite;
}

.animate-float-2 {
  animation: float-2 5s ease-in-out infinite;
}

.animate-float-3 {
  animation: float-3 3.5s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

/* Additional enhancements */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

/* Custom range slider */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: #e2e8f0;
  height: 8px;
  border-radius: 4px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #3b82f6;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-track {
  background: #e2e8f0;
  height: 8px;
  border-radius: 4px;
}

input[type="range"]::-moz-range-thumb {
  background: #3b82f6;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
