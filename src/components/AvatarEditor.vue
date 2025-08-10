<template>
  <div
    class="max-w-7xl mx-auto p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-xl"
  >
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Avatar Settings</h1>
      <p class="text-gray-600">Choose your profile picture</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
      <!-- Left Side: Preview & Save -->
      <div class="flex flex-col justify-between">
        <!-- Avatar Preview -->
        <div class="text-center">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">Current Avatar</h2>

          <div class="flex justify-center mb-8">
            <div class="relative group">
              <div
                class="w-36 h-36 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 border-4 border-white shadow-xl flex items-center justify-center text-gray-700 text-3xl font-semibold overflow-hidden ring-2 ring-blue-100"
              >
                <img
                  v-if="selectedAvatar"
                  :src="selectedAvatar"
                  :style="{ transform: `rotate(${rotation}deg)` }"
                  class="w-36 h-36 rounded-full object-cover transition-transform duration-300"
                  alt="Your avatar"
                />
                <span v-else class="text-3xl">{{ displayNameInitials }}</span>
              </div>

              <!-- Loading overlay -->
              <div
                v-if="isGenerating || isSaving"
                class="absolute inset-0 bg-white bg-opacity-90 rounded-full flex items-center justify-center"
              >
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>

              <!-- Edit overlay for uploaded images -->
              <div
                v-if="uploadedImage && !isSaving"
                class="absolute inset-0 bg-blue-600/15 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer backdrop-blur-sm"
                @click="toggleEditing"
              >
                <svg
                  class="w-7 h-7 text-blue-700"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div v-if="selectedAvatar" class="mb-6">
            <button
              @click="resetSelection"
              class="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-all duration-200"
            >
              Remove Avatar
            </button>
          </div>

          <!-- Image Editor -->
          <div
            v-if="isEditing && uploadedImage"
            class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <h4 class="font-medium text-gray-800 mb-3 flex items-center justify-center gap-2">
              <svg
                class="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21,15 16,10 5,21" />
              </svg>
              Adjust Your Photo
            </h4>
            <div class="flex justify-center gap-2">
              <button
                @click="rotateImage('left')"
                class="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm hover:bg-blue-50 transition-colors flex items-center gap-1"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M1 4v6h6" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                Left
              </button>
              <button
                @click="rotateImage('right')"
                class="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm hover:bg-blue-50 transition-colors flex items-center gap-1"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 4v6h-6" />
                  <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
                </svg>
                Right
              </button>
              <button
                @click="resetRotation"
                class="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm hover:bg-blue-50 transition-colors flex items-center gap-1"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Reset
              </button>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="text-center pt-6 border-t border-gray-200">
          <button
            @click="saveAvatar"
            :disabled="!selectedAvatar || isSaving"
            class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
            <span v-if="!isSaving">Save Avatar</span>
            <span v-else>Saving...</span>
          </button>

          <!-- Messages -->
          <div v-if="message" class="mt-4">
            <div
              :class="[
                'inline-block px-4 py-2 rounded-full text-sm font-medium',
                messageType === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200',
              ]"
            >
              {{ message }}
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side: Options -->
      <div class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-6 text-center">Select Avatar</h2>

        <!-- Option A: Upload Custom Image -->
        <div class="bg-white/70 backdrop-blur-sm rounded-xl border border-white/60 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
            <h3 class="font-semibold flex items-center gap-2">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Upload Your Photo
            </h3>
          </div>

          <div class="p-4">
            <label class="block cursor-pointer">
              <div
                class="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300"
              >
                <svg
                  class="w-8 h-8 text-blue-400 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <p class="font-medium text-blue-600">
                  {{ uploadedImage ? 'Change Photo' : 'Click to Upload' }}
                </p>
                <p class="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileUpload"
                class="sr-only"
              />
            </label>
          </div>
        </div>

        <!-- Option B: Generate Avatar -->
        <div class="bg-white/70 backdrop-blur-sm rounded-xl border border-white/60 overflow-hidden">
          <div class="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4">
            <h3 class="font-semibold flex items-center gap-2">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Generate Avatar
            </h3>
          </div>

          <div class="p-4 space-y-4">
            <!-- Style Selector -->
            <div>
              <div class="flex flex-wrap gap-1 mb-3">
                <button
                  v-for="style in avatarStyles.slice(0, 6)"
                  :key="style"
                  @click="switchStyle(style)"
                  :disabled="isGenerating"
                  :class="[
                    'px-2 py-1 rounded text-xs font-medium transition-all duration-200 disabled:opacity-50',
                    currentStyle === style
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  ]"
                >
                  {{ formatStyleName(style).split(' ')[0] }}
                </button>
              </div>

              <div class="flex flex-wrap gap-1">
                <button
                  v-for="style in avatarStyles.slice(6)"
                  :key="style"
                  @click="switchStyle(style)"
                  :disabled="isGenerating"
                  :class="[
                    'px-2 py-1 rounded text-xs font-medium transition-all duration-200 disabled:opacity-50',
                    currentStyle === style
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  ]"
                >
                  {{ formatStyleName(style).split(' ')[0] }}
                </button>
              </div>
            </div>

            <!-- Generate Button -->
            <div class="text-center">
              <button
                @click="regenerateAvatars"
                :disabled="isGenerating"
                class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <svg
                  v-if="!isGenerating"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span v-if="!isGenerating">Generate</span>
                <span v-else>Generating...</span>
              </button>
            </div>

            <!-- Generated Avatars Grid -->
            <div v-if="generatedAvatars.length > 0" class="max-h-64 overflow-y-auto">
              <div class="grid grid-cols-4 gap-2">
                <div
                  v-for="(avatar, index) in generatedAvatars"
                  :key="`generated-${index}`"
                  class="relative group cursor-pointer"
                  @click="selectAvatar(avatar)"
                >
                  <img
                    :src="avatar"
                    class="w-full aspect-square rounded-lg object-cover border-2 transition-all duration-300 group-hover:scale-105"
                    :class="
                      selectedAvatar === avatar && !uploadedImage
                        ? 'border-purple-500 ring-2 ring-purple-300'
                        : 'border-gray-200 hover:border-purple-300'
                    "
                    :alt="`Avatar ${index + 1}`"
                  />

                  <!-- Selection indicator -->
                  <div
                    v-if="selectedAvatar === avatar && !uploadedImage"
                    class="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <div v-if="generatedAvatars.length === 0 && !isGenerating" class="text-center py-6">
              <div class="text-gray-400 text-2xl mb-2">🎨</div>
              <p class="text-gray-500 text-sm">Click Generate to see options</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { watchEffect } from 'vue'
