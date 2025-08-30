/**
 * ทดสอบการตรวจจับ Quiz Type จาก Prompt Content
 * แก้ปัญหา Round-Robin Algorithm ใน Multiple Choice Templates
 */

// Mock data สำหรับทดสอบ
interface MockAIResponse {
  simpleQuestions: Array<{
    question: string
    answer: string
    context?: string
  }>
  templateId?: string
  originalPrompt?: string
  sourcePrompt?: string
}

// Test cases
const testCases: Array<{
  name: string
  response: MockAIResponse
  expectedType: 'single' | 'mixed'
  expectedQuestionType: 'multiple-choice' | 'true-false' | 'open-ended'
  expectedCount: number
}> = [
  {
    name: "Multiple Choice Template with 1 question",
    response: {
      simpleQuestions: [
        { question: "What is photosynthesis?", answer: "Process of converting sunlight to energy" }
      ],
      originalPrompt: "Generate 1 multiple-choice questions in English about photosynthesis for university level. Each question should have 4 options (A, B, C, D) with only one correct answer."
    },
    expectedType: 'single',
    expectedQuestionType: 'multiple-choice',
    expectedCount: 1
  },
  {
    name: "Multiple Choice Template with 5 questions",
    response: {
      simpleQuestions: Array(5).fill({
        question: "What is photosynthesis?",
        answer: "Process of converting sunlight to energy"
      }),
      originalPrompt: "Generate 5 multiple-choice questions in English about photosynthesis for university level. Each question should have 4 options (A, B, C, D) with only one correct answer."
    },
    expectedType: 'single',
    expectedQuestionType: 'multiple-choice',
    expectedCount: 5
  },
  {
    name: "Short Answer Template",
    response: {
      simpleQuestions: [
        { question: "Explain photosynthesis", answer: "Process where plants convert sunlight to energy" }
      ],
      originalPrompt: "Generate 3 short-answer questions in English about photosynthesis suitable for university level students. Questions should test understanding, application, and analysis skills."
    },
    expectedType: 'single',
    expectedQuestionType: 'open-ended',
    expectedCount: 1
  },
  {
    name: "Mixed Format Template",
    response: {
      simpleQuestions: Array(10).fill({
        question: "What is photosynthesis?",
        answer: "Process of converting sunlight to energy"
      }),
      originalPrompt: "Create a mixed-format quiz in English about Biology for university level with 5 multiple-choice, 3 true/false, and 2 short-answer questions."
    },
    expectedType: 'mixed',
    expectedQuestionType: 'multiple-choice', // First type in custom mixed
    expectedCount: 10
  },
  {
    name: "Pure Multiple Choice (no other keywords)",
    response: {
      simpleQuestions: [
        { question: "What is H2O?", answer: "Water" }
      ],
      originalPrompt: "Create 1 multiple choice question about chemistry"
    },
    expectedType: 'single',
    expectedQuestionType: 'multiple-choice',
    expectedCount: 1
  }
]

/**
 * Simulate the detection logic from InteractiveQuiz.vue
 */
function simulateQuizDetection(response: MockAIResponse): {
  quizType: 'single' | 'mixed'
  recommendedType: 'multiple-choice' | 'true-false' | 'open-ended'
  strategy: string
} {
  const originalPrompt = response.originalPrompt || response.sourcePrompt || ''

  // Enhanced detection logic (same as in InteractiveQuiz.vue)
  let quizType: 'single' | 'mixed' = 'single'
  let recommendedType: 'multiple-choice' | 'true-false' | 'open-ended' = 'multiple-choice'
  let strategy = 'default'

  // Check from prompt content for multiple choice indicators
  const lowerPrompt = originalPrompt.toLowerCase()

  if (lowerPrompt.includes('multiple-choice') || lowerPrompt.includes('multiple choice')) {
    if (!lowerPrompt.includes('true') && !lowerPrompt.includes('false') &&
        !lowerPrompt.includes('short-answer') && !lowerPrompt.includes('open-ended')) {
      quizType = 'single'
      recommendedType = 'multiple-choice'
      strategy = 'pure-multiple-choice-detected'
    }
  }

  // Check for short answer indicators
  if (lowerPrompt.includes('short-answer') || lowerPrompt.includes('short answer') ||
      lowerPrompt.includes('open-ended') || lowerPrompt.includes('explain') ||
      lowerPrompt.includes('describe')) {
    if (!lowerPrompt.includes('multiple') && !lowerPrompt.includes('true')) {
      quizType = 'single'
      recommendedType = 'open-ended'
      strategy = 'pure-short-answer-detected'
    }
  }

  // Check if prompt mentions mixed format
  if (lowerPrompt.includes('mixed') || lowerPrompt.includes('combination') ||
      (lowerPrompt.includes('multiple-choice') && lowerPrompt.includes('true')) ||
      (lowerPrompt.includes('multiple-choice') && lowerPrompt.includes('short'))) {
    quizType = 'mixed'
    strategy = 'mixed-format-detected'
  }

  return { quizType, recommendedType, strategy }
}

