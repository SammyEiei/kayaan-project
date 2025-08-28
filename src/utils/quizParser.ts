// Quiz Parser Utility for Frontend Format Conversion
// แปลง Simple Format จาก AI เป็น 3 รูปแบบคำถาม

export interface SimpleQuestion {
  question: string
  answer: string
  context?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export interface MultipleChoiceQuestion {
  id: number
  type: 'multiple-choice'
  question: string
  options: Array<{
    id: string
    text: string
    correct: boolean
  }>
  correctAnswer: string
  explanation?: string
  points?: number
}

export interface TrueFalseQuestion {
  id: number
  type: 'true-false'
  question: string
  correctAnswer: boolean
  explanation?: string
  points?: number
}

export interface OpenEndedQuestion {
  id: number
  type: 'open-ended'
  question: string
  correctAnswer: string
  keywords?: string[]
  explanation?: string
  points?: number
}

export type ConvertedQuestion = MultipleChoiceQuestion | TrueFalseQuestion | OpenEndedQuestion

export interface QuizConversionOptions {
  questionTypes?: Array<'multiple-choice' | 'true-false' | 'open-ended'>
  distributionMode?: 'round-robin' | 'random' | 'weighted'
  pointsDistribution?: {
    'multiple-choice': number
    'true-false': number
    'open-ended': number
  }
  generateExplanations?: boolean
  language?: 'th' | 'en'
}

// Default options
const DEFAULT_OPTIONS: QuizConversionOptions = {
  questionTypes: ['multiple-choice', 'true-false', 'open-ended'],
  distributionMode: 'round-robin',
  pointsDistribution: {
    'multiple-choice': 10,
    'true-false': 5,
    'open-ended': 15
  },
  generateExplanations: true,
  language: 'th'
}

/**
 * สร้างตัวเลือกสำหรับคำถาม Multiple Choice
 */
const generateOptions = (correctAnswer: string, question: string, language: string = 'th'): Array<{id: string, text: string, correct: boolean}> => {
  const options = [
    { id: 'A', text: correctAnswer, correct: true }
  ]

  // สร้างตัวเลือกผิดตาม context ของคำถาม
  const wrongOptions = generateWrongOptions(correctAnswer, question, language)

  wrongOptions.forEach((option, index) => {
    options.push({
      id: String.fromCharCode(66 + index), // B, C, D
      text: option,
      correct: false
    })
  })

  // สลับตำแหน่งตัวเลือก
  return shuffleArray(options)
}

/**
 * สร้างตัวเลือกผิดที่สมเหตุสมผล
 */
const generateWrongOptions = (correctAnswer: string, question: string, language: string): string[] => {
  const isThaiLanguage = language === 'th'

  // ตรวจสอบประเภทคำตอบ
  if (isNumber(correctAnswer)) {
    return generateNumericWrongOptions(correctAnswer)
  }

  if (isYearOrDate(correctAnswer)) {
    return generateDateWrongOptions(correctAnswer)
  }

  if (isPersonName(correctAnswer)) {
    return generatePersonWrongOptions(correctAnswer, isThaiLanguage)
  }

  if (isConceptOrDefinition(question)) {
    return generateConceptWrongOptions(correctAnswer, question, isThaiLanguage)
  }

  // Default: สร้างตัวเลือกทั่วไป
  return generateGenericWrongOptions(correctAnswer, isThaiLanguage)
}

/**
 * สร้างตัวเลือกผิดสำหรับตัวเลข
 */
const generateNumericWrongOptions = (correctAnswer: string): string[] => {
  const num = parseFloat(correctAnswer)
  if (isNaN(num)) return []

  return [
    (num + Math.random() * 10).toFixed(num % 1 === 0 ? 0 : 1),
    (num - Math.random() * 10).toFixed(num % 1 === 0 ? 0 : 1),
    (num * 1.5).toFixed(num % 1 === 0 ? 0 : 1)
  ].filter(option => option !== correctAnswer)
}

/**
 * สร้างตัวเลือกผิดสำหรับปี/วันที่
 */
const generateDateWrongOptions = (correctAnswer: string): string[] => {
  const yearMatch = correctAnswer.match(/(\d{4})/)
  if (yearMatch) {
    const year = parseInt(yearMatch[1])
    return [
      correctAnswer.replace(yearMatch[1], (year + 1).toString()),
      correctAnswer.replace(yearMatch[1], (year - 1).toString()),
      correctAnswer.replace(yearMatch[1], (year + 5).toString())
    ]
  }
  return []
}

/**
 * สร้างตัวเลือกผิดสำหรับชื่อบุคคล
 */
const generatePersonWrongOptions = (correctAnswer: string, isThaiLanguage: boolean): string[] => {
  if (isThaiLanguage) {
    return [
      'สมเด็จพระนเรศวรมหาราช',
      'สมเด็จพระรามาธิบดีที่ 1',
      'พระเจ้าตากสินมหาราช'
    ].filter(option => option !== correctAnswer)
  } else {
    return [
      'Albert Einstein',
      'Isaac Newton',
      'Charles Darwin'
    ].filter(option => option !== correctAnswer)
  }
}

/**
 * สร้างตัวเลือกผิดสำหรับแนวคิด/คำจำกัดความ
 */
const generateConceptWrongOptions = (correctAnswer: string, question: string, isThaiLanguage: boolean): string[] => {
  // วิเคราะห์คำถามเพื่อสร้างตัวเลือกที่เกี่ยวข้อง
  const questionLower = question.toLowerCase()

  if (questionLower.includes('programming') || questionLower.includes('โปรแกรม')) {
    return isThaiLanguage ?
      ['ภาษาที่ใช้ในการออกแบบเว็บไซต์', 'เครื่องมือสำหรับจัดการฐานข้อมูล', 'ระบบปฏิบัติการคอมพิวเตอร์'] :
      ['A web design language', 'A database management tool', 'A computer operating system']
  }

  if (questionLower.includes('history') || questionLower.includes('ประวัติศาสตร์')) {
    return isThaiLanguage ?
      ['เหตุการณ์ทางการเมือง', 'การเปลี่ยนแปลงทางวัฒนธรรม', 'ความก้าวหน้าทางเทคโนโลยี'] :
      ['A political event', 'A cultural change', 'A technological advancement']
  }

  return generateGenericWrongOptions(correctAnswer, isThaiLanguage)
}

/**
 * สร้างตัวเลือกผิดทั่วไป
 */
const generateGenericWrongOptions = (correctAnswer: string, isThaiLanguage: boolean): string[] => {
  const prefixes = isThaiLanguage ?
    ['การ', 'ระบบ', 'วิธี', 'กระบวนการ'] :
    ['A method of', 'A system for', 'A process of', 'A technique for']

  const suffixes = isThaiLanguage ?
    ['ที่มีประสิทธิภาพ', 'ในยุคปัจจุบัน', 'ที่ได้รับความนิยม'] :
    ['that is efficient', 'in modern times', 'that is popular']

  return [
    `${prefixes[0]} ${correctAnswer.toLowerCase()} ${suffixes[0]}`,
    `${prefixes[1]} ${correctAnswer.toLowerCase()} ${suffixes[1]}`,
    `${prefixes[2]} ${correctAnswer.toLowerCase()} ${suffixes[2]}`
  ]
}

/**
 * แปลงเป็นคำถาม True/False
 */
const convertToTrueFalse = (question: SimpleQuestion, id: number, options: QuizConversionOptions): TrueFalseQuestion => {
  const isThaiLanguage = options.language === 'th'
  const points = options.pointsDistribution?.['true-false'] || 5

  // สร้างคำถามแบบจริง/เท็จ
  let tfQuestion = question.question
  let correctAnswer = true

  // สุ่มว่าจะเป็นคำถามจริงหรือเท็จ
  const shouldBeTrue = Math.random() > 0.5

  if (!shouldBeTrue) {
    // สร้างคำถามเท็จโดยการเปลี่ยนคำตอบ
    tfQuestion = generateFalseStatement(question.question, question.answer, isThaiLanguage)
    correctAnswer = false
  }

  return {
    id,
    type: 'true-false',
    question: tfQuestion,
    correctAnswer,
    explanation: options.generateExplanations ?
      generateTrueFalseExplanation(question.answer, correctAnswer, isThaiLanguage) :
      undefined,
    points
  }
}

/**
 * สร้างข้อความเท็จ
 */
const generateFalseStatement = (question: string, correctAnswer: string, isThaiLanguage: boolean): string => {
  // เปลี่ยนคำตอบในคำถามให้เป็นข้อมูลผิด
  const wrongAnswer = generateWrongOptions(correctAnswer, question, isThaiLanguage ? 'th' : 'en')[0]

  if (wrongAnswer) {
    return question.replace(/\?/g, isThaiLanguage ?
      ` คือ ${wrongAnswer}` :
      ` is ${wrongAnswer}`)
  }

  return question
}

/**
 * สร้างคำอธิบายสำหรับ True/False
 */
const generateTrueFalseExplanation = (correctAnswer: string, isTrue: boolean, isThaiLanguage: boolean): string => {
  if (isThaiLanguage) {
    return isTrue ?
      `ถูกต้อง เพราะ ${correctAnswer}` :
      `ผิด คำตอบที่ถูกต้องคือ ${correctAnswer}`
  } else {
    return isTrue ?
      `Correct, because ${correctAnswer}` :
      `False, the correct answer is ${correctAnswer}`
  }
}

/**
 * หลักฟังก์ชันแปลง Simple Format เป็น Mixed Quiz
 */
export const convertToMixedQuiz = (
  simpleQuestions: SimpleQuestion[],
  options: Partial<QuizConversionOptions> = {}
): ConvertedQuestion[] => {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options }
  const questionTypes = finalOptions.questionTypes!

