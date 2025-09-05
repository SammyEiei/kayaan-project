#!/bin/bash

# Share Study Content API Test Script
# This script tests the Share Study Content functionality

# Configuration
BASE_URL="http://localhost:8080"
TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX1VTRVIiXSwiZW1haWwiOiJ0aW5hQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiVGluYSBLYXlhYW5KdW5nIiwic3ViIjoiMTEwMiIsImlhdCI6MTc1NzA2NTM1MSwiZXhwIjoxNzU3MTUxNzUxfQ.SfbaP0DMo3TceAMNjlQc80xN_vtKsZW3jtY0B8jE7cI"
GROUP_ID="1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Share Study Content API Test Script${NC}"
echo "================================================"

# Function to make API calls
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "\n${YELLOW}📡 Testing: $description${NC}"
    echo "Endpoint: $method $endpoint"
    
    if [ -n "$data" ]; then
        echo "Data: $data"
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -d "$data" \
            "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Authorization: Bearer $TOKEN" \
            "$BASE_URL$endpoint")
    fi
    
    # Split response and status code
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ Success (HTTP $http_code)${NC}"
        echo "Response: $body"
    else
        echo -e "${RED}❌ Failed (HTTP $http_code)${NC}"
        echo "Response: $body"
    fi
    
    return $http_code
}

# Test 1: Share Manual Quiz
echo -e "\n${BLUE}Test 1: Share Manual Quiz${NC}"
make_request "POST" "/api/groups/$GROUP_ID/resources/share-content" \
    '{
        "contentId": "manual-quiz-456",
        "title": "Math Quiz - Calculus",
        "description": "Shared from my personal library",
        "tags": ["math", "calculus", "quiz"]
    }' \
    "Share Manual Quiz"

# Test 2: Share AI Flashcard
echo -e "\n${BLUE}Test 2: Share AI Flashcard${NC}"
make_request "POST" "/api/groups/$GROUP_ID/resources/share-content" \
    '{
        "contentId": "ai-123",
        "title": "Biology Flashcards",
        "description": "AI-generated biology flashcards",
        "tags": ["biology", "flashcards", "ai"]
    }' \
    "Share AI Flashcard"

# Test 3: Share Manual Note
echo -e "\n${BLUE}Test 3: Share Manual Note${NC}"
make_request "POST" "/api/groups/$GROUP_ID/resources/share-content" \
    '{
        "contentId": "manual-note-789",
        "title": "Physics Notes - Quantum Mechanics",
        "description": "Comprehensive notes on quantum mechanics",
        "tags": ["physics", "quantum", "notes"]
    }' \
    "Share Manual Note"

# Test 4: Invalid Content ID Format
echo -e "\n${BLUE}Test 4: Invalid Content ID Format${NC}"
make_request "POST" "/api/groups/$GROUP_ID/resources/share-content" \
    '{
        "contentId": "invalid-id-format",
        "title": "Invalid Content",
        "description": "This should fail",
        "tags": ["invalid"]
    }' \
    "Invalid Content ID Format (Should return 400)"

# Test 5: Missing Required Fields
echo -e "\n${BLUE}Test 5: Missing Required Fields${NC}"
make_request "POST" "/api/groups/$GROUP_ID/resources/share-content" \
    '{
        "contentId": "manual-quiz-456"
    }' \
    "Missing Required Fields (Should return 400)"

# Test 6: Unauthorized Access (No Token)
echo -e "\n${BLUE}Test 6: Unauthorized Access${NC}"
echo -e "\n${YELLOW}📡 Testing: Unauthorized Access (No Token)${NC}"
echo "Endpoint: POST /api/groups/$GROUP_ID/resources/share-content"

response=$(curl -s -w "\n%{http_code}" -X "POST" \
    -H "Content-Type: application/json" \
    -d '{
        "contentId": "manual-quiz-456",
        "title": "Unauthorized Test",
        "description": "This should fail",
        "tags": ["unauthorized"]
    }' \
    "$BASE_URL/api/groups/$GROUP_ID/resources/share-content")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

if [ "$http_code" -eq 401 ]; then
    echo -e "${GREEN}✅ Success (HTTP $http_code) - Correctly rejected unauthorized access${NC}"
else
    echo -e "${RED}❌ Failed (HTTP $http_code) - Should have returned 401${NC}"
fi
echo "Response: $body"

# Test 7: List Group Resources (Updated)
echo -e "\n${BLUE}Test 7: List Group Resources${NC}"
make_request "GET" "/api/groups/$GROUP_ID/resources" \
    "" \
    "List All Group Resources"

# Test 8: List Group Resources with Search
echo -e "\n${BLUE}Test 8: List Group Resources with Search${NC}"
make_request "GET" "/api/groups/$GROUP_ID/resources?search=math" \
    "" \
    "Search Group Resources for 'math'"

# Test 9: List Group Resources with Type Filter
echo -e "\n${BLUE}Test 9: List Group Resources with Type Filter${NC}"
make_request "GET" "/api/groups/$GROUP_ID/resources?type=quiz" \
    "" \
    "Filter Group Resources by type 'quiz'"

# Test 10: List Group Resources with Pagination
echo -e "\n${BLUE}Test 10: List Group Resources with Pagination${NC}"
make_request "GET" "/api/groups/$GROUP_ID/resources?page=0&size=5" \
    "" \
    "List Group Resources with Pagination"

echo -e "\n${BLUE}🎉 Test Script Completed!${NC}"
echo "================================================"
echo -e "${YELLOW}Note: Make sure to:${NC}"
echo "1. Update the TOKEN variable with a valid authentication token"
echo "2. Update the GROUP_ID variable with a valid group ID"
echo "3. Ensure the backend server is running on $BASE_URL"
echo "4. Have some test content available with the specified content IDs"
