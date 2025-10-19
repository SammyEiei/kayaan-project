<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back Button -->
      <div class="mb-6">
        <button
          @click="onBack"
          class="group flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
        >
          <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </button>
      </div>

      <!-- Header Section -->
      <div class="mb-8">
        <div class="relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl p-8 text-white shadow-xl">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
            <div class="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-48 -translate-x-48"></div>
          </div>

          <div class="relative z-10">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-4 ring-white ring-opacity-30 shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-bold mb-1">
                  {{ editingContent ? 'Edit Quiz' : 'Create New Quiz' }}
                </h1>
                <p class="text-orange-100">
                  {{ editingContent ? 'Update your quiz content' : 'Build an interactive quiz for your students' }}
                </p>
              </div>
            </div>

            <!-- Progress Steps -->
            <div class="flex items-center justify-center gap-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 mt-6">
              <div class="flex items-center">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center bg-white text-green-600 shadow-md">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-white hidden sm:inline">Manual Creation</span>
                </div>
                <div class="mx-2 w-8 sm:w-12 h-1 bg-white bg-opacity-50 rounded-full"></div>
              </div>
              <div class="flex items-center">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center bg-white text-green-600 shadow-md">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-white hidden sm:inline">Quiz Selected</span>
                </div>
                <div class="mx-2 w-8 sm:w-12 h-1 bg-white bg-opacity-50 rounded-full"></div>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full flex items-center justify-center bg-white text-orange-600 shadow-md">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span class="text-sm font-semibold text-white hidden sm:inline">Create Content</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Action Buttons -->
        <div class="flex justify-end gap-3">
          <button
            class="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
            @click="onBack"
          >
            Cancel
          </button>
          <button
            :class="[
              'px-5 py-2.5 rounded-xl transition-all duration-200 font-medium flex items-center gap-2',
              isFormValid && !isSaving
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-sm'
            ]"
            @click="handleSave"
            :disabled="!isFormValid || isSaving"
            :title="saveButtonTooltip"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span v-if="!isSaving">Save Quiz</span>
            <span v-else>Saving...</span>
          </button>
        </div>
        <!-- Error/Success Messages -->
        <div v-if="errorMessage" class="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl shadow-md flex items-center gap-3">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>
        <div v-if="successMessage" class="bg-green-50 border-2 border-green-200 text-green-700 px-5 py-4 rounded-xl shadow-md flex items-center gap-3">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Quiz Details -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Quiz Configuration</h2>
              <p class="text-xs text-gray-600">Set up your quiz details and settings</p>
            </div>
          </div>

          <!-- Quiz Information -->
          <div class="mb-8">
            <label class="block text-sm font-semibold text-gray-700 mb-4">Quiz Information</label>

            <div class="space-y-4">
              <div>
                <label for="quiz-title" class="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                <input
                  id="quiz-title"
                  v-model="title"
                  placeholder="Enter an engaging quiz title..."
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-colors duration-150"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="quiz-subject" class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    id="quiz-subject"
                    v-model="subject"
                    placeholder="e.g., Mathematics, Science, History"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-colors duration-150"
                  />
                </div>
                <div>
                  <label for="quiz-tags" class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    id="quiz-tags"
                    v-model="tags"
                    placeholder="concepts, practice, exam-prep"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-colors duration-150"
                  />
                </div>
              </div>

              <div>
                <label for="difficulty-level" class="block text-sm font-medium text-gray-700 mb-3">Difficulty Level</label>
                <div id="difficulty-level" class="flex gap-3 flex-wrap" role="radiogroup" aria-labelledby="difficulty-level">
                  <button
                    v-for="diff in difficultyOptions"
                    :key="diff.value"
                    @click="difficulty = diff.value"
                    :class="[
                      'px-5 py-3 rounded-xl font-medium border-2 transition-all duration-200 flex items-center gap-2',
                      difficulty === diff.value
                        ? diff.activeClass + ' transform scale-105 shadow-md'
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-300'
                    ]"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="diff.value === 'easy'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path v-else-if="diff.value === 'medium'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="capitalize">{{ diff.value }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Questions Section -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>Questions</span>
                  <span class="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-sm font-semibold px-3 py-1 rounded-full border border-orange-200">
                    {{ questions.length }}
                  </span>
                </h3>
                <p class="text-xs text-gray-600 mt-0.5">Create and manage your quiz questions</p>
              </div>
            </div>
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <div v-if="questions.length > 1" class="flex items-center gap-2">
                <button
                  @click="collapseAll"
                  class="px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-150 font-medium"
                >
                  Collapse All
                </button>
                <button
                  @click="expandAll"
                  class="px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-150 font-medium"
                >
                  Expand All
                </button>
              </div>
              <button
                class="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2 transform hover:scale-105"
                @click="addQuestion"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span class="hidden sm:inline">Add Question</span>
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <div v-for="(question, index) in questions" :key="question.id" :id="`question-${question.id}`" class="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200 hover:border-orange-300">
              <!-- Question Header -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3 flex-1">
                  <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-md">
                    {{ index + 1 }}
                  </div>
                  <h4 class="text-lg font-bold text-gray-900">Question {{ index + 1 }}</h4>
                  <!-- <div v-if="question.question.trim()" class="text-sm text-gray-600 truncate max-w-md hidden sm:block">
                    "{{ question.question.slice(0, 50) }}{{ question.question.length > 50 ? '...' : '' }}"
                  </div> -->
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="toggleQuestion(question.id)"
                    class="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all duration-150 hover:text-gray-700"
                    :title="isQuestionCollapsed(question.id) ? 'Expand' : 'Collapse'"
                  >
                    <svg class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': isQuestionCollapsed(question.id) }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    v-if="questions.length > 1"
                    @click="removeQuestion(question.id)"
                    class="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 border-2 border-red-200 rounded-xl transition-all duration-150 flex items-center gap-1 shadow-sm hover:shadow-md"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div v-show="!isQuestionCollapsed(question.id)" class="space-y-4 transition-all duration-200">
                <!-- Question Type -->
                <div>
                  <label :for="'question-type-' + question.id" class="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                  <select
                    :id="'question-type-' + question.id"
                    v-model="question.type"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-colors duration-150 bg-white"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="open-ended">Open-ended</option>
                  </select>
                </div>

                <!-- Question Content -->
                <div>
                  <label :for="'question-text-' + question.id" class="block text-sm font-medium text-gray-700 mb-2">Question</label>
                  <textarea
                    :id="'question-text-' + question.id"
                    v-model="question.question"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-colors duration-150 resize-none"
                    rows="3"
                    placeholder="Enter your question here..."
                  ></textarea>
                </div>

                <!-- Multiple Choice Options -->
                <div v-if="question.type === 'multiple-choice'" class="space-y-3">
                  <fieldset id="answer-options" class="space-y-3 border-0 p-0">
                    <legend class="block text-base font-semibold text-gray-700 mb-3">Answer Options</legend>
                    <div v-for="(option, i) in question.options" :key="i" class="bg-gradient-to-r from-gray-50 to-orange-50 border-2 border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-all duration-150 hover:shadow-md">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-md flex-shrink-0">
                          {{ String.fromCharCode(65 + i) }}
                        </div>
                        <input
                          v-model="question.options[i]"
                          :id="'option-' + question.id + '-' + i"
                          class="flex-1 px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-colors duration-150 bg-white"
                          :placeholder="'Option ' + String.fromCharCode(65 + i)"
                        />
                        <div class="flex items-center gap-2 flex-shrink-0">
                          <input
                            type="radio"
                            :id="'correct-' + question.id + '-' + i"
                            :name="'correct-' + question.id"
                            :value="question.options[i]"
                            v-model="question.correctAnswer"
                            class="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
                          >
                          <label :for="'correct-' + question.id + '-' + i" class="text-sm font-medium text-gray-700 cursor-pointer">
                            <span class="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold border border-green-200">Correct</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>

                <!-- Answer section for non-multiple-choice -->
                <div v-if="question.type !== 'multiple-choice'">
                  <label for="correct-answer" class="block text-sm font-medium text-gray-700 mb-2">Answer</label>

                  <select
                    v-if="question.type === 'true-false'"
                    v-model="question.correctAnswer"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-colors duration-150 bg-white"
                  >
                    <option value="">Select answer...</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>

                  <textarea
                    v-else
                    v-model="question.correctAnswer"
                    rows="3"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-colors duration-150 resize-none"
                    placeholder="Enter the correct answer or explanation..."
                  />
                </div>
              </div>

              <!-- Inline Add Question Button (appears after last question) -->
              <div v-if="index === questions.length - 1" class="mt-6 flex justify-center pt-4 border-t border-gray-200">
                <button
                  @click="addQuestion"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold group transform hover:scale-105"
                  title="Add Another Question"
                >
                  <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Next Question
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="questions.length === 0" class="text-center py-16">
            <div class="w-24 h-24 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg class="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Ready to create your first question?</h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">Start building your interactive quiz by adding questions. You can mix multiple choice, true/false, and open-ended questions.</p>
            <button
              class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              @click="addQuestion"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create First Question
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Menu -->
    <div v-if="questions.length >= 2" class="floating-action-menu fixed bottom-6 right-6 z-50">
      <!-- Action Menu Items -->
      <div v-show="showFloatingMenu" class="absolute bottom-16 right-0 mb-2 space-y-3 transition-all duration-200">
        <!-- Quick Add Question -->
        <button
          @click="addQuestion; showFloatingMenu = false"
          class="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 whitespace-nowrap"
          title="Quick Add Question"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span class="text-sm font-medium">Quick Add</span>
        </button>

        <!-- Collapse All -->
        <button
          @click="collapseAll; showFloatingMenu = false"
          class="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-slate-700 hover:text-orange-600 hover:border-orange-300 whitespace-nowrap"
          title="Collapse All Questions"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l3-3m0 0l3 3m-3-3v12M5 5h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
          </svg>
          <span class="text-sm font-medium">Collapse All</span>
        </button>

        <!-- Expand All -->
        <button
          @click="expandAll; showFloatingMenu = false"
          class="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-slate-700 hover:text-green-600 hover:border-green-300 whitespace-nowrap"
          title="Expand All Questions"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8l3 3m0 0l3-3m-3 3V4M5 19h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          <span class="text-sm font-medium">Expand All</span>
        </button>

        <!-- Back to Top -->
        <button
          @click="scrollToTop; showFloatingMenu = false"
          class="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-slate-700 hover:text-purple-600 hover:border-purple-300 whitespace-nowrap"
          title="Back to Top"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
          <span class="text-sm font-medium">Back to Top</span>
        </button>
      </div>

      <!-- Main Floating Button -->
      <button
        @click="toggleFloatingMenu"
        class="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group transform hover:scale-105"
        :class="{ 'rotate-45': showFloatingMenu }"
        title="Quick Actions"
      >
        <svg class="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ManualContentService from '@/service/ManualContentService'