  return simpleQuestions.map((q, index) => {
    let questionType: string

    // เลือกประเภทคำถามตาม distribution mode
    if (finalOptions.distributionMode === 'round-robin') {
      questionType = questionTypes[index % questionTypes.length]
    } else if (finalOptions.distributionMode === 'random') {
      questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)]
    } else {
      // weighted distribution
      questionType = getWeightedQuestionType(questionTypes)
    }

    const questionId = index + 1

    switch (questionType) {
      case 'multiple-choice':
        return {
          id: questionId,
          type: 'multiple-choice' as const,
          question: q.question,
          options: generateOptions(q.answer, q.question, finalOptions.language || 'th'),
          correctAnswer: q.answer,
          explanation: finalOptions.generateExplanations ? q.context || q.answer : undefined,
          points: finalOptions.pointsDistribution?.['multiple-choice'] || 10
        }

      case 'true-false':
        return convertToTrueFalse(q, questionId, finalOptions)

      case 'open-ended':
        return {
          id: questionId,
          type: 'open-ended' as const,
          question: finalOptions.language === 'th' ?
            `อธิบาย: ${q.question}` :
            `Explain: ${q.question}`,
          correctAnswer: q.answer,
          keywords: extractKeywords(q.answer),
          explanation: finalOptions.generateExplanations ? q.context : undefined,
          points: finalOptions.pointsDistribution?.['open-ended'] || 15
        }

      default:
        throw new Error(`Unsupported question type: ${questionType}`)
    }
  })
}

