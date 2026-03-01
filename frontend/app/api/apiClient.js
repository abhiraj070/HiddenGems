import axios from "axios"

const api = axios.create({
  baseURL: "https://hiddengems-1.onrender.com", //backend url
  withCredentials: true
})

const refreshClient = axios.create({
  baseURL: "https://hiddengems-1.onrender.com",
  withCredentials: true
})

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config
    const isUnauthorized = error.response?.status === 401
    const isRefreshCall = originalRequest?.url?.includes("/api/v1/users/refreshtoken")

    if (isUnauthorized && !originalRequest?._retry && !isRefreshCall) {
      originalRequest._retry = true
      try {
        await refreshClient.post("/api/v1/users/refreshtoken")
        return api(originalRequest)
      } catch {
        if (typeof window !== "undefined") {
          window.location.href = "/auth"
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
