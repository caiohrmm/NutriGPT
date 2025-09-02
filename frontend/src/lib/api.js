import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para capturar novos access tokens do header x-access-token
api.interceptors.response.use(
  (response) => {
    // Verifica se há um novo access token no header
    const newAccessToken = response.headers['x-access-token']
    if (newAccessToken) {
      // Atualiza o token para próximas requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
      // Salva no localStorage para persistência
      localStorage.setItem('accessToken', newAccessToken)
    }
    return response
  },
  (error) => {
    // Se erro 401, limpa tokens e redireciona para login
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      delete api.defaults.headers.common['Authorization']
      // Será tratado pelo AuthContext
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }
    return Promise.reject(error)
  }
)

// Configura token inicial se existir
const savedToken = localStorage.getItem('accessToken')
if (savedToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
}

// Auth API functions
export const authAPI = {
  login: (data) =>
    api.post('/auth/login', data).then(res => res.data),
  
  register: (data) =>
    api.post('/auth/register', data).then(res => res.data),
  
  refresh: () =>
    api.post('/auth/refresh').then(res => res.data),
  
  logout: () =>
    api.post('/auth/logout').then(() => {}),
  
  me: () =>
    api.get('/me').then(res => res.data),
}
