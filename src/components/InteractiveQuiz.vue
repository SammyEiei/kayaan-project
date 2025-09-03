<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  convertToSpecificQuizType,
  convertToCustomMixedQuiz,
  parseMixedQuizCounts,
  type SimpleQuestion
} from '@/utils/quizParser'

interface QuizQuestion {
  id: number
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'open-ended'
  question: string
  options?: Array<{
    id: string
    text: string
    correct: boolean
  }>
  correctAnswer: string | string[] | boolean
  explanation?: string
  points?: number
  keywords?: string[]
}

interface Props {
  content: string
}

const props = defineProps<Props>()

// Quiz state
const questions = ref<QuizQuestion[]>([])
const currentQuestionIndex = ref(0)
const userAnswers = ref<Record<number, string | string[]>>({})
const showResults = ref(false)
const quizStarted = ref(false)

// Helper functions for better type handling
const getQuestionTypeDisplay = (type: string) => {
  switch (type) {
    case 'multiple-choice': return 'Multiple Choice'
    case 'true-false': return 'True/False'
    case 'short-answer': return 'Short Answer'
    case 'open-ended': return 'Open Ended'
    default: return type
  }
}

const isOpenEnded = (type: string) => {
  return type === 'open-ended'
}

const shouldShowOptions = (question: QuizQuestion) => {
  return question.type === 'multiple-choice' || question.type === 'true-false'
}



// Computed properties for debug info
const debugInfo = computed(() => ({
  questionId: currentQuestion.value?.id,
  questionType: currentQuestion.value?.type,
  optionsCount: currentQuestion.value?.options?.length || 0,
  isOpenEnded: currentQuestion.value?.type === 'open-ended',
  shouldShowOptions: shouldShowOptions(currentQuestion.value!)
}))

// Parse content to extract questions
const parseQuizContent = (content: string) => {
  console.log('🔥 === PARSING QUIZ CONTENT ===')
  console.log('📋 Raw content:', content)
  console.log('📊 Content type:', typeof content)
  console.log('📏 Content length:', content.length)

  try {
    // Try to parse as JSON first
    console.log('🔍 Attempting JSON parse...')
    const jsonData = JSON.parse(content)
    console.log('✅ JSON parse successful')
    console.log('📋 Parsed JSON structure:', {
      hasQuestions: !!jsonData.questions,
      questionsType: typeof jsonData.questions,
      questionsIsArray: Array.isArray(jsonData.questions),
      questionsLength: Array.isArray(jsonData.questions) ? jsonData.questions.length : 'N/A'
    })

    // If it's a structured quiz object
    if (jsonData.questions && Array.isArray(jsonData.questions)) {
      console.log('🚀 Using parseJsonQuiz for structured quiz')
      return parseJsonQuiz(jsonData)
    } else {
      console.log('⚠️ JSON parsed but no questions array found')
    }
  } catch (error) {
    // Not JSON, continue with text parsing
    console.log('❌ JSON parse failed:', error)
    console.log('📝 Falling back to text parsing')
  }

  // Original text parsing logic
  const lines = content.split('\n')
  const parsedQuestions: QuizQuestion[] = []
  let currentQuestion: Partial<QuizQuestion> = {}
  let questionId = 1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    console.log(`Line ${i}: "${line}"`)

    if (line.match(/^\d+\./)) {
      // Save previous question if exists
      if (currentQuestion.question) {
        console.log('Saving question:', currentQuestion)

        // Ensure multiple choice questions have options
        let finalOptions = currentQuestion.options
        if (currentQuestion.type === 'multiple-choice' && (!finalOptions || finalOptions.length === 0)) {
          console.log('⚠️ Adding fallback options for multiple choice question')
          finalOptions = [
            { id: 'A', text: 'Option A', correct: false },
            { id: 'B', text: 'Option B', correct: false },
            { id: 'C', text: 'Option C', correct: false },
            { id: 'D', text: 'Option D', correct: false }
          ]
        }

        parsedQuestions.push({
          id: questionId++,
          type: currentQuestion.type || 'multiple-choice',
          question: currentQuestion.question,
          options: finalOptions,
          correctAnswer: currentQuestion.correctAnswer || '',
          explanation: currentQuestion.explanation
        } as QuizQuestion)
      }

      // Start new question
      const questionText = line.replace(/^\d+\.\s*/, '')
      currentQuestion = {
        question: questionText,
        options: [],
        type: 'multiple-choice'
      }

      // Check if it's True/False question
      if (questionText.includes('true/false')) {
        currentQuestion.type = 'true-false'
        currentQuestion.options = [
          { id: 'true', text: 'True', correct: false },
          { id: 'false', text: 'False', correct: false }
        ]
        console.log('Set type to true-false for:', questionText)
      }
      // Check if it's Short Answer question
      else if (questionText.includes('Explain') || questionText.includes('Describe')) {
        currentQuestion.type = 'short-answer'
        console.log('Set type to short-answer for:', questionText)
      }
      // For multiple choice, ensure we have default options
      else {
        currentQuestion.options = [
          { id: 'A', text: 'Option A', correct: false },
          { id: 'B', text: 'Option B', correct: false },
          { id: 'C', text: 'Option C', correct: false },
          { id: 'D', text: 'Option D', correct: false }
        ]
        console.log('Set type to multiple-choice with default options for:', questionText)
      }

      console.log('New question:', currentQuestion)
    } else if (line.match(/^[A-D]\)/)) {
      // Multiple choice option
      const optionText = line.replace(/^[A-D]\)\s*/, '')
      const optionId = line.match(/^([A-D])\)/)?.[1] || 'A'
      currentQuestion.options?.push({
        id: optionId,
        text: optionText,
        correct: false
      })
      console.log('Added option:', optionText)
    } else if (line.includes('True/False')) {
      currentQuestion.type = 'true-false'
      currentQuestion.options = [
        { id: 'true', text: 'True', correct: false },
        { id: 'false', text: 'False', correct: false }
      ]
      console.log('Set type to true-false')
    } else if (line.includes('Explain') || line.includes('Describe')) {
      currentQuestion.type = 'short-answer'
      console.log('Set type to short-answer')
    } else if (line.startsWith('Answer:')) {
      // Extract correct answer
      currentQuestion.correctAnswer = line.replace(/^Answer:\s*/, '')
      console.log('Set answer:', currentQuestion.correctAnswer)
    } else if (line.trim() === '') {
      // Skip empty lines
      continue
    }
  }

  // Add last question
  if (currentQuestion.question) {
    console.log('Saving last question:', currentQuestion)

    // Ensure multiple choice questions have options
    let finalOptions = currentQuestion.options
    if (currentQuestion.type === 'multiple-choice' && (!finalOptions || finalOptions.length === 0)) {
      console.log('⚠️ Adding fallback options for multiple choice question')
      finalOptions = [
        { id: 'A', text: 'Option A', correct: false },
        { id: 'B', text: 'Option B', correct: false },
        { id: 'C', text: 'Option C', correct: false },
        { id: 'D', text: 'Option D', correct: false }
      ]
    }

    parsedQuestions.push({
      id: questionId,
      type: currentQuestion.type || 'multiple-choice',
      question: currentQuestion.question,
      options: finalOptions,
      correctAnswer: currentQuestion.correctAnswer || '',
      explanation: currentQuestion.explanation
    } as QuizQuestion)
  }

  console.log('Final parsed questions:', parsedQuestions)
  return parsedQuestions
}

