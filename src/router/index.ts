import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/welcome_view/HomeView.vue'
import LoginView from '@/views/authentication_view/LoginView.vue';
import RegisterView from '@/views/authentication_view/RegisterView.vue';
import ManualGenerateMainView from '@/views/ManualGenerate_view/ManualGenerateMainView.vue';
import QuizView from '@/views/ManualGenerate_view/QuizView.vue';
import NoteView from '@/views/ManualGenerate_view/NoteView.vue';
import FlashcardView from '@/views/ManualGenerate_view/FlashcardView.vue';
import { useAuthStore } from '@/stores/auth';
import nProgress from 'nprogress';
// import HomeView from '../views/HomeView.vue'



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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
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
      path: '/pomodoro',
      name: 'pomodoro',
      component: () => import('../views/features_view/PomodoroView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/features_view/SettingsView.vue'),
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
      path: '/ManualGenerateMainView',
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
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  nProgress.start();
  if (to.meta.requiresAuth) {
    if( !auth.token){
      return next({ name: 'login' });
    }
    if(to.meta.requiresRole && !auth.user?.roles.includes(to.meta.requiresRole)){
      return next({ name: 'home'})
    }
  }
  next();
});

router.afterEach(() => {
  nProgress.done();
})

export default router