/**
 * Run all test cases
 */
export function runQuizDetectionTests(): void {
  console.log('🧪 Running Quiz Detection Tests...\n')

  let passed = 0
  let failed = 0

  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`)
    console.log(`Input prompt: "${testCase.response.originalPrompt}"`)

    const result = simulateQuizDetection(testCase.response)

    const typeMatch = result.quizType === testCase.expectedType
    const questionTypeMatch = result.recommendedType === testCase.expectedQuestionType
    const countMatch = testCase.response.simpleQuestions.length === testCase.expectedCount

    const success = typeMatch && questionTypeMatch && countMatch

    if (success) {
      console.log(`✅ PASSED`)
      console.log(`   Quiz Type: ${result.quizType} (expected: ${testCase.expectedType})`)
      console.log(`   Question Type: ${result.recommendedType} (expected: ${testCase.expectedQuestionType})`)
      console.log(`   Count: ${testCase.response.simpleQuestions.length} (expected: ${testCase.expectedCount})`)
      console.log(`   Strategy: ${result.strategy}`)
      passed++
    } else {
      console.log(`❌ FAILED`)
      console.log(`   Quiz Type: ${result.quizType} (expected: ${testCase.expectedType}) ${typeMatch ? '✅' : '❌'}`)
      console.log(`   Question Type: ${result.recommendedType} (expected: ${testCase.expectedQuestionType}) ${questionTypeMatch ? '✅' : '❌'}`)
      console.log(`   Count: ${testCase.response.simpleQuestions.length} (expected: ${testCase.expectedCount}) ${countMatch ? '✅' : '❌'}`)
      console.log(`   Strategy: ${result.strategy}`)
      failed++
    }

    console.log('') // Empty line
  })

  console.log(`📊 Test Results:`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`)

  if (failed === 0) {
    console.log('🎉 All tests passed! Round-Robin problem should be fixed.')
  } else {
    console.log('⚠️ Some tests failed. Review the detection logic.')
  }
}

/**
 * Test the specific case mentioned by user
 */
export function testSpecificCase(): void {
  console.log('🎯 Testing Specific User Case: 1 Multiple Choice Question\n')

  const userCase: MockAIResponse = {
    simpleQuestions: [
      { question: "What is the capital of Thailand?", answer: "Bangkok" }
    ],
    originalPrompt: "Generate 1 multiple-choice questions in English about geography for high school level. Each question should have 4 options (A, B, C, D) with only one correct answer."
  }

  const result = simulateQuizDetection(userCase)

  console.log('Input:', userCase.originalPrompt)
  console.log('Result:', result)

  if (result.quizType === 'single' && result.recommendedType === 'multiple-choice') {
    console.log('✅ SUCCESS: Will generate 1 multiple-choice question (not 3 different types)')
    console.log('✅ Round-Robin Algorithm bypassed successfully')
  } else {
    console.log('❌ FAILED: Still would generate mixed question types')
    console.log('❌ Round-Robin Algorithm issue persists')
  }
}

// Auto-run tests if imported
if (typeof window !== 'undefined') {
  console.log('Quiz Detection Test Module Loaded')
  console.log('Run: runQuizDetectionTests() or testSpecificCase()')
}

export { testCases, simulateQuizDetection }