// ✅ Helper function สำหรับ question type detection
function getQuestionType(question: Record<string, unknown>): string {
  console.log('🔍 === GET QUESTION TYPE ===')
  console.log('🔍 Question data:', question)
  console.log('🔍 Question type field:', question.type)
  console.log('🔍 Question options:', question.options)

  // ✅ ตรวจสอบ type field ก่อน
  if (question.type === 'open-ended' || question.type === 'open_ended') {
    console.log('🔍 Type is open-ended, returning open-ended')
    return 'open-ended'
  }

  if (question.type === 'multiple-choice' || question.type === 'multiple_choice') {
    // ✅ ตรวจสอบ options ที่ถูกต้อง
    const hasValidOptions = question.options && Array.isArray(question.options) && question.options.length > 0
    console.log('🔍 Multiple choice detected, hasValidOptions:', hasValidOptions)

    if (hasValidOptions) {
      console.log('🔍 Valid options found, returning multiple-choice')
      return 'multiple-choice'
    } else {
      // ✅ ถ้าไม่มี options ที่ถูกต้อง ให้เป็น open-ended
      console.log('🔍 No valid options, changing to open-ended')
      return 'open-ended'
    }
  }

  // ✅ Fallback: ตรวจสอบจาก options
  if (question.options && Array.isArray(question.options) && question.options.length > 0) {
    console.log('🔍 Fallback: options found, returning multiple-choice')
    return 'multiple-choice'
  }

  console.log('🔍 Fallback: no options found, returning open-ended')
  return 'open-ended' // Default to open-ended
}