import { useAvatarStore } from '@/service/AvatarService'
import { useAuthStore } from '@/stores/auth'

const avatarStore = useAvatarStore()
const authStore = useAuthStore()
const avatarStyles = [
  'avataaars',
  'bottts',
  'pixel-art',
  'fun-emoji',
  'micah',
  'miniavs',
  'open-peeps',
  'personas',
  'identicon',
]

const currentStyle = ref('avataaars')
const generatedAvatars = ref<string[]>([])
const selectedAvatar = ref('')
const uploadedImage = ref<string | null>(null)
const rotation = ref(0)
const isEditing = ref(false)
const isGenerating = ref(false)
const isSaving = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const displayName = 'Kay Anderson'
const userId = computed(() => authStore.userId)
const fileInput = ref<HTMLInputElement>()
const fileToUpload = ref<File | null>(null) // 🆕 Add this to store the actual file

watchEffect(() => {
  if (authStore.user?.id) {
    // Fix: userId is computed, not ref
    // userId.value = authStore.user.id
  }
})

const displayNameInitials = computed(() =>
  displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase(),
)

function formatStyleName(style: string): string {
  return style
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function generateSeed(): string {
  return Math.random().toString(36).substring(7)
}

function generateAvatarUrl(style: string, seed: string): string {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&size=80`
}

async function generateAvatars(style: string): Promise<void> {
  isGenerating.value = true
  clearMessage()

  try {
    const avatars = []
    for (let i = 0; i < 8; i++) {
      avatars.push(generateAvatarUrl(style, generateSeed()))
    }

    // Simulate loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    generatedAvatars.value = avatars
  } catch (error) {
    showMessage('Error generating avatars', 'error')
  } finally {
    isGenerating.value = false
  }
}

function selectAvatar(avatarUrl: string): void {
  selectedAvatar.value = avatarUrl
  uploadedImage.value = null
  clearMessage()
}

function handleFileUpload(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showMessage('Please select an image file', 'error')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('File size must be less than 5MB', 'error')
      return
    }

    fileToUpload.value = file
    uploadedImage.value = URL.createObjectURL(file)
    selectedAvatar.value = uploadedImage.value
    isEditing.value = true
    clearMessage()
  }
}

function toggleEditing(): void {
  isEditing.value = !isEditing.value
}

function rotateImage(direction: 'left' | 'right'): void {
  if (direction === 'left') {
    rotation.value = (rotation.value - 90) % 360
  } else {
    rotation.value = (rotation.value + 90) % 360
  }
}

function resetSelection(): void {
  selectedAvatar.value = ''
  uploadedImage.value = null
  fileToUpload.value = null
  rotation.value = 0
  isEditing.value = false
  clearMessage()
}

async function saveAvatar(): Promise<void> {
  if (!selectedAvatar.value) {
    showMessage('Please select an avatar first', 'error')
    return
  }

  isSaving.value = true
  clearMessage()

  try {
    if (!userId.value) {
      showMessage('User ID is not available. Please try logging in again.', 'error')
      return
    }

    // 🆕 Check if we have a file to upload
    if (fileToUpload.value) {
      // Use new signed URL upload flow
      await uploadAvatarFile(userId.value, fileToUpload.value, rotation.value)
    } else if (selectedAvatar.value) {
      // Use updateAvatarUrl for URLs (generated avatars)
      await avatarStore.updateAvatarUrl(userId.value, {
        avatarUrl: selectedAvatar.value,
        rotation: rotation.value,
      })
    }

    // 🆕 Refresh user info to ensure everything is synced
    await authStore.fetchUserInfo()

    // Update authStore with new avatar URL
    authStore.setAvatar(selectedAvatar.value)

    showMessage('Avatar saved successfully! 🎉', 'success')
    isEditing.value = false
    fileToUpload.value = null // Clear file after successful save
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    showMessage(`Error saving avatar: ${errorMessage}`, 'error')
  } finally {
    isSaving.value = false
  }
}

// New function for signed URL upload
async function uploadAvatarFile(userId: number, file: File, rotation: number) {
  const { getSignedUploadUrl, uploadToSignedUrl, saveAvatarPath } = await import('@/services/avatarService')

  // Step 1: Get signed URL
  const signed = await getSignedUploadUrl(userId, file)
  const putUrl = signed.signedUrl ?? signed.uploadUrl

  if (!putUrl) {
    throw new Error('No signed upload URL returned from server')
  }

  // Step 2: Upload to signed URL
  await uploadToSignedUrl(putUrl, file)

  // Step 3: Save path and get display URL
  const result = await saveAvatarPath(userId, signed.path)

  if (result.avatarUrl) {
    // Update auth store
    authStore.setAvatarUrl(result.avatarUrl, rotation)
  } else {
    // Fallback: refresh user data
    await authStore.fetchUserInfo()
  }
}

function showMessage(msg: string, type: 'success' | 'error'): void {
  message.value = msg
  messageType.value = type

  // Auto-clear success messages
  if (type === 'success') {
    setTimeout(() => {
      clearMessage()
    }, 3000)
  }
}

function clearMessage(): void {
  message.value = ''
}

// Initialize
generateAvatars(currentStyle.value)
</script>

<style scoped>
/* Smooth transitions for all interactive elements */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Enhanced hover effects */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