// Helper functions
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const isNumber = (str: string): boolean => !isNaN(parseFloat(str))
const isYearOrDate = (str: string): boolean => /\d{4}/.test(str)
const isPersonName = (str: string): boolean => /^[A-ZÀ-ÿ][a-zà-ÿ]+ [A-ZÀ-ÿ][a-zà-ÿ]+/.test(str) || /^[ก-๙\s]+$/.test(str)
const isConceptOrDefinition = (question: string): boolean =>
  question.includes('คือ') || question.includes('หมายถึง') ||
  question.includes('is') || question.includes('means')

const getWeightedQuestionType = (types: string[]): string => {
  // Default equal weight
  return types[Math.floor(Math.random() * types.length)]
}

const extractKeywords = (answer: string): string[] => {
  // Simple keyword extraction
  return answer.split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 5)
}

/**
 * ตัวอย่างการใช้งาน
 */
export const exampleUsage = () => {
  const simpleQuestions: SimpleQuestion[] = [
    {
      question: "Python เป็นภาษาโปรแกรมมิ่งประเภทใด?",
      answer: "Interpreted language",
      context: "Python ทำงานผ่าน interpreter ไม่ต้อง compile ก่อน"
    },
    {
      question: "HTML ย่อมาจากอะไร?",
      answer: "HyperText Markup Language"
    }
  ]

  const mixedQuiz = convertToMixedQuiz(simpleQuestions, {
    questionTypes: ['multiple-choice', 'true-false', 'open-ended'],
    distributionMode: 'round-robin',
    language: 'th'
  })

  return mixedQuiz
}
