<template>
  <div :class="embedded ? '' : 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'">
    <!-- Header (only when not embedded) -->
    <div v-if="!embedded" class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
            <h1 class="text-xl font-bold text-gray-900">My Manual Content</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Description Section (only when not embedded) -->
      <div v-if="!embedded" class="mb-8 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">My Manual Content</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage and organize your manually created study content
        </p>
    </div>



    <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Total Content</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ contentStats?.totalManualContent || contentItems.length }}
              </p>
          </div>
        </div>
      </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Quizzes</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ contentStats?.contentTypeCounts?.quiz || contentItems.filter(c => c.type === 'quiz').length }}
            </p>
          </div>
        </div>
      </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Flashcards</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ contentStats?.contentTypeCounts?.flashcard || contentItems.filter(c => c.type === 'flashcard').length }}
            </p>
          </div>
        </div>
      </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Notes</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ contentStats?.contentTypeCounts?.note || contentItems.filter(c => c.type === 'note').length }}
            </p>
        </div>
      </div>
    </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="p-2 bg-indigo-100 rounded-lg">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Downloads</p>
              <p class="text-lg font-semibold text-gray-900">{{ contentStats?.recentActivity?.last30Days || 0 }}</p>
          </div>
        </div>
            </div>
          </div>

      <!-- Filters and Search -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div class="flex flex-col sm:flex-row gap-4 flex-1">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
              placeholder="Search content..."
              class="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

          <select
            v-model="selectedFormat"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="quiz">Quizzes</option>
            <option value="flashcard">Flashcards</option>
            <option value="note">Notes</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
            <button
              @click="viewMode = 'grid'"
            :class="viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'"
            class="p-2 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              @click="viewMode = 'list'"
            :class="viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'"
            class="p-2 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
      </div>
    </div>

    <!-- Content Grid/List -->
    <div v-if="filteredContent.length > 0">
      <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in filteredContent"
          :key="item.id"
            class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          @click="viewContent(item)"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-2">
                <span
                  :class="getTypeColor(item.type)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ getTypeLabel(item.type) }}
              </span>
                <span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  Manual
                </span>
              </div>
              <div class="flex items-center gap-1">
                <button
                  @click.stop="handleInteractiveView(item)"
                  v-if="canShowInteractive(item)"
                  class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="Interactive View"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                </button>
                <button
                  @click.stop="emitEdit(item, item.type)"
                  class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="Edit"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click.stop="emitDelete(item)"
                  class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Delete"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

                                                <h3 class="font-medium text-gray-900 mb-2 line-clamp-2">
              {{ item.title }}
              <span v-if="item.isDeck && item.cardCount" class="text-sm text-blue-600 font-normal">
                ({{ item.cardCount }} cards)
              </span>
              <span v-if="item.isDeck && item.questionCount" class="text-sm text-blue-600 font-normal">
                ({{ item.questionCount }} questions)
              </span>
            </h3>

            <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span>{{ item.subject }}</span>
              <span>{{ item.difficulty }}</span>
              <span>{{ formatDate(item.createdAt) }}</span>
            </div>

            <div v-if="item.tags.length > 0" class="flex flex-wrap gap-1">
              <span
                v-for="tag in item.tags.slice(0, 3)"
                :key="tag"
                class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {{ tag }}
              </span>
              <span v-if="item.tags.length > 3" class="px-2 py-1 text-xs text-gray-500">
                +{{ item.tags.length - 3 }} more
              </span>
          </div>
        </div>
      </div>

      <!-- List View -->
        <div v-else class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="item in filteredContent"
                :key="item.id"
                class="hover:bg-gray-50 cursor-pointer"
                @click="viewContent(item)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 line-clamp-1">{{ item.title }}</div>
                      <div class="text-sm text-gray-500">{{ item.tags.slice(0, 2).join(', ') }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getTypeColor(item.type)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ getTypeLabel(item.type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.subject }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(item.createdAt) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <button
                      @click.stop="handleInteractiveView(item)"
                      v-if="canShowInteractive(item)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Interactive View"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button
                      @click.stop="emitEdit(item, item.type)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Edit"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click.stop="emitDelete(item)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
      </div>
    </div>

    <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No content found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ searchQuery || selectedFormat !== 'all' ? 'Try adjusting your search or filters.' : 'Get started by creating your first manual content.' }}
        </p>
        <div class="mt-6" v-if="!searchQuery && selectedFormat === 'all'">
      <button
            @click="$router.push('/ManualGenerateMainView')"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200"
      >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        Create Your First Content
      </button>
        </div>
      </div>

      <!-- Content Detail Modal -->
      <div v-if="showDetailModal && selectedContent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
        <div class="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.5 1.5A1.5 1.5 0 0 0 7 3v3.5a.5.5 0 0 1-1 0V1.5a1.5 1.5 0 0 0-3 0V12a.5.5 0 0 1-.5.5H1a.5.5 0 0 1 0-1h1V3a1.5 1.5 0 0 0-3 0v8a5 5 0 0 0 10 0V3a1.5 1.5 0 0 0-1.5-1.5z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ selectedContent.title }}</h3>
                <p class="text-sm text-gray-500">
                  {{ currentViewMode === 'detail' ? 'Content Details' : 'Interactive View' }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <!-- View Mode Toggle -->
              <div v-if="canShowInteractive(selectedContent)" class="flex items-center gap-2">
                <button
                  @click="currentViewMode = 'detail'"
                  :class="currentViewMode === 'detail' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'"
                  class="px-3 py-1 text-sm rounded-lg transition-colors"
                >
                  Details
                </button>
                <button
                  @click="currentViewMode = 'interactive'"
                  :class="currentViewMode === 'interactive' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'"
                  class="px-3 py-1 text-sm rounded-lg transition-colors"
                >
                  Try me!
                </button>
              </div>
              <button
                @click="showDetailModal = false"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Content -->
          <div class="flex-1 overflow-y-auto">
            <!-- Detail View -->
            <div v-if="currentViewMode === 'detail'" class="p-6">
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 mb-2">Content Type</h4>
                    <span
                      :class="getTypeColor(selectedContent.type)"
                      class="px-3 py-1 text-sm font-medium rounded-full"
                    >
                      {{ getTypeLabel(selectedContent.type) }}
                    </span>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 mb-2">Created Date</h4>
                    <p class="text-sm text-gray-900">{{ formatDate(selectedContent.createdAt) }}</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 mb-2">Subject</h4>
                    <p class="text-sm text-gray-900">{{ selectedContent.subject }}</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 mb-2">Difficulty</h4>
                    <p class="text-sm text-gray-900">{{ selectedContent.difficulty }}</p>
                  </div>
                </div>
                <div v-if="selectedContent.tags.length > 0">
                  <h4 class="text-sm font-medium text-gray-500 mb-2">Tags</h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in selectedContent.tags"
                      :key="tag"
                      class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Interactive View -->
            <div v-else-if="currentViewMode === 'interactive'" class="h-full">
              <!-- Loading State -->
              <div v-if="loadingDetailedContent" class="flex flex-col items-center justify-center h-64 text-gray-500">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p class="text-sm">Loading your content...</p>
              </div>

              <!-- Interactive Components -->
              <div v-else>
                <InteractiveQuiz
                  v-if="selectedContent.type === 'quiz'"
                  :content="prepareContentForInteractive(selectedContent)"
                  :title="selectedContent.title"
                />
                <InteractiveNote
                  v-else-if="selectedContent.type === 'note'"
                  :content="prepareContentForInteractive(selectedContent)"
                  :title="selectedContent.title"
                />
                <InteractiveFlashcard
                  v-else-if="selectedContent.type === 'flashcard'"
                  :content="prepareContentForInteractive(selectedContent)"
                  :title="selectedContent.title"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// Legacy services ไม่ใช้แล้ว - ใช้ UnifiedContentService แทน
import api from '@/service/api'
import UnifiedContentService, { type UnifiedContentDTO, type UnifiedContentResponse } from '@/service/UnifiedContentService'
import InteractiveQuiz from '@/components/InteractiveQuiz.vue'
import InteractiveNote from '@/components/InteractiveNote.vue'
import InteractiveFlashcard from '@/components/InteractiveFlashcard.vue'

// Props
interface Props {
  embedded?: boolean
}
const { embedded } = defineProps<Props>()

const emit = defineEmits(['edit-content'])
const router = useRouter()

// UI state
const searchQuery = ref('')
const selectedFormat = ref<string>('all')
const viewMode = ref<'grid' | 'list'>('grid')


// Modal state
const showDetailModal = ref(false)
const selectedContent = ref<ContentItem | null>(null)
const currentViewMode = ref<'detail' | 'interactive'>('detail')
const loadingDetailedContent = ref(false)

// Data state
const quizzes = ref<QuizData[]>([])
const notes = ref<NoteData[]>([])
const flashcards = ref<FlashcardData[]>([])
const unifiedContent = ref<UnifiedContentDTO[]>([])
const contentStats = ref<{
  totalManualContent?: number
  contentTypeCounts?: {
    quiz?: number
    flashcard?: number
    note?: number
  }
  recentActivity?: {
    last30Days?: number
  }
} | null>(null)




interface ContentItem {
  id: string
  type: 'quiz' | 'note' | 'flashcard'
  title: string
  subject: string
  tags: string[]
  difficulty: string
  createdAt: string
}

interface QuizData {
  id: number | string
  title?: string
  questions?: Array<{
    subject?: string
    tags?: string[]
    difficulty?: string
  }>
  createdAt?: string
}

interface NoteData {
  id: number | string
  title?: string
  subject?: string
  tags?: string[]
  difficulty?: string
  createdAt?: string
}

interface FlashcardData {
  id: number | string
  frontText?: string
  backText?: string
  subject?: string
  tags?: string[]
  difficulty?: string
  createdAt?: string
}







// Load content data
const loadContentItems = async () => {
  console.log('🚀 Starting loadContentItems...')
  try {
    // ✅ ใช้ Unified API สำหรับทุก content type
    console.log('📊 Loading all content from Unified API...')

    const unifiedResponse: UnifiedContentResponse = await UnifiedContentService.getUserContent({
      source: 'manual',
      contentType: 'all', // Load all content types
      size: 100,
      sortBy: 'createdAt',
      sortDir: 'desc'
    })

    if (unifiedResponse.success && unifiedResponse.content) {
      // Store all content as unified format
      unifiedContent.value = unifiedResponse.content

      console.log('✅ Loaded all content from Unified API:', {
        total: unifiedResponse.content.length,
        summary: unifiedResponse.summary
      })

      // แสดง content statistics
      console.log('🎉 Content Statistics:', {
        totalManualContent: unifiedResponse.summary?.totalManualContent || 0,
        quiz: unifiedResponse.summary?.contentTypeCounts?.quiz || 0,
        flashcard: unifiedResponse.summary?.contentTypeCounts?.flashcard || 0,
        note: unifiedResponse.summary?.contentTypeCounts?.note || 0
      })
    }

    // Clear legacy arrays
    quizzes.value = []
    notes.value = []
    flashcards.value = []

    console.log('✅ All content loaded successfully:', {
      totalContent: unifiedContent.value.length,
      contentTypes: unifiedResponse.summary
    })



  } catch (error) {
    console.error('❌ Error loading content:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error
    })

    // Clear all content on error
    unifiedContent.value = []
    quizzes.value = []
    notes.value = []
    flashcards.value = []
  }
}





