import ExamFeedbackPanel from '@/components/Student/ExamFeedback'
import { Badge, ErrorState, LoadingPage } from '@/components/ui'
import { cn } from '@/lib/utils'
import { examAttemptService } from '@/services'
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    ChevronRight,
    Eye,
    RotateCcw,
    XCircle,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import ReviewItem from './ReviewItem'

const SECTION_COLORS = {
    vocabulary: '#22C55E',
    grammar: '#0891B2',
    reading: '#F59E0B',
    listening: '#EF4444',
}

const RANK_CONFIG = {
    A: { color: '#22C55E', label: 'Xuất sắc' },
    B: { color: '#0891B2', label: 'Giỏi' },
    C: { color: '#F59E0B', label: 'Khá' },
    D: { color: '#F97316', label: 'Trung bình' },
    F: { color: '#EF4444', label: 'Chưa đạt' },
}

export default function ExamResultPage() {
    const { examId, attemptId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const isPractice = attemptId === 'practice'

    const [resultData, setResultData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showReview, setShowReview] = useState(false)
    const [filterSection, setFilterSection] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        const loadResult = async () => {
            setLoading(true)
            try {
                if (isPractice && location.state?.practiceResult) {
                    setResultData({
                        summary: location.state.practiceResult.summary,
                        detailedResults: location.state.practiceResult.detailedResults,
                        exam: location.state.exam,
                        mode: 'practice',
                    })
                } else if (location.state?.attemptResult) {
                    const res = await examAttemptService.getAttemptResult(attemptId)
                    const data = res.data
                    setResultData({
                        summary: data.attempt?.results,
                        detailedResults: data.detailedResults,
                        exam: data.exam || location.state.exam,
                        attempt: data.attempt,
                        mode: 'full_test',
                        timedOut: location.state.timedOut,
                    })
                } else if (!isPractice && attemptId) {
                    const res = await examAttemptService.getAttemptResult(attemptId)
                    const data = res.data
                    setResultData({
                        summary: data.attempt?.results,
                        detailedResults: data.detailedResults,
                        exam: data.exam,
                        attempt: data.attempt,
                        mode: data.attempt?.mode || 'full_test',
                    })
                } else {
                    setError('Không tìm thấy kết quả')
                }
            } catch (err) {
                setError(err?.response?.data?.message || 'Không thể tải kết quả')
            } finally {
                setLoading(false)
            }
        }
        loadResult()
    }, [attemptId, isPractice, location.state])

    const summary = resultData?.summary
    const detailedResults = useMemo(() => resultData?.detailedResults || [], [resultData])
    const exam = resultData?.exam

    const filteredDetails = useMemo(() => {
        let results = detailedResults
        if (filterSection !== 'all') {
            results = results.filter(r => r.sectionType === filterSection)
        }
        if (filterStatus === 'correct') results = results.filter(r => r.isCorrect)
        else if (filterStatus === 'wrong')
            results = results.filter(r => !r.isCorrect && r.selectedAnswer)
        else if (filterStatus === 'skipped') results = results.filter(r => !r.selectedAnswer)
        return results
    }, [detailedResults, filterSection, filterStatus])

    if (loading) return <LoadingPage message="Đang tải kết quả..." />

    if (error || !summary) {
        return (
            <ErrorState
                message={error || 'Không tìm thấy kết quả'}
                action={
                    <Link to="/" className="text-sm text-primary font-medium hover:underline">
                        Về trang chủ
                    </Link>
                }
            />
        )
    }

    const percentage = summary.percentage || 0
    const passed = summary.passed
    const rank = summary.rank
    const rankCfg = RANK_CONFIG[rank] || RANK_CONFIG.F
    const sectionScores = summary.sectionScores || []

    return (
        <div className="min-h-screen bg-background">
            {/* Breadcrumb */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
                <nav>
                    <ol className="inline-flex items-center gap-1.5 text-sm">
                        <li>
                            <Link
                                to="/"
                                className="text-text-light hover:text-primary font-medium transition-colors"
                            >
                                Trang chủ
                            </Link>
                        </li>
                        <li>
                            <ChevronRight className="size-3.5 text-border" />
                        </li>
                        <li className="font-semibold text-text">Kết quả</li>
                    </ol>
                </nav>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Timed out warning */}
                {resultData?.timedOut && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-6 flex gap-3">
                        <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-800">Hết thời gian</p>
                            <p className="text-xs text-red-700">
                                Bài thi đã được tự động nộp do hết thời gian. Các câu trả lời sau
                                thời hạn không được tính.
                            </p>
                        </div>
                    </div>
                )}

                {/* Score summary card */}
                <div className="rounded-2xl border-2 border-border bg-white p-6 sm:p-8 mb-6 shadow-card">
                    <div className="text-center mb-6">
                        {isPractice && (
                            <Badge variant="success" className="mb-3">
                                Luyện tập
                            </Badge>
                        )}
                        <h1 className="text-xl sm:text-2xl font-black text-text mb-1 font-heading">
                            {exam?.title || 'Kết quả bài thi'}
                        </h1>
                        {exam?.level && (
                            <p className="text-sm text-text-light">JLPT {exam.level}</p>
                        )}
                    </div>

                    {/* Score ring */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative size-36 mb-3">
                            <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke="#E2E8F0"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke={passed !== false ? rankCfg.color : '#EF4444'}
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 42}`}
                                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - percentage / 100)}`}
                                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span
                                    className="text-3xl font-black"
                                    style={{ color: rankCfg.color }}
                                >
                                    {percentage}%
                                </span>
                                {rank && (
                                    <span className="text-xs font-bold text-text-muted">
                                        Hạng {rank}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {passed !== undefined &&
                                (passed ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold text-white bg-cta">
                                        <CheckCircle2 className="size-4" />
                                        ĐẠT
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold text-white bg-destructive">
                                        <XCircle className="size-4" />
                                        CHƯA ĐẠT
                                    </span>
                                ))}
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        <StatCard
                            label="Tổng điểm"
                            value={`${summary.totalScore || 0}/${summary.maxScore || 0}`}
                            color="text-primary"
                        />
                        <StatCard label="Đúng" value={summary.correctAnswers} color="text-cta" />
                        <StatCard
                            label="Sai"
                            value={summary.wrongAnswers}
                            color="text-destructive"
                        />
                        <StatCard
                            label="Bỏ qua"
                            value={summary.skippedAnswers}
                            color="text-text-muted"
                        />
                    </div>

                    {/* Section scores */}
                    {sectionScores.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-text mb-3">Điểm từng phần</h3>
                            <div className="space-y-3">
                                {sectionScores.map(sec => {
                                    const pct =
                                        sec.maxScore > 0
                                            ? Math.round((sec.score / sec.maxScore) * 100)
                                            : 0
                                    const barColor = SECTION_COLORS[sec.sectionType] || '#64748B'
                                    return (
                                        <div key={sec.sectionType}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-semibold text-text-light">
                                                    {sec.sectionName}
                                                </span>
                                                <span className="text-xs text-text-light">
                                                    {sec.score}/{sec.maxScore} ({pct}%) ·{' '}
                                                    {sec.correctAnswers}/{sec.totalQuestions} đúng
                                                </span>
                                            </div>
                                            <div className="h-2.5 rounded-full bg-surface overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-700"
                                                    style={{
                                                        width: `${pct}%`,
                                                        backgroundColor: barColor,
                                                    }}
                                                />
                                            </div>
                                            {sec.passed === false && (
                                                <p className="text-[10px] text-destructive font-semibold mt-0.5">
                                                    Chưa đạt điểm tối thiểu
                                                </p>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() => setShowReview(!showReview)}
                        className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border-2 border-primary bg-primary/5 text-primary text-sm font-bold hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                        <Eye className="size-4" />
                        {showReview ? 'Ẩn chi tiết' : 'Xem chi tiết từng câu'}
                    </button>
                    <Link
                        to={`/exam/${examId}`}
                        className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border-2 border-border bg-white text-text-light text-sm font-bold hover:bg-background transition-colors"
                    >
                        <RotateCcw className="size-4" />
                        Làm lại
                    </Link>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border-2 border-border bg-white text-text-light text-sm font-bold hover:bg-background transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                        Trang chủ
                    </Link>
                </div>

                {/* Detailed review */}
                {showReview && (
                    <div className="rounded-2xl border-2 border-border bg-white p-5 sm:p-6 mb-6 shadow-card">
                        <h3 className="text-base font-bold text-text mb-4">Chi tiết từng câu</h3>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <FilterBtn
                                active={filterSection === 'all'}
                                onClick={() => setFilterSection('all')}
                            >
                                Tất cả phần
                            </FilterBtn>
                            {sectionScores.map(s => (
                                <FilterBtn
                                    key={s.sectionType}
                                    active={filterSection === s.sectionType}
                                    onClick={() => setFilterSection(s.sectionType)}
                                >
                                    {s.sectionName}
                                </FilterBtn>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-5">
                            <FilterBtn
                                active={filterStatus === 'all'}
                                onClick={() => setFilterStatus('all')}
                            >
                                Tất cả
                            </FilterBtn>
                            <FilterBtn
                                active={filterStatus === 'correct'}
                                onClick={() => setFilterStatus('correct')}
                                color="cta"
                            >
                                Đúng
                            </FilterBtn>
                            <FilterBtn
                                active={filterStatus === 'wrong'}
                                onClick={() => setFilterStatus('wrong')}
                                color="destructive"
                            >
                                Sai
                            </FilterBtn>
                            <FilterBtn
                                active={filterStatus === 'skipped'}
                                onClick={() => setFilterStatus('skipped')}
                                color="text-muted"
                            >
                                Bỏ qua
                            </FilterBtn>
                        </div>

                        <p className="text-xs text-text-muted mb-3">
                            Hiển thị {filteredDetails.length} / {detailedResults.length} câu
                        </p>

                        <div className="space-y-3">
                            {filteredDetails.map((q, idx) => (
                                <ReviewItem key={q.questionId || idx} question={q} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Feedback / Comment / Report */}
                <ExamFeedbackPanel examId={examId} />
            </div>
        </div>
    )
}

/* --- Sub-components --- */

function StatCard({ label, value, color }) {
    return (
        <div className="rounded-xl border border-border/50 bg-background p-3 text-center">
            <p className={cn('text-lg font-black', color)}>{value}</p>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                {label}
            </p>
        </div>
    )
}

function FilterBtn({ active, onClick, children, color = 'primary' }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'h-7 px-3 text-xs font-semibold rounded-lg border-2 transition-colors cursor-pointer',
                active
                    ? `text-white border-${color} bg-${color}`
                    : 'border-border bg-white text-text-light hover:bg-background'
            )}
        >
            {children}
        </button>
    )
}
