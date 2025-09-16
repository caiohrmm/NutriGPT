import axios from 'axios'

// Detecta automaticamente a URL da API baseada no hostname atual
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // Se estiver acessando via IP da rede, usa o mesmo IP para a API
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:3000/api`;
  }
  
  // Fallback para desenvolvimento local
  return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Debug: mostra a URL da API no console
console.log('🔗 API Base URL:', API_BASE_URL);

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

// User API functions
export const userAPI = {
  // Update user profile
  updateProfile: (data) =>
    api.put('/me', data).then(res => res.data),
}

// Patient API functions
export const patientAPI = {
  // List patients with pagination and filters
  list: (params = {}) => {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.append('page', params.page)
    if (params.limit) searchParams.append('limit', params.limit)
    if (params.name) searchParams.append('name', params.name)
    if (params.goal) searchParams.append('goal', params.goal)
    
    const query = searchParams.toString()
    return api.get(`/patients${query ? `?${query}` : ''}`).then(res => res.data)
  },
  
  // Create new patient
  create: (data) =>
    api.post('/patients', data).then(res => res.data),
  
  // Update patient
  update: (id, data) =>
    api.put(`/patients/${id}`, data).then(res => res.data),
  
  // Delete patient
  delete: (id) =>
    api.delete(`/patients/${id}`).then(() => {}),
  
  // Get patient by ID (we'll need to implement this endpoint)
  getById: (id) =>
    api.get(`/patients/${id}`).then(res => res.data),
}

// Measurement API functions
export const measurementAPI = {
  // Create measurement
  create: (data) =>
    api.post('/measurements', data).then(res => res.data),
  
  // Get measurement by ID
  getById: (id) =>
    api.get(`/measurements/${id}`).then(res => res.data),
  
  // List measurements by patient
  listByPatient: (patientId, params = {}) => {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.append('page', params.page)
    if (params.pageSize) searchParams.append('pageSize', params.pageSize)
    if (params.from) searchParams.append('from', params.from)
    if (params.to) searchParams.append('to', params.to)
    if (params.sort) searchParams.append('sort', params.sort)
    
    const query = searchParams.toString()
    return api.get(`/patients/${patientId}/measurements${query ? `?${query}` : ''}`).then(res => res.data)
  },
  
  // Update measurement
  update: (id, data) =>
    api.put(`/measurements/${id}`, data).then(res => res.data),
  
  // Delete measurement
  delete: (id) =>
    api.delete(`/measurements/${id}`).then(() => {}),
}

// Appointment API functions
export const appointmentAPI = {
  // Create appointment
  create: (data) =>
    api.post('/appointments', data).then(res => res.data),
  
  // List appointments
  list: (params = {}) => {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.append('page', params.page)
    if (params.limit) searchParams.append('limit', params.limit)
    if (params.date) searchParams.append('date', params.date)
    if (params.patient) searchParams.append('patient', params.patient)
    if (params.patientId) searchParams.append('patientId', params.patientId)
    if (params.status) searchParams.append('status', params.status)
    
    const query = searchParams.toString()
    return api.get(`/appointments${query ? `?${query}` : ''}`).then(res => res.data)
  },
  
  // Update appointment
  update: (id, data) =>
    api.put(`/appointments/${id}`, data).then(res => res.data),
  
  // Cancel appointment
  cancel: (id) =>
    api.post(`/appointments/${id}/cancel`).then(res => res.data),
  
  // Delete appointment
  delete: (id) =>
    api.delete(`/appointments/${id}`).then(() => {}),
}

// Meal Plan API functions
export const planAPI = {
  // Generate AI suggestion (preview only)
  generateAISuggestion: (data) =>
    api.post('/plans/ai/suggestion', data).then(res => res.data),
  
  // Create meal plan
  create: (data) =>
    api.post('/plans', data).then(res => res.data),
  
  // Get meal plan by ID
  getById: (id) =>
    api.get(`/plans/${id}`).then(res => res.data),
  
  // List meal plans by patient
  listByPatient: (patientId) =>
    api.get(`/patients/${patientId}/plans`).then(res => res.data),
  
  // Update meal plan
  update: (id, data) =>
    api.put(`/plans/${id}`, data).then(res => res.data),
  
  // Toggle active status
  toggleActive: (id) =>
    api.patch(`/plans/${id}/toggle-active`).then(res => res.data),
  
  // Delete meal plan
  delete: (id) =>
    api.delete(`/plans/${id}`).then(() => {}),
}

// Search API functions
export const searchAPI = {
  // Global search combining patients and appointments
  global: async (query, limit = 10) => {
    try {
      const [patientsResponse, appointmentsResponse] = await Promise.all([
        patientAPI.list({ name: query, limit: Math.ceil(limit / 2) }),
        appointmentAPI.list({ patient: query, limit: Math.ceil(limit / 2) })
      ])

      return {
        patients: patientsResponse.data || [],
        appointments: appointmentsResponse.data || [],
        total: (patientsResponse.data?.length || 0) + (appointmentsResponse.data?.length || 0)
      }
    } catch (error) {
      console.error('Global search error:', error)
      return { patients: [], appointments: [], total: 0 }
    }
  }
}
