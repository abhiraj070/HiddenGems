import axios from "axios"

const api = axios.create({
  baseURL: "https://hiddengems-1.onrender.com", //backend url
  withCredentials: true
})

api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
      try {
        await api.post("/api/v1/users/refreshtoken")
        return api(error.config) //error.config stores the exact error that failed.
      } catch {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export default api
