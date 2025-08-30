/**
 * ตัวอย่างการใช้งาน Quiz Parser Functions ใหม่
 * แก้ปัญหา Round-Robin สำหรับ Template แต่ละประเภท
 */

import {
  convertToSpecificQuizType,
  convertToCustomMixedQuiz,
  detectQuizTypeFromTemplate,
  parseMixedQuizCounts,
  type SimpleQuestion
} from './quizParser'

// ข้อมูลตัวอย่าง
const sampleQuestions: SimpleQuestion[] = [
  {
    question: "What is photosynthesis?",
    answer: "The process by which plants convert sunlight into energy"
  },
  {
    question: "What is the chemical formula for water?",
    answer: "H2O"
  },
  {
    question: "What is the capital of Thailand?",
    answer: "Bangkok"
  }
]

// ===== ตัวอย่างที่ 1: Multiple Choice Quiz Template =====
console.log('🎯 ตัวอย่างที่ 1: Multiple Choice Quiz (แก้ปัญหา Round-Robin)')

// ปัญหาเดิม: 1 คำถาม → ได้ 3 ประเภท (multiple-choice, true-false, open-ended)
// วิธีแก้ใหม่: ใช้ convertToSpecificQuizType
const multipleChoiceQuiz = convertToSpecificQuizType(
  sampleQuestions.slice(0, 1), // 1 คำถาม
  'multiple-choice',
  { language: 'th' }
)

console.log('✅ ผลลัพธ์ (1 คำถาม):')
multipleChoiceQuiz.forEach(q => {
  console.log(`   ${q.id}. Type: ${q.type}, Question: ${q.question}`)
})

// ทดสอบกับ 5 คำถาม
const multipleChoiceQuiz5 = convertToSpecificQuizType(
  Array(5).fill(sampleQuestions[0]), // 5 คำถามเหมือนกัน
  'multiple-choice',
  { language: 'th' }
)

console.log('\n✅ ผลลัพธ์ (5 คำถาม):')
multipleChoiceQuiz5.forEach(q => {
  console.log(`   ${q.id}. Type: ${q.type}`)
})

// ===== ตัวอย่างที่ 2: Mixed Format Quiz Template =====
console.log('\n🎨 ตัวอย่างที่ 2: Mixed Format Quiz (กำหนดจำนวนแต่ละประเภท)')

const mixedPrompt = "Create a quiz with 3 multiple-choice, 2 true/false, and 1 short-answer questions"
const counts = parseMixedQuizCounts(mixedPrompt)

console.log('📊 Parsed counts:', counts)

const customMixedQuiz = convertToCustomMixedQuiz(
  Array(10).fill(sampleQuestions[0]), // 10 คำถาม
  counts,
  { language: 'th' }
)

console.log('✅ ผลลัพธ์ Mixed Quiz:')
customMixedQuiz.forEach(q => {
  console.log(`   ${q.id}. Type: ${q.type}`)
})

// ===== ตัวอย่างที่ 3: Template Detection =====
console.log('\n🔍 ตัวอย่างที่ 3: Template Detection')

const templates = [
  { id: 'multiple-choice', prompt: 'Generate 10 multiple-choice questions' },
  { id: 'mixed-format', prompt: 'Create 5 multiple-choice, 3 true/false, 2 short-answer' },
  { id: 'short-answer', prompt: 'Generate short answer questions' },
  { id: 'unknown', prompt: 'Create some quiz questions' }
]

templates.forEach(template => {
  const detection = detectQuizTypeFromTemplate(template.id, template.prompt)
  console.log(`📝 Template: ${template.id}`)
  console.log(`   → Quiz Type: ${detection.quizType}`)
  console.log(`   → Recommended Types: ${detection.recommendedTypes.join(', ')}`)
})

// ===== ตัวอย่างการใช้งานจริงใน InteractiveQuiz =====
console.log('\n🚀 ตัวอย่างการใช้งานใน InteractiveQuiz')

const simulateQuizGeneration = (templateId: string, questionCount: number) => {
  console.log(`\n🎮 Simulating: ${templateId} with ${questionCount} questions`)

  const detection = detectQuizTypeFromTemplate(templateId)
  console.log(`   Detected: ${detection.quizType} type`)

  const mockQuestions = Array(questionCount).fill(sampleQuestions[0])

  if (detection.quizType === 'single' && detection.recommendedTypes.length === 1) {
    const result = convertToSpecificQuizType(mockQuestions, detection.recommendedTypes[0])
    console.log(`   ✅ Generated ${result.length} ${detection.recommendedTypes[0]} questions`)
    return result
  } else {
    console.log(`   ⚠️ Would use mixed format with types: ${detection.recommendedTypes.join(', ')}`)
    return []
  }
}

// ทดสอบกับ Template ต่างๆ
simulateQuizGeneration('multiple-choice', 1)  // ควรได้ 1 multiple-choice
simulateQuizGeneration('multiple-choice', 5)  // ควรได้ 5 multiple-choice
simulateQuizGeneration('short-answer', 3)     // ควรได้ 3 open-ended
simulateQuizGeneration('mixed-format', 6)     // ควรใช้ mixed format

export {
  convertToSpecificQuizType,
  convertToCustomMixedQuiz,
  detectQuizTypeFromTemplate,
  parseMixedQuizCounts
}
