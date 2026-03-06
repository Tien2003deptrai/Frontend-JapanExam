import { useCallback, useRef, useState, useEffect } from 'react'
import { ExamQuestionNav, ExamQuestion, HeaderExam } from '@/components'
import TimerExam from '@/components/Student/ExamTake/TimerExam'
import { parseDurationMinutes } from '@/utils/formatTime'

const QUESTIONS_PER_SECTION = 10
const DEFAULT_TOTAL_SCORE = 178

/**
 * Nội dung làm bài chung cho Exam và Practice.
 * Tự quản lý answers + submitted; khi nộp bài gọi onSubmit(answers) để page xử lý API/callback.
 * Nếu exam có duration → chế độ thi: tự xử lý timer + hiển thị tổng điểm.
 * @param {Object} props
 * @param {Object} props.exam - { title, level, duration?, totalScore? }
 * @param {Array} props.questions - Danh sách câu hỏi
 * @param {function(Object): void} [props.onSubmit] - (answers) => void, gọi khi user bấm Nộp bài (để gọi API / callback)
 */
export default function ExamTakeContent({
    exam,
    questions,
    onSubmit,
}) {
    const [answers, setAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)

    const onAnswerChange = useCallback((questionId, key) => {
        setAnswers(prev => ({ ...prev, [questionId]: key }))
    }, [])

    const handleSubmit = useCallback(() => {
        setSubmitted(true)
        onSubmit?.(answers)
    }, [answers, onSubmit])

    const questionRefs = useRef({})
    const sectionCount = Math.max(1, Math.ceil(questions.length / QUESTIONS_PER_SECTION))
    const sections = Array.from({ length: sectionCount }, (_, i) =>
        questions.slice(i * QUESTIONS_PER_SECTION, (i + 1) * QUESTIONS_PER_SECTION)
    )

    const isExam = exam?.duration != null
    const totalMinutes = isExam ? parseDurationMinutes(exam.duration) : null
    const totalSeconds = totalMinutes != null ? totalMinutes * 60 : 0
    const totalScore = exam?.totalScore ?? DEFAULT_TOTAL_SCORE

    const [secondsLeft, setSecondsLeft] = useState(null)

    useEffect(() => {
        if (!isExam) return
        setSecondsLeft(totalSeconds)
    }, [isExam, totalSeconds])

    useEffect(() => {
        if (!isExam || secondsLeft == null || secondsLeft <= 0 || submitted) return
        const t = setInterval(() => {
            setSecondsLeft(prev => (prev <= 1 ? 0 : prev - 1))
        }, 1000)
        return () => clearInterval(t)
    }, [isExam, secondsLeft, submitted])

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

    return (
        <div className="min-h-screen bg-gray-50">
            <HeaderExam
                exam={exam}
                totalMinutes={isExam ? totalMinutes : undefined}
                totalScore={isExam ? totalScore : undefined}
            />

            <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-6 px-3 py-4 md:px-4 md:py-6">
                <aside className="w-full lg:w-[320px] xl:w-[500px] lg:shrink-0 flex flex-col gap-4 lg:gap-5 items-center order-2 lg:order-1">
                    {isExam && secondsLeft != null && (
                        <TimerExam secondsLeft={secondsLeft} />
                    )}
                    <ExamQuestionNav
                        sections={sections}
                        questionsPerSection={QUESTIONS_PER_SECTION}
                        answers={answers}
                        onScrollToQuestion={onScrollToQuestion}
                    />
                </aside>

                <main className="min-w-0 flex-1 border border-gray-200 rounded-lg order-1 lg:order-2">
                    <div className="flex flex-col gap-4 p-4 md:p-5">
                        <h1 className="text-lg md:text-2xl font-normal text-gray-900 text-center">
                            言語知識（文字・漢字・文法）- 読解
                        </h1>
                    </div>
                    {sections.map((sectionQuestions, sectionIdx) => (
                        <section key={sectionIdx} className="bg-white shadow-sm">
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center bg-[#6c757d] p-4 md:p-5">
                                <h2 className="text-lg md:text-xl text-white shrink-0">
                                    問題{sectionIdx + 1}:
                                </h2>
                                <p className="text-base md:text-xl text-white">
                                    次の ことばは ひらがなで どう かきますか。1 ＊ 2 ＊ 3 ＊ 4 から
                                    いちばん いい ものを ひとつ えらんでください。
                                </p>
                            </div>
                            <div className="p-4 md:p-6 divide-y divide-gray-200">
                                {sectionQuestions.map(q => (
                                    <div
                                        key={q.id}
                                        ref={el => {
                                            questionRefs.current[q.id] = el
                                        }}
                                        className="py-4 md:py-5"
                                    >
                                        <ExamQuestion
                                            question={q}
                                            value={answers[q.id]}
                                            onValueChange={key => onAnswerChange(q.id, key)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}

                    <div className="flex justify-center p-4 md:p-5 bg-white border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitted}
                            className="rounded-lg w-full sm:w-auto min-w-0 sm:min-w-[320px] bg-blue-500 px-6 py-2.5 font-semibold text-white text-lg md:text-xl hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitted ? 'Đã nộp bài' : 'Nộp bài'}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    )
}
