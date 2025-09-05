# Share Study Content API - Implementation Guide

## Overview

The Share Study Content feature allows users to share their personal study content (both AI-generated and manually created) to study groups. This feature enables seamless sharing without duplicating content, ensuring that shared content is always up-to-date.

## Architecture

```
User's Study Content → Share to Group → Group Library
     ↓                    ↓              ↓
[AI/Manual Tables] → [Group Content] → [Display in Group]
```

## Frontend Implementation

### 1. Type Definitions

#### Updated GroupResource Interface
```typescript
export interface GroupResource {
  id: string
  groupId: string
  title: string
  description: string
  fileUrl: string | null
  fileType: string | null
  fileSize: number | null
  uploaderId: string
  uploaderName: string
  createdAt: string
  comments: ResourceComment[]
  reactions: ResourceReaction[]
  type: 'note' | 'file' | 'link' | 'imported_content'
  tags?: string[]
  isPublic: boolean
  updatedAt?: string
  // New fields for Share Study Content
  contentSource?: 'file' | 'study_content'
  contentId?: string | null
  originalContentType?: string | null
  contentData?: any
}
```

#### New Request/Response Types
```typescript
export interface ShareStudyContentRequest {
  contentId: string
  title: string
  description?: string
  tags?: string[]
}

export interface ShareStudyContentResponse {
  id: number
  title: string
  description: string
  fileUrl: null
  mimeType: null
  fileSize: null
  tags: string[]
  uploaderId: number
  createdAt: string
  contentSource: 'study_content'
  contentId: string
  originalContentType: string
  contentData: any
}
```

### 2. Service Layer

#### GroupService Updates
```typescript
// Updated getGroupResources with query parameters
getGroupResources(groupId: string, params?: { 
  search?: string; 
  type?: string; 
  page?: number; 
  size?: number 
}) {
  // Implementation with query parameters
}

// New shareStudyContent method
shareStudyContent(groupId: string, payload: { 
  contentId: string; 
  title: string; 
  description?: string; 
  tags?: string[] 
}) {
  // Implementation with error handling
}
```

### 3. Store Layer

#### Group Store Updates
```typescript
// Updated resource transformation
const newResource: GroupResource = {
  // ... existing fields
  type: response.contentSource === 'study_content' ? 'imported_content' as const : 'file' as const,
  tags: response.tags || [],
  contentSource: response.contentSource,
  contentId: response.contentId,
  originalContentType: response.originalContentType,
  contentData: response.contentData
}

// New shareStudyContent action
const shareStudyContent = async (payload: { 
  contentId: string; 
  title: string; 
  description?: string; 
  tags?: string[] 
}) => {
  // Implementation with error handling
}
```

### 4. Components

#### ShareStudyContentModal Component
- **Location**: `src/components/group/ShareStudyContentModal.vue`
- **Features**:
  - Content selection from unified content store
  - Custom title and description editing
  - Tag management
  - Error handling and validation
  - Loading states

#### GroupLibrary Component Updates
- **Location**: `src/components/group/GroupLibrary.vue`
- **New Features**:
  - "Share Study Content" button
  - Integration with ShareStudyContentModal
  - Updated resource filtering for study content

### 5. Unified Content Store

#### New Store
```typescript
// Location: src/stores/unifiedContent.ts
export const useUnifiedContentStore = defineStore('unifiedContent', () => {
  // State management for unified content (AI + Manual)
  // Integration with UnifiedContentService
})
```

## API Endpoints

### Share Study Content
```
POST /api/groups/{groupId}/resources/share-content
```

**Request Body:**
```json
{
    "contentId": "manual-quiz-456",
    "title": "Math Quiz - Calculus",
    "description": "Shared from my personal library",
    "tags": ["math", "calculus", "quiz"]
}
```

**Response:**
```json
{
    "id": 123,
    "title": "Math Quiz - Calculus",
    "description": "Shared from my personal library",
    "fileUrl": null,
    "mimeType": null,
    "fileSize": null,
    "tags": ["math", "calculus", "quiz"],
    "uploaderId": 101,
    "createdAt": "2024-01-15T10:30:00",
    "contentSource": "study_content",
    "contentId": "manual-quiz-456",
    "originalContentType": "quiz",
    "contentData": {...}
}
```