// Load content stats
const loadContentStats = async () => {
  try {
    console.log('📊 Loading content statistics from Unified API...')
    const stats = await UnifiedContentService.getUserContentStats()

    if (stats) {
      console.log('✅ Content Stats:', {
        totalManualContent: stats.totalManualContent || 0,
        quiz: stats.contentTypeCounts?.quiz || 0,
        flashcard: stats.contentTypeCounts?.flashcard || 0,
        note: stats.contentTypeCounts?.note || 0
      })
      contentStats.value = stats
    }
  } catch (error) {
    console.warn('🔄 Failed to load content stats:', error)
    console.error('❌ Content stats error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error
    })
  }
}



// Computed properties
const contentItems = computed(() => {
  try {
    console.log('🔧 Building contentItems from Unified API:', {
      totalContent: unifiedContent.value.length
    })

    // ✅ ใช้ Unified content สำหรับทุก content type
    const items = unifiedContent.value.map((item: UnifiedContentDTO) => {
      try {
        const contentData = JSON.parse(item.content)

        switch (item.contentType) {
          case 'flashcard':
            return {
              id: `deck-${item.id}`,
              type: 'flashcard' as const,
              title: item.title || 'Untitled Flashcard Deck',
              subject: item.subject || 'General',
              difficulty: item.difficulty || 'medium',
              tags: item.tags || [],
              createdAt: item.createdAt,
              cardCount: contentData.flashcards?.length || 0,
              isDeck: true,
              deckData: contentData
            }

          case 'quiz':
            return {
              id: `quiz-${item.id}`,
              type: 'quiz' as const,
              title: item.title || 'Untitled Quiz',
              subject: item.subject || 'General',
              difficulty: item.difficulty || 'medium',
              tags: item.tags || [],
              createdAt: item.createdAt,
              questionCount: contentData.questions?.length || 0,
              isDeck: true,
              deckData: contentData
            }

          case 'note':
            return {
              id: `note-${item.id}`,
              type: 'note' as const,
              title: item.title || 'Untitled Note',
              subject: item.subject || 'General',
              difficulty: item.difficulty || 'medium',
              tags: item.tags || [],
              createdAt: item.createdAt,
              isDeck: false,
              content: contentData.content || contentData.sections?.[0]?.content || ''
            }

          default:
            console.warn('⚠️ Unknown content type:', item.contentType)
            return null
        }
      } catch (parseError) {
        console.warn('❌ Failed to parse content for item:', item.id, parseError)
        return null
      }
    }).filter(Boolean) as Array<{
      id: string
      type: 'flashcard' | 'quiz' | 'note'
      title: string
      subject: string
      difficulty: string
      tags: string[]
      createdAt: string
      cardCount?: number
      questionCount?: number
      isDeck?: boolean
      deckData?: Record<string, unknown>
      content?: string
      isMigrated?: boolean
    }>

    console.log('✅ Built contentItems from Unified API:', {
      total: items.length,
      byType: {
        flashcards: items.filter(i => i.type === 'flashcard').length,
        quizzes: items.filter(i => i.type === 'quiz').length,
        notes: items.filter(i => i.type === 'note').length
      }
    })

    return items
  } catch (error) {
    console.error('Error processing content items:', error)
    return []
  }
})

