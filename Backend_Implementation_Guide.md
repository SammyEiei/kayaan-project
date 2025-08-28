# Backend Implementation Guide
## OpenAI API Integration for AI Content Generation

เอกสารนี้เป็น guide สำหรับ Backend team ในการ implement OpenAI API integration และ JSON response formatting

---

## 🔧 1. API Endpoint Structure

### Request Format
```http
POST /api/ai/generation/content
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "prompt": "สร้างเนื้อหาเกี่ยวกับ React Hooks สำหรับผู้เริ่มต้น",
  "outputFormat": "note|quiz|flashcard|summary",
  "language": "th|en",
  "difficulty": "easy|intermediate|advanced",
  "additionalParams": {
    "includeExamples": true,
    "includeCodeSnippets": true,
    "questionCount": 5, // สำหรับ quiz
    "cardCount": 10     // สำหรับ flashcard
  }
}
```

### Response Format
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Content generated successfully",
  "data": {
    // JSON structure ตาม content type
  },
  "meta": {
    "requestId": "req_123456",
    "processingTime": "2.5s",
    "tokensUsed": 1500,
    "model": "gpt-4",
    "contentType": "note",
    "generationParams": {
      "prompt": "สร้างเนื้อหาเกี่ยวกับ React Hooks สำหรับผู้เริ่มต้น",
      "outputFormat": "note",
      "language": "th",
      "difficulty": "intermediate"
    }
  }
}
```

---

## 🤖 2. OpenAI Prompt Engineering

### Base System Prompt
```
คุณเป็น AI Assistant ที่เชี่ยวชาญในการสร้างเนื้อหาการศึกษา
ให้สร้างเนื้อหาที่มีคุณภาพสูง เข้าใจง่าย และเหมาะสมกับระดับความยาก

กฎการสร้างเนื้อหา:
1. ใช้ภาษาที่เข้าใจง่าย เหมาะสมกับกลุมเป้าหมาย
2. ให้ตัวอย่างที่เป็นประโยชน์และเกี่ยวข้อง
3. จัดโครงสร้างเนื้อหาให้ชัดเจน
4. ตรวจสอบความถูกต้องของข้อมูล
5. สร้างเนื้อหาที่น่าสนใจและมีประโยชน์

ตอบกลับในรูปแบบ JSON เท่านั้น ตามโครงสร้างที่กำหนด
```

### Content Type Specific Prompts

#### สำหรับ Note Content
```
สร้าง study notes ในรูปแบบ JSON ตามโครงสร้างดังนี้:
{
  "type": "note",
  "metadata": {
    "title": "หัวข้อหลัก",
    "subject": "หมวดหมู่วิชา",
    "difficulty": "ระดับความยาก",
    "estimatedReadTime": "เวลาอ่าน",
    "tags": ["tag1", "tag2"],
    "language": "ภาษา",
    "createdAt": "timestamp"
  },
  "content": {
    "topic": "หัวข้อหลัก",
    "summary": "บทสรุปสั้นๆ",
    "sections": [
      {
        "id": 1,
        "title": "หัวข้อย่อย",
        "level": 2,
        "content": ["ข้อความ1", "ข้อความ2"],
        "examples": [{"title": "ชื่อตัวอย่าง", "code": "code snippet", "language": "programming language"}],
        "keyPoints": ["จุดสำคัญ1", "จุดสำคัญ2"]
      }
    ],
    "conclusion": "บทสรุป",
    "references": [{"title": "ชื่ออ้างอิง", "url": "URL"}]
  }
}

