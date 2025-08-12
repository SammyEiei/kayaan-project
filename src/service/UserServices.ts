import axios from 'axios'
import { register } from 'module'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api',
  headers: {
    Accept: 'application/json', // ไม่ตั้ง Content-Type เป็น default
  }
})

export default{
  register(formData: FormData){
    return apiClient.post('/register',formData)
  }
}
