// import { describe, it, expect, beforeEach, vi, Mock } from 'vitest'
// import { mount, flushPromises } from '@vue/test-utils'
// import { nextTick } from 'vue'
// import { createRouter, createMemoryHistory } from 'vue-router'
// import { createPinia, setActivePinia } from 'pinia'
// import { createTestingPinia } from '@pinia/testing'
// import AvatarEditor from '../../../../components/AvatarEditor.vue'
// import { useAvatarStore } from '../../../../service/AvatarService'
// import { useAuthStore } from '../../../../stores/auth'
// import apiClient from '../../../../service/AxiosClient'

// // Mock the API service
// vi.mock('../../../../service/AxiosClient')
// vi.mock('../../../../service/api')

// // Mock File API for testing file uploads
// global.File = class MockFile {
//   name: string
//   size: number
//   type: string
//   lastModified: number

//   constructor(parts: BlobPart[], filename: string, options: FilePropertyBag = {}) {
//     this.name = filename
//     this.size = options.size || 1024 * 1024 // Default 1MB
//     this.type = options.type || 'image/png'
//     this.lastModified = options.lastModified || Date.now()
//   }
// } as any

// // Mock FileReader
// global.FileReader = class MockFileReader {
//   result: string | ArrayBuffer | null = null
//   onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null

//   readAsDataURL(file: File) {
//     setTimeout(() => {
//       this.result = `data:${file.type};base64,mockbase64data`
//       if (this.onload) {
//         this.onload.call(this, {} as ProgressEvent<FileReader>)
//       }
//     }, 0)
//   }
// } as any

// const routes = [
//   { path: '/', component: { template: '<div>Home</div>' } },
//   { path: '/avatar', name: 'avatar', component: AvatarEditor },
//   { path: '/dashboard', name: 'dashboard', component: { template: '<div>Dashboard</div>' } },
// ]

// const router = createRouter({
//   history: createMemoryHistory(),
//   routes,
// })

// describe('Avatar Tests', () => {
//   let pinia: any
//   let mockApiClient: Mock

//   beforeEach(async () => {
//     router.push('/avatar')
//     pinia = createTestingPinia({
//       stubActions: false, // เปลี่ยนจาก true เป็น false เพื่อให้ action ทำงานจริง
//       createSpy: vi.fn,
//     })
//     setActivePinia(pinia)
//     mockApiClient = vi.mocked(apiClient)
//     vi.clearAllMocks()
//     localStorage.clear()
//     await router.isReady()

//     // Mock auth store with authenticated user
//     const authStore = useAuthStore()
//     authStore.user = {
//       id: 1,
//       username: 'testuser',
//       email: 'test@example.com',
//       firstname: 'Test',
//       lastname: 'User',
//       roles: ['USER'],
//       avatarUrl: null,
//       password: '',
//     }
//     authStore.userId = 1
//   })

//   describe('URS-05: Upload Avatar Testing', () => {
//     // UTC-05-TC-01: Test storeAvatar() with valid PNG upload
//     it('should successfully upload valid PNG file', async () => {
//       const mockResponse = {
//         data: {
//           userId: 1,
//           avatarUrl: 'uploads/custom_1.png',
//           rotation: 0,
//         },
//       }
//       ;(mockApiClient as any).post.mockResolvedValueOnce(mockResponse)

//       const wrapper = mount(AvatarEditor, {
//         global: {
//           plugins: [router, pinia],
//         },
//       })

//       const avatarStore = useAvatarStore()

//       // Mock the uploadAvatar action to resolve successfully
//       avatarStore.uploadAvatar = vi.fn().mockResolvedValueOnce(mockResponse.data)

//       // Create mock PNG file (1MB)
//       const mockFile = new File(['mock-image-data'], 'custom.png', {
//         type: 'image/png',
//       })

//       // Simulate file input
//       const fileInput = wrapper.find('input[type="file"]')
//       const fileInputElement = fileInput.element as HTMLInputElement

//       // Mock the files property
//       Object.defineProperty(fileInputElement, 'files', {
//         value: [mockFile],
//         configurable: true,
//       })