import { JSONContentValidator, ContentConverter } from '@/utils/jsonContentValidators'
import { ensureAuthenticated, handleAuthError, logAuthStatus } from '@/utils/authHelper'

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'open-ended';
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizContent {
  title: string;
  subject: string;
  tags: string[];
  difficulty: string;
  questions: Question[];
}

const router = useRouter()

const props = defineProps<{ editingContent?: QuizContent }>()

const title = ref(props.editingContent?.title || '')
const subject = ref(props.editingContent?.subject || '')
const tags = ref(props.editingContent?.tags?.join(', ') || '')
const difficulty = ref(props.editingContent?.difficulty || 'easy')
const questions = ref<Question[]>(
  props.editingContent?.questions?.map((q) => ({
    ...q,
    options: q.options || ['', '', '', ''],
    correctAnswer: q.type === 'multiple-choice' ? (Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer) : q.correctAnswer
  })) || [
    {
      id: '1',
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    }
  ]
)

const difficultyOptions = [
  {
    value: 'easy',
    activeClass: 'border-green-500 bg-green-50 text-green-700'
  },
  {
    value: 'medium',
    activeClass: 'border-yellow-500 bg-yellow-50 text-yellow-700'
  },
  {
    value: 'hard',
    activeClass: 'border-red-500 bg-red-50 text-red-700'
  }
]

