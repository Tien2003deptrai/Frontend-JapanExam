import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { examData } from '@/mock/examData'
import { getExamTakingQuestions } from '@/mock/examTakingData'
import { parseDurationMinutes } from '@/utils/formatTime'
import ExamTakeContent from '@/components/Student/ExamTake/ExamTakeContent'

export default function ExamTakePage() {
    const { examId } = useParams()
    const exam = examData.find(e => e.id === examId)
    const questions = useMemo(() => (exam ? getExamTakingQuestions(examId) : []), [exam, examId])

    const [answers, setAnswers] = useState({})
    const [secondsLeft, setSecondsLeft] = useState(null)
    const [submitted, setSubmitted] = useState(false)

    const totalMinutes = exam ? parseDurationMinutes(exam.duration) : 60
    const totalSeconds = totalMinutes * 60
    const totalScore = 178

    useEffect(() => {
        if (!exam) return
        setSecondsLeft(totalSeconds)
    }, [exam, totalSeconds])

    useEffect(() => {
        if (secondsLeft == null || secondsLeft <= 0 || submitted) return
        const t = setInterval(() => {
            setSecondsLeft(prev => (prev <= 1 ? 0 : prev - 1))
        }, 1000)
        return () => clearInterval(t)
    }, [secondsLeft, submitted])

    const onAnswerChange = useCallback((questionId, key) => {
        setAnswers(prev => ({ ...prev, [questionId]: key }))
    }, [])

    const handleSubmit = useCallback(() => {
        setSubmitted(true)
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
            session={{
                answers,
                submitted,
                onAnswerChange,
                onSubmit: handleSubmit,
            }}
            examMeta={{
                secondsLeft,
                totalMinutes,
                totalScore,
            }}
        />
    )
}
