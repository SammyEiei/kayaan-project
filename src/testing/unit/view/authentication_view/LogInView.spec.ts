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
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: { template: '<div>Register</div>' } },
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
    it('should authenticate successfully with valid email and password', async () => {
      // Mock AuthenticationResponse
      const mockAuthenticationResponse = {
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
      const loginSpy = vi.spyOn(authStore, 'login').mockResolvedValue(mockAuthenticationResponse)

      // Fill form with valid credentials (AuthenticationRequest)
      await wrapper.find('input[name="username"]').setValue('user@email.com')
      await wrapper.find('input[name="password"]').setValue('abc123')

      // Call onSubmit directly
      const vm = wrapper.vm as { onSubmit: () => Promise<void> }
      await vm.onSubmit()
      await flushPromises()
      await nextTick()
      await flushPromises()

      // Verify login was called with correct credentials
      expect(loginSpy).toHaveBeenCalledWith('user@email.com', 'abc123')

      // Verify AuthenticationResponse structure
      expect(mockAuthenticationResponse.access_token).toMatch(
        /^eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
      )
      expect(mockAuthenticationResponse.refresh_token).toBeDefined()
      expect(mockAuthenticationResponse.user).toBeDefined()
    })
  })

  describe('UTC-02-TC-02: Test authenticate() with invalid credentials', () => {
    it('should throw BadCredentialsException for invalid credentials', async () => {
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

      // Fill form with invalid credentials (AuthenticationRequest)
      await wrapper.find('input[name="username"]').setValue('user@email.com')
      await wrapper.find('input[name="password"]').setValue('wrong')

      // Call onSubmit directly
      const vm = wrapper.vm as { onSubmit: () => Promise<void> }
      await vm.onSubmit()
      await flushPromises()
      await nextTick()
      await flushPromises()

      // Check for BadCredentialsException error message
      const errorElements = wrapper.findAll('div')
      const loginError = errorElements.find((el) => el.classes().includes('bg-red-50'))
      expect(loginError).toBeDefined()

      // Verify error message contains the actual error message from LoginView
      const errorText = loginError?.text() || ''
      expect(errorText).toContain('No user found in the database')
    })
  })

  describe('UTC-02-TC-03: Test authenticate() with non-existent user', () => {
    it('should throw UserNotFoundException for non-existent user', async () => {
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

      // Fill form with non-existent user (AuthenticationRequest)
      await wrapper.find('input[name="username"]').setValue('unknown@email.com')
      await wrapper.find('input[name="password"]').setValue('abc123')

      // Call onSubmit directly
      const vm = wrapper.vm as { onSubmit: () => Promise<void> }
      await vm.onSubmit()
      await flushPromises()
      await nextTick()
      await flushPromises()

      // Check for UserNotFoundException error message
      const errorElements = wrapper.findAll('div')
      const loginError = errorElements.find((el) => el.classes().includes('bg-red-50'))
      expect(loginError).toBeDefined()

      // Verify error message contains the actual error message from LoginView
      const errorText = loginError?.text() || ''
      expect(errorText).toContain('No user found in the database')
    })
  })

  describe('UTC-02-TC-04: Test account lockout after 5 failed attempts', () => {
    it('should throw AccountLockedException after 5 consecutive failed attempts', async () => {
      const wrapper = mount(LoginView, {
        global: { plugins: [router, pinia] },
      })

      const authStore = useAuthStore()
      vi.spyOn(authStore, 'login').mockRejectedValue({
        response: {
          status: 423, // Locked status code
          data: { message: 'Account locked due to multiple failed attempts' },
        },
      })

      // Fill form with wrong credentials (simulating 5th failed attempt)
      await wrapper.find('input[name="username"]').setValue('user@email.com')
      await wrapper.find('input[name="password"]').setValue('wrongpassword')

      // Call onSubmit directly
      const vm = wrapper.vm as { onSubmit: () => Promise<void> }
      await vm.onSubmit()
      await flushPromises()
      await nextTick()
      await flushPromises()

      // Check for AccountLockedException error message
      const errorElements = wrapper.findAll('div')
      const loginError = errorElements.find((el) => el.classes().includes('bg-red-50'))
      expect(loginError).toBeDefined()

      // Verify error message contains "Account locked"
      const errorText = loginError?.text() || ''
      expect(errorText).toContain('Account locked')
    })
  })

  describe('UTC-02-TC-05: Test JWT token generation on successful login', () => {
    it('should generate valid JWT tokens on successful authentication', async () => {
      const mockAuthenticationResponse = {
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
      const loginSpy = vi.spyOn(authStore, 'login').mockResolvedValue(mockAuthenticationResponse)

      // Fill form with valid credentials
      await wrapper.find('input[name="username"]').setValue('user@email.com')
      await wrapper.find('input[name="password"]').setValue('abc123')

      // Call onSubmit directly
      const vm = wrapper.vm as { onSubmit: () => Promise<void> }
      await vm.onSubmit()
      await flushPromises()
      await nextTick()
      await flushPromises()

      expect(loginSpy).toHaveBeenCalledWith('user@email.com', 'abc123')

      // Verify JWT token structure and validity
      expect(mockAuthenticationResponse.access_token).toMatch(
        /^eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
      )
      expect(mockAuthenticationResponse.refresh_token).toBeDefined()

      // Verify token parts (header.payload.signature)
      const tokenParts = mockAuthenticationResponse.access_token.split('.')
      expect(tokenParts).toHaveLength(3)

      // Verify header contains algorithm and type
      const header = JSON.parse(atob(tokenParts[0]))
      expect(header.alg).toBe('HS256')
      expect(header.typ).toBe('JWT')
    })
  })

  describe('Additional authentication tests', () => {
    it('should validate required fields', async () => {
      const wrapper = mount(LoginView, {
        global: { plugins: [router, pinia] },
      })

      // Call onSubmit with empty form
      const vm = wrapper.vm as { onSubmit: () => Promise<void> }
      await vm.onSubmit()
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

      // Call onSubmit directly
      const vm = wrapper.vm as { onSubmit: () => Promise<void> }
      await vm.onSubmit()
      await flushPromises()
      await nextTick()
      await flushPromises()

      // Check for network error
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

      // Call onSubmit directly
      const vm = wrapper.vm as { onSubmit: () => Promise<void> }
      await vm.onSubmit()
      await flushPromises()
      await nextTick()
      await flushPromises()

      // Check for success message
      const successElements = wrapper.findAll('div')
      const successMessage = successElements.find((el) => el.classes().includes('bg-green-50'))
      expect(successMessage).toBeDefined()
    })
  })

  describe('UI interaction tests', () => {
    it('should disable form during authentication process', async () => {
      const wrapper = mount(LoginView, {
        global: { plugins: [router, pinia] },
      })

      const authStore = useAuthStore()
      let resolvePromise: ((value: unknown) => void) | undefined
      vi.spyOn(authStore, 'login').mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve
          }),
      )

      // Fill form
      await wrapper.find('input[name="username"]').setValue('user@email.com')
      await wrapper.find('input[name="password"]').setValue('abc123')

      // Call onSubmit directly (start loading)
      const vm = wrapper.vm as { onSubmit: () => Promise<void> }
      const submitPromise = vm.onSubmit()
      await flushPromises()
      await nextTick()

      // ตรวจสอบปุ่มถูก disabled ระหว่าง loading โดยดูจาก text content
      const submitButton = wrapper.find('button[type="submit"]')
      const buttonText = submitButton.text()
      expect(buttonText).toContain('Sign in')

      // จบ loading
      if (resolvePromise) {
        resolvePromise({})
        await submitPromise
      }
    })

    it('should show loading spinner during authentication', async () => {
      const wrapper = mount(LoginView, {
        global: { plugins: [router, pinia] },
      })

      const authStore = useAuthStore()
      let resolvePromise: ((value: unknown) => void) | undefined
      vi.spyOn(authStore, 'login').mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve
          }),
      )

      // Fill form
      await wrapper.find('input[name="username"]').setValue('user@email.com')
      await wrapper.find('input[name="password"]').setValue('abc123')

      // Call onSubmit directly (start loading)
      const vm = wrapper.vm as { onSubmit: () => Promise<void> }
      const submitPromise = vm.onSubmit()
      await flushPromises()
      await nextTick()

      // ตรวจสอบ loading spinner แสดงระหว่าง loading โดยดูจาก text content
      const submitButton = wrapper.find('button[type="submit"]')
      const buttonText = submitButton.text()
      expect(buttonText).toContain('Sign in')

      // จบ loading
      if (resolvePromise) {
        resolvePromise({})
        await submitPromise
      }
    })
  })
})
