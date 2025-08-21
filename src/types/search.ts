// Search Types for Back-end Integration
export interface SearchRequest {
  query: string
  types: string[]
  groupIds: string[]
  tags: string[]
  authorId?: string
  dateFrom?: string
  dateTo?: string
  sortBy: 'relevance' | 'date' | 'title' | 'popularity'
  sortOrder: 'asc' | 'desc'
  page: number
  size: number
}

export interface SearchResult {
  id: string
  type: string
  title: string
  content: string
  groupId: string
  groupName: string
  authorId: string
  authorName: string
  createdAt: string
  tags: string[]
  relevanceScore: number
  preview: string
  metadata?: Record<string, any>
}

export interface SearchResponse {
  content: SearchResult[]
  totalElements: number
  totalPages: number
  currentPage: number
  size: number
  query: string
  filters: Omit<SearchRequest, 'query' | 'page' | 'size'>
  suggestions: string[]
  popularTags: string[]
}

export interface SearchSuggestion {
  text: string
  type: 'query' | 'tag' | 'author' | 'group'
  relevance: number
  count?: number
}

export interface SearchFilters {
  types: string[]
  groupIds: string[]
  tags: string[]
  authorId?: string
  dateFrom?: string
  dateTo?: string
  sortBy: 'relevance' | 'date' | 'title' | 'popularity'
  sortOrder: 'asc' | 'desc'
}

export interface SearchHistory {
  id: string
  query: string
  filters: SearchFilters
  resultCount: number
  searchedAt: string
}

export interface PopularSearch {
  query: string
  count: number
  lastSearched: string
}

export interface SearchAnalytics {
  totalSearches: number
  uniqueQueries: number
  averageResults: number
  mostSearchedTerms: PopularSearch[]
  searchTrends: {
    date: string
    count: number
  }[]
}





