/**
 * 🚨 DEBUG: Round-Robin Problem Investigation
 * ไฟล์นี้ใช้สำหรับ debug ปัญหา Round-Robin Algorithm
 */

import { convertToSpecificQuizType, convertToMixedQuiz, type SimpleQuestion } from './quizParser'

// Mock AI response data ที่ทำให้เกิดปัญหา
const problematicResponse = {
  simpleQuestions: [
    {
      question: "What is photosynthesis?",
      answer: "The process by which plants convert sunlight into energy"
    }
  ],
  // Missing templateId and originalPrompt (realistic scenario)
  templateId: undefined,
  originalPrompt: undefined,
  sourcePrompt: undefined
}

/**
 * ทดสอบ convertToSpecificQuizType ด้วย 1 คำถาม
 */
export function testSingleQuestionConversion(): void {
  console.log('🔬 === ROUND-ROBIN DEBUG TEST ===')
  console.log('🎯 Testing convertToSpecificQuizType with 1 question')

  const simpleQuestions: SimpleQuestion[] = [
    {
      question: "What is the capital of Thailand?",
      answer: "Bangkok",
      context: "Geography question about Thailand",
      difficulty: "easy"
    }
  ]

  console.log('\n📊 Input:')
  console.log('- Questions count:', simpleQuestions.length)
  console.log('- Expected type: multiple-choice')
  console.log('- Expected result: 1 multiple-choice question ONLY')

  try {
    console.log('\n🚀 Calling convertToSpecificQuizType...')
    const result = convertToSpecificQuizType(simpleQuestions, 'multiple-choice', {
      language: 'th'
    })

    console.log('\n📋 Result Analysis:')
    console.log('- Total questions:', result.length)

    const typeDistribution = result.reduce((acc, q) => {
      acc[q.type] = (acc[q.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    console.log('- Type distribution:', typeDistribution)

    result.forEach((q, index) => {
      console.log(`  ${index + 1}. ${q.type}: "${q.question.substring(0, 50)}..."`)
    })

    // Validate result
    const types = Object.keys(typeDistribution)
    if (types.length === 1 && types[0] === 'multiple-choice') {
      console.log('\n✅ SUCCESS: Round-robin problem is FIXED!')
      console.log('✅ Only multiple-choice questions generated as expected')
    } else {
      console.log('\n❌ FAILED: Round-robin problem PERSISTS!')
      console.log(`❌ Expected: [multiple-choice], Got: [${types.join(', ')}]`)
      console.log('❌ Need to investigate convertToMixedQuiz function')
    }

  } catch (error) {
    console.error('\n💥 ERROR during conversion:', error)
  }
}

/**
 * ทดสอบ convertToMixedQuiz ด้วย single type array
 */
export function testMixedQuizWithSingleType(): void {
  console.log('\n🔬 === MIXED QUIZ SINGLE TYPE DEBUG ===')
  console.log('🎯 Testing convertToMixedQuiz with questionTypes: [\"multiple-choice\"]')

  const simpleQuestions: SimpleQuestion[] = [
    {
      question: "What is HTML?",
      answer: "HyperText Markup Language",
      difficulty: "easy"
    }
  ]

  try {
    console.log('\n🚀 Calling convertToMixedQuiz with single type...')
    const result = convertToMixedQuiz(simpleQuestions, {
      questionTypes: ['multiple-choice'], // Single type array
      distributionMode: 'round-robin',
      language: 'th'
    })

    console.log('\n📋 convertToMixedQuiz Result:')
    console.log('- Total questions:', result.length)

    const typeDistribution = result.reduce((acc, q) => {
      acc[q.type] = (acc[q.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    console.log('- Type distribution:', typeDistribution)

    result.forEach((q, index) => {
      console.log(`  ${index + 1}. ${q.type}: "${q.question.substring(0, 50)}..."`)
    })

    // Validate
    const types = Object.keys(typeDistribution)
    if (types.length === 1 && types[0] === 'multiple-choice') {
      console.log('\n✅ convertToMixedQuiz works correctly with single type')
    } else {
      console.log('\n❌ convertToMixedQuiz has a bug even with single type array!')
      console.log('❌ This is the root cause of the round-robin problem')
    }

  } catch (error) {
    console.error('\n💥 ERROR in convertToMixedQuiz:', error)
  }
}

/**
 * ทดสอบ Default Options
 */
export function testDefaultOptions(): void {
  console.log('\n🔬 === DEFAULT OPTIONS DEBUG ===')

  // Import DEFAULT_OPTIONS for inspection
  try {
    const testQuestions: SimpleQuestion[] = [
      { question: "Test question", answer: "Test answer", difficulty: "easy" }
    ]

    console.log('\n🚀 Testing with empty options (using defaults)...')
    const result = convertToMixedQuiz(testQuestions, {})

    console.log('\n📋 Default behavior result:')
    result.forEach((q, index) => {
      console.log(`  ${index + 1}. ${q.type}: "${q.question}"`)
    })

    console.log('\n🔍 This shows what the DEFAULT_OPTIONS contain')

  } catch (error) {
    console.error('\n💥 ERROR testing defaults:', error)
  }
}

/**
 * Run all debug tests
 */
export function runAllDebugTests(): void {
  console.log('🚨 ROUND-ROBIN PROBLEM INVESTIGATION')
  console.log('=====================================\n')

  testSingleQuestionConversion()
  testMixedQuizWithSingleType()
  testDefaultOptions()

  console.log('\n🏁 === DEBUG SESSION COMPLETE ===')
  console.log('Check the logs above to identify the exact cause of the round-robin problem')
}

// Auto-run on import in browser console
if (typeof window !== 'undefined') {
  console.log('🔧 Round-Robin Debug Module Loaded')
  console.log('📞 Call runAllDebugTests() to investigate the problem')
}

export { problematicResponse }
