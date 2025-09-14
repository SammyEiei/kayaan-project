<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { GroupResource } from '@/types/group'

interface Props {
  resource: GroupResource
  groupId: string
}

const props = defineProps<Props>()
const router = useRouter()


// Debug: Log resource data when component mounts
console.log('🔍 ResourceCard mounted with resource:', props.resource)

// Computed property to determine the correct resource type for display
const displayResourceType = computed(() => {
  // Use contentType from Backend for Interactive Content
  if (props.resource.contentType &&
      ['flashcard', 'quiz', 'note'].includes(props.resource.contentType) &&
      props.resource.contentData &&
      props.resource.contentData !== '0' &&
      props.resource.contentData !== 'null') {
    return props.resource.contentType
  }

  // Fallback to resource.type for Regular Files
  return props.resource.type
})



// ฟังก์ชันใหม่ที่สอดคล้องกับ My Content card
const getTypeColor = (type: string) => {
  const colors = {
    quiz: 'bg-green-100 text-green-700',
    flashcard: 'bg-purple-100 text-purple-700',
    note: 'bg-orange-100 text-orange-700',
    file: 'bg-blue-100 text-blue-700',
    link: 'bg-indigo-100 text-indigo-700',
    imported_content: 'bg-yellow-100 text-yellow-700'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700'
}

const getTypeLabel = (type: string) => {
  const labels = {
    quiz: 'Quiz',
    flashcard: 'Flashcard',
    note: 'Note',
    file: 'File',
    link: 'Link',
    imported_content: 'Study Content'
  }
  return labels[type as keyof typeof labels] || type
}


const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const downloadResource = () => {
  if (props.resource.contentUrl) {
    window.open(props.resource.contentUrl, '_blank')
  }
}

const viewStudyContent = () => {
  console.log('🔍 View Study Content Debug:', {
    contentSource: props.resource.contentSource,
    contentData: props.resource.contentData,
    contentId: props.resource.contentId,
    contentType: props.resource.contentType,
    originalContentType: props.resource.originalContentType,
    resourceType: props.resource.type
  })

  // Check if we have content data (prioritize new Backend fields)
  const hasContentData = (props.resource.contentData &&
                         props.resource.contentData !== '0' &&
                         props.resource.contentData !== 'null') ||
                        props.resource.description

  if (hasContentData) {
    try {
      // Parse content from Backend contentData field first
      let parsedContent: unknown = null
      if (props.resource.contentData &&
          props.resource.contentData !== '0' &&
          props.resource.contentData !== 'null') {
        try {
          parsedContent = JSON.parse(props.resource.contentData)
          console.log('✅ Parsed content from Backend contentData field:', parsedContent)
        } catch (parseError) {
          console.warn('⚠️ Could not parse Backend contentData as JSON:', parseError)
        }
      }

      // Fallback: Parse from description if contentData is not available (Legacy)
      if (!parsedContent && props.resource.description) {
        try {
          parsedContent = JSON.parse(props.resource.description)
          console.log('✅ Parsed content from description (Legacy):', parsedContent)
        } catch (parseError) {
          console.warn('⚠️ Could not parse description as JSON:', parseError)
          // If it's not JSON, create a simple content structure
          parsedContent = {
            type: 'note',
            topic: props.resource.title,
            content: props.resource.description
          }
        }
      }

      // Determine content type (prioritize new contentType field)
      let detectedContentType = 'note'
      if (props.resource.contentType) {
        // Use contentType from new fields
        detectedContentType = props.resource.contentType.toLowerCase()
        console.log('✅ Using contentType from new fields:', detectedContentType)
      } else if (parsedContent && typeof parsedContent === 'object' && parsedContent !== null) {
        // Fallback: detect from content structure
        const contentObj = parsedContent as Record<string, unknown>
        if (contentObj.type && typeof contentObj.type === 'string') {
          detectedContentType = contentObj.type.toLowerCase()
        } else if (contentObj.questions && Array.isArray(contentObj.questions)) {
          detectedContentType = 'quiz'
        } else if (contentObj.flashcards && Array.isArray(contentObj.flashcards)) {
          detectedContentType = 'flashcard'
        } else if (contentObj.cards && Array.isArray(contentObj.cards)) {
          detectedContentType = 'flashcard'
        } else if (contentObj.content && Array.isArray(contentObj.content)) {
          detectedContentType = 'note'
        }
        console.log('✅ Detected content type from structure:', detectedContentType)
      } else {
        // Fallback: detect from title/description
        const title = props.resource.title.toLowerCase()
        const description = props.resource.description.toLowerCase()

        if (title.includes('flashcard') || description.includes('flashcard')) {
          detectedContentType = 'flashcard'
        } else if (title.includes('quiz') || description.includes('quiz') || description.includes('question')) {
          detectedContentType = 'quiz'
        } else if (title.includes('note') || description.includes('note')) {
          detectedContentType = 'note'
        }
        console.log('✅ Detected content type from title/description:', detectedContentType)
      }

      console.log('🔍 Final detected content type:', detectedContentType)

      // Create fallback content if no parsedContent
      let finalContent = parsedContent
      if (!finalContent) {
        // Create a basic content structure based on detected type
        if (detectedContentType === 'flashcard') {
          finalContent = {
            type: 'flashcard',
            topic: props.resource.title,
            flashcards: [{
              question: 'Sample Question',
              answer: 'This is a sample flashcard. The actual content is not available yet.'
            }]
          }
        } else if (detectedContentType === 'quiz') {
          finalContent = {
            type: 'quiz',
            topic: props.resource.title,
            questions: [{
              question: 'Sample Question',
              options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
              answer: 0
            }]
          }
        } else {
          finalContent = {
            type: 'note',
            topic: props.resource.title,
            content: [props.resource.description || 'Content not available yet.']
          }
        }
        console.log('✅ Created fallback content:', finalContent)
      }

      // Navigate to content viewer with the shared content
      const contentData = {
        id: props.resource.contentId || props.resource.id,
        title: props.resource.title,
        content: finalContent,
        contentType: detectedContentType,
        source: 'shared'
      }

      console.log('✅ Content data prepared:', contentData)

      // Store content data for viewing
      localStorage.setItem('sharedContentToView', JSON.stringify(contentData))

      // Store group ID for navigation back
      if (props.groupId) {
        localStorage.setItem('contentViewerSourceGroupId', props.groupId)
      }

      // Navigate to content viewer
      router.push('/content-viewer')
    } catch (error) {
      console.error('❌ Error preparing content data:', error)
      alert('เกิดข้อผิดพลาดในการเปิด content กรุณาลองใหม่อีกครั้ง')
    }
  } else if (props.resource.contentUrl) {
    window.open(props.resource.contentUrl, '_blank')
  } else {
    console.warn('⚠️ No content data available for viewing')
    alert('ไม่สามารถเปิด content ได้ เนื่องจากไม่มีข้อมูล content')
  }
}

const getContentTopic = () => {
  // สำหรับ manual content ที่ import จาก Feat AI
  if (props.resource.contentSource === 'study_content' && props.resource.contentData) {
    try {
      const contentData = typeof props.resource.contentData === 'string'
        ? JSON.parse(props.resource.contentData)
        : props.resource.contentData

      console.log('🔍 Content data for topic extraction:', contentData)

      // ดึง topic จาก content data ก่อน
      if (contentData.topic && contentData.topic.trim()) {
        console.log('✅ Found topic:', contentData.topic)
        return contentData.topic
      }

      // Fallback ไปใช้ title จาก content data
      if (contentData.title && contentData.title.trim()) {
        console.log('✅ Using content title:', contentData.title)
        return contentData.title
      }

      // ลองหา topic จาก flashcards หรือ questions
      if (contentData.flashcards && contentData.flashcards.length > 0) {
        const firstCard = contentData.flashcards[0]
        if (firstCard.question && firstCard.question.trim()) {
          console.log('✅ Using first flashcard question as topic:', firstCard.question.substring(0, 50))
          return firstCard.question.substring(0, 50) + (firstCard.question.length > 50 ? '...' : '')
        }
      }

      if (contentData.questions && contentData.questions.length > 0) {
        const firstQuestion = contentData.questions[0]
        if (firstQuestion.question && firstQuestion.question.trim()) {
          console.log('✅ Using first question as topic:', firstQuestion.question.substring(0, 50))
          return firstQuestion.question.substring(0, 50) + (firstQuestion.question.length > 50 ? '...' : '')
        }
      }

      // Fallback สุดท้าย - ใช้ resource title
      console.log('⚠️ Using resource title as fallback:', props.resource.title)
      return props.resource.title
    } catch (error) {
      console.error('❌ Error parsing content data for topic:', error)
      return props.resource.title
    }
  }

  // สำหรับ AI content ที่สร้างผ่าน API
  return props.resource.title
}

const getContentPreview = () => {
  if (props.resource.contentSource === 'study_content' && props.resource.contentData) {
    try {
      const contentData = typeof props.resource.contentData === 'string'
        ? JSON.parse(props.resource.contentData)
        : props.resource.contentData

      // ใช้ contentType จาก backend response ก่อน
      const contentType = props.resource.contentType || props.resource.originalContentType

      if (contentType === 'QUIZ' || contentType === 'quiz') {
        if (contentData.questions) {
          return `${contentData.questions.length} questions available`
        }
      } else if (contentType === 'FLASHCARD' || contentType === 'flashcard') {
        if (contentData.flashcards) {
          return `${contentData.flashcards.length} flashcards available`
        } else if (contentData.cards) {
          return `${contentData.cards.length} flashcards available`
        }
      } else if (contentType === 'NOTE' || contentType === 'note') {
        if (contentData.content) {
          return contentData.content.substring(0, 100) + (contentData.content.length > 100 ? '...' : '')
        }
      }
    } catch (error) {
      console.error('Error parsing content data:', error)
    }
  }
  return 'Click to view content'
}



const handleViewClick = () => {
  console.log('🔍 View button clicked!')
  console.log('🔍 Resource data:', props.resource)
  console.log('🔍 Content source:', props.resource.contentSource)
  console.log('🔍 Resource type:', props.resource.type)
  console.log('🔍 Content type:', props.resource.contentType)
  console.log('🔍 Content data exists:', !!props.resource.contentData)

  // Check if this is interactive study content using new Backend fields
  const isInteractiveContent = props.resource.contentType &&
                              ['flashcard', 'quiz', 'note'].includes(props.resource.contentType) &&
                              props.resource.contentData &&
                              props.resource.contentData !== '0' &&
                              props.resource.contentData !== 'null'

  // Check if this is a regular file (no interactive content)
  const isRegularFile = !props.resource.contentType ||
                       props.resource.contentType === null ||
                       !props.resource.contentData ||
                       props.resource.contentData === '0' ||
                       props.resource.contentData === 'null'

  // Fallback: Check legacy criteria for backward compatibility (only if new fields are not available)
  const hasJsonDescription = props.resource.description &&
                            (props.resource.description.includes('"type":') ||
                             props.resource.description.includes('"topic":') ||
                             props.resource.description.includes('"content":'))

  const isLegacyStudyContent = !props.resource.contentType && (
                              props.resource.contentSource === 'study_content' ||
                              props.resource.type === 'imported_content' ||
                              hasJsonDescription
                            )

  // Additional fallback: Check if title/description suggests interactive content (only for legacy)
  const titleSuggestsInteractive = !props.resource.contentType && (
                                  props.resource.title.toLowerCase().includes('flashcard') ||
                                  props.resource.title.toLowerCase().includes('quiz') ||
                                  props.resource.title.toLowerCase().includes('note')
                                )

  const descriptionSuggestsInteractive = !props.resource.contentType && (
                                        props.resource.description.toLowerCase().includes('flashcard') ||
                                        props.resource.description.toLowerCase().includes('quiz') ||
                                        props.resource.description.toLowerCase().includes('question') ||
                                        props.resource.description.toLowerCase().includes('answer')
                                      )

  const isStudyContent = isInteractiveContent || isLegacyStudyContent ||
                        (titleSuggestsInteractive && descriptionSuggestsInteractive)

  console.log('🔍 Is interactive content:', isInteractiveContent)
  console.log('🔍 Is regular file:', isRegularFile)
  console.log('🔍 Is legacy study content:', isLegacyStudyContent)
  console.log('🔍 Title suggests interactive:', titleSuggestsInteractive)
  console.log('🔍 Description suggests interactive:', descriptionSuggestsInteractive)
  console.log('🔍 Is study content:', isStudyContent)

  if (isStudyContent) {
    console.log('🔍 Calling viewStudyContent()')
    viewStudyContent()
  } else {
    console.log('🔍 Calling downloadResource()')
    downloadResource()
  }
}
</script>

<template>
  <div
    class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    @click="handleViewClick"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-2">
        <span
          :class="getTypeColor(displayResourceType)"
          class="px-2 py-1 text-xs font-medium rounded-full"
        >
          {{ getTypeLabel(displayResourceType) }}
        </span>
        <span
          v-if="resource.contentSource === 'study_content'"
          class="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full"
        >
          Shared
        </span>
      </div>

    </div>

    <!-- Content -->
    <div class="mb-4">
      <h3 class="font-medium text-gray-900 mb-2 line-clamp-2">
        {{ getContentTopic() }}
        <span v-if="resource.contentType === 'flashcard' && getContentPreview().includes('cards')" class="text-sm text-blue-600 font-normal">
          ({{ getContentPreview().match(/\d+/)?.[0] || '0' }} cards)
        </span>
        <span v-if="resource.contentType === 'quiz' && getContentPreview().includes('questions')" class="text-sm text-blue-600 font-normal">
          ({{ getContentPreview().match(/\d+/)?.[0] || '0' }} questions)
        </span>
      </h3>

      <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <span class="font-medium text-gray-700">Shared by <span class="font-semibold text-gray-900">{{ resource.uploaderName }}</span></span>
        <span>{{ formatDate(resource.createdAt) }}</span>
      </div>

      <div v-if="resource.tags && resource.tags.length > 0" class="flex flex-wrap gap-1">
        <span
          v-for="tag in resource.tags.slice(0, 3)"
          :key="tag"
          class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
        >
          {{ tag }}
        </span>
        <span v-if="resource.tags.length > 3" class="px-2 py-1 text-xs text-gray-500">
          +{{ resource.tags.length - 3 }} more
        </span>
      </div>
    </div>

  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
