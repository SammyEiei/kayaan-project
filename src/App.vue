<template>
  <div class="flex flex-col min-h-screen" style="background: var(--background); color: var(--text)">
    <!-- Background Elements -->
    <div
      class="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl"
      style="
        background: linear-gradient(
          90deg,
          var(--primary) 20%,
          var(--secondary) 80%,
          var(--background) 100%
        );
        opacity: 0.15;
      "
    ></div>
    <div
      class="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl"
      style="
        background: linear-gradient(90deg, var(--secondary) 0%, var(--accent) 100%);
        opacity: 0.15;
      "
    ></div>

    <div class="flex min-h-screen relative z-10">
      <!-- Left Side - Sidebar -->
      <aside
        v-if="isLoggedIn && !isAuthPage"
        class="fixed top-0 left-0 h-full w-64 flex flex-col z-40 shadow-sm"
        style="background: var(--surface); border-right: 1px solid var(--border)"
      >
        <router-link
          to="/"
          class="flex items-center px-6 py-5 border-b"
          :style="{ borderColor: 'var(--border)' }"
        >
          <div class="relative">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
              :style="{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }"
            >
              <svg class="w-6 h-6 text-white" viewBox="0 0 32 32" fill="currentColor">
                <path d="M7 6c0-1.1.9-2 2-2s2 .9 2 2v20c0 1.1-.9 2-2 2s-2-.9-2-2V6z" />
                <path
                  d="M11 16c0-.6.4-1 1-1h.5c.3 0 .6.1.8.3l6.4 6.4c.8.8 2.1.8 2.8 0 .8-.8.8-2.1 0-2.8L16.8 13c-.2-.2-.3-.5-.3-.8V12c0-.3.1-.6.3-.8l5.7-5.7c.8-.8.8-2.1 0-2.8-.8-.8-2.1-.8-2.8 0L13.3 9.1c-.2.2-.5.3-.8.3H12c-.6 0-1 .4-1 1v5z"
                />
                <circle cx="22" cy="16" r="2.5" opacity="0.4" />
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <span
              class="text-xl font-bold bg-clip-text text-transparent"
              :style="{
                background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }"
            >
              Kayaan
            </span>
            <div class="text-xs" style="color: var(--text-secondary)">Learning Hub</div>
          </div>
        </router-link>

        <!-- Menu -->
        <nav class="flex-1 py-4 px-3 space-y-1">
          <router-link
            v-for="item in menuItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center px-3 py-2.5 rounded-lg font-medium group transition-colors duration-150"
            :style="{
              color: route.path.startsWith(item.to) ? 'var(--primary)' : 'var(--text)',
              background: route.path.startsWith(item.to) ? 'var(--accent)' : 'transparent',
              borderLeft: route.path.startsWith(item.to) ? '3px solid var(--primary)' : 'none',
            }"
          >
            <div class="w-5 h-5 mr-3">
              <component :is="getIconComponent(item.icon)" />
            </div>
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <!-- User Section -->
        <div class="p-4 border-t" :style="{ borderColor: 'var(--border)' }">
          <div class="rounded-lg p-3 mb-3" style="background: var(--accent)">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium overflow-hidden"
                :style="{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }"
              >
                <img
                  v-if="userAvatarUrl"
                  :src="userAvatarUrl"
                  :key="avatarKey"
                  :alt="authStore.user?.username || 'User avatar'"
                  class="w-full h-full object-cover"
                />
                <span v-else>
                  {{ (authStore.user?.username || 'U').charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <div class="font-medium text-sm" style="color: var(--text)">
                  {{ authStore.user?.username || 'User' }}
                </div>
                <div class="text-xs" style="color: var(--text-secondary)">Premium Member</div>
              </div>
            </div>
          </div>

          <button
            @click="logout"
            class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors duration-150 text-sm font-medium"
            style="background: var(--error); color: #fff"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div :class="[isLoggedIn && !isAuthPage ? 'ml-64' : '', 'flex-1 flex flex-col']">
        <!-- Header -->
        <header
          v-if="!isAuthPage"
          class="backdrop-blur-sm shadow-sm py-3 px-6 flex justify-between items-center sticky top-0 z-30"
          style="background: var(--surface); border-bottom: 1px solid var(--border)"
        >
          <!-- Mobile Logo -->
          <router-link to="/" class="flex items-center md:hidden">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
              :style="{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }"
            >
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h4v18H3V3zm6 0h2l6 8-6 8h-2l6-8-6-8zm8 0h4v18h-4V3z" />
                <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.7" />
              </svg>
            </div>
            <div class="ml-2">
              <span
                class="text-lg font-bold bg-clip-text text-transparent"
                :style="{
                  background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }"
              >
                Kayaan
              </span>
            </div>
          </router-link>

          <!-- Page Title -->
          <div v-if="isLoggedIn" class="hidden md:block">
            <h1 class="text-lg font-semibold" style="color: var(--primary)">
              {{ getPageTitle() }}
            </h1>
          </div>

          <!-- Navigation/Auth Buttons -->
          <nav class="flex items-center space-x-3">
            <template v-if="!isLoggedIn">
              <router-link
                to="/login"
                class="font-medium transition-colors duration-150 px-3 py-2"
                style="color: var(--text)"
              >
                Sign in
              </router-link>
              <router-link
                to="/register"
                class="px-4 py-2 rounded-lg transition-all duration-150 font-medium text-sm"
                style="background: var(--primary); color: var(--background)"
              >
                Sign up
              </router-link>
            </template>

            <template v-if="isLoggedIn">
              <button
                class="p-2 rounded-lg transition-colors duration-150"
                style="color: var(--text-secondary)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-5 5-5-5h5v-7h5v7z"
                  />
                </svg>
              </button>
              <button
                class="p-2 rounded-lg transition-colors duration-150"
                style="color: var(--text-secondary)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </button>
            </template>
          </nav>
        </header>

        <main class="flex-1">
          <RouterView />
        </main>

        <!-- Footer -->
        <footer
          v-if="!isAuthPage"
          class="backdrop-blur-sm border-t py-8 px-6"
          style="background: var(--surface); border-top: 1px solid var(--border)"
        >
          <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <!-- Logo & Description -->
              <div class="col-span-1 md:col-span-2">
                <div class="flex items-center mb-3">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center"
                    :style="{
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    }"
                  >
                    <svg class="w-6 h-6 text-white" viewBox="0 0 32 32" fill="currentColor">
                      <path d="M7 6c0-1.1.9-2 2-2s2 .9 2 2v20c0 1.1-.9 2-2 2s-2-.9-2-2V6z" />
                      <path
                        d="M11 16c0-.6.4-1 1-1h.5c.3 0 .6.1.8.3l6.4 6.4c.8.8 2.1.8 2.8 0 .8-.8.8-2.1 0-2.8L16.8 13c-.2-.2-.3-.5-.3-.8V12c0-.3.1-.6.3-.8l5.7-5.7c.8-.8.8-2.1 0-2.8-.8-.8-2.1-.8-2.8 0L13.3 9.1c-.2.2-.5.3-.8.3H12c-.6 0-1 .4-1 1v5z"
                      />
                      <circle cx="22" cy="16" r="2.5" opacity="0.4" />
                    </svg>
                  </div>
                  <div class="ml-2">
                    <span
                      class="text-lg font-bold bg-clip-text text-transparent"
                      :style="{
                        background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }"
                    >
                      Kayaan
                    </span>
                    <div class="text-xs" style="color: var(--text-secondary)">Learning Hub</div>
                  </div>
                </div>
                <p class="text-sm max-w-md" style="color: var(--text-secondary)">
                  Empowering learners with AI-driven tools and collaborative features to achieve
                  their educational goals efficiently.
                </p>
              </div>
              <!-- Quick Links -->
              <div>
                <h3 class="font-medium mb-3 text-sm" style="color: var(--text)">Features</h3>
                <ul class="space-y-2 text-sm">
                  <li>
                    <a href="#" class="hover:underline" style="color: var(--text-secondary)"
                      >Flashcards</a
                    >
                  </li>
                  <li>
                    <a href="#" class="hover:underline" style="color: var(--text-secondary)"
                      >Study Groups</a
                    >
                  </li>
                  <li>
                    <a href="#" class="hover:underline" style="color: var(--text-secondary)"
                      >Pomodoro Timer</a
                    >
                  </li>
                  <li>
                    <a href="#" class="hover:underline" style="color: var(--text-secondary)"
                      >AI Content</a
                    >
                  </li>
                </ul>
              </div>
              <!-- Support -->
              <div>
                <h3 class="font-medium mb-3 text-sm" style="color: var(--text)">Support</h3>
                <ul class="space-y-2 text-sm">
                  <li>
                    <a href="#" class="hover:underline" style="color: var(--text-secondary)"
                      >Help Center</a
                    >
                  </li>
                  <li>
                    <a href="#" class="hover:underline" style="color: var(--text-secondary)"
                      >Contact Us</a
                    >
                  </li>
                  <li>
                    <a href="#" class="hover:underline" style="color: var(--text-secondary)"
                      >Privacy Policy</a
                    >
                  </li>
                  <li>
                    <a href="#" class="hover:underline" style="color: var(--text-secondary)"
                      >Terms of Service</a
                    >
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="border-t mt-6 pt-6 flex flex-col md:flex-row justify-between items-center"
              :style="{ borderColor: 'var(--border)' }"
            >
              <div class="text-xs" style="color: var(--text-secondary)">
                © 2024 Kayaan Learning Hub. All rights reserved.
              </div>
              <!-- ...social icons etc... -->
            </div>
          </div>
        </footer>
      </div>
    </div>
    <PomodoroWidget v-if="isLoggedIn" />
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { computed, onMounted, h, ref, watch } from 'vue' // 🆕 Add ref, watch
import PomodoroWidget from '@/components/PomodoroWidget.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 🆕 Add reactive key for forcing image reload
const avatarKey = ref(0)

