// Demo และ Test สำหรับ Quiz Parser
import { convertToMixedQuiz, type SimpleQuestion, type QuizConversionOptions } from './quizParser'

/**
 * ข้อมูลตัวอย่างสำหรับทดสอบ
 */
export const sampleSimpleQuestions: SimpleQuestion[] = [
  {
    question: "Python เป็นภาษาโปรแกรมมิ่งประเภทใด?",
    answer: "Interpreted language",
    context: "Python ทำงานผ่าน interpreter ไม่ต้อง compile ก่อนใช้งาน",
    difficulty: "medium"
  },
  {
    question: "HTML ย่อมาจากอะไร?",
    answer: "HyperText Markup Language",
    context: "HTML เป็นภาษามาร์กอัปสำหรับสร้างเว็บเพจ",
    difficulty: "easy"
  },
  {
    question: "CSS ใช้ทำอะไร?",
    answer: "จัดรูปแบบและการแสดงผลของเว็บเพจ",
    context: "CSS ย่อมาจาก Cascading Style Sheets ใช้สำหรับตกแต่งเว็บ",
    difficulty: "easy"
  },
  {
    question: "JavaScript สามารถทำงานที่ไหนได้บ้าง?",
    answer: "ทั้งฝั่ง Client และ Server",
    context: "JavaScript สามารถทำงานใน Browser และ Node.js",
    difficulty: "medium"
  },
  {
    question: "React เป็นอะไร?",
    answer: "JavaScript Library สำหรับสร้าง User Interface",
    context: "React พัฒนาโดย Facebook เป็น Component-based library",
    difficulty: "medium"
  },
  {
    question: "Database คืออะไร?",
    answer: "ระบบจัดเก็บและจัดการข้อมูลอย่างเป็นระเบียบ",
    context: "Database ช่วยให้เราสามารถเก็บ ค้นหา และจัดการข้อมูลได้อย่างมีประสิทธิภาพ",
    difficulty: "easy"
  }
]

/**
 * ตัวอย่างการแปลงด้วย options ต่างๆ
 */
export const demoQuizConversions = () => {
  console.log('🎯 Demo Quiz Parser - Frontend Format Conversion\n')

  // 1. Round Robin Distribution
  console.log('📋 1. Round Robin Distribution (หมุนเวียน 3 แบบ):')
  const roundRobinQuiz = convertToMixedQuiz(sampleSimpleQuestions.slice(0, 3), {
    questionTypes: ['multiple-choice', 'true-false', 'open-ended'],
    distributionMode: 'round-robin',
    language: 'th'
  })

  roundRobinQuiz.forEach((q, index) => {
    console.log(`   ${index + 1}. ${q.type}: ${q.question}`)
  })

  // 2. Random Distribution
  console.log('\n🎲 2. Random Distribution (สุ่มประเภท):')
  const randomQuiz = convertToMixedQuiz(sampleSimpleQuestions.slice(0, 3), {
    questionTypes: ['multiple-choice', 'true-false'],
    distributionMode: 'random',
    language: 'th'
  })

  randomQuiz.forEach((q, index) => {
    console.log(`   ${index + 1}. ${q.type}: ${q.question}`)
  })

  // 3. English Version
  console.log('\n🌍 3. English Version:')
  const englishQuiz = convertToMixedQuiz([
    { question: "What is Python?", answer: "A programming language" },
    { question: "What does HTML stand for?", answer: "HyperText Markup Language" }
  ], {
    questionTypes: ['multiple-choice', 'true-false'],
    distributionMode: 'round-robin',
    language: 'en'
  })

  englishQuiz.forEach((q, index) => {
    console.log(`   ${index + 1}. ${q.type}: ${q.question}`)
  })

  return {
    roundRobinQuiz,
    randomQuiz,
    englishQuiz
  }
}

/**
 * ทดสอบ Multiple Choice Generation
 */
export const testMultipleChoiceGeneration = () => {
  console.log('\n🔍 Testing Multiple Choice Generation:')

  const mcQuiz = convertToMixedQuiz([sampleSimpleQuestions[0]], {
    questionTypes: ['multiple-choice'],
    language: 'th'
  })

  const mcQuestion = mcQuiz[0]
  if (mcQuestion.type === 'multiple-choice') {
    console.log(`Question: ${mcQuestion.question}`)
    mcQuestion.options.forEach(option => {
      console.log(`   ${option.id}. ${option.text} ${option.correct ? '✅' : ''}`)
    })
    console.log(`Points: ${mcQuestion.points}`)
  }

  return mcQuestion
}

/**
 * ทดสอบ True/False Generation
 */
export const testTrueFalseGeneration = () => {
  console.log('\n✅❌ Testing True/False Generation:')

  const tfQuiz = convertToMixedQuiz([sampleSimpleQuestions[1]], {
    questionTypes: ['true-false'],
    language: 'th'
  })

  const tfQuestion = tfQuiz[0]
  if (tfQuestion.type === 'true-false') {
    console.log(`Question: ${tfQuestion.question}`)
    console.log(`Answer: ${tfQuestion.correctAnswer ? 'True' : 'False'}`)
    console.log(`Explanation: ${tfQuestion.explanation}`)
    console.log(`Points: ${tfQuestion.points}`)
  }

  return tfQuestion
}

/**
 * ทดสอบ Open-ended Generation
 */
