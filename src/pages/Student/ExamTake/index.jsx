import { Badge, ErrorState, LoadingPage } from '@/components/ui'
import HighlightableText from '@/components/ui/HighlightableText'
import { bookmarkService, examAttemptService } from '@/services'
import useAuthStore from '@/stores/authStore'
import { BookOpen, Send } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ConfirmSubmitModal, TabWarningModal } from './ExamModals'
import QuestionItem from './QuestionItem'
import QuestionSidebar from './QuestionSidebar'
import TimerDisplay from './TimerDisplay'

/**
 * ExamTakePage - Trang làm bài thi
 * Nhận attempt + exam data từ ExamDetailPage qua location.state
 * Features: server-synced timer, tab-switch detection, auto-submit
 */
export default function ExamTakePage() {
    const { examId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuthStore()

    const [attempt, setAttempt] = useState(location.state?.attempt || null)
    const [exam, setExam] = useState(location.state?.exam || null)
    const [serverTime] = useState(location.state?.serverTime || Date.now())
    const [remainingSecondsInit] = useState(location.state?.remainingSeconds || 0)
    const mode = location.state?.mode || attempt?.mode || 'full_test'

    const [answers, setAnswers] = useState({})
    const [flagged, setFlagged] = useState(new Set())
    const [bookmarkedIds, setBookmarkedIds] = useState(new Set())
    const [secondsLeft, setSecondsLeft] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(!attempt)
    const [error, setError] = useState(null)

    const [tabSwitchCount, setTabSwitchCount] = useState(0)
    const [showTabWarning, setShowTabWarning] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [currentSection, setCurrentSection] = useState(0)

    const questionRefs = useRef({})
    const timerRef = useRef(null)
    const autoSubmitRef = useRef(false)

    // Fallback: vào trực tiếp không qua ExamDetail → start/resume
    useEffect(() => {
        if (!attempt && !exam) {
            setLoading(true)
            const tryStart = async () => {
                try {
                    const res = await examAttemptService.startExam({
                        examId,
                        mode: /** @type {const} */ ('full_test'),
                    })
                    const data = res.data
                    setAttempt(data.attempt)
                    setExam(data.exam)
                    if (data.remainingSeconds > 0) setSecondsLeft(data.remainingSeconds)
                } catch {
                    setError('Không thể tải bài thi. Vui lòng quay lại.')
                } finally {
                    setLoading(false)
                }
            }
            tryStart()
        }
    }, [attempt, exam, examId])

    // Build flat question list
    const { questions, sectionMeta } = useMemo(() => {
        if (!exam?.sections) return { questions: [], sectionMeta: [] }
        const qs = []
        const meta = []
        for (const section of exam.sections) {
            const sectionStart = qs.length
            for (const block of section.blocks || []) {
                for (const q of block.questions || []) {
                    qs.push({
                        ...q,
                        _qid: q._id,
                        sectionType: section.sectionType,
                        sectionName: section.sectionName,
                        blockInstruction: block.instruction,
                        blockContext: block.context,
                        blockTitle: block.title,
                    })
                }
            }
            meta.push({
                sectionType: section.sectionType,
                sectionName: section.sectionName,
                startIdx: sectionStart,
                count: qs.length - sectionStart,
            })
        }
        return { questions: qs, sectionMeta: meta }
    }, [exam])

    // Load existing bookmarks
    useEffect(() => {
        if (!isAuthenticated || questions.length === 0) return
        const qIds = questions.map(q => q._qid).filter(Boolean)
        if (qIds.length === 0) return
        bookmarkService
            .checkBookmarks(qIds)
            .then(res => setBookmarkedIds(new Set(res.data?.bookmarkedIds || [])))
            .catch(() => {})
    }, [isAuthenticated, questions])

    const toggleBookmark = useCallback(
        async (qId, sectionType) => {
            if (!isAuthenticated || !examId) return
            const wasBookmarked = bookmarkedIds.has(qId)
            // Optimistic update
            setBookmarkedIds(prev => {
                const next = new Set(prev)
                if (wasBookmarked) next.delete(qId)
                else next.add(qId)
                return next
            })
            try {
                await bookmarkService.toggle({
                    examId,
                    questionId: qId,
                    sectionType: sectionType || 'vocabulary',
                })
            } catch {
                // Revert on error
                setBookmarkedIds(prev => {
                    const next = new Set(prev)
                    if (wasBookmarked) next.add(qId)
                    else next.delete(qId)
                    return next
                })
            }
        },
        [isAuthenticated, examId, bookmarkedIds]
    )

    // Initialize timer with network delay compensation
    useEffect(() => {
        if (secondsLeft !== null || !attempt) return
        if (remainingSecondsInit > 0) {
            const networkDelay = Math.max(0, Math.floor((Date.now() - serverTime) / 1000))
            setSecondsLeft(Math.max(0, remainingSecondsInit - networkDelay))
        } else if (mode === 'full_test' && attempt.allowedDuration) {
            setSecondsLeft(attempt.allowedDuration * 60)
        }
    }, [attempt, remainingSecondsInit, serverTime, secondsLeft, mode])

    // Countdown interval
    const timerStarted = secondsLeft !== null
    useEffect(() => {
        if (!timerStarted || secondsLeft <= 0 || submitted) return
        timerRef.current = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(timerRef.current)
    }, [timerStarted, submitted]) // eslint-disable-line react-hooks/exhaustive-deps

    // Tab-switch detection (full_test only)
    useEffect(() => {
        if (mode !== 'full_test' || submitted) return
        const handleVisibility = () => {
            if (document.hidden) {
                setTabSwitchCount(prev => prev + 1)
                setShowTabWarning(true)
            }
        }
        document.addEventListener('visibilitychange', handleVisibility)
        return () => document.removeEventListener('visibilitychange', handleVisibility)
    }, [mode, submitted])

    // Restore answers for resumed attempt
    useEffect(() => {
        if (attempt?.answers?.length > 0) {
            const restored = {}
            for (const a of attempt.answers) {
                if (a.selectedAnswer) restored[a.questionId] = a.selectedAnswer
            }
            setAnswers(prev => ({ ...prev, ...restored }))
        }
    }, [attempt])

    const onAnswer = useCallback((qId, value) => {
        setAnswers(prev => ({ ...prev, [qId]: value }))
    }, [])

    const toggleFlag = useCallback(qId => {
        setFlagged(prev => {
            const next = new Set(prev)
            if (next.has(qId)) next.delete(qId)
            else next.add(qId)
            return next
        })
    }, [])

    const scrollToQuestion = useCallback(qId => {
        questionRefs.current[qId]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, [])

    const handleSubmit = useCallback(
        async (isAutoSubmit = false) => {
            if (submitting || submitted) return
            setSubmitting(true)
            setShowConfirm(false)

            try {
                const answerArray = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
                    questionId,
                    selectedAnswer,
                }))

                if (mode === 'practice') {
                    const sectionTypes = exam?.sections?.map(s => s.sectionType) || []
                    const res = await examAttemptService.evaluatePractice({
                        examId,
                        sectionTypes,
                        answers: answerArray,
                    })
                    setSubmitted(true)
                    navigate(`/exam/${examId}/result/practice`, {
                        state: { practiceResult: res.data, exam, mode: 'practice' },
                        replace: true,
                    })
                } else if (!attempt?._id) {
                    // Guest mode – evaluate in-memory without attempt
                    const sectionTypes = exam?.sections?.map(s => s.sectionType) || []
                    const res = await examAttemptService.evaluatePractice({
                        examId,
                        sectionTypes,
                        answers: answerArray,
                    })
                    setSubmitted(true)
                    navigate(`/exam/${examId}/result/practice`, {
                        state: { practiceResult: res.data, exam, mode: 'full_test', guest: true },
                        replace: true,
                    })
                } else {
                    const res = await examAttemptService.submitExam({
                        attemptId: attempt._id,
                        answers: answerArray,
                    })
                    setSubmitted(true)
                    const attemptData = res.data?.attempt
                    navigate(`/exam/${examId}/result/${attemptData?._id || attempt._id}`, {
                        state: {
                            attemptResult: attemptData,
                            exam,
                            mode: 'full_test',
                            timedOut: res.data?.timedOut,
                        },
                        replace: true,
                    })
                }
            } catch (err) {
                setError(err?.response?.data?.message || 'Lỗi khi nộp bài')
                setSubmitting(false)
            }
        },
        [answers, attempt, exam, examId, mode, navigate, submitted, submitting]
    )

    // Auto-submit on timeout
    useEffect(() => {
        if (secondsLeft === 0 && !submitted && !autoSubmitRef.current) {
            autoSubmitRef.current = true
            handleSubmit(true)
        }
    }, [secondsLeft, submitted, handleSubmit])

    const answeredCount = Object.keys(answers).length
    const totalCount = questions.length

    // --- Loading / Error states ---
    if (loading) return <LoadingPage message="Đang tải bài thi..." />

    if (error && !exam) {
        return (
            <ErrorState
                message={error}
                action={
                    <Link
                        to={`/exam/${examId}`}
                        className="text-sm text-primary font-medium hover:underline"
                    >
                        Quay lại
                    </Link>
                }
            />
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Sticky header */}
            <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 flex items-center h-14 gap-4">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <h1 className="text-sm font-bold text-text truncate font-heading">
                            {exam?.title}
                        </h1>
                        {exam?.level && (
                            <Badge variant="primary" size="sm">
                                {exam.level}
                            </Badge>
                        )}
                        {mode === 'practice' && (
                            <Badge variant="success" size="sm">
                                Luyện tập
                            </Badge>
                        )}
                    </div>

                    {secondsLeft !== null && <TimerDisplay seconds={secondsLeft} />}

                    <div className="text-xs text-text-light shrink-0">
                        <span className="font-bold text-primary">{answeredCount}</span>/{totalCount}
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowConfirm(true)}
                        disabled={submitting}
                        className="shrink-0 inline-flex items-center gap-1.5 h-9 px-4 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <Send className="size-3.5" />
                        Nộp bài
                    </button>
                </div>
            </header>

            <div className="flex-1 flex max-w-7xl mx-auto w-full">
                {/* Sidebar */}
                <QuestionSidebar
                    sectionMeta={sectionMeta}
                    questions={questions}
                    answers={answers}
                    flagged={flagged}
                    currentSection={currentSection}
                    setCurrentSection={setCurrentSection}
                    scrollToQuestion={scrollToQuestion}
                />

                {/* Main content */}
                <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6">
                    {sectionMeta.map(sec => (
                        <div key={sec.sectionType} className="mb-8">
                            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-border">
                                <BookOpen className="size-4 text-primary" />
                                <h2 className="text-base font-bold text-text">{sec.sectionName}</h2>
                                <span className="text-xs text-text-muted">({sec.count} câu)</span>
                            </div>

                            <div className="space-y-4">
                                {(() => {
                                    const sectionQs = questions.slice(
                                        sec.startIdx,
                                        sec.startIdx + sec.count
                                    )
                                    // Group consecutive questions sharing the same blockContext
                                    const groups = []
                                    for (const q of sectionQs) {
                                        const ctxKey = q.blockContext?.text || ''
                                        const last = groups[groups.length - 1]
                                        if (last && last.ctxKey === ctxKey) {
                                            last.items.push(q)
                                        } else {
                                            groups.push({
                                                ctxKey,
                                                context: q.blockContext,
                                                instruction: q.blockInstruction,
                                                items: [q],
                                            })
                                        }
                                    }
                                    let runIdx = 0
                                    return groups.map((g, gi) => {
                                        const groupItems = g.items.map((q, qi) => {
                                            const globalIdx = sec.startIdx + runIdx + qi
                                            const qId = q._qid
                                            return (
                                                <QuestionItem
                                                    key={qId}
                                                    innerRef={el => {
                                                        questionRefs.current[qId] = el
                                                    }}
                                                    question={q}
                                                    index={globalIdx}
                                                    selectedAnswer={answers[qId]}
                                                    isFlagged={flagged.has(qId)}
                                                    isBookmarked={bookmarkedIds.has(qId)}
                                                    onAnswer={val => onAnswer(qId, val)}
                                                    onFlag={() => toggleFlag(qId)}
                                                    onToggleBookmark={
                                                        isAuthenticated
                                                            ? () =>
                                                                  toggleBookmark(qId, q.sectionType)
                                                            : undefined
                                                    }
                                                />
                                            )
                                        })
                                        runIdx += g.items.length
                                        // Wrap group with shared context
                                        if (g.ctxKey) {
                                            return (
                                                <div
                                                    key={`ctx-${gi}`}
                                                    className="rounded-xl border-2 border-border/40 bg-linear-to-b from-primary/2 to-transparent p-4 space-y-4"
                                                >
                                                    <div className="rounded-lg bg-background border border-border/50 p-3">
                                                        <HighlightableText
                                                            text={g.context.text}
                                                            className="text-xs text-text-light"
                                                        />
                                                    </div>
                                                    {groupItems}
                                                </div>
                                            )
                                        }
                                        return groupItems
                                    })
                                })()}
                            </div>
                        </div>
                    ))}

                    {/* Bottom submit */}
                    <div className="flex justify-center py-6">
                        <button
                            type="button"
                            onClick={() => setShowConfirm(true)}
                            disabled={submitting}
                            className="inline-flex items-center gap-2 h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                        >
                            <Send className="size-5" />
                            Nộp bài ({answeredCount}/{totalCount})
                        </button>
                    </div>
                </main>
            </div>

            {/* Modals */}
            {showTabWarning && (
                <TabWarningModal
                    tabSwitchCount={tabSwitchCount}
                    onClose={() => setShowTabWarning(false)}
                />
            )}

            {showConfirm && (
                <ConfirmSubmitModal
                    answeredCount={answeredCount}
                    totalCount={totalCount}
                    error={error}
                    submitting={submitting}
                    onClose={() => setShowConfirm(false)}
                    onSubmit={() => handleSubmit(false)}
                />
            )}
        </div>
    )
}
