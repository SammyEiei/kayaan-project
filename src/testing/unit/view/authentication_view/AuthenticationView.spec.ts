import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import RegisterView from '@/views/authentication_view/RegisterView.vue'
import LoginView from '@/views/authentication_view/LoginView.vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/service/api'

vi.mock('@/service/api')

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(api.post).mockReset()
})

const routes = [
  { path: '/', component: { template: '<div>Home</div>' } },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/dashboard', name: 'dashboard', component: { template: '<div>Dashboard</div>' } },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

describe('Authentication Tests', () => {
  beforeEach(async () => {
    router.push('/register')

    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
    await router.isReady()
  })

  describe('URS-01: Register Account Testing', () => {
    it('should successfully register a new user with valid data', async () => {
      const mockResponse = {
        data: {
          access_token: 'mock-token-123',
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            firstname: 'Test',
            lastname: 'User',
            roles: ['USER'],
          },
        },
      }

      const mockedApi = vi.mocked(api)
      mockedApi.post.mockResolvedValueOnce(mockResponse)

      const authStore = useAuthStore()
      const registerSpy = vi.spyOn(authStore, 'register')

      const wrapper = mount(RegisterView, {
        global: {
          plugins: [router],
        },
      })
      await flushPromises()

      await wrapper.find('input[name="firstName"]').setValue('Test')
      await wrapper.find('input[name="lastName"]').setValue('User')
      await wrapper.find('input[name="email"]').setValue('test@example.com')
      await wrapper.find('input[name="userName"]').setValue('testuser') // ✅ update name to match template
      await wrapper.find('input[name="password"]').setValue('password123')
      await wrapper.find('input[name="confirmPassword"]').setValue('password123')

      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      expect(registerSpy).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'testuser',
        'Test',
        'User',
      )
      expect(api.post).toHaveBeenCalledWith('/api/v1/auth/register', {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstname: 'Test',
        lastname: 'User',
      })

      expect(wrapper.text()).toContain('Sign up successfully')
    })

    it('should show validation errors for invalid input', async () => {
      const wrapper = mount(RegisterView, {
        global: {
          plugins: [router],
        },
      })
      await flushPromises()

      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      expect(wrapper.text()).toContain('First name is required')
      expect(wrapper.text()).toContain('Email is required')
      expect(wrapper.text()).toContain('Password is required')
    })

    it('should validate password confirmation matches', async () => {
      const wrapper = mount(RegisterView, {
        global: {
          plugins: [router],
        },
      })

      await wrapper.find('input[name="password"]').setValue('password123')
      await wrapper.find('input[name="confirmPassword"]').setValue('wrongpassword')
      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      expect(wrapper.text()).toContain('Passwords do not match')
    })
  })

  describe('URS-02: Log In Testing', () => {
    it('should successfully log in with valid credentials', async () => {
      const mockResponse = {
        data: {
          access_token: 'mock-token-123',
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            roles: ['USER'],
          },
        },
      }

      const mockedApi = vi.mocked(api)
      mockedApi.post.mockResolvedValueOnce(mockResponse)

      const wrapper = mount(LoginView, {
        global: {
          plugins: [router],
        },
      })
      await flushPromises()

      const authStore = useAuthStore()
      vi.spyOn(authStore, 'login')

      await wrapper.find('input[name="username"]').setValue('testuser')
      await wrapper.find('input[name="password"]').setValue('password123')

      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      expect(authStore.login).toHaveBeenCalledWith('testuser', 'password123')
      expect(wrapper.text()).toContain('Sign in successfully')
    })

    it('should show error for invalid credentials', async () => {
      const mockedApi = vi.mocked(api)
      mockedApi.post.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: 'Invalid credentials' },
        },
      })

      const wrapper = mount(LoginView, {
        global: {
          plugins: [router],
        },
      })
      await flushPromises()

      await wrapper.find('input[name="username"]').setValue('wronguser')
      await wrapper.find('input[name="password"]').setValue('wrongpassword')
      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      expect(wrapper.text()).toContain('No user found in the database. Please try again.')
    })

    it('should validate required fields', async () => {
      const wrapper = mount(LoginView, {
        global: {
          plugins: [router],
        },
      })
      await flushPromises()

      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      expect(wrapper.text()).toContain('The username is required')
      expect(wrapper.text()).toContain('Password is required')
    })
  })

  describe('URS-03: Log Out Testing', () => {
    it('should successfully log out user', () => {
      const authStore = useAuthStore()

      authStore.token = 'mock-token'
      authStore.user = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: ['USER'],
        firstname: 'Test',
        lastname: 'User',
        password: '',
      }
      localStorage.setItem('access_token', 'mock-token')
      localStorage.setItem('user', JSON.stringify(authStore.user))

      authStore.logout()

      expect(authStore.token).toBeNull()
      expect(authStore.user).toBeNull()
      expect(authStore.userId).toBeNull()
      expect(authStore.roles).toEqual([])
      expect(localStorage.getItem('access_token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })
  })
})
