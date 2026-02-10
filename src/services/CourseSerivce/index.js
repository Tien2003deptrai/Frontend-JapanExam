import axiosInstance from '@/services/axiosInstance'

class CourseService {
    api = axiosInstance

    async addCourse(body) {
        const response = await this.api.post('/course/addCourse', body)
        return response.data
    }

    async getCourses() {
        const response = await this.api.get('/course/getCourses')
        return response.data
    }
}

export const courseService = new CourseService()