// 🆕 Add computed for avatar URL
const userAvatarUrl = computed(() => authStore.user?.avatarUrl || '')

// ระบุว่าอยู่ในหน้า auth หรือไม่ (login/register)
const isAuthPage = computed(() => route.path === '/login' || route.path === '/register')

// เมื่อ avatar เปลี่ยน ให้บังคับ reload รูปภาพ
watch(userAvatarUrl, () => {
  avatarKey.value++
})

const isLoggedIn = computed(() => !!authStore.token)

const menuItems = [
  { to: '/dashboard', icon: 'grid', label: 'Dashboard' },
  { to: '/MyContentView', icon: 'book', label: 'My content' },
  { to: '/create-content', icon: 'sparkles', label: 'Create Content' },
  // { to: '/study-groups', icon: 'users', label: 'Study Groups' },
  { to: '/pomodoro', icon: 'clock', label: 'Pomodoro Timer' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
]

function getIconComponent(iconName: string) {
  const icons = {
    grid: () =>
      h(
        'svg',
        {
          class: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          viewBox: '0 0 24 24',
        },
        [
          h('rect', { x: '3', y: '3', width: '7', height: '7', rx: '1.5' }),
          h('rect', { x: '14', y: '3', width: '7', height: '7', rx: '1.5' }),
          h('rect', { x: '14', y: '14', width: '7', height: '7', rx: '1.5' }),
          h('rect', { x: '3', y: '14', width: '7', height: '7', rx: '1.5' }),
        ],
      ),
    book: () =>
      h(
        'svg',
        {
          class: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          viewBox: '0 0 24 24',
        },
        [
          h('path', { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' }),
          h('path', { d: 'M6.5 17V5.5A2.5 2.5 0 0 1 9 3h10.5A2.5 2.5 0 0 1 22 5.5v11.5' }),
        ],
      ),
    sparkles: () =>
      h(
        'svg',
        {
          class: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          viewBox: '0 0 24 24',
        },
        [
          h('path', {
            d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
          }),
        ],
      ),
    users: () =>
      h(
        'svg',
        {
          class: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          viewBox: '0 0 24 24',
        },
        [
          h('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2' }),
          h('circle', { cx: '9', cy: '7', r: '4' }),
          h('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }),
          h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }),
        ],
      ),
    clock: () =>
      h(
        'svg',
        {
          class: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          viewBox: '0 0 24 24',
        },
        [h('circle', { cx: '12', cy: '12', r: '10' }), h('path', { d: 'M12 6v6l4 2' })],
      ),
    settings: () =>
      h(
        'svg',
        {
          class: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          viewBox: '0 0 24 24',
        },
        [
          h('circle', { cx: '12', cy: '12', r: '3' }),
          h('path', {
            d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
          }),
        ],
      ),
  }
  return icons[iconName as keyof typeof icons] || icons.grid
}

function getPageTitle() {
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/flashcards': 'Flashcards & Quizzes',
    '/MyContentView': 'Create Content',
    '/study-groups': 'Study Groups',
    '/pomodoro': 'Pomodoro Timer',
    '/settings': 'Settings',
  }
  return titles[route.path] || 'Kayaan'
}

function logout() {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  authStore.reload()
})
</script>

<style scoped>
/* Backdrop blur support */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Gradient text support */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, transform;
  transition-timing-function: ease-out;
  transition-duration: 150ms;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.7);
}

/* Focus states */
button:focus,
a:focus {
  outline: 2px solid rgba(59, 130, 246, 0.5);
  outline-offset: 2px;
}
</style>
