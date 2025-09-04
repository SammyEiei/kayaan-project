<template>
  <div class="token-debugger" v-if="showDebug">
    <h4>🔐 Token Debug Info</h4>
    <div class="debug-content">
      <p><strong>Has Token:</strong> {{ tokenStatus.hasToken }}</p>
      <p><strong>Is Valid:</strong> {{ tokenStatus.isValid }}</p>
      <p><strong>Message:</strong> {{ tokenStatus.message }}</p>
      <p v-if="tokenStatus.expiration">
        <strong>Expires:</strong> {{ formatDate(tokenStatus.expiration) }}
      </p>
      <p v-if="tokenStatus.payload">
        <strong>User ID:</strong> {{ tokenStatus.payload.sub }}
      </p>
      <p v-if="tokenStatus.tokenPreview">
        <strong>Token Preview:</strong> {{ tokenStatus.tokenPreview }}
      </p>
    </div>
    <button @click="refreshToken" class="btn btn-sm bg-blue-500 text-white px-2 py-1 rounded text-xs">
      Refresh Token
    </button>
    <button @click="clearToken" class="btn btn-sm bg-red-500 text-white px-2 py-1 rounded text-xs ml-2">
      Clear Token
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface TokenPayload {
  sub: string
  username?: string
  roles?: string[]
  exp: number
}

interface TokenStatus {
  hasToken: boolean
  isValid: boolean
  message: string
  expiration?: Date
  payload?: TokenPayload
  tokenPreview?: string
}

const showDebug = ref(true)
const tokenStatus = ref<TokenStatus>({
  hasToken: false,
  isValid: false,
  message: 'No token found'
})

const checkTokenStatus = () => {
  const token = localStorage.getItem('access_token')

  if (!token) {
    tokenStatus.value = {
      hasToken: false,
      isValid: false,
      message: 'No token found'
    }
    return
  }

  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      tokenStatus.value = {
        hasToken: true,
        isValid: false,
        message: 'Invalid JWT format'
      }
      return
    }

    const payload = JSON.parse(atob(parts[1])) as TokenPayload
    const expiration = new Date(payload.exp * 1000)
    const isExpired = expiration < new Date()

    tokenStatus.value = {
      hasToken: true,
      isValid: !isExpired,
      message: isExpired ? 'Token expired' : 'Token valid',
      expiration,
      payload,
      tokenPreview: `${token.substring(0, 20)}...`
    }
    } catch {
    tokenStatus.value = {
      hasToken: true,
      isValid: false,
      message: 'Token validation failed'
    }
  }
}

const refreshToken = () => {
  checkTokenStatus()
}

const clearToken = () => {
  localStorage.removeItem('access_token')
  checkTokenStatus()
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString()
}

onMounted(() => {
  checkTokenStatus()
})
</script>

<style scoped>
.token-debugger {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  font-family: monospace;
  font-size: 12px;
}

.debug-content p {
  margin: 5px 0;
}

.btn {
  cursor: pointer;
}

.btn:hover {
  opacity: 0.8;
}
</style>
