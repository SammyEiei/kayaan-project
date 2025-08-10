<script setup lang="ts">
import { ref, computed } from 'vue'
import { uploadAvatar } from '@/services/avatarService'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{ 
  userId: number
  maxSizeMb?: number 
}>()

const emit = defineEmits<{ 
  (e: 'updated', url: string): void 
}>()

const auth = useAuthStore()

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)
const busy = ref(false)
const errorMsg = ref<string | null>(null)

const maxSize = computed(() => (props.maxSizeMb ?? 5) * 1024 * 1024)

function pickFile() {
  fileInput.value?.click()
}

function validate(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed')
  }
  
  if (file.size > maxSize.value) {
    throw new Error(`File too large (>${props.maxSizeMb ?? 5} MB)`)
  }
}

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  await doUpload(file)
}

async function onDrop(ev: DragEvent) {
  ev.preventDefault()
  const file = ev.dataTransfer?.files?.[0]
  if (!file) return
  await doUpload(file)
}

function onDragOver(ev: DragEvent) { 
  ev.preventDefault() 
}

async function doUpload(file: File) {
  errorMsg.value = null
  
  try {
    // Validate file
    validate(file)
    
    // Show preview
    previewUrl.value = URL.createObjectURL(file)
    busy.value = true

    // Upload via signed URL
    const result = await uploadAvatar(props.userId, file)

    if (result.avatarUrl) {
      // Update auth store
      auth.setAvatarUrl(result.avatarUrl)
      emit('updated', result.avatarUrl)
    } else {
      // Fallback: refresh user data
      await auth.fetchUserInfo()
      if (auth.user?.avatarUrl) {
        emit('updated', auth.user.avatarUrl)
      }
    }
  } catch (e: any) {
    errorMsg.value = e?.message ?? 'Upload failed'
    console.error('Avatar upload error:', e)
  } finally {
    busy.value = false
  }
}

// Cleanup preview URL on unmount
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>

<template>
  <div class="space-y-4">
    <!-- Upload Area -->
    <div
      class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer transition-colors hover:border-purple-400 hover:bg-purple-50"
      :class="busy ? 'opacity-60 pointer-events-none' : ''"
      @click="pickFile"
      @drop="onDrop"
      @dragover="onDragOver"
    >
      <div class="flex flex-col items-center justify-center gap-3">
        <svg
          class="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <div>
          <p class="font-medium text-gray-700">
            {{ busy ? 'Uploading...' : 'Drop image here or click to upload' }}
          </p>
          <p class="text-sm text-gray-500 mt-1">
            PNG, JPG, WEBP up to {{ props.maxSizeMb ?? 5 }}MB
          </p>
        </div>
      </div>
      
      <input
        ref="fileInput"
        class="hidden"
        type="file"
        accept="image/*"
        @change="onFileChange"
      />
    </div>

    <!-- Preview -->
    <div v-if="previewUrl" class="flex items-center gap-4">
      <img 
        :src="previewUrl" 
        class="w-24 h-24 rounded-full object-cover border-2 border-gray-200" 
        alt="Preview"
      />
      <div class="flex-1">
        <p v-if="busy" class="text-sm text-purple-600 font-medium">
          Uploading to server...
        </p>
        <p v-else class="text-sm text-gray-600">
          Image preview
        </p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMsg" class="p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-600 text-sm">{{ errorMsg }}</p>
    </div>

    <!-- Loading Indicator -->
    <div v-if="busy" class="flex items-center justify-center">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
      <span class="ml-2 text-sm text-gray-600">Uploading...</span>
    </div>
  </div>
</template>
