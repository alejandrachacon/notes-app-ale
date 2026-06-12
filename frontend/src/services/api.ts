import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        })

        const { access } = response.data
        localStorage.setItem('access_token', access)

        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  title: string
  category: string
  color: string
  content: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  access: string
  refresh: string
}

export const authAPI = {
  register: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/register/', { email, password }),
  
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login/', { email, password }),
  
  logout: (refreshToken: string) =>
    api.post('/auth/logout/', { refresh: refreshToken }),
}

export interface CreateNoteData {
  title: string
  content: string
  category?: string
  color?: string
}

export interface UpdateNoteData {
  title: string
  content: string
  category?: string
  color?: string
}

export interface Category {
  name: string
  color: string
}

export const notesAPI = {
  getAll: () => api.get<Note[]>('/notes/'),
  
  getOne: (id: string) => api.get<Note>(`/notes/${id}/`),
  
  create: (data: CreateNoteData) =>
    api.post<Note>('/notes/', data),
  
  update: (id: string, data: UpdateNoteData) =>
    api.put<Note>(`/notes/${id}/`, data),
  
  delete: (id: string) => api.delete(`/notes/${id}/`),
  
  getCategories: () => api.get<Category[]>('/notes/categories/'),
}

export default api