const filteredContent = computed(() => {
  let filtered = contentItems.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.subject.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  if (selectedFormat.value !== 'all') {
    filtered = filtered.filter(item => item.type === selectedFormat.value)
  }

  return filtered
})

// Methods
function viewContent(item: ContentItem) {
  selectedContent.value = item
  currentViewMode.value = 'detail'
  showDetailModal.value = true
}

function emitEdit(item: ContentItem, type: string) {
  emit('edit-content', { item, type })
  // Navigate to appropriate edit page
  const id = item.id.split('-')[1]
  switch (type) {
    case 'quiz':
      router.push(`/QuizView?edit=${id}`)
      break
    case 'note':
      router.push(`/NoteView?edit=${id}`)
      break
    case 'flashcard':
      router.push(`/FlashcardView?edit=${id}`)
      break
  }
}

async function emitDelete(item: ContentItem) {
  if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
    try {
      const contentId = item.id.replace(/^(deck|quiz|note)-/, '')

      // ใช้ Unified API สำหรับลบ content
      await api.delete(`/api/content/user/${contentId}`)

      console.log('✅ Content deleted successfully')

      // Reload content
      await loadContentItems()
    } catch (error) {
      console.error('❌ Failed to delete content:', error)
      alert('Failed to delete content. Please try again.')
    }
  }
}