// Parse JSON quiz content with Quiz Parser support
const parseJsonQuiz = (jsonData: Record<string, unknown>): QuizQuestion[] => {
  console.log('🔥 === PARSING JSON QUIZ DATA ===')
  console.log('📋 Full JSON Data:', JSON.stringify(jsonData, null, 2))
  console.log('🔍 Available top-level keys:', Object.keys(jsonData))
  console.log('📊 Data structure analysis:')
  Object.keys(jsonData).forEach(key => {
    const value = jsonData[key]
    console.log(`  - ${key}: ${typeof value} ${Array.isArray(value) ? `(array length: ${value.length})` : ''}`)
  })

  // Check if this is already a converted quiz format from Quiz Parser
  if (jsonData.questions && Array.isArray(jsonData.questions)) {
    console.log('📋 Parsing pre-converted quiz format')

    return jsonData.questions.map((q: Record<string, unknown>, index: number) => {
      console.log(`🔍 Processing question ${index + 1}:`, q)

      // ✅ ใช้ helper function สำหรับ question type detection
      const questionType = getQuestionType(q) as QuizQuestion['type']

      // ✅ ใช้ correctAnswer จริงจาก backend
      const correctAnswer = q.correctAnswer as QuizQuestion['correctAnswer'] || ''

      console.log(`🔍 Question ${index + 1} type: ${questionType}, correctAnswer: ${correctAnswer}`)

      if (questionType === 'open-ended') {
        // ✅ Open-ended questions ไม่มี options
        console.log('🔍 Open-ended question detected, no options needed')
        return {
          id: q.id as number || index + 1,
          type: 'open-ended',
          question: q.question as string || '',
          options: undefined, // ✅ ไม่มี options
          correctAnswer: correctAnswer, // ✅ ใช้ correctAnswer จริง
          explanation: q.explanation as string
        }
      } else if (questionType === 'multiple-choice') {
        // ✅ Multiple choice questions ต้องมี options
        let questionOptions = q.options as QuizQuestion['options']

        if (!questionOptions || !Array.isArray(questionOptions) || questionOptions.length === 0) {
          console.log('⚠️ Multiple choice question without options, adding fallback')
          questionOptions = [
            { id: 'A', text: 'Option A', correct: correctAnswer === 'Option A' },
            { id: 'B', text: 'Option B', correct: correctAnswer === 'Option B' },
            { id: 'C', text: 'Option C', correct: correctAnswer === 'Option C' },
            { id: 'D', text: 'Option D', correct: correctAnswer === 'Option D' }
          ]
        }

        return {
          id: q.id as number || index + 1,
          type: 'multiple-choice',
          question: q.question as string || '',
          options: questionOptions,
          correctAnswer: correctAnswer, // ✅ ใช้ correctAnswer จริง
          explanation: q.explanation as string
        }
      } else if (questionType === 'true-false') {
        // ✅ True/false questions
        return {
          id: q.id as number || index + 1,
          type: 'true-false',
          question: q.question as string || '',
          options: [
            { id: 'true', text: 'True', correct: correctAnswer === 'true' },
            { id: 'false', text: 'False', correct: correctAnswer === 'false' }
          ],
          correctAnswer: correctAnswer, // ✅ ใช้ correctAnswer จริง
          explanation: q.explanation as string
        }
      }

      // ✅ Fallback
      return {
        id: q.id as number || index + 1,
        type: questionType,
        question: q.question as string || '',
        options: undefined,
        correctAnswer: correctAnswer, // ✅ ใช้ correctAnswer จริง
        explanation: q.explanation as string
      }

      // ✅ ไม่ต้องสร้าง finalQuestion object อีก เพราะ return ไปแล้วในแต่ละ case
    })
  }

    // Check if this is simple format that needs conversion
  if (jsonData.simpleQuestions && Array.isArray(jsonData.simpleQuestions)) {
    console.log('Converting simple questions using smart template detection')
    const simpleQuestions = jsonData.simpleQuestions as SimpleQuestion[]

        // ตรวจสอบ template type จาก metadata หรือ prompt
    const templateId = jsonData.templateId as string || 'unknown'
    const originalPrompt = jsonData.originalPrompt as string || jsonData.sourcePrompt as string || ''

    console.log('🔍 DETECTION DEBUG:')
    console.log('- Available fields:', Object.keys(jsonData))
    console.log('- templateId:', templateId)
    console.log('- originalPrompt:', originalPrompt)
    console.log('- sourcePrompt:', jsonData.sourcePrompt)
    console.log('- simpleQuestions count:', simpleQuestions.length)

    // 🔍 Analyze template type from metadata or prompt
    let quizType: 'single' | 'mixed' = 'single'
    let recommendedType: 'multiple-choice' | 'true-false' | 'open-ended' = 'multiple-choice'

    console.log('🔍 Analyzing template type from prompt...')

    // Check from prompt content for question type indicators
    const lowerPrompt = originalPrompt.toLowerCase()
    if (lowerPrompt.includes('mixed-format') || lowerPrompt.includes('combination quiz') ||
        (lowerPrompt.includes('multiple-choice') && lowerPrompt.includes('true-false') && lowerPrompt.includes('short-answer'))) {
      quizType = 'mixed'
      console.log('✅ Detected: Explicit Mixed Format Quiz')
    } else {
      // 🔍 Smart detection based on question content
      console.log('🔍 Smart detection: Analyzing question content...')

      // Check if any questions suggest open-ended format
      const hasOpenEndedIndicators = simpleQuestions.some(q => {
        const questionText = (q.question || '').toLowerCase()
        return questionText.includes('explain') || questionText.includes('describe') ||
               questionText.includes('why') || questionText.includes('how') ||
               questionText.includes('discuss') || questionText.includes('analyze')
      })

      if (hasOpenEndedIndicators) {
        quizType = 'single'
        recommendedType = 'open-ended'
        console.log('✅ DETECTED: Open-ended questions based on content')
      } else {
        quizType = 'single'
        recommendedType = 'multiple-choice'
        console.log('✅ DEFAULT: Multiple choice (no open-ended indicators)')
      }
    }

        let convertedQuiz

                if (quizType === 'single') {
      // 🚀 NEW: Use improved convertToSpecificQuizType with DIRECT implementation
      console.log('🚀 USING IMPROVED convertToSpecificQuizType (DIRECT IMPLEMENTATION)')

      convertedQuiz = convertToSpecificQuizType(simpleQuestions, recommendedType, {
        language: 'th'
      })

      console.log(`✅ IMPROVED CONVERSION: Generated ${convertedQuiz.length} questions of type: ${recommendedType}`)

      // 🔍 VALIDATE RESULT
      const actualTypes = [...new Set(convertedQuiz.map(q => q.type))]
      console.log(`🔍 VALIDATION: Expected [${recommendedType}], Got [${actualTypes.join(', ')}]`)

      if (actualTypes.length === 1 && actualTypes[0] === recommendedType) {
        console.log('✅ VALIDATION PASSED: Direct implementation successful!')
      } else {
        console.error('❌ VALIDATION FAILED: Direct implementation still has issues!')
        console.error('❌ This should not happen with the new direct conversion')
      }

    } else {
      // Mixed format - try to parse counts from prompt
      const counts = parseMixedQuizCounts(originalPrompt)
      console.log('📊 Parsed mixed quiz counts:', counts)

      if (counts['multiple-choice'] + counts['true-false'] + counts['open-ended'] > 0) {
        convertedQuiz = convertToCustomMixedQuiz(simpleQuestions, counts, {
          language: 'th'
        })
        console.log('✅ MIXED TYPE: Using custom mixed quiz with specific counts')
      } else {
        // This should never happen in our current logic, but keeping as safety
        console.warn('⚠️ UNEXPECTED: Mixed type detected but no counts parsed - forcing single MC')
        convertedQuiz = convertToSpecificQuizType(simpleQuestions, 'multiple-choice', {
          language: 'th'
        })
        console.log('✅ SAFETY FALLBACK: Forced single multiple choice')
      }
    }

    return convertedQuiz.map(q => ({
      id: q.id,
      // ✅ เก็บ type เดิม ไม่แปลง open-ended เป็น short-answer
      type: q.type,
      question: q.question,
            // ✅ ใช้ options ตาม type จริง
      options: (() => {
        const questionType = q.type as string
        if (questionType === 'multiple-choice') {
          // Safe access to options with fallback
          const questionOptions = (q as any).options
          return (questionOptions && questionOptions.length > 0) ? questionOptions : [
            { id: 'A', text: 'Option A', correct: false },
            { id: 'B', text: 'Option B', correct: false },
            { id: 'C', text: 'Option C', correct: false },
            { id: 'D', text: 'Option D', correct: false }
          ]
        } else if (questionType === 'true-false') {
          return [
            { id: 'true', text: 'True', correct: q.correctAnswer === true },
            { id: 'false', text: 'False', correct: q.correctAnswer === false }
          ]
        } else if (questionType === 'open-ended' || questionType === 'short-answer') {
          // ✅ open-ended และ short-answer ไม่มี options
          return undefined
        } else {
          return undefined
        }
      })(),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      points: q.points,
      keywords: q.type === 'open-ended' ? q.keywords : undefined
    } as QuizQuestion))
  }

  // Fallback: try to detect simple Q&A format and convert using Quiz Parser
  if (jsonData.content && Array.isArray(jsonData.content)) {
    console.log('🚨 FALLBACK PATH: Detecting simple Q&A format')
    console.log('🔍 This path may be causing the round-robin problem!')
    const simpleQuestions: SimpleQuestion[] = jsonData.content.map((item: Record<string, unknown>) => ({
      question: item.question as string || '',
      answer: item.answer as string || '',
      context: item.context as string,
      difficulty: item.difficulty as 'easy' | 'medium' | 'hard'
    }))

        if (simpleQuestions.length > 0) {
      // Enhanced template detection for fallback
      const templateId = jsonData.templateId as string || 'unknown'
      const originalPrompt = jsonData.originalPrompt as string || jsonData.sourcePrompt as string || ''

      console.log('Fallback conversion input:', { templateId, originalPrompt })

      // Smart detection for fallback
      let quizType: 'single' | 'mixed' = 'single'
      let recommendedType: 'multiple-choice' | 'true-false' | 'open-ended' = 'multiple-choice'

      const lowerPrompt = originalPrompt.toLowerCase()

      // Check question content to detect open-ended questions
      const hasOpenEndedQuestions = simpleQuestions.some(q => {
        const questionText = (q.question || '').toLowerCase()
        return questionText.includes('explain') || questionText.includes('describe') ||
               questionText.includes('why') || questionText.includes('how') ||
               questionText.includes('what are') || questionText.includes('discuss') ||
               questionText.includes('elaborate') || questionText.includes('analyze') ||
               questionText.includes('compare') || questionText.includes('evaluate') ||
               questionText.includes('justify') || questionText.includes('criticize')
      })

      if (hasOpenEndedQuestions) {
        console.log('✅ Detected open-ended questions in content')
        quizType = 'mixed'
        recommendedType = 'open-ended'
      }
      // Detect multiple choice from prompt
      else if (lowerPrompt.includes('multiple-choice') || lowerPrompt.includes('multiple choice')) {
        if (!lowerPrompt.includes('true') && !lowerPrompt.includes('false') &&
            !lowerPrompt.includes('short-answer') && !lowerPrompt.includes('open-ended')) {
          quizType = 'single'
          recommendedType = 'multiple-choice'
          console.log('✅ Fallback: Detected Pure Multiple Choice Quiz')
        }
      }

      // Detect short answer from prompt
      if (lowerPrompt.includes('short-answer') || lowerPrompt.includes('short answer') ||
          lowerPrompt.includes('open-ended') || lowerPrompt.includes('explain') ||
          lowerPrompt.includes('describe')) {
        if (!lowerPrompt.includes('multiple') && !lowerPrompt.includes('true')) {
          quizType = 'single'
          recommendedType = 'open-ended'
          console.log('✅ Fallback: Detected Pure Short Answer Quiz')
        }
      }

      // Check for mixed format indicators
      if (lowerPrompt.includes('mixed') || lowerPrompt.includes('combination') ||
          (lowerPrompt.includes('multiple') && lowerPrompt.includes('true')) ||
          (lowerPrompt.includes('multiple') && lowerPrompt.includes('short'))) {
        quizType = 'mixed'
        console.log('✅ Fallback: Detected Mixed Format Quiz')
      }

      let convertedQuiz

      if (quizType === 'single') {
        // ใช้ประเภทเดียวเท่านั้น
        convertedQuiz = convertToSpecificQuizType(simpleQuestions, recommendedType, {
          language: 'th',
          generateExplanations: true
        })
        console.log(`✅ Fallback: Generated ${convertedQuiz.length} ${recommendedType} questions`)
      } else {
        // Mixed format
        const counts = parseMixedQuizCounts(originalPrompt)
        if (counts['multiple-choice'] + counts['true-false'] + counts['open-ended'] > 0) {
          convertedQuiz = convertToCustomMixedQuiz(simpleQuestions, counts, {
            language: 'th',
            generateExplanations: true
          })
          console.log('✅ Fallback: Using custom mixed quiz with parsed counts')
        } else {
          // 🔍 Smart fallback: Check question content for type hints
          console.log('🔍 Smart fallback: Analyzing question content for type hints...')

          const hasOpenEndedHints = simpleQuestions.some(q => {
            const questionText = (q.question || '').toLowerCase()
            return questionText.includes('explain') || questionText.includes('describe') ||
                   questionText.includes('why') || questionText.includes('how') ||
                   questionText.includes('discuss') || questionText.includes('analyze')
          })

          if (hasOpenEndedHints) {
            convertedQuiz = convertToSpecificQuizType(simpleQuestions, 'open-ended', {
              language: 'th',
              generateExplanations: true
            })
            console.log('✅ Fallback: Using open-ended based on question content hints')
          } else {
            // Default to pure multiple choice as safest option
            convertedQuiz = convertToSpecificQuizType(simpleQuestions, 'multiple-choice', {
              language: 'th',
              generateExplanations: true
            })
            console.log('✅ Fallback: Using pure multiple choice as safe default')
          }
        }
      }

      return convertedQuiz.map(q => ({
        id: q.id,
        // ✅ เก็บ type เดิม ไม่แปลง open-ended เป็น short-answer
        type: q.type,
        question: q.question,
        // ✅ ใช้ options ตาม type จริง
        options: (() => {
          const questionType = q.type as string
          if (questionType === 'multiple-choice') {
            // Safe access to options with fallback
            const questionOptions = (q as any).options
            return (questionOptions && questionOptions.length > 0) ? questionOptions : [
              { id: 'A', text: 'Option A', correct: false },
              { id: 'B', text: 'Option B', correct: false },
              { id: 'C', text: 'Option C', correct: false },
              { id: 'D', text: 'Option D', correct: false }
            ]
          } else if (questionType === 'true-false') {
            return [
              { id: 'true', text: 'True', correct: q.correctAnswer === true },
              { id: 'false', text: 'False', correct: q.correctAnswer === false }
            ]
          } else if (questionType === 'open-ended' || questionType === 'short-answer') {
            // ✅ open-ended และ short-answer ไม่มี options
            return undefined
          } else {
            return undefined
          }
        })(),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: q.points,
        keywords: q.type === 'open-ended' ? q.keywords : undefined
      } as QuizQuestion))
    }
  }

  console.log('No compatible format found, returning empty array')
  return []
}

