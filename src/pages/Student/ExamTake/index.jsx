import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { examData } from '@/mock/examData'
import { getExamTakingQuestions } from '@/mock/examTakingData'
import { cn } from '@/lib/utils'
import { ExamQuestionNav, ExamQuestion, HeaderExam } from '@/components'
import { parseDurationMinutes, formatCountdown } from '@/utils/formatTime'
import TimerExam from '@/components/Student/ExamTake/TimerExam'

const QUESTIONS_PER_SECTION = 10

export default function ExamTakePage() {
    const { examId } = useParams()
    const exam = examData.find(e => e.id === examId)
    const questions = useMemo(() => (exam ? getExamTakingQuestions(examId) : []), [exam, examId])

    const [answers, setAnswers] = useState({})
    const [secondsLeft, setSecondsLeft] = useState(null)
    const [submitted, setSubmitted] = useState(false)
    const questionRefs = useRef({})

    const totalMinutes = exam ? parseDurationMinutes(exam.duration) : 60
    const totalSeconds = totalMinutes * 60
    const sectionCount = Math.max(1, Math.ceil(questions.length / QUESTIONS_PER_SECTION))
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

    const sections = Array.from({ length: sectionCount }, (_, i) =>
        questions.slice(i * QUESTIONS_PER_SECTION, (i + 1) * QUESTIONS_PER_SECTION)
    )

    const onValueChange = useCallback((questionId, key) => {
        setAnswers(prev => ({ ...prev, [questionId]: key }))
    }, [])

    const onScrollToQuestion = useCallback(
        index => {
            const q = questions[index]
            if (!q?.id) return
            questionRefs.current[q.id]?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        },
        [questions]
    )

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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <HeaderExam exam={exam} totalMinutes={totalMinutes} totalScore={totalScore} />

            <div className="w-full flex gap-6 px-4 py-6">
                <aside className="w-[500px] shrink-0 flex flex-col gap-5 items-center">
                    <TimerExam secondsLeft={secondsLeft} />
                    <ExamQuestionNav
                        sections={sections}
                        questionsPerSection={QUESTIONS_PER_SECTION}
                        answers={answers}
                        onScrollToQuestion={onScrollToQuestion}
                    />
                </aside>

                <main className="min-w-0 flex-1 border border-gray-200 rounded-lg">
                    <div className="flex flex-col gap-6 p-5">
                        <h1 className="text-2xl font-normal text-gray-900 text-center">
                            言語知識（文字・漢字・文法）- 読解
                        </h1>
                    </div>
                    {sections.map((sectionQuestions, sectionIdx) => (
                        <section key={sectionIdx} className="bg-white shadow-sm">
                            {/* Section title */}
                            <div className="flex gap-2 items-center bg-[#6c757d] p-5">
                                <h2 className="text-xl text-white">問題{sectionIdx + 1}:</h2>
                                <p className="text-xl text-white">
                                    次の ことばは ひらがなで どう かきますか。1 ＊ 2 ＊ 3 ＊ 4 から
                                    いちばん いい ものを ひとつ えらんでください。
                                </p>
                            </div>
                            <div className="p-6 divide-y divide-gray-200">
                                {sectionQuestions.map(q => (
                                    <div
                                        key={q.id}
                                        ref={el => {
                                            questionRefs.current[q.id] = el
                                        }}
                                        className="py-5"
                                    >
                                        <ExamQuestion
                                            question={q}
                                            value={answers[q.id]}
                                            onValueChange={key => onValueChange(q.id, key)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}

                    <div className="flex justify-center p-5 bg-white border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitted}
                            className="rounded-lg min-w-[320px] bg-blue-500 px-6 py-2.5 font-semibold text-white text-xl hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitted ? 'Đã nộp bài' : 'Nộp bài'}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    )
}
