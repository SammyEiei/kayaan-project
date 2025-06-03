<template>
  <div class="backdrop-blur-lg bg-white/60 rounded-2xl border border-white/50 p-8 shadow-xl">
    <div class="space-y-8">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h2 class="text-2xl font-bold text-gray-800">Avatar Customization</h2>
        <p class="text-gray-600">Choose or upload your perfect avatar</p>
      </div>

      <!-- Current Avatar Preview -->
      <div class="flex justify-center">
        <div class="relative group">
          <div
            class="absolute -inset-3 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"
          ></div>
          <div
            class="relative w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-2xl overflow-hidden"
          >
            <img
              v-if="selectedAvatar"
              :src="selectedAvatar"
              :style="{ transform: `rotate(${rotation}deg)` }"
              class="w-32 h-32 rounded-full object-cover transition-transform duration-300"
              alt="Avatar preview"
            />
            <span v-else class="text-3xl">{{
              displayName
                .split(' ')
                .map((n) => n[0])
                .join('')
            }}</span>
          </div>

          <!-- Edit overlay -->
          <div
            v-if="selectedAvatar && isEditing"
            class="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg
              class="w-8 h-8 text-white"
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

      <!-- Upload Section -->
      <div class="bg-white/50 rounded-xl p-6 border border-white/30">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg
            class="w-5 h-5 text-purple-600"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Upload Custom Image
        </h3>

        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row gap-4 items-start">
            <label class="flex-1">
              <div class="relative group cursor-pointer">
                <div
                  class="flex items-center justify-center w-full h-32 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-500 transition-colors duration-300 bg-purple-50/50 hover:bg-purple-100/50"
                >
                  <div class="text-center">
                    <svg
                      class="w-8 h-8 text-purple-400 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7,10 12,15 17,10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <p class="text-sm text-purple-600 font-medium">Click to upload</p>
                    <p class="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleFileUpload"
                  class="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </label>

            <div class="flex flex-col gap-2 sm:w-auto w-full">
              <button
                v-if="uploadedImage"
                @click="triggerFileUpload"
                class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Replace Image
              </button>
              <button
                v-if="selectedAvatar"
                @click="removeAvatar"
                class="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Editor (shown when editing uploaded image) -->
      <div
        v-if="isEditing && uploadedImage"
        class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200"
      >
        <h4 class="font-semibold mb-4 flex items-center gap-2">
          <svg
            class="w-5 h-5 text-purple-600"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21,15 16,10 5,21" />
          </svg>
          Edit Avatar
        </h4>
        <div class="flex flex-wrap gap-3">
          <button
            @click="rotateImage('left')"
            class="px-4 py-2 bg-white/80 hover:bg-white border border-purple-200 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-md"
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
            Rotate Left
          </button>
          <button
            @click="rotateImage('right')"
            class="px-4 py-2 bg-white/80 hover:bg-white border border-purple-200 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-md"
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
            Rotate Right
          </button>
          <button
            @click="resetRotation"
            class="px-4 py-2 bg-white/80 hover:bg-white border border-purple-200 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-md"
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

      <!-- Preset Avatars Gallery -->
      <div class="bg-white/50 rounded-xl p-6 border border-white/30">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg
            class="w-5 h-5 text-purple-600"
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
          Choose from Gallery
        </h3>

        <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          <div
            v-for="(avatar, index) in presetAvatars"
            :key="`preset-${index}`"
            @click="selectPresetAvatar(avatar)"
            :class="{
              'ring-4 ring-purple-400 ring-offset-2': selectedAvatar === avatar && !uploadedImage,
              'hover:ring-2 hover:ring-purple-200': selectedAvatar !== avatar || uploadedImage,
            }"
            class="cursor-pointer transition-all duration-300 hover:scale-110 rounded-full"
          >
            <div
              class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl"
            >
              <img
                v-if="avatar"
                :src="avatar"
                class="w-16 h-16 rounded-full object-cover"
                :alt="`Avatar ${index + 1}`"
              />
              <span v-else class="text-sm">A{{ index + 1 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-center pt-4">
        <button
          @click="saveAvatar"
          :disabled="!selectedAvatar"
          class="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17,21 17,13 7,13 7,21" />
            <polyline points="7,3 7,8 15,8" />
          </svg>
          Save Avatar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  currentAvatar?: string
  displayName: string
}

const props = withDefaults(defineProps<Props>(), {
  currentAvatar: '',
})

const emit = defineEmits<{
  avatarChange: [avatar: string]
}>()

const selectedAvatar = ref(props.currentAvatar)
const uploadedImage = ref<string | null>(null)
const rotation = ref(0)
const isEditing = ref(false)

// Demo preset avatars (in real app, these would be actual avatar URLs)
const presetAvatars = ref([
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
])

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Validate file type
  if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
    alert('Only JPG and PNG files are allowed')
    return
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    uploadedImage.value = result
    selectedAvatar.value = result
    isEditing.value = true
    rotation.value = 0
  }
  reader.readAsDataURL(file)
}

function triggerFileUpload() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = handleFileUpload
  input.click()
}

function selectPresetAvatar(avatar: string) {
  selectedAvatar.value = avatar
  uploadedImage.value = null
  isEditing.value = false
  rotation.value = 0
}

function removeAvatar() {
  selectedAvatar.value = ''
  uploadedImage.value = null
  isEditing.value = false
  rotation.value = 0
}

function rotateImage(direction: 'left' | 'right') {
  const step = direction === 'left' ? -90 : 90
  rotation.value = (rotation.value + step) % 360
}

function resetRotation() {
  rotation.value = 0
}

function saveAvatar() {
  if (selectedAvatar.value) {
    emit('avatarChange', selectedAvatar.value)
    isEditing.value = false
    // Show success message
    showSuccessMessage()
  }
}

function showSuccessMessage() {
  // Create a simple toast notification
  const toast = document.createElement('div')
  toast.className =
    'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in'
  toast.textContent = 'Avatar updated successfully!'

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

// Watch for prop changes
watch(
  () => props.currentAvatar,
  (newAvatar) => {
    selectedAvatar.value = newAvatar
  },
)
</script>

<style scoped>
/* Enhanced hover and transition effects */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom scrollbar for gallery */
.gallery-container::-webkit-scrollbar {
  height: 6px;
}

.gallery-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.gallery-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.gallery-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
