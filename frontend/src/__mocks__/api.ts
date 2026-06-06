export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  title: string
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
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
}

export const notesAPI = {
  getAll: jest.fn(),
  getOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

const api = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
}

export default api