//       // Trigger file change
//       await fileInput.trigger('change')
//       await flushPromises()
//       await nextTick()

//       // Verify file was processed and avatar is selected
//       expect((wrapper.vm as any).selectedAvatar).toBeTruthy()
//       expect((wrapper.vm as any).uploadedImage).toBeTruthy()
//       expect((wrapper.vm as any).fileToUpload).toBe(mockFile)

//       // Trigger save
//       await wrapper.find('button').trigger('click') // Save button
//       await flushPromises()
//       await nextTick()

//       // Verify store action was called
//       expect(avatarStore.uploadAvatar).toHaveBeenCalledWith(1, mockFile, 0)
//     })

//     // UTC-05-TC-02: Test storeAvatar() with valid JPEG upload
//     it('should successfully upload valid JPEG file', async () => {
//       const mockResponse = {
//         data: {
//           userId: 1,
//           avatarUrl: 'uploads/custom_1.jpg',
//           rotation: 0,
//         },
//       }
//       mockApiClient.post.mockResolvedValueOnce(mockResponse)

//       const wrapper = mount(AvatarEditor, {
//         global: {
//           plugins: [router, pinia],
//         },
//       })

//       const avatarStore = useAvatarStore()

//       // Create mock JPEG file (2MB)
//       const mockFile = new File(['mock-image-data'], 'custom.jpg', {
//         type: 'image/jpeg',
//         size: 2 * 1024 * 1024, // 2MB
//       })

//       const fileInput = wrapper.find('input[type="file"]')
//       const fileInputElement = fileInput.element as HTMLInputElement

//       Object.defineProperty(fileInputElement, 'files', {
//         value: [mockFile],
//         configurable: true,
//       })

//       await fileInput.trigger('change')
//       await flushPromises()
//       await nextTick()

//       expect(wrapper.vm.selectedAvatar).toBeTruthy()
//       expect(wrapper.vm.uploadedImage).toBeTruthy()
//       expect(wrapper.vm.fileToUpload).toBe(mockFile)

//       // Trigger save
//       await wrapper.find('button').trigger('click') // Save button
//       await flushPromises()
//       await nextTick()

//       expect(avatarStore.uploadAvatar).toHaveBeenCalledWith(1, mockFile, 0)
//     })

//     // UTC-05-TC-03: Test storeAvatar() with invalid file type
//     it('should reject invalid file type', async () => {
//       const wrapper = mount(AvatarEditor, {
//         global: {
//           plugins: [router, pinia],
//         },
//       })

//       // Create mock .exe file
//       const mockFile = new File(['mock-executable'], 'file.exe', {
//         type: 'application/x-msdownload',
//         size: 1024,
//       })

//       const fileInput = wrapper.find('input[type="file"]')
//       const fileInputElement = fileInput.element as HTMLInputElement

//       Object.defineProperty(fileInputElement, 'files', {
//         value: [mockFile],
//         configurable: true,
//       })

//       await fileInput.trigger('change')
//       await flushPromises()
//       await nextTick()

//       // Check for validation error message
//       expect(wrapper.vm.message).toContain('Only JPG and PNG files are allowed')
//       expect(wrapper.vm.messageType).toBe('error')
//       expect(wrapper.vm.selectedAvatar).toBe('')
//     })

//     // UTC-05-TC-04: Test storeAvatar() with oversized file
//     it('should reject oversized file', async () => {
//       const wrapper = mount(AvatarEditor, {
//         global: {
//           plugins: [router, pinia],
//         },
//       })

//       // Create mock oversized file (6MB)
//       const mockFile = new File(['mock-large-image'], 'large.png', {
//         type: 'image/png',
//         size: 6 * 1024 * 1024, // 6MB
//       })

//       const fileInput = wrapper.find('input[type="file"]')
//       const fileInputElement = fileInput.element as HTMLInputElement

//       Object.defineProperty(fileInputElement, 'files', {
//         value: [mockFile],
//         configurable: true,
//       })

