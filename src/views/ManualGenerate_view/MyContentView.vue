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

          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in formatOptions"
              :key="option.value"
              @click="selectedFormat = option.value"
              :class="
                selectedFormat === option.value
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              "
              class="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
            >
              <!-- All Resource Icon -->
              <svg v-if="option.icon === 'Cards'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-2-6H6v-2h12v2zm-4 4H6v-2h8v2z"/>
              </svg>
              <!-- Quiz Icon -->
              <svg v-else-if="option.icon === 'List'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                  <path d="M7.5 3.5c-1.556.047-2.483.22-3.125.862c-.879.88-.879 2.295-.879 5.126v6.506c0 2.832 0 4.247.879 5.127C5.253 22 6.668 22 9.496 22h5c2.829 0 4.243 0 5.121-.88c.88-.879.88-2.294.88-5.126V9.488c0-2.83 0-4.246-.88-5.126c-.641-.642-1.569-.815-3.125-.862"/>
                  <path d="M7.496 3.75c0-.966.784-1.75 1.75-1.75h5.5a1.75 1.75 0 1 1 0 3.5h-5.5a1.75 1.75 0 0 1-1.75-1.75M6.5 10h4m3 1s.5 0 1 1c0 0 1.588-2.5 3-3m-11 7h4m3 1s.5 0 1 1c0 0 1.588-2.5 3-3"/>
                </g>
              </svg>
              <!-- Note Icon -->
              <svg v-else-if="option.icon === 'FileText'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                  <path d="M16.5 4H8a4 4 0 0 0-4 4v8.5a4 4 0 0 0 4 4h6.843a4 4 0 0 0 2.829-1.172l1.656-1.656a4 4 0 0 0 1.172-2.829V8a4 4 0 0 0-4-4"/>
                  <path d="M20.5 14H17a3 3 0 0 0-3 3v3.5M8 8h7.5M8 12h5"/>
                </g>
              </svg>
              <!-- Flashcard Icon -->
              <svg v-else-if="option.icon === 'HelpCircle'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2 16c0 2.21 0 3.316.702 4.054q.169.178.37.327C3.908 21 5.16 21 7.667 21h.666c2.506 0 3.759 0 4.595-.62q.201-.147.37-.326C14 19.316 14 18.211 14 16c0-2.21 0-3.316-.702-4.054a3 3 0 0 0-.37-.327C12.092 11 10.84 11 8.333 11h-.666c-2.506 0-3.759 0-4.595.62a3 3 0 0 0-.37.326C2 12.684 2 13.789 2 16m8-8c0-2.21 0-3.316.702-4.054q.168-.178.37-.327C11.908 3 13.16 3 15.667 3h.666c2.506 0 3.759 0 4.595.62q.201.148.37.326C22 4.684 22 5.789 22 8c0 2.21 0 3.316-.702 4.054a3 3 0 0 1-.37.327c-.758.562-1.86.614-3.928.618M2 15h12m-4-8h12M2 9c0-3.317 2.683-6 6-6l-.857 1.714M22 15c0 3.317-2.683 6-6 6l.857-1.714"/>
              </svg>
              {{ option.label }}
            </button>
          </div>
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
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                      <path d="m8.533 13.653l1.967 1.72V6.5a1.5 1.5 0 0 1 3.001-.002l.004 4.764l2.636.427c1.702.26 2.553.389 3.152.753C20.283 13.044 21 14 21 15.266c0 .918-.224 1.534-.768 3.19c-.345 1.05-.518 1.575-.8 1.99a3.53 3.53 0 0 1-1.934 1.414c-.478.14-1.024.14-2.115.14h-.926c-1.452 0-2.177 0-2.824-.27a4 4 0 0 1-.339-.164c-.614-.338-1.072-.91-1.987-2.052l-2.963-3.698a1.57 1.57 0 0 1-.008-1.954a1.52 1.52 0 0 1 2.197-.21"/>
                      <path d="M7 8h-.824C4.68 8 3.93 8 3.466 7.56C3 7.122 3 6.415 3 5s0-2.121.465-2.56S4.68 2 6.176 2h11.647c1.498 0 2.247 0 2.712.44C21 2.878 21 3.585 21 5s0 2.121-.465 2.56S19.32 8 17.823 8H17"/>
                    </g>
                  </svg>
                </button>
                <!-- <button
                  @click.stop="emitEdit(item, item.type)"
                  class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="Edit"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button> -->
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
                    <!-- <button
                      @click.stop="emitEdit(item, item.type)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Edit"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button> -->
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
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <g fill="none" stroke="currentColor">
                    <path d="M20 12v5c0 1.886 0 2.828-.586 3.414C18.828 21 17.886 21 16 21H6.5a2.5 2.5 0 0 1 0-5H16c1.886 0 2.828 0 3.414-.586C20 14.828 20 13.886 20 12V7c0-1.886 0-2.828-.586-3.414C18.828 3 17.886 3 16 3H8c-1.886 0-2.828 0-3.414.586C4 4.172 4 5.114 4 7v11.5"/>
                    <path stroke-linecap="round" d="M9 8h6"/>
                  </g>
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

