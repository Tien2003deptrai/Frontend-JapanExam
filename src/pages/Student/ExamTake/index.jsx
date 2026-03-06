import { useParams, Link } from 'react-router-dom'
import { useCallback, useMemo } from 'react'
import { examData } from '@/mock/examData'
import { getExamTakingQuestions } from '@/mock/examTakingData'
import ExamTakeContent from '@/components/Student/ExamTake/ExamTakeContent'

export default function ExamTakePage() {
    const { examId } = useParams()
    const exam = examData.find(e => e.id === examId)
    const questions = useMemo(() => (exam ? getExamTakingQuestions(examId) : []), [exam, examId])

    const handleSubmit = useCallback(answers => {
        // TODO: gọi API nộp bài, sau đó callback (redirect / thông báo)
        console.log('Nộp bài', answers)
    }, [])

    if (!exam) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-600">Không tìm thấy đề thi.</p>
                <Link to="/student" className="text-blue-600 underline mt-2 inline-block">
                    Về trang chủ
                </Link>
            </div>
        )
    }

    return (
        <ExamTakeContent
            exam={exam}
            questions={questions}
            onSubmit={handleSubmit}
        />
    )
}