// Computed properties
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const totalQuestions = computed(() => questions.value.length)
const progress = computed(() => ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100)
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1)

const correctAnswers = computed(() => {
  let correct = 0
  Object.keys(userAnswers.value).forEach(questionId => {
    const id = parseInt(questionId)
    const question = questions.value.find(q => q.id === id)
    const userAnswer = userAnswers.value[id]

    if (question && userAnswer) {
      if (Array.isArray(question.correctAnswer)) {
        if (Array.isArray(userAnswer) && userAnswer.length === question.correctAnswer.length) {
          correct += question.correctAnswer.every(ans => userAnswer.includes(ans)) ? 1 : 0
        }
      } else {
        correct += userAnswer === question.correctAnswer ? 1 : 0
      }
    }
  })
  return correct
})

const score = computed(() => {
  return totalQuestions.value > 0 ? Math.round((correctAnswers.value / totalQuestions.value) * 100) : 0
})

// Check if current question has a valid answer
const isAnswerProvided = computed(() => {
  const answer = userAnswers.value[currentQuestion.value.id]

  // For different question types, check if answer is provided
  if (currentQuestion.value.type === 'short-answer' || currentQuestion.value.type === 'open-ended') {
    // For text answers, check if there's actual content (not just whitespace)
    return answer && typeof answer === 'string' && answer.trim().length > 0
  } else {
    // For multiple choice, true/false, etc.
    return answer !== undefined && answer !== null && answer !== ''
  }
})

