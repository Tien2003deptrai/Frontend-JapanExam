import { useCallback, useRef } from 'react'
import { ExamQuestionNav, ExamQuestion, HeaderExam } from '@/components'
import TimerExam from '@/components/Student/ExamTake/TimerExam'

const QUESTIONS_PER_SECTION = 10

/**
 * Nội dung làm bài chung cho Exam và Practice.
 * @param {Object} props
 * @param {Object} props.exam - { title, level, duration? }
 * @param {Array} props.questions - Danh sách câu hỏi
 * @param {Object} props.session - { answers, submitted, onAnswerChange, onSubmit }
 * @param {Object} [props.examMeta] - Nếu có: hiển thị timer + tổng điểm (chế độ thi). { secondsLeft, totalMinutes, totalScore }
 */
export default function ExamTakeContent({
    exam,
    questions,
    session,
    examMeta,
}) {
    const { answers, submitted, onAnswerChange, onSubmit } = session
    const questionRefs = useRef({})
    const sectionCount = Math.max(1, Math.ceil(questions.length / QUESTIONS_PER_SECTION))
    const sections = Array.from({ length: sectionCount }, (_, i) =>
        questions.slice(i * QUESTIONS_PER_SECTION, (i + 1) * QUESTIONS_PER_SECTION)
    )
    const isExam = examMeta != null

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
                totalMinutes={examMeta?.totalMinutes}
                totalScore={examMeta?.totalScore}
            />

            <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-6 px-3 py-4 md:px-4 md:py-6">
                <aside className="w-full lg:w-[320px] xl:w-[500px] lg:shrink-0 flex flex-col gap-4 lg:gap-5 items-center order-2 lg:order-1">
                    {isExam && examMeta.secondsLeft != null && (
                        <TimerExam secondsLeft={examMeta.secondsLeft} />
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
                            onClick={onSubmit}
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
