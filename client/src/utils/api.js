import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sp_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sp_admin_token')
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export const login = (email, password) => api.post('/auth/login', { email, password })
export const verifyAuth = () => api.get('/auth/verify')

export const getServices = () => api.get('/services')
export const getAllServices = () => api.get('/services/all')
export const createService = (data) => api.post('/services', data)
export const updateService = (id, data) => api.put(`/services/${id}`, data)
export const deleteService = (id) => api.delete(`/services/${id}`)

export const getContent = () => api.get('/content')
export const updateContent = (key, value) => api.put(`/content/${key}`, { value })

export const submitBooking = (data) => api.post('/bookings', data)
export const getBookings = () => api.get('/bookings')
export const getBooking = (id) => api.get(`/bookings/${id}`)
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data)
export const deleteBooking = (id) => api.delete(`/bookings/${id}`)

export const submitContact = (data) => api.post('/contact', data)
export const getContacts = () => api.get('/contact')
export const markContactRead = (id) => api.put(`/contact/${id}/read`)
export const deleteContact = (id) => api.delete(`/contact/${id}`)

export const getGallery = () => api.get('/gallery')
export const uploadImage = (formData) => api.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateImage = (id, data) => api.put(`/gallery/${id}`, data)
export const deleteImage = (id) => api.delete(`/gallery/${id}`)

export const getTestimonials = () => api.get('/testimonials')
export const getAllTestimonials = () => api.get('/testimonials/all')
export const createTestimonial = (data) => api.post('/testimonials', data)
export const updateTestimonial = (id, data) => api.put(`/testimonials/${id}`, data)
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`)

export const getDashboardStats = () => api.get('/dashboard/stats')

export const createPayment = (data) => api.post('/payments/create', data)
export const getPayments = () => api.get('/payments')
export const getPayment = (id) => api.get(`/payments/${id}`)
export const updatePayment = (id, data) => api.put(`/payments/${id}`, data)
export const getRevenueSummary = () => api.get('/payments/revenue-summary')

export const getPlans = () => api.get('/plans')
export const getAllPlans = () => api.get('/plans/all')
export const createPlan = (data) => api.post('/plans', data)
export const updatePlan = (id, data) => api.put(`/plans/${id}`, data)
export const deletePlan = (id) => api.delete(`/plans/${id}`)

export const getIndustries = () => api.get('/industries')
export const getAllIndustries = () => api.get('/industries/all')
export const createIndustry = (data) => api.post('/industries', data)
export const updateIndustry = (id, data) => api.put(`/industries/${id}`, data)
export const deleteIndustry = (id) => api.delete(`/industries/${id}`)

export default api