// Methods for modal and interactive view
const detailedContent = ref<Record<string, {
  id?: number | string
  title?: string
  questions?: Array<{
    id?: number
    questionText?: string
    question?: string
    text?: string
    type?: string
    options?: string[]
    choices?: string[]
    correctAnswer?: string | number
    answer?: string | number
    explanation?: string
    feedback?: string
    subject?: string
    difficulty?: string
    tags?: string[]
  }>
  content?: string
  cards?: Array<{
    id?: number
    front?: string
    back?: string
    tags?: string[]
  }>
  frontText?: string
  backText?: string
  tags?: string[] | string
  createdByUsername?: string
  subject?: string
  difficulty?: string
  category?: string
  createdAt?: string
  updatedAt?: string
}>>({})

async function handleInteractiveView(item: ContentItem) {
  selectedContent.value = item
  currentViewMode.value = 'interactive'
  showDetailModal.value = true

  // Load detailed content for interactive view
  await loadDetailedContent(item)
}

async function loadDetailedContent(item: ContentItem) {
  // Skip if already loaded
  if (detailedContent.value[item.id]) {
    console.log('✅ Content already loaded:', item.id)
    return
  }

  loadingDetailedContent.value = true

  try {
    // ไม่ต้องใช้ itemId และ username แล้วสำหรับ Unified API

    // ใช้ Unified API สำหรับโหลด content details
    const contentId = item.id.replace(/^(deck|quiz|note)-/, '')
    console.log('🔄 Loading content details from Unified API for ID:', contentId)

    const response = await api.get(`/api/content/user/${contentId}`)

    if (response.data) {
      detailedContent.value[item.id] = response.data
      console.log('✅ Content loaded from Unified API:', response.data)
    }
  } catch (error) {
    console.error('❌ Error loading detailed content:', error)
    // Keep existing mock fallback if loading fails
  } finally {
    loadingDetailedContent.value = false
  }
}