// Development mode check
const isDevelopmentMode = computed(() => {
  return import.meta.env.DEV
})

// Methods
const startQuiz = () => {
  quizStarted.value = true
  currentQuestionIndex.value = 0
  userAnswers.value = {}
  showResults.value = false
}

const selectAnswer = (answer: string) => {
  const questionId = currentQuestion.value.id
  console.log('🎯 Selecting answer:', {
    answer,
    questionId,
    questionType: currentQuestion.value.type,
    currentAnswers: userAnswers.value
  })

  // ✅ เก็บ answer text โดยตรง ไม่ต้องแปลงเป็น index
  userAnswers.value[questionId] = answer

  console.log('✅ Updated userAnswers:', {
    questionId,
    selectedAnswer: userAnswers.value[questionId],
    allAnswers: userAnswers.value
  })
}

const handleAnswerInput = () => {
  // Force reactivity update
  console.log('Answer input changed:', userAnswers.value[currentQuestion.value.id])
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++
  } else {
    showResults.value = true
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const restartQuiz = () => {
  quizStarted.value = false
  showResults.value = false
  currentQuestionIndex.value = 0
  userAnswers.value = {}
}

const isAnswerSelected = (answer: string) => {
  const questionId = currentQuestion.value.id
  const currentAnswer = userAnswers.value[questionId]

  // ✅ เปรียบเทียบ answer text โดยตรง
  const isSelected = currentAnswer === answer

  return isSelected
}

const isAnswerCorrect = (questionId: number, answer: string | string[]) => {
  const question = questions.value.find(q => q.id === questionId)
  if (!question) return false

  if (Array.isArray(answer)) {
    if (Array.isArray(question.correctAnswer)) {
      return answer.length === question.correctAnswer.length &&
             answer.every(ans => (question.correctAnswer as string[]).includes(ans))
    }
    return false
  }

  if (Array.isArray(question.correctAnswer)) {
    return question.correctAnswer.includes(answer as string)
  }
  return question.correctAnswer === answer
}

const getUserAnswer = (questionId: number) => {
  const answer = userAnswers.value[questionId] || ''

  // ✅ แปลง answer ให้เป็นรูปแบบที่อ่านได้
  if (answer === '') return 'No answer'

  // ✅ สำหรับ true/false ให้แปลงเป็น "True"/"False"
  const question = questions.value.find(q => q.id === questionId)
  if (question && question.type === 'true-false') {
    return answer === 'true' ? 'True' : answer === 'false' ? 'False' : String(answer)
  }

  // ✅ สำหรับ question types อื่นๆ แสดง answer โดยตรง
  return String(answer)
}

const getCorrectAnswerDisplay = (question: QuizQuestion) => {
  if (Array.isArray(question.correctAnswer)) {
    return question.correctAnswer.join(', ')
  }

  // ✅ สำหรับ true/false ให้แปลงเป็น "True"/"False"
  if (question.type === 'true-false') {
    return question.correctAnswer === 'true' ? 'True' : question.correctAnswer === 'false' ? 'False' : String(question.correctAnswer)
  }

  // ✅ สำหรับ question types อื่นๆ แสดง correctAnswer โดยตรง
  return String(question.correctAnswer)
}

const parseAndSetQuestions = () => {
  try {
    console.log('=== PARSING QUIZ CONTENT ===')
    console.log('Content received:', props.content)

    if (!props.content || typeof props.content !== 'string') {
      console.warn('Invalid content provided to InteractiveQuiz')
      questions.value = []
      return
    }

    console.log('🚀 Calling parseQuizContent with content:', props.content)
    questions.value = parseQuizContent(props.content)
    console.log('✅ parseQuizContent returned:', questions.value)
    console.log('Final questions count:', questions.value.length)
    console.log('Questions:', questions.value)

    // Debug individual questions with safe checks
    if (Array.isArray(questions.value)) {
      questions.value.forEach((q, index) => {
        if (q && typeof q === 'object') {
          console.log(`Question ${index + 1}:`, {
            id: q.id,
            type: q.type,
            question: q.question,
            optionsCount: Array.isArray(q.options) ? q.options.length : 0,
            optionsType: Array.isArray(q.options) && q.options.length > 0 ? typeof q.options[0] : 'none',
            optionsPreview: Array.isArray(q.options) ? q.options.slice(0, 2) : 'none',
            correctAnswer: q.correctAnswer
          })
        }
      })
    }

    // Reset quiz state when content changes
    quizStarted.value = false
    currentQuestionIndex.value = 0
    userAnswers.value = {}
    showResults.value = false
  } catch (error) {
    console.error('Error parsing quiz content:', error)
    questions.value = []
  }
}

onMounted(() => {
  parseAndSetQuestions()
})

watch(() => props.content, () => {
  parseAndSetQuestions()
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Quiz Start Screen -->
    <div v-if="!quizStarted" class="text-center py-12">
      <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 mb-4">Interactive Quiz</h2>
      <p class="text-slate-600 mb-6">Test your knowledge with {{ totalQuestions }} questions</p>
      <button
        @click="startQuiz"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Start Quiz
      </button>
    </div>

    <!-- Quiz Questions -->
    <div v-else-if="!showResults" class="space-y-6">
      <!-- Progress Bar -->
      <div class="bg-slate-200 rounded-full h-2">
        <div
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>

      <div class="text-sm text-slate-500 text-center">
        Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
      </div>

      <!-- Question Card -->
      <div class="bg-white rounded-lg border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-6">
          {{ currentQuestion.question }}
        </h3>

        <!-- Multiple Choice -->
        <div v-if="currentQuestion.type === 'multiple-choice' && currentQuestion.options && currentQuestion.options.length > 0" class="space-y-3">


          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="selectAnswer(typeof option === 'string' ? option : option.text)"
            :class="[
              'w-full p-4 text-left border-2 rounded-lg transition-colors',
              isAnswerSelected(typeof option === 'string' ? option : option.text)
                ? 'bg-blue-100 border-blue-500 text-blue-900'
                : 'bg-white border-slate-300 hover:bg-slate-50'
            ]"
          >
            <span class="font-medium mr-3">{{ String.fromCharCode(65 + index) }}.</span>
            {{ typeof option === 'string' ? option : option.text }}
          </button>
        </div>

        <!-- True/False -->
        <div v-else-if="currentQuestion.type === 'true-false'" class="space-y-3">
          <button
            v-for="option in currentQuestion.options || [
              { id: 'true', text: 'True', correct: false },
              { id: 'false', text: 'False', correct: false }
            ]"
            :key="typeof option === 'string' ? option : option.id"
            @click="selectAnswer(typeof option === 'string' ? option : option.text)"
            :class="[
              'w-full p-4 text-left border-2 rounded-lg transition-colors',
              isAnswerSelected(typeof option === 'string' ? option : option.text)
                ? 'bg-blue-100 border-blue-500 text-blue-900'
                : 'bg-white border-slate-300 hover:bg-slate-50'
            ]"
          >
            {{ typeof option === 'string' ? option : option.text }}
          </button>
        </div>

        <!-- Short Answer -->
        <div v-else-if="currentQuestion.type === 'short-answer'" class="space-y-3">
          <div class="mb-4">
            <p class="text-slate-700 text-sm mb-2">Please provide your answer to the question above:</p>
          </div>
          <textarea
            v-model="userAnswers[currentQuestion.id]"
            rows="4"
            class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Type your answer here..."
            @input="handleAnswerInput"
          ></textarea>
        </div>

        <!-- Open Ended -->
        <div v-else-if="currentQuestion.type === 'open-ended'" class="space-y-3">
          <div class="mb-4">
            <p class="text-slate-700 text-sm mb-2">Please provide a detailed answer to the question above:</p>
          </div>
          <textarea
            v-model="userAnswers[currentQuestion.id]"
            rows="6"
            class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Provide your detailed answer here..."
            @input="handleAnswerInput"
          ></textarea>
        </div>

        <!-- Questions without options or open-ended content -->
        <div v-else-if="currentQuestion.type === 'multiple-choice' && (!currentQuestion.options || currentQuestion.options.length === 0)" class="space-y-3">
          <!-- Debug info for development -->
          <div v-if="isDevelopmentMode" class="mb-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
            <strong>Debug:</strong> Question ID = {{ debugInfo.questionId }},
            Options count = {{ debugInfo.optionsCount }},
            Options structure: {{ JSON.stringify(currentQuestion.options, null, 2) }}
            <br>
            <strong>User Answers:</strong> {{ JSON.stringify(userAnswers, null, 2) }}
            <br>
            <strong>Question Type:</strong> {{ getQuestionTypeDisplay(currentQuestion.type) }}
            <br>
            <strong>Question Text:</strong> {{ currentQuestion.question }}
            <br>
            <strong>Is Open-ended Content?:</strong> {{ debugInfo.isOpenEnded }}
          </div>

          <!-- Auto-convert to open-ended for questions without options -->
          <div class="mb-4">
            <p class="text-slate-700 text-sm mb-2">Please provide a detailed answer to the question above:</p>
          </div>
          <textarea
            v-model="userAnswers[currentQuestion.id]"
            rows="6"
            class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Provide your detailed answer here..."
            @input="handleAnswerInput"
          ></textarea>
        </div>

        <!-- Fallback for unsupported question types -->
        <div v-else class="space-y-3">
          <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="text-yellow-800 text-sm">
              <strong>Unsupported question type:</strong> {{ currentQuestion.type }}
            </p>
            <p class="text-yellow-700 text-xs mt-1">
              This question type is not yet supported in the interactive quiz.
            </p>
          </div>

          <!-- Allow manual text input as fallback -->
          <textarea
            v-model="userAnswers[currentQuestion.id]"
            rows="4"
            class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Please provide your answer here..."
            @input="handleAnswerInput"
          ></textarea>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between">
        <button
          @click="previousQuestion"
          :disabled="currentQuestionIndex === 0"
          class="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          @click="nextQuestion"
          :disabled="!isAnswerProvided"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isLastQuestion ? 'Finish Quiz' : 'Next' }}
        </button>
      </div>
    </div>

    <!-- Results Screen -->
    <div v-else class="text-center py-12">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h2 class="text-2xl font-bold text-slate-900 mb-4">Quiz Complete!</h2>
      <div class="text-4xl font-bold text-blue-600 mb-2">{{ score }}%</div>
      <p class="text-slate-600 mb-6">
        You got {{ correctAnswers }} out of {{ totalQuestions }} questions correct
      </p>

      <!-- Score Message -->
      <div class="mb-8">
        <p v-if="score >= 90" class="text-green-600 font-medium">Excellent! Great job!</p>
        <p v-else-if="score >= 70" class="text-blue-600 font-medium">Good work! Keep it up!</p>
        <p v-else-if="score >= 50" class="text-yellow-600 font-medium">Not bad! Review the material and try again.</p>
        <p v-else class="text-red-600 font-medium">Keep studying! You'll get better with practice.</p>
      </div>

      <!-- Review Questions -->
      <div class="bg-white rounded-lg border border-slate-200 p-6 text-left">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Question Review</h3>
        <div class="space-y-4">
          <div
            v-for="question in questions"
            :key="question.id"
            class="border border-slate-200 rounded-lg p-4"
          >
            <div class="flex items-start justify-between mb-2">
              <h4 class="font-medium text-slate-900">{{ question.question }}</h4>
              <span
                :class="
                  isAnswerCorrect(question.id, getUserAnswer(question.id))
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ isAnswerCorrect(question.id, getUserAnswer(question.id)) ? 'Correct' : 'Incorrect' }}
              </span>
            </div>
            <div class="text-sm text-slate-600">
              <p><strong>Your answer:</strong> {{ getUserAnswer(question.id) || 'No answer' }}</p>
              <p><strong>Correct answer:</strong> {{ getCorrectAnswerDisplay(question) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <button
          @click="restartQuiz"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>