const formatOptions = [
  { value: 'all', label: 'All Types', icon: 'Cards' },
  { value: 'quiz', label: 'Quizzes', icon: 'List' },
  { value: 'note', label: 'Notes', icon: 'FileText' },
  { value: 'flashcard', label: 'Flashcards', icon: 'HelpCircle' },
]


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
            console.log('🔧 Processing note content:', {
              itemId: item.id,
              contentData: contentData,
              contentDataKeys: Object.keys(contentData)
            })

            // ✅ แก้ไขการ parse note content ให้ถูกต้อง
            let noteContent = ''
            if (contentData.content && Array.isArray(contentData.content)) {
              // Note format: { type: "note", content: [{ feature: "...", description: "..." }] }
              noteContent = contentData.content
                .map((item: { feature?: string; description?: string }) => {
                  const feature = item.feature || 'Content'
                  const description = item.description || ''
                  return `**${feature}**\n${description}`
                })
                .join('\n\n')
            } else if (contentData.sections && Array.isArray(contentData.sections)) {
              // Alternative format: { sections: [{ content: "..." }] }
              noteContent = contentData.sections
                .map((section: { content?: string }) => section.content || '')
                .join('\n\n')
            } else if (typeof contentData.content === 'string') {
              // Simple string format
              noteContent = contentData.content
            } else {
              console.warn('⚠️ Unknown note content format:', contentData)
              noteContent = 'No content available'
            }

            console.log('✅ Parsed note content:', noteContent)

            return {
              id: `note-${item.id}`,
              type: 'note' as const,
              title: item.title || 'Untitled Note',
              subject: item.subject || 'General',
              difficulty: item.difficulty || 'medium',
              tags: item.tags || [],
              createdAt: item.createdAt,
              isDeck: false,
              content: noteContent,
              rawContentData: contentData // ✅ เก็บ raw data สำหรับ interactive view
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
      await api.delete(`/content/user/${contentId}`)

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
  console.log('🔧 === PREPARE CONTENT FOR INTERACTIVE ===')
  console.log('🔧 Item type:', item.type)
  console.log('🔧 Item data:', item)
  console.log('🔧 Item keys:', Object.keys(item))

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
            correctAnswer: (q.correctAnswer as string) || '',
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
      console.log('🎯 === QUIZ CASE ===')
      console.log('🎯 Has detailed content?', !!detailed)
      console.log('🎯 Has questions?', !!(detailed && detailed.questions))
      console.log('🎯 Questions is array?', !!(detailed && detailed.questions && Array.isArray(detailed.questions)))

      if (detailed && detailed.questions && Array.isArray(detailed.questions)) {
        console.log('✅ Using real quiz data with', detailed.questions.length, 'questions')
        console.log('📋 Raw quiz data:', detailed)
        console.log('📋 Questions array:', detailed.questions)
        console.log('📋 First question:', detailed.questions[0])
        console.log('📋 First question type:', detailed.questions[0]?.type)
        console.log('📋 First question keys:', detailed.questions[0] ? Object.keys(detailed.questions[0]) : 'No question')

                // Convert Manual Quiz format to Interactive Quiz format
        console.log('🔄 === CONVERTING QUESTIONS ===')
        const convertedQuestions = detailed.questions.map((q, index: number) => {
          console.log(`🔄 Processing question ${index + 1}:`, q)

                            // ✅ ใช้ helper function สำหรับ question type detection
        const questionType = getQuestionType(q)
        console.log(`🔍 Question ${index + 1} type from helper:`, questionType)
        console.log(`🔍 Question ${index + 1} original type:`, q?.type)
        console.log(`🔍 Question ${index + 1} raw type:`, typeof q?.type, q?.type)
        console.log(`🔍 Question ${index + 1} has type property:`, 'type' in q)
        console.log(`🔍 Question ${index + 1} all properties:`, Object.keys(q))

        // ✅ ตรวจสอบว่า helper function ทำงานถูกต้องหรือไม่
        console.log(`🔍 Question ${index + 1} helper function result:`, {
          originalType: q?.type,
          helperResult: questionType,
          isCorrect: q?.type === questionType
        })

                          // ✅ แก้ไข logic สำหรับ correctAnswer ตาม question type
        if (!q) {
          console.warn(`⚠️ Question ${index + 1} is undefined, skipping`)
          return {
            id: index + 1,
            type: 'multiple-choice',
            question: `Question ${index + 1}`,
            options: undefined,
            correctAnswer: '',
            explanation: ''
          }
        }

        // ✅ ใช้ correctAnswer จริงจาก backend
        const correctAnswer = q.correctAnswer || ''
        console.log(`🔍 Question ${index + 1} correctAnswer from backend:`, correctAnswer)

        if (questionType === 'multiple-choice') {
          // ✅ สำหรับ multiple choice ต้องมี options
          const choices = q.choices || q.options || ['Option A', 'Option B', 'Option C', 'Option D']

          return {
            id: index + 1,
            type: 'multiple-choice',
            question: q.questionText || q.question || q.text || `Question ${index + 1}`,
            options: choices.map((choice: string, choiceIndex: number) => ({
              id: choiceIndex.toString(),
              text: choice,
              correct: choice === correctAnswer // ✅ ใช้ correctAnswer จริง
            })),
            correctAnswer: correctAnswer, // ✅ ใช้ correctAnswer จริง
            explanation: q.explanation || q.feedback || `Explanation for question ${index + 1}`
          }
        } else if (questionType === 'open-ended') {
          // ✅ สำหรับ open-ended ไม่มี options
          return {
            id: index + 1,
            type: 'open-ended',
            question: q.questionText || q.question || q.text || `Question ${index + 1}`,
            options: undefined, // ✅ ไม่มี options
            correctAnswer: correctAnswer, // ✅ ใช้ correctAnswer จริง
            explanation: q.explanation || q.feedback || `Explanation for question ${index + 1}`
          }
        } else if (questionType === 'true-false') {
          // ✅ สำหรับ true/false
          return {
            id: index + 1,
            type: 'true-false',
            question: q.questionText || q.question || q.text || `Question ${index + 1}`,
            options: [
              { id: 'true', text: 'True', correct: correctAnswer === 'true' },
              { id: 'false', text: 'False', correct: correctAnswer === 'false' }
            ],
            correctAnswer: correctAnswer, // ✅ ใช้ correctAnswer จริง
            explanation: q.explanation || q.feedback || `Explanation for question ${index + 1}`
          }
        } else {
          // ✅ Other question types (short-answer, etc.)
          return {
            id: index + 1,
            type: questionType,
            question: q.questionText || q.question || q.text || `Question ${index + 1}`,
            options: undefined, // ไม่มี options
            correctAnswer: correctAnswer, // ✅ ใช้ correctAnswer จริง
            explanation: q.explanation || q.feedback || `Explanation for question ${index + 1}`
          }
        }
        })

                const finalQuizData = {
          title: detailed.title || item.title,
          questions: convertedQuestions
        }

        console.log('🎯 Final converted quiz data:', finalQuizData)
        console.log('📊 Questions preview:', convertedQuestions.map(q => ({
          id: q.id,
          type: q.type,
          question: q.question,
          optionsCount: q.options?.length,
          correctAnswer: q.correctAnswer
        })))

        // 🔍 DEBUG: ตรวจสอบ type ที่ละเอียดขึ้น
        console.log('🔍 Type analysis for converted questions:', {
          questionTypes: convertedQuestions.map(q => q.type),
          openEndedCount: convertedQuestions.filter(q => q.type === 'open-ended').length,
          multipleChoiceCount: convertedQuestions.filter(q => q.type === 'multiple-choice').length,
          hasOpenEnded: convertedQuestions.some(q => q.type === 'open-ended'),
          hasMultipleChoice: convertedQuestions.some(q => q.type === 'multiple-choice')
        })

        // 🔍 DEBUG: ตรวจสอบ correctAnswer ที่ละเอียดขึ้น
        console.log('🔍 CorrectAnswer analysis for converted questions:', {
          correctAnswers: convertedQuestions.map(q => q.correctAnswer),
          openEndedCorrectAnswers: convertedQuestions.filter(q => q.type === 'open-ended').map(q => q.correctAnswer),
          multipleChoiceCorrectAnswers: convertedQuestions.filter(q => q.type === 'multiple-choice').map(q => q.correctAnswer)
        })

        console.log('📤 === RETURNING QUIZ DATA ===')
        console.log('📤 Final quiz data object:', finalQuizData)
        console.log('📤 Final quiz data JSON:', JSON.stringify(finalQuizData))
        console.log('📤 Final quiz data type:', typeof JSON.stringify(finalQuizData))

        return JSON.stringify(finalQuizData)
      }

      // Fallback to mock data
      console.warn('⚠️ === FALLBACK TO MOCK DATA ===')
      console.warn('⚠️ No detailed quiz data, using mock')
      console.warn('⚠️ Detailed content:', detailed)
      console.warn('⚠️ Item:', item)

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
            correctAnswer: 'Sample answer',
            explanation: 'This is a sample question from your manual content.'
          }
        ]
      })

      case 'note':
        console.log('🔧 === NOTE INTERACTIVE VIEW ===')
        console.log('🔧 Item:', item)
        console.log('🔧 Has detailed content?', !!detailed)
        console.log('🔧 Detailed content:', detailed)

        // ✅ ใช้ rawContentData จาก item ก่อน
        const noteItem = item as ContentItem & { rawContentData?: Record<string, unknown> }
        if (noteItem.rawContentData) {
          console.log('✅ Using raw content data from item:', noteItem.rawContentData)

          // Parse note content จาก rawContentData
          let noteContent = ''
          if (noteItem.rawContentData.content && Array.isArray(noteItem.rawContentData.content)) {
            // Note format: { type: "note", content: [{ feature: "...", description: "..." }] }
            noteContent = noteItem.rawContentData.content
              .map((item: { feature?: string; description?: string }) => {
                const feature = item.feature || 'Content'
                const description = item.description || ''
                return `**${feature}**\n${description}`
              })
              .join('\n\n')
          } else if (noteItem.rawContentData.sections && Array.isArray(noteItem.rawContentData.sections)) {
            // Alternative format: { sections: [{ content: "..." }] }
            noteContent = noteItem.rawContentData.sections
              .map((section: { content?: string }) => section.content || '')
              .join('\n\n')
          } else if (typeof noteItem.rawContentData.content === 'string') {
            // Simple string format
            noteContent = noteItem.rawContentData.content
          }

          console.log('✅ Parsed note content for interactive view:', noteContent)
          return noteContent
        }

        // ✅ Fallback ไปใช้ detailed content
        if (detailed && detailed.content) {
          console.log('✅ Using detailed note data:', detailed.content)
          return detailed.content
        }

        // ✅ Fallback สุดท้าย: ใช้ content จาก item
        if ('content' in noteItem && noteItem.content) {
          console.log('✅ Using item content as fallback:', noteItem.content)
          return noteItem.content as string
        }

        // No content available
        console.warn('⚠️ No note content available; showing empty interactive note')
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