ข้อกำหนด:
- sections ต้องมีอย่างน้อย 3 หัวข้อ
- แต่ละ section ต้องมี content ที่มีประโยชน์
- ถ้ามี code ให้ใส่ examples ด้วย
- keyPoints ต้องสรุปประเด็นสำคัญของแต่ละ section
```

#### สำหรับ Quiz Content
```
สร้าง interactive quiz ในรูปแบบ JSON ตามโครงสร้างนี้:
{
  "type": "quiz",
  "metadata": {
    "title": "ชื่อ quiz",
    "totalQuestions": จำนวนคำถาม,
    "passingScore": 70,
    // ... metadata อื่นๆ
  },
  "content": {
    "instructions": "คำแนะนำการทำ quiz",
    "questions": [
      {
        "id": 1,
        "type": "multiple-choice|true-false|short-answer|essay",
        "question": "คำถาม",
        "points": คะแนน,
        "options": [{"id": "A", "text": "ตัวเลือก", "correct": true/false}], // สำหรับ multiple-choice
        "answer": true/false, // สำหรับ true-false
        "sampleAnswer": "คำตอบตัวอย่าง", // สำหรับ short-answer/essay
        "explanation": "คำอธิบาย",
        "hints": ["คำใบ้1", "คำใบ้2"]
      }
    ],
    "feedback": {
      "excellent": {"message": "ข้อความชื่นชม", "minScore": 90},
      "good": {"message": "ข้อความดี", "minScore": 70},
      "needsImprovement": {"message": "ข้อความแนะนำ", "minScore": 0}
    }
  }
}

ข้อกำหนด:
- สร้างคำถามหลากหลายประเภท
- คำถาม multiple-choice ต้องมี 4 ตัวเลือก
- ทุกคำถามต้องมี explanation
- คำถามต้องครอบคลุมเนื้อหาที่สำคัญ
```

#### สำหรับ Flashcard Content
```
สร้าง flashcard set ในรูปแบบ JSON ตามโครงสร้างนี้:
{
  "type": "flashcard",
  "metadata": {
    "title": "ชื่อชุด flashcard",
    "totalCards": จำนวนการ์ด,
    // ... metadata อื่นๆ
  },
  "content": {
    "description": "คำอธิบายชุดการ์ด",
    "categories": [{"id": "category1", "name": "ชื่อหมวด", "description": "คำอธิบาย", "color": "#hex"}],
    "cards": [
      {
        "id": 1,
        "categoryId": "category1",
        "difficulty": "easy|medium|hard",
        "front": {
          "text": "ด้านหน้าการ์ด",
          "type": "text",
          "additionalInfo": "ข้อมูลเพิ่มเติม"
        },
        "back": {
          "text": "ด้านหลังการ์ด",
          "type": "text",
          "details": ["รายละเอียด1", "รายละเอียด2"],
          "example": {"title": "ตัวอย่าง", "code": "code", "language": "lang"}
        },
        "tags": ["tag1", "tag2"],
        "studyNotes": "หมายเหตุการศึกษา"
      }
    ],
    "studyModes": [
      {"id": "learn", "name": "Learn Mode", "description": "คำอธิบาย"},
      {"id": "test", "name": "Test Mode", "description": "คำอธิบาย"}
    ]
  }
}

ข้อกำหนด:
- การ์ดต้องมีข้อมูลที่กระชับและชัดเจน
- ด้านหน้าต้องเป็นคำถามหรือคำศัพท์
- ด้านหลังต้องเป็นคำตอบหรือความหมาย
- จัดกลุ่มการ์ดด้วย categories
- ให้ study notes สำหรับการจำ
```

---

## 💻 3. Implementation Code Examples

### Node.js + Express Implementation
```javascript
const express = require('express');
const { OpenAI } = require('openai');
const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Content generation endpoint
app.post('/api/ai/generation/content', async (req, res) => {
  try {
    const { prompt, outputFormat, language, difficulty, additionalParams } = req.body;
    
    // Validate input
    const validFormats = ['note', 'quiz', 'flashcard', 'summary'];
    if (!validFormats.includes(outputFormat)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid output format'
      });
    }

    // Build system prompt based on content type
    const systemPrompt = buildSystemPrompt(outputFormat, language, difficulty);
    
    // Build user prompt
    const userPrompt = buildUserPrompt(prompt, outputFormat, additionalParams);

    // Call OpenAI API
    const startTime = Date.now();
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const processingTime = `${(Date.now() - startTime) / 1000}s`;
    
    // Parse and validate JSON response
    const content = JSON.parse(completion.choices[0].message.content);
    
    // Add metadata if missing
    if (!content.metadata) {
      content.metadata = generateMetadata(prompt, outputFormat, language, difficulty);
    }

    // Validate content structure
    const validationResult = validateContentStructure(content, outputFormat);
    if (!validationResult.valid) {
      throw new Error(`Invalid content structure: ${validationResult.error}`);
    }

    // Return response
    res.json({
      success: true,
      message: "Content generated successfully",
      data: content,
      meta: {
        requestId: generateRequestId(),
        processingTime,
        tokensUsed: completion.usage.total_tokens,
        model: "gpt-4",
        contentType: outputFormat,
        generationParams: {
          prompt,
          outputFormat,
          language,
          difficulty
        }
      }
    });

  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({
      success: false,
      message: "Content generation failed",
      error: error.message
    });
  }
});

