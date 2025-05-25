import axios from 'axios'
import { register } from 'module'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

export default{
  register(formData: FormData){
    return apiClient.post('/register',formData)
  }
}
