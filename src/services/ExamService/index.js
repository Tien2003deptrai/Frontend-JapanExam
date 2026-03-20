import axiosInstance from '@/services/axiosInstance'

class ExamService {
    api = axiosInstance

    /**
     * Tạo bài thi mới
     * POST /exam/create
     * Hỗ trợ 3 cách tạo block: blockId, questionIds, inline questions
     */
    async createExam(payload) {
        const response = await this.api.post('/exams/create', payload)
        return response.data
    }

    /**
     * Danh sách bài thi (có search & pagination)
     * POST /exam/list
     */
    async getExams(body = {}) {
        const response = await this.api.post('/exams/list', body)
        return response.data
    }

    /**
     * Chi tiết bài thi (kèm tất cả câu hỏi)
     * POST /exam/get-by-id
     */
    async getExamById(examId) {
        const response = await this.api.post('/exams/get-by-id', { examId })
        return response.data
    }

    /**
     * Cập nhật metadata bài thi
     * POST /exam/update
     */
    async updateExam(body) {
        const response = await this.api.post('/exams/update', body)
        return response.data
    }

    /**
     * Xóa bài thi
     * POST /exam/delete
     */
    async deleteExam(examId) {
        const response = await this.api.post('/exams/delete', { examId })
        return response.data
    }

    /**
     * Publish bài thi
     * POST /exam/publish
     */
    async publishExam(examId) {
        const response = await this.api.post('/exams/publish', { examId })
        return response.data
    }

    /**
     * Lấy bài thi mẫu
     * GET /exam/sample
     */
    async getSampleExam() {
        const response = await this.api.get('/exams/sample')
        return response.data
    }
}

export const examService = new ExamService()
