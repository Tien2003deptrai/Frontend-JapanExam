import { LoadingSpinner } from '@/components/ui'
import { examAttemptService } from '@/services/ExamAttemptService'
import { bookmarkService } from '@/services/BookmarkService'
import {
    AlertCircle,
    Bookmark,
    BookmarkCheck,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const SECTION_NAME = { vocabulary: 'Từ vựng', grammar: 'Ngữ pháp', reading: 'Đọc hiểu', listening: 'Nghe hiểu' }
const SECTION_COLOR = { vocabulary: 'bg-sky-100 text-sky-700', grammar: 'bg-violet-100 text-violet-700', reading: 'bg-emerald-100 text-emerald-700', listening: 'bg-amber-100 text-amber-700' }

export default function WrongQuestionsPage() {
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [bookmarkedIds, setBookmarkedIds] = useState(new Set())
    const [expandedId, setExpandedId] = useState(null)
    const [practiceMode, setPracticeMode] = useState(false)
    const [practiceAnswers, setPracticeAnswers] = useState({})
    const [showResults, setShowResults] = useState(false)

    useEffect(() => { loadWrongQuestions() }, [])

    const loadWrongQuestions = async () => {
        try {
            setLoading(true)
            const res = await examAttemptService.getWrongQuestions()
            const items = res.data || []
            setQuestions(items)

            // Check bookmarks
            const qIds = items.map(q => q.question?._id).filter(Boolean)
            if (qIds.length) {
                const bmRes = await bookmarkService.checkBookmarks(qIds)
                setBookmarkedIds(new Set(bmRes.data?.bookmarkedIds || []))
            }
        } catch { setQuestions([]) }
        finally { setLoading(false) }
    }

    const toggleBookmark = async (item) => {
        try {
            const res = await bookmarkService.toggle({
                examId: item.examId,
                questionId: item.question._id,
                sectionType: item.sectionType,
            })
            setBookmarkedIds(prev => {
                const next = new Set(prev)
                if (res.data?.bookmarked) next.add(item.question._id)
                else next.delete(item.question._id)
                return next
            })
        } catch { /* silent */ }
    }

    const startPractice = () => {
        setPracticeMode(true)
        setPracticeAnswers({})
        setShowResults(false)
    }

    const selectAnswer = (qId, answer) => {
        if (showResults) return
        setPracticeAnswers(prev => ({ ...prev, [qId]: answer }))
    }

    const submitPractice = () => setShowResults(true)

    const correctCount = showResults
        ? questions.filter(q => practiceAnswers[q.question?._id] === q.question?.correctAnswer).length
        : 0

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-2xl bg-red-100 flex items-center justify-center">
                            <RefreshCw className="size-5 text-red-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-text tracking-tight">Làm lại câu sai</h1>
                            <p className="text-sm text-text-muted">{questions.length} câu sai từ các bài thi gần đây</p>
                        </div>
                    </div>
                    {questions.length > 0 && !practiceMode && (
                        <button onClick={startPractice}
                            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition">
                            Luyện tập
                        </button>
                    )}
                    {practiceMode && !showResults && (
                        <button onClick={submitPractice}
                            className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition">
                            Nộp bài ({Object.keys(practiceAnswers).length}/{questions.length})
                        </button>
                    )}
                    {showResults && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-emerald-600">{correctCount}/{questions.length} đúng</span>
                            <button onClick={() => { setPracticeMode(false); setShowResults(false); setPracticeAnswers({}) }}
                                className="px-3 py-2 rounded-xl bg-surface text-sm font-semibold text-text-light hover:bg-border/30 transition">
                                Xem lại
                            </button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><LoadingSpinner /></div>
                ) : questions.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-border bg-white p-16 text-center">
                        <CheckCircle2 className="size-10 text-emerald-400/50 mx-auto mb-3" />
                        <p className="font-semibold text-text-muted">Tuyệt vời! Không có câu sai nào</p>
                        <p className="text-sm text-text-muted/70">Hãy tiếp tục làm bài thi để cải thiện kỹ năng.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {questions.map((item, idx) => {
                            const q = item.question
                            if (!q) return null
                            const isExpanded = expandedId === q._id
                            const isBookmarked = bookmarkedIds.has(q._id)
                            const myAnswer = practiceAnswers[q._id]
                            const isCorrectAnswer = myAnswer === q.correctAnswer

                            return (
                                <div key={`${item.examId}-${q._id}`} className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
                                    {/* Header */}
                                    <div className="p-4 flex items-start gap-3 cursor-pointer" onClick={() => !practiceMode && setExpandedId(isExpanded ? null : q._id)}>
                                        <span className="size-8 rounded-lg bg-surface flex items-center justify-center text-sm font-bold text-text-muted shrink-0">{idx + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-text">{q.questionText}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${SECTION_COLOR[item.sectionType] || 'bg-gray-100 text-gray-600'}`}>
                                                    {SECTION_NAME[item.sectionType] || item.sectionType}
                                                </span>
                                                <span className="text-[10px] text-text-muted">Sai {item.wrongCount} lần · {item.examLevel}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button onClick={(e) => { e.stopPropagation(); toggleBookmark(item) }}
                                                className={`p-1.5 rounded-lg transition ${isBookmarked ? 'text-amber-500 bg-amber-50' : 'text-text-muted hover:bg-surface'}`}>
                                                {isBookmarked ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                                            </button>
                                            {!practiceMode && (isExpanded ? <ChevronUp className="size-4 text-text-muted" /> : <ChevronDown className="size-4 text-text-muted" />)}
                                        </div>
                                    </div>

                                    {/* Options - always show in practice mode */}
                                    {(practiceMode || isExpanded) && (
                                        <div className="px-4 pb-4 space-y-2">
                                            {q.options?.map(opt => {
                                                let optClass = 'border-border bg-white hover:bg-surface'
                                                if (practiceMode && myAnswer === opt.label) {
                                                    if (showResults) {
                                                        optClass = isCorrectAnswer ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50'
                                                    } else {
                                                        optClass = 'border-primary bg-primary/5'
                                                    }
                                                }
                                                if (showResults && opt.label === q.correctAnswer && myAnswer !== opt.label) {
                                                    optClass = 'border-emerald-300 bg-emerald-50'
                                                }

                                                return (
                                                    <button key={opt.label}
                                                        onClick={() => practiceMode && selectAnswer(q._id, opt.label)}
                                                        className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition ${optClass} ${practiceMode ? 'cursor-pointer' : 'cursor-default'}`}>
                                                        <span className="font-bold mr-2">{opt.label}.</span>
                                                        {opt.text}
                                                        {showResults && opt.label === q.correctAnswer && <CheckCircle2 className="inline size-4 text-emerald-500 ml-2" />}
                                                        {showResults && myAnswer === opt.label && myAnswer !== q.correctAnswer && <XCircle className="inline size-4 text-red-500 ml-2" />}
                                                    </button>
                                                )
                                            })}

                                            {/* Explanation (review mode or after submit) */}
                                            {(isExpanded || showResults) && q.explanation && (
                                                <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                                                    <p className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                                                        <AlertCircle className="size-3.5" />Giải thích
                                                    </p>
                                                    <div className="text-xs text-blue-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: q.explanation }} />
                                                </div>
                                            )}

                                            {/* Show what user previously selected */}
                                            {isExpanded && !practiceMode && (
                                                <div className="mt-2 flex items-center gap-2 text-xs text-text-muted">
                                                    <span>Bạn đã chọn: <strong className="text-red-500">{item.selectedAnswer}</strong></span>
                                                    <span>· Đáp án đúng: <strong className="text-emerald-600">{q.correctAnswer}</strong></span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}