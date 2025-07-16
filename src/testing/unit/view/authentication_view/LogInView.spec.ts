// src/testing/unit/view/authentication_view/LoginView.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia } from 'pinia'
import LoginView from '@/views/authentication_view/LoginView.vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/service/api'
import { createTestingPinia } from '@pinia/testing'

vi.mock('@/service/api')

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/dashboard', name: 'dashboard', component: { template: '<div>Dashboard</div>' } },
  ],
})

describe('LoginView', () => {
  let pinia: ReturnType<typeof createTestingPinia>

  beforeEach(async () => {
    router.push('/login')
    pinia = createTestingPinia({
      stubActions: false, // เปลี่ยนเป็น false เพื่อ mock action จริง
      createSpy: vi.fn,
    })
    setActivePinia(pinia)

    // Mock action ก่อน mount component
    const authStore = useAuthStore()
    authStore.login = vi.fn()

    vi.clearAllMocks()
    localStorage.clear()
    await router.isReady()
  })

  it('login สำเร็จ', async () => {
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
      global: { plugins: [router, pinia] },
    })

    const authStore = useAuthStore()
    authStore.login = vi.fn().mockResolvedValue(mockResponse.data)

    await wrapper.find('input[name="username"]').setValue('testuser')
    await wrapper.find('input[name="password"]').setValue('password123')

    await wrapper.find('form').trigger('submit')
    await flushPromises()
    await nextTick()
    await flushPromises()
    await nextTick()

    expect(authStore.login).toHaveBeenCalledWith('testuser', 'password123')
  })

  it('แสดง error เมื่อ login ผิด', async () => {
    vi.spyOn(api, 'post').mockRejectedValueOnce({
      response: {
        status: 401,
        data: { message: 'No user found in the database. Please try again.' },
      },
    })

    const wrapper = mount(LoginView, {
      global: { plugins: [router, pinia] },
    })

    await wrapper.find('input[name="username"]').setValue('wronguser')
    await wrapper.find('input[name="password"]').setValue('wrongpassword')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    await nextTick()
    await flushPromises()
    await nextTick()
    await nextTick()

    const errorMessage = wrapper.find('[data-testid="login-error-message"]')
    expect(errorMessage.exists()).toBe(true)
    expect(errorMessage.text()).toContain('No user found in the database. Please try again.')
  })

  it('validate required fields', async () => {
    const wrapper = mount(LoginView, {
      global: { plugins: [router, pinia] },
    })

    await wrapper.find('form').trigger('submit')
    await flushPromises()
    await nextTick()
    await flushPromises()
    await nextTick()

    await wrapper.find('input[name="username"]').trigger('blur')
    await wrapper.find('input[name="password"]').trigger('blur')
    await flushPromises()
    await nextTick()
    await nextTick()

    const usernameError = wrapper.find('[data-testid="login-username-error"]')
    const passwordError = wrapper.find('[data-testid="login-password-error"]')

    expect(usernameError.exists()).toBe(true)
    expect(usernameError.text()).toContain('The username is required')
    expect(passwordError.exists()).toBe(true)
    expect(passwordError.text()).toContain('Password is required')
  })
})
