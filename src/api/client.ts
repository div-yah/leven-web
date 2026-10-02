import axios from 'axios'

// In production the frontend and API are deployed as separate Railway
// services on separate domains, so relative paths like '/api/v1' or
// '/uploads/...' won't resolve against the API. VITE_API_URL (set at
// build time) points at the API's public URL in that case.
//
// In local dev, VITE_API_URL is left unset and we fall back to relative
// paths, which Vite's dev server proxies to localhost:8000 (see
// vite.config.ts).
export const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

const client = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default client
