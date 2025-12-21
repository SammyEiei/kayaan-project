// Test data สำหรับ Note Interactive Mode
export const noteTestData = {
  // 1. New API Format (with metadata)
  newFormatNote: JSON.stringify({
    type: 'note',
    metadata: {
      title: 'JavaScript ES6 Features Study Notes',
      subject: 'Programming',
      difficulty: 'intermediate',
      estimatedReadTime: '12 minutes',
      wordCount: 850,
      tags: ['JavaScript', 'ES6', 'Study Notes'],
      language: 'th',
      createdAt: new Date().toISOString()
    },
    content: {
      topic: 'JavaScript ES6 Features ที่สำคัญ',
      summary: 'บทสรุปเกี่ยวกับฟีเจอร์ใหม่ใน ES6 ที่นักพัฒนาควรรู้',
      sections: [
        {
          id: 1,
          title: 'Arrow Functions',
          level: 2,
          content: [
            'Arrow functions เป็นวิธีใหม่ในการเขียน function ใน ES6',
            'มี syntax ที่กระชับและมี lexical scope binding',
            'เหมาะสำหรับ callback functions และ functional programming'
          ],
          examples: [
            {
              title: 'Basic Arrow Function',
              code: 'const add = (a, b) => a + b;',
              language: 'javascript'
            }
          ],
          keyPoints: [
            'Syntax กระชับกว่า function แบบเดิม',
            'ไม่มี this binding ของตัวเอง',
            'ไม่สามารถใช้เป็น constructor ได้'
          ]
        },
        {
          id: 2,
          title: 'Template Literals',
          level: 2,
          content: [
            'ใช้ backticks (`) แทน quotes เดิม',
            'รองรับ string interpolation ด้วย ${expression}',
            'สามารถเขียน multiline strings ได้'
          ],
          examples: [
            {
              title: 'String Interpolation',
              code: 'const name = "World"; const greeting = `Hello, ${name}!`;',
              language: 'javascript'
            }
          ]
        }
      ],
      objectives: [
        'เข้าใจ Arrow Functions และการใช้งาน',
        'เรียนรู้ Template Literals สำหรับ string manipulation',
        'ประยุกต์ใช้ ES6 features ในโปรเจ็คจริง'
      ],
      studyTips: [
        'ฝึกเขียน code ตัวอย่างทุกวัน',
        'อ่าน documentation อย่างสม่ำเสมอ',
        'ลองใช้ features ใหม่ในโปรเจ็คเล็กๆ'
      ]
    }
  }),

  // 2. Current API Format (title + content array)
  currentFormatNote: JSON.stringify({
    title: 'Python Programming Basics',
    content: [
      {
        feature: 'Introduction to Python',
        description: 'Python is a high-level, interpreted programming language known for its simplicity and readability.'
      },
      {
        feature: 'Variables and Data Types',
        description: 'Python supports various data types such as integers, floats, strings, lists, tuples, and dictionaries. Variables are dynamically typed.'
      },
      {
        feature: 'Control Structures',
        description: 'Python uses if-elif-else statements for decision-making, loops like for and while for iteration, and supports break and continue statements.'
      }
    ]
  }),

  // 3. Simple Text Format (should parse as markdown)
  textFormatNote: `# Python Programming Guide

## Introduction
Python is a versatile programming language that's great for beginners.

### Key Features
- Easy to learn syntax
- Powerful libraries
- Cross-platform compatibility

## Variables
Variables in Python are created by assignment:
\`\`\`python
name = "Alice"
age = 25
\`\`\`

## Data Types
Python has several built-in data types:
- int: whole numbers
- float: decimal numbers
- str: text strings
- bool: True/False values`,

  // 4. Invalid Format (should fail validation)
  invalidFormatNote: JSON.stringify({
    randomField: 'This is not a valid note format',
    anotherField: 'No title or content fields'
  }),

  // 5. Empty Note
  emptyNote: '',

  // 6. Malformed JSON
  malformedNote: '{ "title": "Test", "content": [ incomplete json',
}

// Test function สำหรับ debugging
export const testNoteValidation = () => {
  console.log('🧪 Testing Note Validation and Parsing...\n')

  const testCases = [
    { name: 'New Format Note', data: noteTestData.newFormatNote },
    { name: 'Current Format Note', data: noteTestData.currentFormatNote },
    { name: 'Text Format Note', data: noteTestData.textFormatNote },
    { name: 'Invalid Format Note', data: noteTestData.invalidFormatNote },
    { name: 'Empty Note', data: noteTestData.emptyNote },
    { name: 'Malformed Note', data: noteTestData.malformedNote }
  ]

  testCases.forEach(({ name, data }) => {
    console.log(`\n📝 Testing: ${name}`)
    console.log(`Data length: ${data.length} characters`)

    // Test JSON parsing
    try {
      const parsed = JSON.parse(data)
      console.log('✅ JSON Parse: Success')
      console.log(`Keys: ${Object.keys(parsed).join(', ')}`)

      // Test validation logic
      if (parsed.metadata && parsed.content?.sections) {
        console.log('✅ Format: New API Format detected')
      } else if (parsed.title && Array.isArray(parsed.content)) {
        console.log('✅ Format: Current API Format detected')
      } else {
        console.log('❌ Format: Unknown JSON structure')
      }
    } catch (error) {
      console.log('❌ JSON Parse: Failed')
      if (data.includes('#')) {
        console.log('📄 Might be markdown format')
      }
    }
  })
}

// Mock data สำหรับ InteractiveNote component
export const createMockNoteContent = (type: 'new' | 'current' | 'text' = 'current'): any => {
  switch (type) {
    case 'new':
      return {
        id: 1,
        title: 'JavaScript ES6 Features Study Notes',
        content: noteTestData.newFormatNote,
        outputFormat: 'note',
        requestId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

    case 'current':
      return {
        id: 2,
        title: 'Python Programming Basics',
        content: noteTestData.currentFormatNote,
        outputFormat: 'note',
        requestId: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

    case 'text':
      return {
        id: 3,
        title: 'Python Programming Guide',
        content: noteTestData.textFormatNote,
        outputFormat: 'note',
        requestId: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

    default:
      return createMockNoteContent('current')
  }
}
