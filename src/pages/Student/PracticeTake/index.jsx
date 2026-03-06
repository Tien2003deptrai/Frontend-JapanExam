import { useParams, Link } from 'react-router-dom'
import { useState, useCallback, useMemo } from 'react'
import { getPracticeExam } from '@/mock/praticeData'
import ExamTakeContent from '@/components/Student/ExamTake/ExamTakeContent'

export default function PracticeTakePage() {
    const { code } = useParams()
    const { exam, questions } = useMemo(() => getPracticeExam(code || '01'), [code])

    const [answers, setAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)

    const onAnswerChange = useCallback((questionId, key) => {
        setAnswers(prev => ({ ...prev, [questionId]: key }))
    }, [])

    const handleSubmit = useCallback(() => {
        setSubmitted(true)
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
            session={{
                answers,
                submitted,
                onAnswerChange,
                onSubmit: handleSubmit,
            }}
        />
    )
}
