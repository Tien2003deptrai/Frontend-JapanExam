import ExamFeedbackPanel from '@/components/Student/ExamFeedback'
import { Modal } from '@/components/ui'
import Button from '@/components/ui/Button'
import { LoadingPage } from '@/components/ui/Loading'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ErrorState } from '@/components/ui/States'
import { cn } from '@/lib/utils'
import { examAttemptService } from '@/services'
import { SECTION_LABELS, formatDuration } from '@/utils/helpers'
import {
    AlertTriangle,
    BookOpen,
    ChevronRight,
    Clock,
    MessageSquareText,
    PlayCircle,
    Shield,
    Target,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const SECTION_CONFIG = {
    vocabulary: { icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    grammar: { icon: Target, color: 'text-sky-600', bg: 'bg-sky-50' },
    reading: { icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
    listening: { icon: PlayCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
}

export default function ExamDetailPage() {
    const { examId } = useParams()
    const navigate = useNavigate()
    const [examInfo, setExamInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [starting, setStarting] = useState(false)
    const [error, setError] = useState(null)
    const [mode, setMode] = useState(/** @type {'full_test'|'practice'} */ ('full_test'))
    const [selectedSections, setSelectedSections] = useState([])
    const [practiceMinutes, setPracticeMinutes] = useState('')
    const [feedbackOpen, setFeedbackOpen] = useState(false)

    useEffect(() => {
        setLoading(true)
        examAttemptService
            .getExamInfo(examId)
            .then(res => setExamInfo(res.data?.data?.exam || res.data?.exam || res.data))
            .catch(err =>
                setError(err?.response?.data?.message || 'Không thể tải thông tin đề thi')
            )
            .finally(() => setLoading(false))
    }, [examId])

    const toggleSection = useCallback(sectionType => {
        setSelectedSections(prev =>
            prev.includes(sectionType)
                ? prev.filter(s => s !== sectionType)
                : [...prev, sectionType]
        )
    }, [])

    const handleStart = useCallback(async () => {
        if (starting) return
        setStarting(true)
        setError(null)
        try {
            const payload = { examId, mode }
            if (mode === 'practice') {
                if (selectedSections.length > 0) payload.practiceSections = selectedSections
                if (practiceMinutes && Number(practiceMinutes) > 0)
                    payload.practiceMinutes = Number(practiceMinutes)
            }
            const res = await examAttemptService.startExam(payload)
            const data = res.data?.data || res.data
            navigate(`/exam/${examId}/take`, {
                state: {
                    attempt: data.attempt,
                    exam: data.exam,
                    serverTime: data.serverTime,
                    remainingSeconds: data.remainingSeconds,
                    mode,
                },
            })
        } catch (err) {
            setError(err?.response?.data?.message || 'Không thể bắt đầu bài thi')
            setStarting(false)
        }
    }, [examId, mode, selectedSections, practiceMinutes, starting, navigate])

    if (loading) return <LoadingPage message="Đang tải thông tin đề thi..." />

    if (!examInfo) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10">
                <ErrorState
                    title="Không tìm thấy đề thi"
                    message={error || 'Đề thi không tồn tại hoặc đã bị xoá.'}
                />
                <div className="text-center mt-4">
                    <Link to="/" className="text-sm text-primary font-medium hover:underline">
                        Về trang chủ
                    </Link>
                </div>
            </div>
        )
    }

    const exam = examInfo
    const sections = exam.sections || []

    return (
        <div>
            {/* Breadcrumb */}
            <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
                <nav className="flex">
                    <ol className="inline-flex items-center gap-1.5 text-sm">
                        <li>
                            <Link
                                to="/"
                                className="text-text-light hover:text-primary transition-colors"
                            >
                                Trang chủ
                            </Link>
                        </li>
                        <li>
                            <ChevronRight className="size-3.5 text-text-muted" />
                        </li>
                        {exam.level && (
                            <>
                                <li>
                                    <Link
                                        to={`/level/${exam.level.toLowerCase()}`}
                                        className="text-text-light hover:text-primary transition-colors"
                                    >
                                        {exam.level}
                                    </Link>
                                </li>
                                <li>
                                    <ChevronRight className="size-3.5 text-text-muted" />
                                </li>
                            </>
                        )}
                        <li className="font-semibold text-text truncate max-w-50">{exam.title}</li>
                    </ol>
                </nav>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
                {/* ── Exam Info Card ── */}
                <div className="bg-white rounded-xl border border-border-light p-6 shadow-sm">
                    <div className="flex items-start gap-4 mb-5">
                        <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                            {exam.level || '?'}
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-xl md:text-2xl font-bold text-text mb-1">
                                {exam.title}
                            </h1>
                            {exam.description && (
                                <p className="text-sm text-text-light line-clamp-3">
                                    {exam.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 text-sm text-text-light mb-5">
                        <span className="flex items-center gap-1.5">
                            <Clock className="size-4 text-text-muted" />
                            {formatDuration(exam.duration)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <BookOpen className="size-4 text-text-muted" />
                            {exam.totalQuestions} câu hỏi
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Target className="size-4 text-text-muted" />
                            Tổng điểm: {exam.totalPoints || '—'}
                        </span>
                        {exam.passingScore > 0 && (
                            <span className="flex items-center gap-1.5">
                                <Shield className="size-4 text-text-muted" />
                                Điểm đạt: {exam.passingScore}
                            </span>
                        )}
                    </div>

                    {/* Sections */}
                    {sections.length > 0 && (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {sections.map(s => {
                                const cfg = SECTION_CONFIG[s.sectionType] || {
                                    icon: BookOpen,
                                    color: 'text-gray-600',
                                    bg: 'bg-gray-50',
                                }
                                const Icon = cfg.icon
                                return (
                                    <div
                                        key={s.sectionType}
                                        className={`flex items-center gap-3 rounded-lg ${cfg.bg} p-3`}
                                    >
                                        <div className="size-9 rounded-lg bg-white/60 flex items-center justify-center">
                                            <Icon className={`size-4 ${cfg.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-text">
                                                {SECTION_LABELS[s.sectionType] || s.sectionName}
                                            </p>
                                            <p className="text-xs text-text-muted">
                                                {s.questionCount} câu · {s.duration} phút ·{' '}
                                                {s.points} điểm
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {exam.instructions && (
                        <div className="mt-5 rounded-lg bg-warning-light border border-amber-200 p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                                Hướng dẫn
                            </p>
                            <p className="text-sm text-amber-800 whitespace-pre-line">
                                {exam.instructions}
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Mode Selector ── */}
                <div className="bg-white rounded-xl border border-border-light p-6 shadow-sm">
                    <h2 className="text-base font-bold text-text mb-4">Chọn chế độ</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setMode('full_test')}
                            className={cn(
                                'flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all cursor-pointer',
                                mode === 'full_test'
                                    ? 'border-primary bg-primary/5 ring-2 ring-primary/10'
                                    : 'border-border hover:border-text-muted bg-white'
                            )}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Shield
                                    className={cn(
                                        'size-5',
                                        mode === 'full_test' ? 'text-primary' : 'text-text-muted'
                                    )}
                                />
                                <span className="font-bold text-text">Làm full test</span>
                            </div>
                            <p className="text-xs text-text-light leading-relaxed">
                                Tính giờ nghiêm ngặt ({formatDuration(exam.duration)}). Tự động nộp
                                bài khi hết giờ. Kết quả được lưu lại.
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode('practice')}
                            className={cn(
                                'flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all cursor-pointer',
                                mode === 'practice'
                                    ? 'border-cta bg-cta/5 ring-2 ring-cta/10'
                                    : 'border-border hover:border-text-muted bg-white'
                            )}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Target
                                    className={cn(
                                        'size-5',
                                        mode === 'practice' ? 'text-cta' : 'text-text-muted'
                                    )}
                                />
                                <span className="font-bold text-text">Luyện tập</span>
                            </div>
                            <p className="text-xs text-text-light leading-relaxed">
                                Chọn phần muốn luyện, tùy chỉnh thời gian. Xem đáp án ngay, không
                                lưu kết quả.
                            </p>
                        </button>
                    </div>

                    {/* Practice options */}
                    {mode === 'practice' && sections.length > 0 && (
                        <div className="mt-5 space-y-4 pt-4 border-t border-border-light">
                            <div>
                                <p className="text-sm font-semibold text-text mb-2">
                                    Chọn phần muốn luyện (bỏ trống = tất cả)
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {sections.map(s => {
                                        const isSelected = selectedSections.includes(s.sectionType)
                                        return (
                                            <button
                                                key={s.sectionType}
                                                type="button"
                                                onClick={() => toggleSection(s.sectionType)}
                                                className={cn(
                                                    'h-8 px-3.5 text-xs font-semibold rounded-lg border-2 transition-colors cursor-pointer',
                                                    isSelected
                                                        ? 'border-cta bg-cta text-white'
                                                        : 'border-border bg-white text-text-light hover:bg-background'
                                                )}
                                            >
                                                {SECTION_LABELS[s.sectionType] || s.sectionName} (
                                                {s.questionCount} câu)
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-[#1E293B]">
                                    Thời gian (phút, bỏ trống = không giới hạn)
                                </label>
                                <Select
                                    value={practiceMinutes}
                                    onValueChange={v => setPracticeMinutes(v)}
                                >
                                    <SelectTrigger className="h-10 rounded-lg border-2 border-[#E2E8F0] w-40">
                                        <SelectValue placeholder="Chọn thời gian" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Không giới hạn</SelectItem>
                                        {Array.from({ length: 20 }, (_, i) => (i + 1) * 15).map(
                                            minutes => (
                                                <SelectItem key={minutes} value={String(minutes)}>
                                                    {minutes} phút
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Warning */}
                {mode === 'full_test' && (
                    <div className="rounded-lg bg-destructive-light border border-red-200 p-4 flex gap-3">
                        <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-800 mb-1">
                                Lưu ý khi làm full test
                            </p>
                            <ul className="text-xs text-red-700 space-y-0.5 list-disc list-inside">
                                <li>Thời gian được tính từ khi bắt đầu, không thể tạm dừng.</li>
                                <li>Chuyển tab sẽ bị cảnh báo.</li>
                                <li>Bài thi tự động nộp khi hết giờ.</li>
                                <li>Kết quả được lưu lại vĩnh viễn.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="rounded-lg bg-destructive-light border border-red-200 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {/* Start button */}
                <Button
                    onClick={handleStart}
                    loading={starting}
                    variant={mode === 'full_test' ? 'secondary' : 'primary'}
                    size="lg"
                    className="w-full"
                >
                    {mode === 'full_test' ? (
                        <>
                            <Shield className="size-5" />
                            Bắt đầu thi ({formatDuration(exam.duration)})
                        </>
                    ) : (
                        <>
                            <Target className="size-5" />
                            Bắt đầu luyện tập
                        </>
                    )}
                </Button>

                {/* Feedback / Comment / Report */}
                <button
                    onClick={() => setFeedbackOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 text-sm font-semibold text-primary bg-primary/10 border-2 border-primary/20 rounded-xl hover:bg-primary/20 transition-colors cursor-pointer"
                >
                    <MessageSquareText className="size-4" />
                    Thảo luận & Đánh giá
                </button>
                <Modal
                    isOpen={feedbackOpen}
                    onClose={() => setFeedbackOpen(false)}
                    title="Thảo luận & Đánh giá"
                    className="max-w-4xl max-h-[85vh] flex flex-col"
                >
                    <ExamFeedbackPanel examId={examId} />
                </Modal>
            </div>
        </div>
    )
}
