import api from './api'

export const complaintService = {
  // Raise a new complaint
  create: async (data) => {
    const response = await api.post('/api/complaints', data)
    return response.data
  },

  // Get all complaints (authority)
  getAll: async (params = {}) => {
    const response = await api.get('/api/complaints', { params })
    return response.data
  },

  // Get my complaints (citizen)
  getMy: async () => {
    const response = await api.get('/api/complaints/my')
    return response.data
  },

  // Get single complaint by ID
  getById: async (id) => {
    const response = await api.get(`/api/complaints/${id}`)
    return response.data
  },

  // Track by complaint ID string (e.g. LV-2024-0001) or mobile
  track: async (complaintId) => {
    const response = await api.get(`/api/complaints/track/${complaintId}`)
    return response.data
  },

  // Update complaint status (authority)
  updateStatus: async (id, status) => {
    const response = await api.put(`/api/complaints/${id}/status`, { status })
    return response.data
  },

  // Add response to complaint (authority)
  addResponse: async (id, message) => {
    const response = await api.post(`/api/complaints/${id}/response`, { message })
    return response.data
  },
}

export default complaintService
