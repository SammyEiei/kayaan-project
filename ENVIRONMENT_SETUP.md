# Environment Setup for Backend Connection

## Overview
This document explains how to set up the environment variables to connect the frontend to the backend API.

## Required Environment Variables

### 1. Backend URL
The main environment variable needed is `VITE_BACKEND_URL` which should point to your backend API endpoint.

#### Option 1: Create .env file (Recommended)
Create a `.env` file in the root directory of your project:

```bash
# .env
VITE_BACKEND_URL=http://localhost:8080/api
```

#### Option 2: Use .env.local (Development only)
Create a `.env.local` file for local development:

```bash
# .env.local
VITE_BACKEND_URL=http://localhost:8080/api
```

#### Option 3: Set in Vite config (Fallback)
The `vite.config.ts` file has a fallback to `http://localhost:8080/api` if no environment variable is set.

## Backend URL Examples

### Local Development
```bash
VITE_BACKEND_URL=http://localhost:8080/api
```

### Production
```bash
VITE_BACKEND_URL=https://api.yourdomain.com/api
```

### Custom Port
```bash
VITE_BACKEND_URL=http://localhost:3000/api
```

## Verification

### 1. Check Console Logs
When you make API calls, check the browser console for logs like:
```
🚀 API Request: POST /api/groups
🔧 Full URL: http://localhost:8080/api/api/groups
```

### 2. Network Tab
Check the Network tab in browser DevTools to see if requests are going to the correct URL.

### 3. Environment Variable Check
Add this to your component temporarily to verify:
```typescript
console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL)
```

## Troubleshooting

### Issue: API calls going to wrong URL
- Check if `.env` file exists and has correct values
- Restart the development server after changing environment variables
- Verify the environment variable name starts with `VITE_`

### Issue: CORS errors
- Ensure backend has CORS configured for your frontend domain
- Check if backend is running and accessible

### Issue: 404 errors
- Verify the backend URL is correct
- Check if the API endpoints exist on your backend
- Ensure the API path structure matches (e.g., `/api/groups`)

## Current Configuration

The project is configured to:
1. Use `VITE_BACKEND_URL` from environment variables
2. Fall back to `http://localhost:8080/api` if not set
3. Log all API requests for debugging
4. Handle authentication headers automatically

## Next Steps

1. Create the `.env` file with your backend URL
2. Restart the development server
3. Test creating a study group
4. Check browser console for API request logs
5. Verify the group is saved in your backend database
