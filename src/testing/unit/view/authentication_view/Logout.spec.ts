// src/testing/unit/view/authentication_view/Logout.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { useAuthStore } from '../../../../stores/auth'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Logout - UTC-03: Log Out Testing', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let authStore: ReturnType<typeof useAuthStore>

  beforeEach(async () => {
    pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    })
    setActivePinia(pinia)
    authStore = useAuthStore()

    vi.clearAllMocks()
    localStorageMock.clear()
  })

  describe('UTC-03-TC-01: Test logout with valid refresh token', () => {
    it('should clear all authentication data when logout is called', async () => {
      // Set up initial authenticated state
      authStore.token = 'valid.access.token'
      authStore.user = {
        id: 1,
        username: 'test@example.com',
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        roles: ['USER'],
        password: '',
      }
      authStore.userId = 1
      authStore.roles = ['USER']

      // Mock localStorage to return our test data
      localStorageMock.getItem
        .mockReturnValueOnce('valid.access.token') // access_token
        .mockReturnValueOnce(JSON.stringify(authStore.user)) // user
        .mockReturnValueOnce('1') // userId

      // Call logout
      authStore.logout()

      // Verify token is cleared from store
      expect(authStore.token).toBeNull()
      expect(authStore.user).toBeNull()
      expect(authStore.userId).toBeNull()
      expect(authStore.roles).toEqual([])

      // Verify localStorage is cleared
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userId')
    })
  })

  describe('UTC-03-TC-02: Test logout with invalid refresh token', () => {
    it('should clear authentication data even when token is invalid', async () => {
      // Set up initial authenticated state with invalid token
      authStore.token = 'invalid.access.token'
      authStore.user = {
        id: 1,
        username: 'test@example.com',
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        roles: ['USER'],
        password: '',
      }
      authStore.userId = 1
      authStore.roles = ['USER']

      // Mock localStorage
      localStorageMock.getItem
        .mockReturnValueOnce('invalid.access.token') // access_token
        .mockReturnValueOnce(JSON.stringify(authStore.user)) // user
        .mockReturnValueOnce('1') // userId

      // Call logout
      authStore.logout()

      // Verify that store state is cleared even with invalid token
      expect(authStore.token).toBeNull()
      expect(authStore.user).toBeNull()
      expect(authStore.userId).toBeNull()
      expect(authStore.roles).toEqual([])

      // Verify localStorage is cleared
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userId')
    })
  })

  describe('UTC-03-TC-03: Test logout with expired refresh token', () => {
    it('should clear authentication data even when token is expired', async () => {
      // Set up initial authenticated state with expired token
      authStore.token = 'expired.access.token'
      authStore.user = {
        id: 1,
        username: 'test@example.com',
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        roles: ['USER'],
        password: '',
      }
      authStore.userId = 1
      authStore.roles = ['USER']

      // Mock localStorage
      localStorageMock.getItem
        .mockReturnValueOnce('expired.access.token') // access_token
        .mockReturnValueOnce(JSON.stringify(authStore.user)) // user
        .mockReturnValueOnce('1') // userId

      // Call logout
      authStore.logout()

      // Verify that store state is cleared even with expired token
      expect(authStore.token).toBeNull()
      expect(authStore.user).toBeNull()
      expect(authStore.userId).toBeNull()
      expect(authStore.roles).toEqual([])

      // Verify localStorage is cleared
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userId')
    })
  })

  describe('Additional logout functionality tests', () => {
    it('should handle logout when no authentication data exists', () => {
      // Ensure no initial state
      authStore.token = null
      authStore.user = null
      authStore.userId = null
      authStore.roles = []

      // Mock empty localStorage
      localStorageMock.getItem.mockReturnValue(null)

      // Call logout
      authStore.logout()

      // Verify state remains null/empty
      expect(authStore.token).toBeNull()
      expect(authStore.user).toBeNull()
      expect(authStore.userId).toBeNull()
      expect(authStore.roles).toEqual([])

      // Verify localStorage removal is still attempted
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userId')
    })

    it('should clear multiple roles when logout', () => {
      // Set up initial authenticated state with multiple roles
      authStore.token = 'test.access.token'
      authStore.user = {
        id: 1,
        username: 'admin@example.com',
        email: 'admin@example.com',
        firstname: 'Admin',
        lastname: 'User',
        roles: ['USER', 'ADMIN'],
        password: '',
      }
      authStore.userId = 1
      authStore.roles = ['USER', 'ADMIN']

      // Mock localStorage
      localStorageMock.getItem
        .mockReturnValueOnce('test.access.token') // access_token
        .mockReturnValueOnce(JSON.stringify(authStore.user)) // user
        .mockReturnValueOnce('1') // userId

      // Call logout
      authStore.logout()

      // Verify all store state is cleared including multiple roles
      expect(authStore.token).toBeNull()
      expect(authStore.user).toBeNull()
      expect(authStore.userId).toBeNull()
      expect(authStore.roles).toEqual([])

      // Verify localStorage items are removed
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userId')
    })

    it('should verify logout clears all user data types', () => {
      // Set up initial authenticated state with all data types
      authStore.token = 'test.access.token'
      authStore.user = {
        id: 1,
        username: 'test@example.com',
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        roles: ['USER'],
        password: '',
        avatarUrl: 'https://example.com/avatar.jpg',
        avatarRotation: 45,
      }
      authStore.userId = 1
      authStore.roles = ['USER']

      // Mock localStorage
      localStorageMock.getItem
        .mockReturnValueOnce('test.access.token') // access_token
        .mockReturnValueOnce(JSON.stringify(authStore.user)) // user
        .mockReturnValueOnce('1') // userId

      // Call logout
      authStore.logout()

      // Verify all user data is cleared
      expect(authStore.token).toBeNull()
      expect(authStore.user).toBeNull()
      expect(authStore.userId).toBeNull()
      expect(authStore.roles).toEqual([])

      // Verify localStorage items are removed
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userId')
    })
  })
})
