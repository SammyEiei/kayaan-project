import apiClient from '@/service/AxiosClient'
apiClient.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem('access_token')
    console.log('token', token)
    if (token) {
      request.headers['Authorization'] = 'Bearer ' + token
    }
    return request
  },
  (error: any) => {
    return Promise.reject(error)
  },
)
