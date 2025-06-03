<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg border p-6 shadow-sm">
      <div class="flex flex-col gap-6">
        <!-- Current Avatar Preview -->
        <div class="flex justify-center">
          <div class="relative w-24 h-24">
            <img
              :src="selectedAvatar"
              :style="{ transform: `rotate(${rotation}deg)` }"
              class="w-24 h-24 rounded-full border object-cover"
            />
            <span
              v-if="!selectedAvatar"
              class="absolute inset-0 flex items-center justify-center text-gray-300 text-lg"
              >No Avatar</span
            >
          </div>
        </div>

        <!-- Upload Custom Image -->
        <div class="space-y-2">
          <label class="block text-sm font-medium">Upload Custom Image</label>
          <div class="flex items-center gap-2">
            <label
              class="relative overflow-hidden border rounded px-3 py-2 flex items-center gap-2 cursor-pointer bg-white hover:bg-gray-50"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                <polyline points="7 9 12 4 17 9" />
                <line x1="12" y1="4" x2="12" y2="16" />
              </svg>
              Upload Image
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                @change="handleFileUpload"
                class="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
            <span class="text-sm text-gray-400">JPEG, PNG only • Max 5MB</span>
          </div>
        </div>

        <!-- Image Editor (shown when editing uploaded image) -->
        <div v-if="isEditing && uploadedImage" class="space-y-3 p-4 border rounded-md bg-gray-50">
          <h4 class="font-medium">Edit Avatar</h4>
          <div class="flex gap-2">
            <button
              @click="handleRotate('left')"
              class="px-2 py-1 border rounded flex items-center gap-1 text-xs"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M15.17 7l-5.59 5.59a2 2 0 000 2.83l5.59 5.59" />
              </svg>
              Rotate Left
            </button>
            <button
              @click="handleRotate('right')"
              class="px-2 py-1 border rounded flex items-center gap-1 text-xs"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M8.83 7l5.59 5.59a2 2 0 010 2.83l-5.59 5.59" />
              </svg>
              Rotate Right
            </button>
            <button class="px-2 py-1 border rounded flex items-center gap-1 text-xs" disabled>
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M8 8h8v8H8z" />
              </svg>
              Crop
            </button>
          </div>
        </div>

        <!-- Preset Avatars Gallery -->
        <div class="space-y-2">
          <label class="block text-sm font-medium">Or Choose from Gallery</label>
          <div class="grid grid-cols-4 gap-3">
            <button
              v-for="(avatar, index) in presetAvatars"
              :key="index"
              @click="handlePresetSelect(avatar)"
              :class="[
                'relative group rounded-full transition-all',
                selectedAvatar === avatar && !uploadedImage
                  ? 'ring-2 ring-primary'
                  : 'hover:ring-2 hover:ring-gray-300',
              ]"
            >
              <img :src="avatar" class="w-16 h-16 rounded-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Save Button -->
        <button
          @click="handleSave"
          :disabled="!selectedAvatar"
          class="w-full bg-gradient-to-r from-primary to-blue-400 text-white py-2 rounded font-medium shadow-sm hover:bg-primary/90 transition disabled:opacity-50"
        >
          Save Avatar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
const props = defineProps<{ currentAvatar?: string }>()
const emit = defineEmits(['avatar-change'])
const presetAvatars = [
  '/placeholder.svg?height=80&width=80&text=A1',
  '/placeholder.svg?height=80&width=80&text=A2',
  '/placeholder.svg?height=80&width=80&text=A3',
  '/placeholder.svg?height=80&width=80&text=A4',
  '/placeholder.svg?height=80&width=80&text=A5',
  '/placeholder.svg?height=80&width=80&text=A6',
  '/placeholder.svg?height=80&width=80&text=A7',
  '/placeholder.svg?height=80&width=80&text=A8',
]
const selectedAvatar = ref(props.currentAvatar || '')
const uploadedImage = ref<string | null>(null)
const rotation = ref(0)
const isEditing = ref(false)

watch(
  () => props.currentAvatar,
  (val) => {
    selectedAvatar.value = val || ''
  },
)

function handlePresetSelect(avatar: string) {
  selectedAvatar.value = avatar
  uploadedImage.value = null
  isEditing.value = false
}
function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
    alert('Only .jpg/.png files are allowed')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('Max file size is 5MB')
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
function handleRotate(direction: 'left' | 'right') {
  rotation.value = direction === 'left' ? rotation.value - 90 : rotation.value + 90
}
function handleSave() {
  if (selectedAvatar.value) {
    emit('avatar-change', selectedAvatar.value)
    isEditing.value = false
    // สามารถเพิ่ม toast ได้ถ้าต้องการ
  }
}
</script>

<style scoped>
.cropper {
  width: 200px;
  height: 200px;
  border: 1px solid #ddd;
}
</style>
