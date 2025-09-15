/**
 * Test script สำหรับ debug note content issue
 * ใช้สำหรับทดสอบการเรียก API และการ parse JSON content
 */

// Test data สำหรับ note content
const testNoteContent = {
  type: "note",
  content: [
    {
      feature: "Example",
      description: "ExampleExample\nExample\nExampleExampleExampleExampleExampleExampleExample"
    }
  ]
}

const testNoteRequest = {
  contentTitle: "Example",
  contentType: "note",
  contentData: JSON.stringify(testNoteContent),
  subject: "Example",
  difficulty: "medium",
  tags: ["Example"]
}

console.log('🧪 Test Note Content Debug Script')
console.log('📋 Test note content:', testNoteContent)
console.log('📋 Test note request:', testNoteRequest)

// Test functions
async function testCreateNote() {
  try {
    console.log('🚀 Testing note creation...')

    const response = await fetch('http://localhost:8080/api/content/manual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // ใส่ token จริง
      },
      body: JSON.stringify(testNoteRequest)
    })

    const result = await response.json()
    console.log('✅ Note creation result:', result)
    return result
  } catch (error) {
    console.error('❌ Note creation failed:', error)
    return null
  }
}

async function testGetUnifiedContent() {
  try {
    console.log('🚀 Testing unified content API...')

    const response = await fetch('http://localhost:8080/api/content/user?contentType=note&source=manual', {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // ใส่ token จริง
      }
    })

    const result = await response.json()
    console.log('✅ Unified content result:', result)
    return result
  } catch (error) {
    console.error('❌ Unified content fetch failed:', error)
    return null
  }
}

async function testGetManualContent() {
  try {
    console.log('🚀 Testing manual content API...')

    const response = await fetch('http://localhost:8080/api/content/manual', {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // ใส่ token จริง
      }
    })

    const result = await response.json()
    console.log('✅ Manual content result:', result)
    return result
  } catch (error) {
    console.error('❌ Manual content fetch failed:', error)
    return null
  }
}

async function testDebugNotes() {
  try {
    console.log('🚀 Testing debug notes API...')

    const response = await fetch('http://localhost:8080/api/content/debug/notes', {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // ใส่ token จริง
      }
    })

    const result = await response.json()
    console.log('✅ Debug notes result:', result)
    return result
  } catch (error) {
    console.error('❌ Debug notes fetch failed:', error)
    return null
  }
}

// Main test function
async function runTests() {
  console.log('🧪 === STARTING NOTE CONTENT DEBUG TESTS ===')

  // Test 1: Create note
  console.log('\n📝 Test 1: Create Note')
  const createResult = await testCreateNote()

  // Test 2: Get unified content
  console.log('\n📝 Test 2: Get Unified Content')
  const unifiedResult = await testGetUnifiedContent()

  // Test 3: Get manual content
  console.log('\n📝 Test 3: Get Manual Content')
  const manualResult = await testGetManualContent()

  // Test 4: Debug notes
  console.log('\n📝 Test 4: Debug Notes')
  const debugResult = await testDebugNotes()

  // Summary
  console.log('\n📊 === TEST SUMMARY ===')
  console.log('Create Note:', createResult ? '✅ Success' : '❌ Failed')
  console.log('Unified Content:', unifiedResult ? '✅ Success' : '❌ Failed')
  console.log('Manual Content:', manualResult ? '✅ Success' : '❌ Failed')
  console.log('Debug Notes:', debugResult ? '✅ Success' : '❌ Failed')

  // Analyze results
  if (unifiedResult && unifiedResult.content) {
    console.log('\n🔍 === UNIFIED CONTENT ANALYSIS ===')
    console.log('Total content items:', unifiedResult.content.length)

    const notes = unifiedResult.content.filter(item => item.contentType === 'note')
    console.log('Note items:', notes.length)

    notes.forEach((note, index) => {
      console.log(`Note ${index + 1}:`, {
        id: note.id,
        title: note.title,
        contentType: note.contentType,
        contentLength: note.content?.length || 0,
        contentPreview: note.content?.substring(0, 100) + '...'
      })

      // Try to parse content
      try {
        const parsedContent = JSON.parse(note.content)
        console.log(`  Parsed content:`, parsedContent)
      } catch (parseError) {
        console.log(`  Parse error:`, parseError.message)
      }
    })
  }

  if (manualResult && Array.isArray(manualResult)) {
    console.log('\n🔍 === MANUAL CONTENT ANALYSIS ===')
    console.log('Total manual content items:', manualResult.length)

    const notes = manualResult.filter(item => item.contentType === 'note')
    console.log('Note items:', notes.length)

    notes.forEach((note, index) => {
      console.log(`Note ${index + 1}:`, {
        id: note.id,
        contentTitle: note.contentTitle,
        contentType: note.contentType,
        contentDataLength: note.contentData?.length || 0,
        contentDataPreview: note.contentData?.substring(0, 100) + '...'
      })

      // Try to parse contentData
      try {
        const parsedContent = JSON.parse(note.contentData)
        console.log(`  Parsed contentData:`, parsedContent)
      } catch (parseError) {
        console.log(`  Parse error:`, parseError.message)
      }
    })
  }
}

// Export functions for use in browser console
if (typeof window !== 'undefined') {
  window.testNoteContent = {
    testCreateNote,
    testGetUnifiedContent,
    testGetManualContent,
    testDebugNotes,
    runTests,
    testNoteContent,
    testNoteRequest
  }
  console.log('🔧 Test functions available in window.testNoteContent')
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  runTests()
}