// Helper functions
function buildSystemPrompt(outputFormat, language, difficulty) {
  const basePrompt = `คุณเป็น AI Assistant ที่เชี่ยวชาญในการสร้างเนื้อหาการศึกษา...`;
  
  // Add format-specific instructions
  const formatPrompts = {
    note: `สร้าง study notes ในรูปแบบ JSON...`,
    quiz: `สร้าง interactive quiz ในรูปแบบ JSON...`,
    flashcard: `สร้าง flashcard set ในรูปแบบ JSON...`,
    summary: `สร้าง summary ในรูปแบบ JSON...`
  };

  return `${basePrompt}\n\n${formatPrompts[outputFormat]}`;
}

function buildUserPrompt(prompt, outputFormat, additionalParams) {
  let userPrompt = `สร้าง${outputFormat}เกี่ยวกับ: ${prompt}`;
  
  if (additionalParams?.includeExamples) {
    userPrompt += '\nรวมตัวอย่างการใช้งาน';
  }
  
  if (additionalParams?.includeCodeSnippets) {
    userPrompt += '\nรวม code examples';
  }
  
  if (outputFormat === 'quiz' && additionalParams?.questionCount) {
    userPrompt += `\nสร้าง ${additionalParams.questionCount} คำถาม`;
  }
  
  if (outputFormat === 'flashcard' && additionalParams?.cardCount) {
    userPrompt += `\nสร้าง ${additionalParams.cardCount} การ์ด`;
  }

  return userPrompt;
}

function generateMetadata(prompt, outputFormat, language, difficulty) {
  return {
    title: generateTitle(prompt),
    subject: detectSubject(prompt),
    difficulty,
    estimatedTime: estimateTime(outputFormat),
    tags: extractTags(prompt),
    language,
    createdAt: new Date().toISOString(),
    version: "1.0",
    author: {
      name: "AI Assistant",
      type: "ai"
    }
  };
}

function validateContentStructure(content, outputFormat) {
  // Implement validation logic for each content type
  const validators = {
    note: validateNoteStructure,
    quiz: validateQuizStructure,
    flashcard: validateFlashcardStructure,
    summary: validateSummaryStructure
  };

  return validators[outputFormat](content);
}

// Export for testing
module.exports = { app };
```

### Content Structure Validators
```javascript
function validateNoteStructure(content) {
  if (!content.type || content.type !== 'note') {
    return { valid: false, error: 'Invalid type' };
  }
  
  if (!content.metadata || !content.metadata.title) {
    return { valid: false, error: 'Missing metadata.title' };
  }
  
  if (!content.content || !content.content.topic) {
    return { valid: false, error: 'Missing content.topic' };
  }
  
  if (!content.content.sections || !Array.isArray(content.content.sections)) {
    return { valid: false, error: 'Missing or invalid content.sections' };
  }
  
  if (content.content.sections.length < 2) {
    return { valid: false, error: 'Must have at least 2 sections' };
  }

  return { valid: true };
}

function validateQuizStructure(content) {
  if (!content.type || content.type !== 'quiz') {
    return { valid: false, error: 'Invalid type' };
  }
  
  if (!content.content.questions || !Array.isArray(content.content.questions)) {
    return { valid: false, error: 'Missing or invalid questions array' };
  }
  
  if (content.content.questions.length === 0) {
    return { valid: false, error: 'Must have at least 1 question' };
  }

  // Validate each question
  for (const question of content.content.questions) {
    if (!question.question || !question.type) {
      return { valid: false, error: 'Invalid question structure' };
    }
    
    if (question.type === 'multiple-choice' && (!question.options || question.options.length < 2)) {
      return { valid: false, error: 'Multiple choice must have at least 2 options' };
    }
  }

  return { valid: true };
}

