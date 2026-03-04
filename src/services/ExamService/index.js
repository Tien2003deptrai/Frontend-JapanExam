import { examData } from '@/mock/examData'

const mockDelay = (result, time = 500) =>
    new Promise((resolve) => {
        setTimeout(() => resolve(result), time)
    })

class ExamService {
    constructor() {
        this.exams = [...examData]
    }

    async getExams() {
        return mockDelay([...this.exams])
    }

    async getExamsByLevel(level) {
        const filtered = this.exams.filter(
            (exam) => exam.level === level && exam.status === 'published',
        )
        return mockDelay([...filtered])
    }

    async createExam(payload) {
        const newExam = {
            id: `exam-${Date.now()}`,
            status: 'draft',
            attempts: 0,
            thumbnail:
                'https://images.pexels.com/photos/5428004/pexels-photo-5428004.jpeg?auto=compress&cs=tinysrgb&w=800',
            ...payload,
        }

        this.exams = [newExam, ...this.exams]
        return mockDelay(newExam)
    }

    async toggleExamStatus(id) {
        this.exams = this.exams.map((exam) =>
            exam.id === id ? { ...exam, status: exam.status === 'published' ? 'draft' : 'published' } : exam
        )

        const updatedExam = this.exams.find((exam) => exam.id === id)
        return mockDelay(updatedExam)
    }

    async deleteExam(id) {
        this.exams = this.exams.filter((exam) => exam.id !== id)
        return mockDelay({ success: true })
    }
}

export const examService = new ExamService()