const isSaving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const collapsedQuestions = ref<Set<string>>(new Set())
const showFloatingMenu = ref(false)

// Computed property to check if form is valid for saving
const isFormValid = computed(() => {
  // Check if title is filled
  if (!title.value.trim()) return false

  // Check if at least one question exists
  if (questions.value.length === 0) return false

  // Check if all questions are properly filled
  for (const q of questions.value) {
    // Check if question text is filled
    if (!q.question.trim()) return false

    // Check based on question type
    if (q.type === 'multiple-choice') {
      const filledOptions = q.options.filter(o => o.trim())
      if (filledOptions.length < 2) return false
      if (!q.correctAnswer || !filledOptions.includes(q.correctAnswer)) return false
      if (q.options.some(o => !o.trim())) return false // All options must have content
    } else if (q.type === 'true-false') {
      if (!q.correctAnswer || !['true', 'false'].includes(q.correctAnswer.toLowerCase())) return false
    } else if (q.type === 'open-ended') {
      if (!q.correctAnswer || !q.correctAnswer.trim()) return false
    }
  }

  return true
})

// Computed property for save button tooltip message
const saveButtonTooltip = computed(() => {
  if (isSaving.value) return 'กำลังบันทึก...'
  if (!isFormValid.value) {
    if (!title.value.trim()) return 'กรุณากรอกชื่อ Quiz'
    if (questions.value.length === 0) return 'กรุณาเพิ่มคำถามอย่างน้อย 1 ข้อ'

    // Check specific question issues
    for (let i = 0; i < questions.value.length; i++) {
      const q = questions.value[i]
      const questionNumber = i + 1

      if (!q.question.trim()) return `กรุณากรอกข้อความคำถามที่ ${questionNumber}`

      if (q.type === 'multiple-choice') {
        const filledOptions = q.options.filter(o => o.trim())
        if (filledOptions.length < 2) return `คำถามที่ ${questionNumber} ต้องมีตัวเลือกอย่างน้อย 2 ข้อ`
        if (!q.correctAnswer || !filledOptions.includes(q.correctAnswer)) return `คำถามที่ ${questionNumber} ต้องเลือกคำตอบที่ถูกต้อง`
      } else if (q.type === 'true-false') {
        if (!q.correctAnswer || !['true', 'false'].includes(q.correctAnswer.toLowerCase())) return `คำถามที่ ${questionNumber} ต้องเลือก True หรือ False`
      } else if (q.type === 'open-ended') {
        if (!q.correctAnswer || !q.correctAnswer.trim()) return `คำถามที่ ${questionNumber} ต้องกรอกคำตอบ`
      }
    }

    return 'กรุณากรอกข้อมูลให้ครบถ้วน'
  }
  return 'บันทึก Quiz'
})

