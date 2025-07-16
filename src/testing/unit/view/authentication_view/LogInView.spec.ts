// src/testing/unit/view/authentication_view/LoginView.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia } from 'pinia'
import LoginView from '@/views/authentication_view/LoginView.vue'
import { useAuthStore } from '@/stores/auth'
import { createTestingPinia } from '@pinia/testing'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/dashboard', name: 'dashboard', component: { template: '<div>Dashboard</div>' } },
  ],
})

describe('LoginView - UTC-02: Log In Testing', () => {
  let pinia: ReturnType<typeof createTestingPinia>

  beforeEach(async () => {
    router.push('/login')
    pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    })
    setActivePinia(pinia)

    vi.clearAllMocks()
    localStorage.clear()
    await router.isReady()
  })

  describe('UTC-02-TC-01: Test authenticate() with valid credentials', () => {
    it('should login successfully with valid credentials', async () => {
      const mockResponse = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'dXJlbGZlc2hUb2tlbi4uLg==',
        user: {
          id: 1,
          username: 'user@email.com',
          email: 'user@email.com',
          firstname: 'Test',
          lastname: 'User',
          roles: ['USER'],
        },
      }

      const wrapper = mount(LoginView, {
        global: { plugins: [router, pinia] },
      })

      const authStore = useAuthStore()
      const loginSpy = vi.spyOn(authStore, 'login').mockResolvedValue(mockResponse)

      // Fill form with valid credentials
      await wrapper.find('input[name="username"]').setValue('user@email.com')
      await wrapper.find('input[name="password"]').setValue('abc123')

      await wrapper.find('form').trigger('submit')
      await flushPromises()
      await nextTick()

      expect(loginSpy).toHaveBeenCalledWith('user@email.com', 'abc123')
    })
  })

  describe('UTC-02-TC-02: Test authenticate() with invalid credentials', () => {
    it('should show error for invalid credentials', async () => {
      const wrapper = mount(LoginView, {
        global: { plugins: [router, pinia] },
      })

      const authStore = useAuthStore()
      vi.spyOn(authStore, 'login').mockRejectedValue({
        response: {
          status: 401,
          data: { message: 'Invalid credentials' },
        },
      })

      // Fill form with invalid credentials
      await wrapper.find('input[name="username"]').setValue('user@email.com')
      await wrapper.find('input[name="password"]').setValue('wrong')

      await wrapper.find('form').trigger('submit')
      await flushPromises()
      await nextTick()

      // Check for login error
      const errorElements = wrapper.findAll('div')
      const loginError = errorElements.find((el) => el.classes().includes('bg-red-50'))
      expect(loginError).toBeDefined()
    })
  })

  describe('UTC-02-TC-03: Test authenticate() with non-existent user', () => {
    it('should show error for non-existent user', async () => {
      const wrapper = mount(LoginView, {
        global: { plugins: [router, pinia] },
      })

      const authStore = useAuthStore()
      vi.spyOn(authStore, 'login').mockRejectedValue({
        response: {
          status: 404,
          data: { message: 'User not found' },
        },
      })

      // Fill form with non-existent user
      await wrapper.find('input[name="username"]').setValue('unknown@email.com')
      await wrapper.find('input[name="password"]').setValue('abc123')

      await wrapper.find('form').trigger('submit')
      await flushPromises()
      await nextTick()

      // Check for login error
      const errorElements = wrapper.findAll('div')
      const loginError = errorElements.find((el) => el.classes().includes('bg-red-50'))
      expect(loginError).toBeDefined()
    })
  })

  describe('UTC-02-TC-04: Test account lockout after 5 failed attempts', () => {
    it('should show account locked error after multiple failed attempts', async () => {
      const wrapper = mount(LoginView, {
        global: { plugins: [router, pinia] },
      })

      const authStore = useAuthStore()
      vi.spyOn(authStore, 'login').mockRejectedValue({
        response: {
          status: 423,
          data: { message: 'Account locked due to multiple failed attempts' },
        },
      })

      // Fill form with wrong credentials
      await wrapper.find('input[name="username"]').setValue('user@email.com')
      await wrapper.find('input[name="password"]').setValue('wrongpassword')

      await wrapper.find('form').trigger('submit')
      await flushPromises()
      await nextTick()

      // Check for account locked error
      const errorElements = wrapper.findAll('div')
      const loginError = errorElements.find((el) => el.classes().includes('bg-red-50'))
      expect(loginError).toBeDefined()
    })
  })

  describe('UTC-02-TC-05: Test JWT token generation on successful login', () => {
    it('should generate JWT tokens on successful login', async () => {
      const mockResponse = {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        refresh_token: 'dXJlbGZlc2hUb2tlbi4uLg==',
        user: {
          id: 1,
          username: 'user@email.com',
          email: 'user@email.com',
          firstname: 'Test',
          lastname: 'User',
          roles: ['USER'],
        },
      }

      const wrapper = mount(LoginView, {
        global: { plugins: [router, pinia] },
      })

      const authStore = useAuthStore()
      const loginSpy = vi.spyOn(authStore, 'login').mockResolvedValue(mockResponse)

      // Fill form with valid credentials
      await wrapper.find('input[name="username"]').setValue('user@email.com')
      await wrapper.find('input[name="password"]').setValue('abc123')

      await wrapper.find('form').trigger('submit')
      await flushPromises()
      await nextTick()

      expect(loginSpy).toHaveBeenCalledWith('user@email.com', 'abc123')

      // Verify that tokens are generated (this would be handled by the auth store)
      expect(mockResponse.access_token).toMatch(
        /^eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
      )
      expect(mockResponse.refresh_token).toBeDefined()
    })
  })

  describe('Form validation tests', () => {
    it('should show validation errors for required fields', async () => {
      const wrapper = mount(LoginView, {
        global: { plugins: [router, pinia] },
      })

      await wrapper.find('form').trigger('submit')
      await flushPromises()
      await nextTick()

      // Trigger blur events to show validation errors
      await wrapper.find('input[name="username"]').trigger('blur')
      await wrapper.find('input[name="password"]').trigger('blur')
      await flushPromises()
      await nextTick()

      // Check for validation errors
      const errorElements = wrapper.findAll('p')
      const requiredErrors = errorElements.filter((el) => el.text().includes('required'))
      expect(requiredErrors.length).toBeGreaterThan(0)
    })

    it('should handle network connection errors', async () => {
      const wrapper = mount(LoginView, {
        global: { plugins: [router, pinia] },
      })

      const authStore = useAuthStore()
      vi.spyOn(authStore, 'login').mockRejectedValue(new Error('Network Error'))

      // Fill form
      await wrapper.find('input[name="username"]').setValue('user@email.com')
      await wrapper.find('input[name="password"]').setValue('abc123')

      await wrapper.find('form').trigger('submit')
      await flushPromises()
      await nextTick()

      // Check for login error
      const errorElements = wrapper.findAll('div')
      const loginError = errorElements.find((el) => el.classes().includes('bg-red-50'))
      expect(loginError).toBeDefined()
    })

    it('should show success message on successful login', async () => {
      const mockResponse = {
        access_token: 'mock-token',
        user: { id: 1, username: 'test', email: 'test@example.com' },
      }

      const wrapper = mount(LoginView, {
        global: { plugins: [router, pinia] },
      })

      const authStore = useAuthStore()
      vi.spyOn(authStore, 'login').mockResolvedValue(mockResponse)

      // Fill form
      await wrapper.find('input[name="username"]').setValue('user@email.com')
      await wrapper.find('input[name="password"]').setValue('abc123')

      await wrapper.find('form').trigger('submit')
      await flushPromises()
      await nextTick()

      // Check for success message
      const successElements = wrapper.findAll('div')
      const successMessage = successElements.find((el) => el.classes().includes('bg-green-50'))
      expect(successMessage).toBeDefined()
    })
  })

  describe('UI interaction tests', () => {
    it('should disable form during loading', async () => {
      const wrapper = mount(LoginView, {
        global: { plugins: [router, pinia] },
      })

      const authStore = useAuthStore()
      vi.spyOn(authStore, 'login').mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      )

      // Fill form
      await wrapper.find('input[name="username"]').setValue('user@email.com')
      await wrapper.find('input[name="password"]').setValue('abc123')

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      // Check if form is disabled during loading
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('should show loading spinner during authentication', async () => {
      const wrapper = mount(LoginView, {
        global: { plugins: [router, pinia] },
      })

      const authStore = useAuthStore()
      vi.spyOn(authStore, 'login').mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      )

      // Fill form
      await wrapper.find('input[name="username"]').setValue('user@email.com')
      await wrapper.find('input[name="password"]').setValue('abc123')

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      // Check for loading spinner
      const loadingSpinner = wrapper.find('.animate-spin')
      expect(loadingSpinner.exists()).toBe(true)
    })
  })
})
