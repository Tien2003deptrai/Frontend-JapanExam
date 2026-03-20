import useAuthStore from '@/stores/authStore'
import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

axiosInstance.interceptors.request.use(
    config => {
        const token = useAuthStore.getState().token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => Promise.reject(error)
)

export default axiosInstance