//       await fileInput.trigger('change')
//       await flushPromises()
//       await nextTick()

//       // Check for validation error message
//       expect(wrapper.vm.message).toContain('File size must be less than 5MB')
//       expect(wrapper.vm.messageType).toBe('error')
//       expect(wrapper.vm.selectedAvatar).toBe('')
//     })

//     // UTC-05-TC-05: Test storeAvatar() with non-existent user
//     it('should handle non-existent user error', async () => {
//       mockApiClient.post.mockRejectedValueOnce({
//         response: {
//           status: 404,
//           data: { message: 'User not found' },
//         },
//       })

//       const wrapper = mount(AvatarEditor, {
//         global: {
//           plugins: [router, pinia],
//         },
//       })

//       const avatarStore = useAvatarStore()

//       // Mock uploadAvatar to throw UserNotFoundException
//       avatarStore.uploadAvatar = vi.fn().mockRejectedValueOnce(new Error('User not found'))

//       const mockFile = new File(['mock-image'], 'test.png', {
//         type: 'image/png',
//         size: 1024 * 1024,
//       })

//       const fileInput = wrapper.find('input[type="file"]')
//       const fileInputElement = fileInput.element as HTMLInputElement

//       Object.defineProperty(fileInputElement, 'files', {
//         value: [mockFile],
//         configurable: true,
//       })

//       await fileInput.trigger('change')
//       await flushPromises()
//       await nextTick()

//       // Trigger save
//       await wrapper.find('button').trigger('click') // Save button
//       await flushPromises()
//       await nextTick()

//       expect(wrapper.vm.message).toContain('User not found')
//       expect(wrapper.vm.messageType).toBe('error')
//     })
//   })

//   describe('URS-06: Edit Avatar Testing', () => {
//     // UTC-06-TC-01: Test cropAvatar() functionality
//     it('should handle avatar cropping functionality', async () => {
//       const wrapper = mount(AvatarEditor, {
//         global: {
//           plugins: [router, pinia],
//         },
//       })

//       // Set up uploaded image first
//       const mockFile = new File(['mock-image'], 'test.png', {
//         type: 'image/png',
//         size: 1024 * 1024,
//       })

//       const fileInput = wrapper.find('input[type="file"]')
//       const fileInputElement = fileInput.element as HTMLInputElement

//       Object.defineProperty(fileInputElement, 'files', {
//         value: [mockFile],
//         configurable: true,
//       })

//       await fileInput.trigger('change')
//       await flushPromises()
//       await nextTick()

//       // Enable editing mode
//       expect(wrapper.vm.isEditing).toBe(true)
//       expect(wrapper.vm.uploadedImage).toBeTruthy()

//       // Test that crop functionality is available when editing
//       const editSection = wrapper.find('.mb-6.p-4.bg-blue-50')
//       expect(editSection.exists()).toBe(true)

//       // While we can't directly test crop parameters in this component,
//       // we can test that the editing interface is properly enabled
//       expect(wrapper.vm.isEditing).toBe(true)
//     })

//     // UTC-06-TC-02: Test rotateAvatar() functionality
//     it('should rotate avatar 90 degrees', async () => {
//       const wrapper = mount(AvatarEditor, {
//         global: {
//           plugins: [router, pinia],
//         },
//       })

//       // Set up uploaded image first
//       const mockFile = new File(['mock-image'], 'test.png', {
//         type: 'image/png',
//         size: 1024 * 1024,
//       })

//       const fileInput = wrapper.find('input[type="file"]')
//       const fileInputElement = fileInput.element as HTMLInputElement

//       Object.defineProperty(fileInputElement, 'files', {
//         value: [mockFile],
//         configurable: true,
//       })

//       await fileInput.trigger('change')
//       await flushPromises()
//       await nextTick()

//       expect(wrapper.vm.rotation).toBe(0)

//       // Find and click rotate right button
//       const rotateRightBtn = wrapper.find('button:has(svg)')
//       await rotateRightBtn.trigger('click')
//       await nextTick()

//       expect(wrapper.vm.rotation).toBe(90)
//     })

