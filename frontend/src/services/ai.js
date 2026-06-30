import api from './api'

export const aiService = {
  analyze: async (message, language = 'en') => {
    const response = await api.post('/api/ai/analyze', { message, language })
    return response.data
  },

  uploadImage: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}

export default aiService
