import axiosInstance from '@/services/axiosInstance'

class LessonService {
    api = axiosInstance

    async addLesson(body) {
        const response = await this.api.post('/lesson/addLesson', body)
        return response.data
    }

    async getLessons() {
        const response = await this.api.get('/lesson/getLessons')
        return response.data
    }
}

export const lessonService = new LessonService()
