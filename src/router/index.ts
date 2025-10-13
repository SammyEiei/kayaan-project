import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/welcome_view/HomeView.vue'

import { useAuthStore } from '@/stores/auth'
import nProgress from 'nprogress'
import LoginView from '@/views/authentication_view/LoginView.vue'
import RegisterView from '@/views/authentication_view/RegisterView.vue'
import ManualGenerateMainView from '@/views/ManualGenerate_view/ManualGenerateMainView.vue'
import QuizView from '@/views/ManualGenerate_view/QuizView.vue'
import NoteView from '@/views/ManualGenerate_view/NoteView.vue'
import FlashcardView from '@/views/ManualGenerate_view/FlashcardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/welcome_view/AboutView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/welcome_view/ContactView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/authentication_view/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/authentication_view/RegisterView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/authentication_view/ForgotPasswordView.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/authentication_view/ResetPassword.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/features_view/DashboardView.vue'),
    },
    {
      path: '/study-groups',
      name: 'study-groups',
      component: () => import('../views/features_view/StudyGroupView.vue'),
    },
    {
      path: '/study-groups/:id',
      name: 'group-detail',
      component: () => import('../views/features_view/GroupDetailView.vue'),
    },
    {
      path: '/pomodoro',
      name: 'pomodoro',
      component: () => import('../views/features_view/PomodoroView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/resources',
      name: 'resources',
      component: () => import('../views/features_view/ResourceLibraryView.vue'),
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/features_view/CalendarView.vue'),
    },
    {
      path: '/create-content',
      name: 'ManualGenerateMainView',
      component: () => import('../views/ManualGenerate_view/ManualGenerateMainView.vue'),
    },
    {
      path: '/QuizView',
      name: 'QuizView',
      component: () => import('../views/ManualGenerate_view/QuizView.vue'),
    },
    {
      path: '/NoteView',
      name: 'NoteView',
      component: () => import('../views/ManualGenerate_view/NoteView.vue'),
    },
    {
      path: '/FlashcardView',
      name: 'FlashcardView',
      component: () => import('../views/ManualGenerate_view/FlashcardView.vue'),
    },
    {
      path: '/MyContentView',
      name: 'MyContentView',
      redirect: _to => {
        return { path: '/create-content', query: { tab: 'content' } }
      }
    },
    {
      path: '/ai-content-generator',
      name: 'ai-content-generator',
      component: () => import('../views/features_view/AIContentGeneratorView.vue'),
    },
    {
      path: '/content-hub',
      name: 'content-hub',
      component: () => import('../views/features_view/UnifiedContentView.vue'),
    },
    {
      path: '/content-viewer',
      name: 'content-viewer',
      component: () => import('../views/ContentViewerView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  nProgress.start()
  if (to.meta.requiresAuth) {
    if (!auth.token) {
      return next({ name: 'login' })
    }
    if (to.meta.requiresRole && !auth.user?.roles.includes(to.meta.requiresRole)) {
      return next({ name: 'home' })
    }
  }
  next()
})

router.afterEach(() => {
  nProgress.done()
})

export default router
