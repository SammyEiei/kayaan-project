# Backend Theme API Specification

## 1. Data Structures

### ThemeDto

```typescript
interface ThemeDto {
  id: number
  name: string
  description?: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  surfaceColor: string
  textColor: string
  textSecondaryColor: string
  borderColor: string
  successColor: string
  warningColor: string
  errorColor: string
  isDark: boolean
  isHighContrast: boolean
  isSystemTheme?: boolean
}
```

### UserThemeResponse

```typescript
interface UserThemeResponse {
  current: ThemeDto
  presets: ThemeDto[]
}
```

### UpdateThemeRequest

```typescript
interface UpdateThemeRequest {
  themeId?: number
  presetId?: number
}
```

## 2. API Endpoints

### GET /api/themes

- **Description**: Get all system themes
- **Response**: `ThemeDto[]`
- **Status**: 200 OK

### GET /api/users/{userId}/theme

- **Description**: Get user's current theme and presets
- **Response**: `UserThemeResponse`
- **Status**: 200 OK

### PUT /api/users/{userId}/theme

- **Description**: Update user's active theme
- **Request Body**: `UpdateThemeRequest`
- **Status**: 200 OK

### GET /api/users/{userId}/presets

- **Description**: Get user's theme presets
- **Response**: `ThemeDto[]`
- **Status**: 200 OK

### POST /api/users/{userId}/presets

- **Description**: Create new theme preset
- **Request Body**: `ThemeDto`
- **Response**: `ThemeDto[]` (updated presets list)
- **Status**: 201 Created

### DELETE /api/users/{userId}/presets/{presetId}

- **Description**: Delete theme preset
- **Parameters**: `presetId` (number)
- **Response**: `ThemeDto[]` (updated presets list)
- **Status**: 200 OK

### POST /api/users/{userId}/reset-personalization

- **Description**: Reset user's theme to default
- **Status**: 200 OK

## 3. Implementation Notes

### Preset ID Type

- Use `number` for preset IDs consistently
- Frontend sends `number`, backend expects `number`

### Theme Update Contract

- Frontend sends `themeId`/`presetId` in request body
- Backend accepts `UpdateThemeRequest` object

### Theme Data Structure

- Use individual color fields instead of `colors` object
- Match the structure used in `theme.ts` store

### Error Handling

- Return appropriate HTTP status codes
- Include error messages in response body
- Handle validation errors (400 Bad Request)
- Handle not found errors (404 Not Found)
- Handle server errors (500 Internal Server Error)