function validateFlashcardStructure(content) {
  if (!content.type || content.type !== 'flashcard') {
    return { valid: false, error: 'Invalid type' };
  }
  
  if (!content.content.cards || !Array.isArray(content.content.cards)) {
    return { valid: false, error: 'Missing or invalid cards array' };
  }
  
  if (content.content.cards.length === 0) {
    return { valid: false, error: 'Must have at least 1 card' };
  }

  // Validate each card
  for (const card of content.content.cards) {
    if (!card.front || !card.back) {
      return { valid: false, error: 'Card must have both front and back' };
    }
  }

  return { valid: true };
}
```

---

## 🛡️ 4. Error Handling & Edge Cases

### Common Error Scenarios
1. **OpenAI API Errors**
   - Rate limiting
   - Token limit exceeded
   - Invalid API key
   - Service unavailable

2. **Content Validation Errors**
   - Invalid JSON format
   - Missing required fields
   - Content inappropriate

3. **Processing Errors**
   - Timeout
   - Memory issues
   - Network errors

### Error Response Format
```javascript
{
  "success": false,
  "message": "Error description",
  "errorCode": "ERROR_CODE",
  "details": {
    "type": "validation_error|api_error|processing_error",
    "field": "specific field if applicable",
    "suggestion": "How to fix the error"
  },
  "meta": {
    "requestId": "req_123456",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## 📊 5. Quality Assurance

### Content Quality Checks
1. **Structure Validation**: ตรวจสอบ JSON structure
2. **Content Appropriateness**: กรอง inappropriate content
3. **Language Consistency**: ตรวจสอบภาษาตรงตาม request
4. **Educational Value**: ประเมินคุณภาพเนื้อหา

### Performance Optimization
1. **Caching**: Cache frequent requests
2. **Rate Limiting**: ป้องกัน abuse
3. **Token Management**: ติดตาม token usage
4. **Response Compression**: ลดขนาด response

---

## 🧪 6. Testing Strategy

### Unit Tests
```javascript
describe('Content Generation API', () => {
  test('should generate valid note content', async () => {
    const response = await request(app)
      .post('/api/ai/generation/content')
      .send({
        prompt: 'React Hooks basics',
        outputFormat: 'note',
        language: 'th',
        difficulty: 'intermediate'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.type).toBe('note');
    expect(response.body.data.content.sections.length).toBeGreaterThan(1);
  });
});
```

### Integration Tests
- Test OpenAI API integration
- Test complete flow from request to response
- Test error scenarios

### Performance Tests
- Load testing with concurrent requests
- Memory usage monitoring
- Response time benchmarks

---

## 📈 7. Monitoring & Analytics

### Metrics to Track
1. **Usage Metrics**
   - Requests per hour/day
   - Content type distribution
   - Success rate

2. **Performance Metrics**
   - Average response time
   - Token usage
   - Error rates

3. **Quality Metrics**
   - Content validation success rate
   - User feedback scores
   - Content engagement

### Logging Strategy
```javascript
const logger = {
  info: (message, metadata) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      metadata,
      timestamp: new Date().toISOString()
    }));
  },
  error: (message, error, metadata) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error.message,
      stack: error.stack,
      metadata,
      timestamp: new Date().toISOString()
    }));
  }
};
```

---

## 🚀 8. Deployment Checklist

### Environment Variables
```bash
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
RATE_LIMIT_WINDOW=3600000  # 1 hour in ms
RATE_LIMIT_MAX=100         # max requests per window
```

### Security Considerations
1. **API Key Security**: ใช้ environment variables
2. **Input Validation**: validate ทุก input parameter
3. **Rate Limiting**: ป้องกัน abuse
4. **CORS Configuration**: กำหนด allowed origins
5. **Request Size Limits**: จำกัดขนาด request

### Production Deployment
1. Set up monitoring and alerting
2. Configure load balancing
3. Set up backup and recovery
4. Implement health checks
5. Set up log aggregation

---

Documentation นี้ครอบคลุมทุกด้านของการ implement OpenAI integration สำหรับ AI content generation ที่จะทำงานร่วมกับ Frontend UI ได้อย่างสมบูรณ์!
