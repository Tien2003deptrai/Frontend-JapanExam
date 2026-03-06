import { useParams, Link } from 'react-router-dom'
import { useCallback, useMemo } from 'react'
import { getPracticeExam } from '@/mock/praticeData'
import ExamTakeContent from '@/components/Student/ExamTake/ExamTakeContent'

export default function PracticeTakePage() {
    const { code } = useParams()
    const { exam, questions } = useMemo(() => getPracticeExam(code || '01'), [code])

    const handleSubmit = useCallback(answers => {
        // TODO: gọi API nộp bài luyện, callback (redirect / thông báo)
        console.log('Nộp bài luyện', answers)
    }, [])

    if (!code) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-600">Mã đề không hợp lệ.</p>
                <Link
                    to="/student/practice-list"
                    className="text-blue-600 underline mt-2 inline-block"
                >
                    Về danh sách luyện đề
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
