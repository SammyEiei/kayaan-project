import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia } from 'pinia'
import RegisterView from '@/views/authentication_view/RegisterView.vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/service/api'
import { createTestingPinia } from '@pinia/testing'

vi.mock('@/service/api')

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/register', name: 'register', component: RegisterView }],
})

describe('RegisterView', () => {
  let pinia: ReturnType<typeof createTestingPinia>

  beforeEach(async () => {
    router.push('/register')
    pinia = createTestingPinia({
      stubActions: false, // เปลี่ยนเป็น false เพื่อ mock action จริง
      createSpy: vi.fn,
    })
    setActivePinia(pinia)

    // Mock action ก่อน mount component
    const authStore = useAuthStore()
    authStore.register = vi.fn()

    vi.clearAllMocks()
    localStorage.clear()
    await router.isReady()
  })

  it('สมัครสมาชิกสำเร็จ', async () => {
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
      global: { plugins: [router, pinia] },
    })

    const authStore = useAuthStore()
    authStore.register = vi.fn().mockResolvedValue(mockResponse.data)

    await wrapper.find('input[name="firstName"]').setValue('Test')
    await wrapper.find('input[name="lastName"]').setValue('User')
    await wrapper.find('input[name="email"]').setValue('test@example.com')
    await wrapper.find('input[name="userName"]').setValue('testuser')
    await wrapper.find('input[name="password"]').setValue('password123')
    await wrapper.find('input[name="confirmPassword"]').setValue('password123')

    await wrapper.find('form').trigger('submit')
    await flushPromises()
    await nextTick()
    await flushPromises()
    await nextTick()

    expect(authStore.register).toHaveBeenCalledWith(
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
  })

  it('แสดง error validation เมื่อข้อมูลไม่ถูกต้อง', async () => {
    const wrapper = mount(RegisterView, {
      global: { plugins: [router, pinia] },
    })

    await wrapper.find('form').trigger('submit')
    await flushPromises()
    await nextTick()
    await flushPromises()
    await nextTick()

    // blur ทุก input เพื่อให้ vee-validate แสดง error
    await wrapper.find('input[name="firstName"]').trigger('blur')
    await wrapper.find('input[name="lastName"]').trigger('blur')
    await wrapper.find('input[name="email"]').trigger('blur')
    await wrapper.find('input[name="userName"]').trigger('blur')
    await wrapper.find('input[name="password"]').trigger('blur')
    await wrapper.find('input[name="confirmPassword"]').trigger('blur')
    await flushPromises()
    await nextTick()
    await nextTick()

    expect(wrapper.find('[data-testid="first-name-error"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="last-name-error"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="email-error"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="username-error"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="password-error"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="confirm-password-error"]').exists()).toBe(true)
  })

  it('validate password confirmation ไม่ตรงกัน', async () => {
    const wrapper = mount(RegisterView, {
      global: { plugins: [router, pinia] },
    })

    await wrapper.find('input[name="password"]').setValue('password123')
    await wrapper.find('input[name="confirmPassword"]').setValue('wrongpassword')

    await wrapper.find('form').trigger('submit')
    await flushPromises()
    await nextTick()
    await flushPromises()
    await nextTick()

    await wrapper.find('input[name="confirmPassword"]').trigger('blur')
    await flushPromises()
    await nextTick()
    await nextTick()

    const confirmPasswordError = wrapper.find('[data-testid="confirm-password-error"]')
    expect(confirmPasswordError.exists()).toBe(true)
    expect(confirmPasswordError.text()).toContain('Passwords do not match')
  })
})