function addQuestion() {
  const newId = Date.now().toString()
  questions.value.push({
    id: newId,
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  })

  // Auto-scroll to new question
  nextTick(() => {
    const element = document.getElementById(`question-${newId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Focus on question input
      const questionInput = element.querySelector('textarea')
      if (questionInput) {
        questionInput.focus()
      }
    }
  })
}

function removeQuestion(id: string) {
  questions.value = questions.value.filter(q => q.id !== id)
  collapsedQuestions.value.delete(id)
}

function toggleQuestion(id: string) {
  if (collapsedQuestions.value.has(id)) {
    collapsedQuestions.value.delete(id)
  } else {
    collapsedQuestions.value.add(id)
  }
}

function isQuestionCollapsed(id: string) {
  return collapsedQuestions.value.has(id)
}

function collapseAll() {
  questions.value.forEach(q => {
    collapsedQuestions.value.add(q.id)
  })
}

function expandAll() {
  collapsedQuestions.value.clear()
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function toggleFloatingMenu() {
  showFloatingMenu.value = !showFloatingMenu.value
}

function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement
  const floatingMenu = document.querySelector('.floating-action-menu')
  if (floatingMenu && !floatingMenu.contains(target)) {
    showFloatingMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function onBack() {
  router.push('/create-content')
}

async function handleSave() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!title.value.trim()) {
    errorMessage.value = 'Please enter a quiz title'
    return
  }

  if (questions.value.length === 0) {
    errorMessage.value = 'Please add at least one question'
    return
  }

  for (let i = 0; i < questions.value.length; i++) {
    const q = questions.value[i]
    const questionNumber = i + 1 // Display number (1-based)

    if (!q.question.trim()) {
      errorMessage.value = `Question ${questionNumber} cannot be empty`
      return
    }
    if (q.type === 'multiple-choice') {
      const filled = q.options.filter(o => o.trim())
      if (filled.length < 2) {
        errorMessage.value = `Question ${questionNumber} must have at least 2 answer choices`
        return
      }
      // Ensure correctAnswer is one of the valid choices
      if (!q.correctAnswer || !filled.includes(q.correctAnswer)) {
        errorMessage.value = `Question ${questionNumber}: correct answer must be one of the provided choices`
        return
      }
      // Ensure all options have content
      if (q.options.some(o => !o.trim())) {
        errorMessage.value = `Question ${questionNumber}: all options must have content`
        return
      }
    } else if (q.type === 'true-false') {
      if (!q.correctAnswer || !['true', 'false'].includes(q.correctAnswer.toLowerCase())) {
        errorMessage.value = `Question ${questionNumber}: correct answer must be "true" or "false"`
        return
      }
    } else if (q.type === 'open-ended') {
      if (!q.correctAnswer || !q.correctAnswer.trim()) {
        errorMessage.value = `Question ${questionNumber}: answer cannot be empty`
        return
      }
    }
  }

  isSaving.value = true
  const quizPayload = {
    title: title.value,
    questions: questions.value.map(q => ({
      questionText: q.question,
      type: (q.type === 'multiple-choice'
        ? 'MULTIPLE_CHOICE'
        : q.type === 'true-false'
          ? 'TRUE_FALSE'
          : 'OPEN_ENDED') as 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'OPEN_ENDED',
      choices: q.type === 'multiple-choice' ? q.options : undefined,
      correctAnswer: q.correctAnswer,
      subject: subject.value,
      difficulty: difficulty.value,
      tags: tags.value.split(',').map(tag => tag.trim()).filter(Boolean),
    })),
  }

  // Debug information
  console.log('🔍 Quiz Creation Debug:')
  console.log('📡 Backend URL:', import.meta.env.VITE_BACKEND_URL)
  console.log('📦 Quiz Payload:', quizPayload)
  logAuthStatus()

  try {
    // Enhanced authentication check
    if (!(await ensureAuthenticated())) {
      errorMessage.value = 'Please log in to create a quiz'
      return
    }

    console.log('📝 Creating quiz via JSON API...')

    // Convert to JSON format
    const jsonQuiz = ContentConverter.quizToJSON({
      title: title.value,
      questions: questions.value.map(q => {
        // Filter out empty options and ensure correctAnswer is valid
        const validChoices = q.type === 'multiple-choice' ? q.options.filter(o => o.trim()) : []

        // Ensure correctAnswer is one of the valid choices
        let validCorrectAnswer = q.correctAnswer
        if (q.type === 'multiple-choice' && validChoices.length > 0) {
          if (!validChoices.includes(q.correctAnswer)) {
            // If correctAnswer is not in valid choices, use the first valid choice
            validCorrectAnswer = validChoices[0]
            console.warn(`⚠️ Question ${q.id}: correctAnswer corrected from "${q.correctAnswer}" to "${validCorrectAnswer}"`)
          }
        } else if (q.type === 'true-false') {
          // Normalize true/false answers
          validCorrectAnswer = q.correctAnswer?.toLowerCase() === 'true' ? 'true' : 'false'
        } else if (q.type === 'open-ended') {
          // Ensure open-ended answer is not empty
          validCorrectAnswer = q.correctAnswer?.trim() || 'No answer provided'
        }

        console.log(`🔍 Question ${q.id}:`, {
          questionText: q.question,
          type: q.type,
          choices: validChoices,
          correctAnswer: validCorrectAnswer,
          originalCorrectAnswer: q.correctAnswer,
          options: q.options,
          hasCorrectAnswer: !!q.correctAnswer,
          correctAnswerInChoices: validChoices.includes(q.correctAnswer)
        })

        return {
          questionText: q.question,
          type: q.type === 'multiple-choice' ? 'MULTIPLE_CHOICE' :
                q.type === 'true-false' ? 'TRUE_FALSE' : 'OPEN_ENDED',
          choices: validChoices,
          correctAnswer: validCorrectAnswer,
          explanation: ''
        }
      })
    })

    // Debug: Log the JSON structure
    console.log('🔍 JSON Quiz structure:', JSON.stringify(jsonQuiz, null, 2))

    // Validate JSON
    JSONContentValidator.validateQuizJSON(jsonQuiz)

    // Create via JSON API
    const result = await ManualContentService.createContent({
      contentTitle: title.value,
      contentType: 'quiz' as const,
      contentData: JSON.stringify(jsonQuiz),
      subject: subject.value,
      difficulty: difficulty.value,
      tags: tags.value.split(',').map(tag => tag.trim()).filter(Boolean)
    })

    console.log('✅ Quiz created via JSON API:', result)
    successMessage.value = `Quiz "${title.value}" saved successfully!`

  } catch (err: unknown) {
    console.error('❌ Quiz Creation Error:', err)
    handleAuthError(err, 'Quiz creation')

    if (err instanceof Error) {
      errorMessage.value = err.message
    } else {
      errorMessage.value = 'Failed to save quiz. Please try again.'
    }
    isSaving.value = false
    return
  }

  // Success handling
  setTimeout(() => {
    isSaving.value = false
    onBack()
  }, 1500)
}
</script>

<style scoped>
/* Focus states */
input:focus,
textarea:focus,
select:focus {
  outline: none;
}

/* Custom scrollbar for textareas */
textarea::-webkit-scrollbar {
  width: 4px;
}

textarea::-webkit-scrollbar-track {
  background: transparent;
}

textarea::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}
</style>
