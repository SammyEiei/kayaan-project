import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import RegisterView from '../../../../views/authentication_view/RegisterView.vue'
import LoginView from '../../../../views/authentication_view/LoginView.vue'
import { useAuthStore } from '../../../../stores/auth'
import api from '../../../../service/api'
import { createTestingPinia } from '@pinia/testing'

vi.mock('../../../../service/api')

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
  let pinia: any

  beforeEach(async () => {
    router.push('/register')
    // ใช้ createTestingPinia แบบ stubActions: true เพื่อให้สามารถ spy action ได้
    pinia = createTestingPinia({
      stubActions: true, // สำคัญ! ต้องเป็น true เพื่อให้ spy ได้
      createSpy: vi.fn,
    })
    setActivePinia(pinia)
    vi.clearAllMocks()
    localStorage.clear()
    await router.isReady()
  })

  describe('URS-01: Register Account Testing', () => {
    // #1
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
      vi.spyOn(api, 'post').mockResolvedValueOnce(mockResponse)

      const wrapper = mount(RegisterView, {
        global: {
          plugins: [router, pinia],
        },
      })

      // ต้อง get store instance หลัง setActivePinia และ mount component
      const authStore = useAuthStore()

      // Fill form
      await wrapper.find('input[name="firstName"]').setValue('Test')
      await wrapper.find('input[name="lastName"]').setValue('User')
      await wrapper.find('input[name="email"]').setValue('test@example.com')
      await wrapper.find('input[name="userName"]').setValue('testuser')
      await wrapper.find('input[name="password"]').setValue('password123')
      await wrapper.find('input[name="confirmPassword"]').setValue('password123')

      // Submit form
      await wrapper.find('form').trigger('submit')
      await flushPromises()
      await nextTick()
      await flushPromises()
      await nextTick()

      // ตรวจสอบว่า register ถูกเรียกด้วย argument ที่ถูกต้อง
      expect(authStore.register).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'testuser',
        'Test',
        'User',
      )

      // Verify API call
      expect(api.post).toHaveBeenCalledWith('/api/v1/auth/register', {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstname: 'Test',
        lastname: 'User',
      })
    })
    // #2
    it('should show validation errors for invalid input', async () => {
      const wrapper = mount(RegisterView, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Submit empty form
      await wrapper.find('form').trigger('submit')
      await flushPromises()
      await nextTick()
      await flushPromises()
      await nextTick()

      // trigger blur เพื่อให้ vee-validate แสดง error
      await wrapper.find('input[name="firstName"]').trigger('blur')
      await wrapper.find('input[name="lastName"]').trigger('blur')
      await wrapper.find('input[name="email"]').trigger('blur')
      await wrapper.find('input[name="userName"]').trigger('blur')
      await wrapper.find('input[name="password"]').trigger('blur')
      await wrapper.find('input[name="confirmPassword"]').trigger('blur')
      await flushPromises()
      await nextTick()

      // ตรวจสอบ error จาก DOM element โดยตรง
      const firstNameError = wrapper.find('[data-testid="first-name-error"]')
      const lastNameError = wrapper.find('[data-testid="last-name-error"]')
      const emailError = wrapper.find('[data-testid="email-error"]')
      const usernameError = wrapper.find('[data-testid="username-error"]')
      const passwordError = wrapper.find('[data-testid="password-error"]')
      const confirmPasswordError = wrapper.find('[data-testid="confirm-password-error"]')

      expect(firstNameError.exists()).toBe(true)
      expect(firstNameError.text()).toContain('First name is required')
      expect(lastNameError.exists()).toBe(true)
      expect(lastNameError.text()).toContain('Last name is required')
      expect(emailError.exists()).toBe(true)
      expect(emailError.text()).toContain('Email is required')
      expect(usernameError.exists()).toBe(true)
      expect(usernameError.text()).toContain('User name is required')
      expect(passwordError.exists()).toBe(true)
      expect(passwordError.text()).toContain('Password is required')
      expect(confirmPasswordError.exists()).toBe(true)
      expect(confirmPasswordError.text()).toContain('Please confirm your password')
    })
    // #3
    it('should validate password confirmation matches', async () => {
      const wrapper = mount(RegisterView, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Fill passwords with mismatch
      await wrapper.find('input[name="password"]').setValue('password123')
      await wrapper.find('input[name="confirmPassword"]').setValue('wrongpassword')

      // Submit form
      await wrapper.find('form').trigger('submit')
      await flushPromises()
      await nextTick()
      await flushPromises()
      await nextTick()

      // ตรวจสอบ error จาก DOM element โดยตรง
      const confirmPasswordError = wrapper.find('[data-testid="confirm-password-error"]')
      expect(confirmPasswordError.exists()).toBe(true)
      expect(confirmPasswordError.text()).toContain('Passwords do not match')
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
      vi.spyOn(api, 'post').mockResolvedValueOnce(mockResponse)

      const wrapper = mount(LoginView, {
        global: {
          plugins: [router, pinia],
        },
      })

      const authStore = useAuthStore()

      // Fill credentials
      await wrapper.find('input[name="username"]').setValue('testuser')
      await wrapper.find('input[name="password"]').setValue('password123')

      // Submit form
      await wrapper.find('form').trigger('submit')
      await flushPromises()
      await nextTick()
      await flushPromises()
      await nextTick()

      // Verify store action call (mock action)
      expect(authStore.login).toHaveBeenCalledWith('testuser', 'password123')
    })

    it('should show error for invalid credentials', async () => {
      vi.spyOn(api, 'post').mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: 'No user found in the database. Please try again.' },
        },
      })

      const wrapper = mount(LoginView, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Fill invalid credentials
      await wrapper.find('input[name="username"]').setValue('wronguser')
      await wrapper.find('input[name="password"]').setValue('wrongpassword')

      // Submit form
      await wrapper.find('form').trigger('submit')
      await flushPromises()
      await nextTick()
      await flushPromises()
      await nextTick()

      // ตรวจสอบ error จาก DOM element โดยตรง
      const errorMessage = wrapper.find('[data-testid="login-error-message"]')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toContain('No user found in the database. Please try again.')
    })

    it('should validate required fields', async () => {
      const wrapper = mount(LoginView, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Submit empty form
      await wrapper.find('form').trigger('submit')
      await flushPromises()
      await nextTick()
      await flushPromises()
      await nextTick()

      // ตรวจสอบ error จาก DOM element โดยตรง
      const usernameError = wrapper.find('[data-testid="login-username-error"]')
      const passwordError = wrapper.find('[data-testid="login-password-error"]')

      expect(usernameError.exists()).toBe(true)
      expect(usernameError.text()).toContain('The username is required')
      expect(passwordError.exists()).toBe(true)
      expect(passwordError.text()).toContain('Password is required')
    })
  })
})