### List Resources (Updated)
```
GET /api/groups/{groupId}/resources?search=math&type=quiz&page=0&size=20
```

**Response:**
```json
[
    {
        "id": 123,
        "title": "Math Quiz - Calculus",
        "description": "Shared from my personal library",
        "fileUrl": null,
        "mimeType": null,
        "fileSize": null,
        "tags": ["math", "calculus", "quiz"],
        "uploaderId": 101,
        "createdAt": "2024-01-15T10:30:00",
        "contentSource": "study_content",
        "contentId": "manual-quiz-456",
        "originalContentType": "quiz",
        "contentData": {...}
    },
    {
        "id": 124,
        "title": "Lecture Notes.pdf",
        "description": "Uploaded file",
        "fileUrl": "https://supabase.../file.pdf",
        "mimeType": "application/pdf",
        "fileSize": 1024000,
        "tags": ["notes", "lecture"],
        "uploaderId": 101,
        "createdAt": "2024-01-15T10:30:00",
        "contentSource": "file",
        "contentId": null,
        "originalContentType": null,
        "contentData": null
    }
]
```

## Content ID Formats

### AI Generated Content
- **Format**: `"ai-{id}"`
- **Example**: `"ai-123"`
- **Source**: `ai_generated_content` table

### Manual Generated Content
- **Format**: `"manual-{type}-{id}"`
- **Examples**:
  - `"manual-quiz-456"`
  - `"manual-flashcard-789"`
  - `"manual-note-101"`
- **Source**: `manual_generated_content` table

## Error Handling

### Frontend Error Handling
```typescript
try {
  const sharedContent = await groupStore.shareStudyContent(payload)
} catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : 'Unknown error'
  if (errorMessage === 'INVALID_CONTENT_ID_FORMAT') {
    // Handle invalid content ID
  } else if (errorMessage === 'ACCESS_DENIED') {
    // Handle access denied
  } else if (errorMessage === 'CONTENT_NOT_FOUND') {
    // Handle content not found
  }
}
```

### Backend Error Responses
- **400 Bad Request**: Invalid content ID format
- **403 Forbidden**: Access denied (not a member or content doesn't belong to user)
- **404 Not Found**: Content not found

## Database Schema

### Group Content Table Updates
```sql
-- New columns for study content support
ALTER TABLE group_content ADD COLUMN content_id VARCHAR(100) NULL;
ALTER TABLE group_content ADD COLUMN content_source ENUM('file', 'study_content') DEFAULT 'file';
ALTER TABLE group_content ADD COLUMN original_content_type VARCHAR(50) NULL;

-- Make existing file-related columns nullable
ALTER TABLE group_content MODIFY COLUMN file_name VARCHAR(255) NULL;
ALTER TABLE group_content MODIFY COLUMN file_url VARCHAR(500) NULL;
ALTER TABLE group_content MODIFY COLUMN mime_type VARCHAR(100) NULL;
ALTER TABLE group_content MODIFY COLUMN file_size BIGINT NULL;
```

## Testing

### Test Script
- **Location**: `test_share_study_content.sh`
- **Features**:
  - Tests all API endpoints
  - Validates error handling
  - Tests different content types
  - Includes authentication tests

### Manual Testing
1. Create some study content (AI and Manual)
2. Join a study group
3. Use the "Share Study Content" button in Group Library
4. Verify content appears in group resources
5. Test search and filtering functionality

## Benefits

1. **No Duplication**: Content is not duplicated, saving storage space
2. **Always Updated**: Shared content reflects the latest version
3. **Storage Efficient**: No additional Supabase storage usage
4. **Unified API**: Single endpoint for both files and study content
5. **Backward Compatible**: Existing file upload functionality remains unchanged

## Integration Notes

- The feature integrates with existing `UnifiedContentController` for content validation
- Uses the same notification system as file uploads
- Maintains audit logs for content sharing activities
- Supports the same permission system as other group operations
- Frontend is ready for backend implementation

## Next Steps

1. **Backend Implementation**: Implement the API endpoints according to the specification
2. **Database Migration**: Run the database schema updates
3. **Testing**: Use the provided test script to validate the implementation
4. **Documentation**: Update API documentation with the new endpoints
5. **Monitoring**: Add logging and monitoring for the new functionality