function prepareContentForInteractive(item: ContentItem): string {
  console.log('🔧 Preparing content for interactive view:', item)

    // Check if this is a deck item with deckData
  const deckItem = item as ContentItem & { isDeck?: boolean; deckData?: Record<string, unknown> }
  if (deckItem.isDeck && deckItem.deckData) {
    console.log('✅ Using deck data for interactive view')

    switch (item.type) {
      case 'flashcard':
        const flashcardData = deckItem.deckData as { flashcards: Array<{ question: string; answer: string }> }
        if (flashcardData.flashcards && Array.isArray(flashcardData.flashcards)) {
          const cards = flashcardData.flashcards.map((card: { question: string; answer: string }, index: number) => ({
            id: index + 1,
            front: card.question,
            back: card.answer,
            tags: item.tags
          }))

          console.log('🎯 Converted flashcard deck:', { cardCount: cards.length, cards })
          return JSON.stringify({ cards })
        }
        break

      case 'quiz':
        const quizData = deckItem.deckData as { questions: Array<Record<string, unknown>> }
        if (quizData.questions && Array.isArray(quizData.questions)) {
          const questions = quizData.questions.map((q: Record<string, unknown>, index: number) => ({
            id: index + 1,
            type: 'multiple-choice',
            question: (q.question as string) || (q.questionText as string) || `Question ${index + 1}`,
            options: ((q.options as string[]) || (q.choices as string[]) || ['Option A', 'Option B', 'Option C', 'Option D']).map((choice: string, choiceIndex: number) => ({
              id: choiceIndex.toString(),
              text: choice,
              correct: choiceIndex === ((q.correctAnswer as number) || 0)
            })),
            correctAnswer: ((q.options as string[]) || (q.choices as string[]) || ['Option A'])[(q.correctAnswer as number) || 0] || 'Option A',
            explanation: (q.explanation as string) || `Explanation for question ${index + 1}`
          }))

          console.log('🎯 Converted quiz deck:', { questionCount: questions.length, questions })
          return JSON.stringify({ title: item.title, questions })
        }
        break
    }
  }

  // Fallback to detailed content if available
  const detailed = detailedContent.value[item.id]

  switch (item.type) {
    case 'quiz':
      if (detailed && detailed.questions && Array.isArray(detailed.questions)) {
        console.log('✅ Using real quiz data with', detailed.questions.length, 'questions')
        console.log('📋 Raw quiz data:', detailed)

        // Convert Manual Quiz format to Interactive Quiz format
        const convertedQuestions = detailed.questions.map((q, index: number) => {
          // Handle different correct answer formats
          let correctIndex = 0
          if (typeof q?.correctAnswer === 'string') {
            // If correctAnswer is the actual text, find its index in choices
            const answerIndex = q.choices?.indexOf(q.correctAnswer)
            correctIndex = answerIndex !== undefined && answerIndex >= 0 ? answerIndex : 0
          } else if (typeof q?.correctAnswer === 'number') {
            correctIndex = q.correctAnswer
          } else if (typeof q?.answer === 'number') {
            correctIndex = q.answer
          }

          const choices = q?.choices || q?.options || ['Option A', 'Option B', 'Option C', 'Option D']

          return {
            id: index + 1,
            type: 'multiple-choice',
            question: q?.questionText || q?.question || q?.text || `Question ${index + 1}`,
            options: choices.map((choice: string, choiceIndex: number) => ({
              id: choiceIndex.toString(),
              text: choice,
              correct: choiceIndex === correctIndex
            })),
            correctAnswer: choices[correctIndex] || choices[0],
            explanation: q?.explanation || q?.feedback || `Explanation for question ${index + 1}`
          }
        })

        const finalQuizData = {
          title: detailed.title || item.title,
          questions: convertedQuestions
        }

        console.log('🎯 Final converted quiz data:', finalQuizData)
        console.log('📊 Questions preview:', convertedQuestions.map(q => ({
          id: q.id,
          question: q.question,
          optionsCount: q.options?.length,
          correctAnswer: q.correctAnswer
        })))

        return JSON.stringify(finalQuizData)
      }

      // Fallback to mock data
      console.warn('⚠️ No detailed quiz data, using mock')
      return JSON.stringify({
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: `Sample question from ${item.title}`,
            options: [
              { id: '0', text: 'Option A', correct: true },
              { id: '1', text: 'Option B', correct: false },
              { id: '2', text: 'Option C', correct: false },
              { id: '3', text: 'Option D', correct: false }
            ],
            correctAnswer: 'Option A',
            explanation: 'This is a sample question from your manual content.'
          }
        ]
      })

      case 'note':
      if (detailed && detailed.content) {
        console.log('✅ Using real note data')
        return detailed.content
      }

      // No fallback mock: show empty state in InteractiveNote
      console.warn('⚠️ No detailed note data; showing empty interactive note')
      return ''

      case 'flashcard':
      if (detailed && (detailed.cards || detailed.frontText)) {
        console.log('✅ Using real flashcard data')

        // Handle different flashcard formats
        if (detailed.cards && Array.isArray(detailed.cards)) {
          return JSON.stringify({ cards: detailed.cards })
        } else if (detailed.frontText && detailed.backText) {
          return JSON.stringify({
            cards: [{
              id: 1,
              front: detailed.frontText,
              back: detailed.backText,
              tags: detailed.tags || item.tags
            }]
          })
        }
      }

      // Fallback to mock data
      console.warn('⚠️ No detailed flashcard data, using mock')
      return JSON.stringify({
        cards: [
          {
            id: 1,
            front: item.title,
            back: `Back side of ${item.title}`,
            tags: item.tags
          }
        ]
      })

    default:
      return 'Content not available for interactive view.'
  }
}

function canShowInteractive(item: ContentItem | null): boolean {
  return item !== null && ['quiz', 'note', 'flashcard'].includes(item.type)
}

// Utility functions
function getTypeColor(type: string) {
  const colors = {
    quiz: 'bg-green-100 text-green-700',
    flashcard: 'bg-purple-100 text-purple-700',
    note: 'bg-orange-100 text-orange-700'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700'
}

function getTypeLabel(type: string) {
  const labels = {
    quiz: 'Quiz',
    flashcard: 'Flashcard',
    note: 'Note'
  }
  return labels[type as keyof typeof labels] || type
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

onMounted(async () => {
  await loadContentItems()
  await loadContentStats()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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