// ✅ Helper function สำหรับ question type detection
function getQuestionType(question: Record<string, unknown>): string {
  console.log('🔍 === GET QUESTION TYPE ===')
  console.log('🔍 Question data:', question)
  console.log('🔍 Question type field:', question.type)
  console.log('🔍 Question type type:', typeof question.type)
  console.log('🔍 Question options:', question.options)
  console.log('🔍 Question choices:', question.choices)

  // ✅ ตรวจสอบ type field ก่อน - เพิ่ม debug logging
  console.log('🔍 Checking if type is open-ended...')
  console.log('🔍 question.type === "open-ended":', question.type === 'open-ended')
  console.log('🔍 question.type === "open_ended":', question.type === 'open_ended')
  console.log('🔍 String(question.type) === "open-ended":', String(question.type) === 'open-ended')

  if (question.type === 'open-ended' || question.type === 'open_ended') {
    console.log('🔍 Type is open-ended, returning open-ended')
    return 'open-ended'
  }

  if (question.type === 'multiple-choice' || question.type === 'multiple_choice') {
    // ตรวจสอบ options ที่ถูกต้อง
    const hasValidOptions = question.options && Array.isArray(question.options) && question.options.length > 0
    const hasValidChoices = question.choices && Array.isArray(question.choices) && question.choices.length > 0

    console.log('🔍 Multiple choice detected, hasValidOptions:', hasValidOptions, 'hasValidChoices:', hasValidChoices)

    if (hasValidOptions || hasValidChoices) {
      console.log('🔍 Valid options found, returning multiple-choice')
      return 'multiple-choice'
    } else {
      // ถ้าไม่มี options ที่ถูกต้อง ให้เป็น open-ended
      console.log('🔍 No valid options, changing to open-ended')
      return 'open-ended'
    }
  }

  // Fallback: ตรวจสอบจาก options
  if (question.options && Array.isArray(question.options) && question.options.length > 0) {
    console.log('🔍 Fallback: options found, returning multiple-choice')
    return 'multiple-choice'
  }

  if (question.choices && Array.isArray(question.choices) && question.choices.length > 0) {
    console.log('🔍 Fallback: choices found, returning multiple-choice')
    return 'multiple-choice'
  }

  console.log('🔍 Fallback: no options/choices found, returning open-ended')
  return 'open-ended' // Default to open-ended
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

// ✅ Debug functions สำหรับทดสอบ
const debugNotes = async () => {
  try {
    console.log('🔍 === DEBUG NOTES TEST ===')
    const debugData = await UnifiedContentService.getDebugNotes()
    console.log('🔍 Debug notes result:', debugData)

    // แสดงผลใน alert สำหรับ debug
    alert(`Debug Notes Found: ${debugData.totalNotes}\nFirst note: ${debugData.notes[0]?.contentTitle || 'None'}`)
  } catch (error) {
    console.error('❌ Debug notes failed:', error)
    alert('Debug notes failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

const debugUnifiedAPI = async () => {
  try {
    console.log('🔍 === DEBUG UNIFIED API TEST ===')
    const response = await UnifiedContentService.getUserContent({
      source: 'manual',
      contentType: 'note',
      size: 100
    })
    console.log('🔍 Unified API result:', response)

    // แสดงผลใน alert สำหรับ debug
    alert(`Unified API Found: ${response.content.length} notes\nSuccess: ${response.success}`)
  } catch (error) {
    console.error('❌ Debug unified API failed:', error)
    alert('Debug unified API failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

onMounted(async () => {
  console.log('🚀 === MY CONTENT VIEW MOUNTED ===')

  // ✅ เพิ่ม debug tools ใน development mode
  if (import.meta.env.DEV) {
    console.log('🔧 Development mode: Adding debug tools to window')
    const windowWithDebug = window as typeof window & {
      debugNotes: typeof debugNotes
      debugUnifiedAPI: typeof debugUnifiedAPI
      debugLoadContent: typeof loadContentItems
      debugContentItems: () => typeof contentItems.value
      debugUnifiedContent: () => typeof unifiedContent.value
    }
    windowWithDebug.debugNotes = debugNotes
    windowWithDebug.debugUnifiedAPI = debugUnifiedAPI
    windowWithDebug.debugLoadContent = loadContentItems
    windowWithDebug.debugContentItems = () => contentItems.value
    windowWithDebug.debugUnifiedContent = () => unifiedContent.value
  }

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