export const testOpenEndedGeneration = () => {
  console.log('\n📝 Testing Open-ended Generation:')

  const oeQuiz = convertToMixedQuiz([sampleSimpleQuestions[2]], {
    questionTypes: ['open-ended'],
    language: 'th'
  })

  const oeQuestion = oeQuiz[0]
  if (oeQuestion.type === 'open-ended') {
    console.log(`Question: ${oeQuestion.question}`)
    console.log(`Expected Answer: ${oeQuestion.correctAnswer}`)
    console.log(`Keywords: ${oeQuestion.keywords?.join(', ')}`)
    console.log(`Points: ${oeQuestion.points}`)
  }

  return oeQuestion
}

/**
 * สร้าง Quiz พร้อม Custom Options
 */
export const createCustomQuiz = (options: Partial<QuizConversionOptions> = {}) => {
  console.log('\n⚙️ Creating Custom Quiz with options:', options)

  const customQuiz = convertToMixedQuiz(sampleSimpleQuestions, options)

  console.log('\nGenerated Quiz:')
  customQuiz.forEach((q, index) => {
    console.log(`${index + 1}. [${q.type.toUpperCase()}] ${q.question}`)
    if (q.type === 'multiple-choice') {
      q.options.forEach(opt => console.log(`   ${opt.id}. ${opt.text}`))
    } else if (q.type === 'true-false') {
      console.log(`   Answer: ${q.correctAnswer}`)
    } else if (q.type === 'open-ended') {
      console.log(`   Expected: ${q.correctAnswer}`)
    }
    console.log(`   Points: ${q.points}\n`)
  })

  return customQuiz
}

/**
 * สถิติการแปลง
 */
export const analyzeConversionStats = (quiz: ReturnType<typeof convertToMixedQuiz>) => {
  const stats = quiz.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1
    acc.totalPoints += q.points || 0
    return acc
  }, {
    'multiple-choice': 0,
    'true-false': 0,
    'open-ended': 0,
    totalPoints: 0
  } as Record<string, number>)

  console.log('\n📊 Quiz Statistics:')
  console.log(`   Multiple Choice: ${stats['multiple-choice']} questions`)
  console.log(`   True/False: ${stats['true-false']} questions`)
  console.log(`   Open-ended: ${stats['open-ended']} questions`)
  console.log(`   Total Points: ${stats.totalPoints}`)
  console.log(`   Total Questions: ${quiz.length}`)

  return stats
}

/**
 * Integration ตัวอย่างกับ Interactive Quiz Component
 */
export const integrateWithInteractiveQuiz = () => {
  console.log('\n🔗 Integration Example for InteractiveQuiz Component:')

  // สร้าง Quiz ในรูปแบบที่ InteractiveQuiz ต้องการ
  const convertedQuiz = convertToMixedQuiz(sampleSimpleQuestions.slice(0, 4), {
    questionTypes: ['multiple-choice', 'true-false', 'open-ended'],
    distributionMode: 'round-robin',
    pointsDistribution: {
      'multiple-choice': 10,
      'true-false': 5,
      'open-ended': 15
    },
    generateExplanations: true,
    language: 'th'
  })

  // แปลงเป็นรูปแบบที่ InteractiveQuiz component รองรับ
  const quizForComponent = {
    metadata: {
      title: 'Programming Fundamentals Quiz',
      subject: 'Programming',
      difficulty: 'beginner',
      estimatedTime: '10 minutes',
      totalQuestions: convertedQuiz.length,
      passingScore: 70,
      language: 'th'
    },
    content: {
      instructions: 'ทำแบบทดสอบเพื่อประเมินความเข้าใจเกี่ยวกับพื้นฐานการเขียนโปรแกรม',
      questions: convertedQuiz,
      scoring: {
        totalPoints: convertedQuiz.reduce((sum, q) => sum + (q.points || 0), 0),
        passingScore: Math.floor(convertedQuiz.reduce((sum, q) => sum + (q.points || 0), 0) * 0.7),
        timeLimit: 600 // 10 minutes in seconds
      }
    }
  }

  console.log('✅ Quiz ready for InteractiveQuiz component')
  console.log(`   Questions: ${quizForComponent.content.questions.length}`)
  console.log(`   Total Points: ${quizForComponent.content.scoring.totalPoints}`)
  console.log(`   Passing Score: ${quizForComponent.content.scoring.passingScore}`)

  return quizForComponent
}

/**
 * รันการทดสอบทั้งหมด
 */
export const runAllTests = () => {
  console.log('🚀 Running All Quiz Parser Tests...\n')

  const demos = demoQuizConversions()
  const mcTest = testMultipleChoiceGeneration()
  const tfTest = testTrueFalseGeneration()
  const oeTest = testOpenEndedGeneration()

  const customQuiz = createCustomQuiz({
    questionTypes: ['multiple-choice', 'true-false'],
    distributionMode: 'random',
    pointsDistribution: {
      'multiple-choice': 15,
      'true-false': 10,
      'open-ended': 20
    }
  })

  const stats = analyzeConversionStats(customQuiz)
  const integration = integrateWithInteractiveQuiz()

  console.log('\n✅ All tests completed!')

  return {
    demos,
    tests: { mcTest, tfTest, oeTest },
    customQuiz,
    stats,
    integration
  }
}