//     // UTC-06-TC-03: Test rotateAvatar() multiple rotations (360° = 0°)
//     it('should handle multiple rotations and return to original', async () => {
//       const wrapper = mount(AvatarEditor, {
//         global: {
//           plugins: [router, pinia],
//         },
//       })

//       // Set up uploaded image first
//       const mockFile = new File(['mock-image'], 'test.png', {
//         type: 'image/png',
//         size: 1024 * 1024,
//       })

//       const fileInput = wrapper.find('input[type="file"]')
//       const fileInputElement = fileInput.element as HTMLInputElement

//       Object.defineProperty(fileInputElement, 'files', {
//         value: [mockFile],
//         configurable: true,
//       })

//       await fileInput.trigger('change')
//       await flushPromises()
//       await nextTick()

//       // Rotate 4 times (360 degrees total)
//       for (let i = 0; i < 4; i++) {
//         wrapper.vm.rotateImage('right')
//         await nextTick()
//       }

//       expect(wrapper.vm.rotation).toBe(0) // Back to original
//     })

//     // UTC-06-TC-04: Test replaceAvatar() functionality
//     it('should replace existing avatar with new file', async () => {
//       const mockResponse = {
//         data: {
//           userId: 1,
//           avatarUrl: 'uploads/new_avatar_1.png',
//           rotation: 0,
//         },
//       }
//       mockApiClient.post.mockResolvedValueOnce(mockResponse)

//       const wrapper = mount(AvatarEditor, {
//         global: {
//           plugins: [router, pinia],
//         },
//       })

//       const avatarStore = useAvatarStore()

//       // First upload
//       const firstFile = new File(['first-image'], 'first.png', {
//         type: 'image/png',
//         size: 1024 * 1024,
//       })

//       const fileInput = wrapper.find('input[type="file"]')
//       const fileInputElement = fileInput.element as HTMLInputElement

//       Object.defineProperty(fileInputElement, 'files', {
//         value: [firstFile],
//         configurable: true,
//       })

//       await fileInput.trigger('change')
//       await flushPromises()
//       await nextTick()

//       // Replace with new file
//       const newFile = new File(['new-image'], 'new.png', {
//         type: 'image/png',
//         size: 1024 * 1024,
//       })

//       Object.defineProperty(fileInputElement, 'files', {
//         value: [newFile],
//         configurable: true,
//       })

//       await fileInput.trigger('change')
//       await flushPromises()
//       await nextTick()

//       expect(wrapper.vm.fileToUpload).toStrictEqual(newFile)
//       expect(wrapper.vm.selectedAvatar).toBeTruthy()

//       // Trigger save
//       await wrapper.find('button').trigger('click') // Save button
//       await flushPromises()
//       await nextTick()

//       expect(avatarStore.uploadAvatar).toHaveBeenCalledWith(1, newFile, 0)
//     })

//     // UTC-06-TC-05: Test avatar validation before save
//     it('should validate corrupted image file', async () => {
//       const wrapper = mount(AvatarEditor, {
//         global: {
//           plugins: [router, pinia],
//         },
//       })

//       const avatarStore = useAvatarStore()

//       // Mock uploadAvatar to throw validation error
//       avatarStore.uploadAvatar = vi.fn().mockRejectedValueOnce(new Error('Invalid image file'))

//       // Create a mock corrupted file (still has valid type but will fail on backend)
//       const corruptedFile = new File(['corrupted-data'], 'corrupted.png', {
//         type: 'image/png',
//         size: 1024 * 1024,
//       })

//       const fileInput = wrapper.find('input[type="file"]')
//       const fileInputElement = fileInput.element as HTMLInputElement

//       Object.defineProperty(fileInputElement, 'files', {
//         value: [corruptedFile],
//         configurable: true,
//       })

//       await fileInput.trigger('change')
//       await flushPromises()
//       await nextTick()

//       // Trigger save
//       await wrapper.find('button').trigger('click') // Save button
//       await flushPromises()
//       await nextTick()

//       expect(wrapper.vm.message).toContain('Invalid image file')
//       expect(wrapper.vm.messageType).toBe('error')
//     })

//     // UTC-06-TC-06: Test avatar storage replacement
//     it('should replace old avatar file with new one', async () => {
//       const mockResponse = {
//         data: {
//           userId: 1,
//           avatarUrl: 'uploads/updated_avatar_1.png',
//           rotation: 0,
//         },
//       }
//       mockApiClient.post.mockResolvedValueOnce(mockResponse)

//       const wrapper = mount(AvatarEditor, {
//         global: {
//           plugins: [router, pinia],
//         },
//       })

//       const avatarStore = useAvatarStore()
//       const authStore = useAuthStore()

//       // Set existing avatar
//       authStore.user.avatarUrl = 'uploads/old_avatar_1.png'

//       const newFile = new File(['new-avatar-data'], 'new_avatar.png', {
//         type: 'image/png',
//         size: 1024 * 1024,
//       })

//       const fileInput = wrapper.find('input[type="file"]')
//       const fileInputElement = fileInput.element as HTMLInputElement

//       Object.defineProperty(fileInputElement, 'files', {
//         value: [newFile],
//         configurable: true,
//       })

//       await fileInput.trigger('change')
//       await flushPromises()
//       await nextTick()

//       // Trigger save
//       await wrapper.find('button').trigger('click') // Save button
//       await flushPromises()
//       await nextTick()

//       // Verify upload was called (which handles replacement on backend)
//       expect(avatarStore.uploadAvatar).toHaveBeenCalledWith(1, newFile, 0)

//       // Verify auth store was updated
//       expect(authStore.setAvatar).toHaveBeenCalled()

//       // Verify success message
//       expect(wrapper.vm.message).toContain('Avatar saved successfully')
//       expect(wrapper.vm.messageType).toBe('success')
//     })

//     // Additional test: Reset rotation
//     it('should reset rotation to 0', async () => {
//       const wrapper = mount(AvatarEditor, {
//         global: {
//           plugins: [router, pinia],
//         },
//       })

//       // Set up uploaded image first
//       const mockFile = new File(['mock-image'], 'test.png', {
//         type: 'image/png',
//         size: 1024 * 1024,
//       })

//       const fileInput = wrapper.find('input[type="file"]')
//       const fileInputElement = fileInput.element as HTMLInputElement

//       Object.defineProperty(fileInputElement, 'files', {
//         value: [mockFile],
//         configurable: true,
//       })

//       await fileInput.trigger('change')
//       await flushPromises()
//       await nextTick()

//       // Rotate first
//       wrapper.vm.rotateImage('right')
//       await nextTick()
//       expect(wrapper.vm.rotation).toBe(90)

//       // Reset rotation
//       wrapper.vm.resetRotation()
//       await nextTick()
//       expect(wrapper.vm.rotation).toBe(0)
//     })

//     // Additional test: Remove avatar
//     it('should remove selected avatar', async () => {
//       const wrapper = mount(AvatarEditor, {
//         global: {
//           plugins: [router, pinia],
//         },
//       })

//       // Set up uploaded image first
//       const mockFile = new File(['mock-image'], 'test.png', {
//         type: 'image/png',
//         size: 1024 * 1024,
//       })

//       const fileInput = wrapper.find('input[type="file"]')
//       const fileInputElement = fileInput.element as HTMLInputElement

//       Object.defineProperty(fileInputElement, 'files', {
//         value: [mockFile],
//         configurable: true,
//       })

//       await fileInput.trigger('change')
//       await flushPromises()
//       await nextTick()

//       expect(wrapper.vm.selectedAvatar).toBeTruthy()

//       // Reset selection
//       wrapper.vm.resetSelection()
//       await nextTick()

//       expect(wrapper.vm.selectedAvatar).toBe('')
//       expect(wrapper.vm.uploadedImage).toBe(null)
//       expect(wrapper.vm.fileToUpload).toBe(null)
//       expect(wrapper.vm.rotation).toBe(0)
//     })
//   })
// })
