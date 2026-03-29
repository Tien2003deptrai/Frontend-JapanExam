import ExamFeedbackPanel from '@/components/Student/ExamFeedback'
import EditExamMetadataModal from '@/components/Teacher/Exam/EditExamMetadataModal'
import AddQuestionToExamModal from '@/components/Teacher/ExamQuestion/AddQuestionToExamModal'
import EditExamQuestionModal from '@/components/Teacher/ExamQuestion/EditExamQuestionModal'
import ExamQuestionPreviewModal from '@/components/Teacher/ExamQuestion/ExamQuestionPreviewModal'
import { cn } from '@/lib/utils'
import { examService } from '@/services'
import {
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Clock,
    Eye,
    FileText,
    Layers,
    Loader2,
    MessageSquareText,
    PencilLine,
    Plus,
    Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const SECTION_CONFIG = {
    vocabulary: { name: 'Từ vựng (文字・語彙)', color: '#0891B2', icon: '文' },
    grammar: { name: 'Ngữ pháp (文法)', color: '#22C55E', icon: '法' },
    reading: { name: 'Đọc hiểu (読解)', color: '#F59E0B', icon: '読' },
    listening: { name: 'Nghe hiểu (聴解)', color: '#8B5CF6', icon: '聴' },
}

const LEVEL_COLORS = {
    N5: 'bg-emerald-100 text-emerald-800',
    N4: 'bg-blue-100 text-blue-800',
    N3: 'bg-amber-100 text-amber-800',
    N2: 'bg-orange-100 text-orange-800',
    N1: 'bg-red-100 text-red-800',
}

export default function ExamQuestionsPage() {
    const [exam, setExam] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Modal states
    const [feedbackOpen, setFeedbackOpen] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [editMetadataOpen, setEditMetadataOpen] = useState(false)
    const [addQuestionModal, setAddQuestionModal] = useState({
        open: false,
        sectionIndex: null,
        sectionType: null,
    })
    const [previewQuestion, setPreviewQuestion] = useState(null)
    const [editQuestion, setEditQuestion] = useState(null)

    // Section expand state
    const [expandedSections, setExpandedSections] = useState({})

    const { examId } = useParams()
    const navigate = useNavigate()

    // Fetch exam data
    const fetchExam = async () => {
        try {
            setLoading(true)
            const response = await examService.getExamById(examId)
            if (response.success) {
                setExam(response.data.exam)
                // Expand all sections by default
                const expanded = {}
                response.data.exam.sections?.forEach((_, i) => {
                    expanded[i] = true
                })
                setExpandedSections(expanded)
            } else {
                setError('Không tìm thấy đề thi')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải đề thi')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (examId) fetchExam()
    }, [examId]) // eslint-disable-line react-hooks/exhaustive-deps

    // Handle exam deletion
    const handleDeleteExam = async () => {
        try {
            setDeleteLoading(true)
            const response = await examService.deleteExam(examId)
            if (response.success) {
                navigate('/creator/exam')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi xóa đề thi')
        } finally {
            setDeleteLoading(false)
            setShowDeleteModal(false)
        }
    }

    // Remove block from exam
    const handleRemoveBlock = async (sectionIndex, blockIndex) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa block câu hỏi này?')) return
        try {
            const res = await examService.removeBlockFromExam({ examId, sectionIndex, blockIndex })
            if (res.success) setExam(res.data.exam)
        } catch (err) {
            alert('Có lỗi xảy ra khi xóa block')
        }
    }

    // Remove question from exam
    const handleRemoveQuestion = async (sectionIndex, blockIndex, questionIndex) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return
        try {
            const res = await examService.removeQuestionFromExam({
                examId,
                sectionIndex,
                blockIndex,
                questionIndex,
            })
            if (res.success) setExam(res.data.exam)
        } catch (err) {
            alert('Có lỗi xảy ra khi xóa câu hỏi')
        }
    }

    // Handle question click → open preview modal
    const handleQuestionClick = (question, questionNumber, sectionType, blockContext, location) => {
        setPreviewQuestion({
            question,
            questionNumber,
            sectionType,
            blockContext,
            location, // { sectionIndex, blockIndex, questionIndex }
        })
    }

    // Handle edit from preview modal → open edit modal
    const handleEditFromPreview = question => {
        if (!previewQuestion) return
        setEditQuestion({
            ...previewQuestion.location,
            questionData: previewQuestion.question,
        })
        setPreviewQuestion(null)
    }

    // Toggle section expand
    const toggleSection = index => {
        setExpandedSections(prev => ({ ...prev, [index]: !prev[index] }))
    }

    // Calculate total questions
    const totalQuestions =
        exam?.sections?.reduce(
            (total, section) =>
                total +
                (section.blocks?.reduce((bt, block) => bt + (block.questions?.length || 0), 0) ||
                    0),
            0
        ) || 0

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="size-6 animate-spin text-primary" />
                    <span className="text-sm font-medium text-text-light">Đang tải đề thi...</span>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !exam) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center gap-4">
                <FileText className="size-12 text-border" />
                <p className="text-base font-semibold text-text-light">
                    {error || 'Không tìm thấy đề thi'}
                </p>
                <button
                    onClick={() => navigate('/creator/exam')}
                    className="text-sm font-medium text-primary hover:underline cursor-pointer"
                >
                    Quay lại danh sách
                </button>
            </div>
        )
    }

    let globalQuestionNumber = 0

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
            {/* ── Header ── */}
            <div className="bg-white border-b-2 border-border">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Breadcrumb */}
                    <nav className="flex mb-4">
                        <ol className="inline-flex items-center gap-1 text-sm">
                            <li>
                                <button
                                    onClick={() => navigate('/creator/exam')}
                                    className="font-medium text-text-light hover:text-primary transition-colors cursor-pointer"
                                >
                                    Đề thi
                                </button>
                            </li>
                            <li className="text-border">/</li>
                            <li className="font-medium text-text">Chi tiết đề thi</li>
                        </ol>
                    </nav>

                    {/* Title row */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 mb-2">
                                <span
                                    className={cn(
                                        'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold',
                                        LEVEL_COLORS[exam.level] || 'bg-gray-100 text-gray-600'
                                    )}
                                >
                                    {exam.level}
                                </span>
                                <span
                                    className={cn(
                                        'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold',
                                        exam.status === 'published'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : exam.status === 'draft'
                                              ? 'bg-gray-100 text-gray-600'
                                              : 'bg-amber-100 text-amber-700'
                                    )}
                                >
                                    {exam.status === 'published'
                                        ? 'Đã xuất bản'
                                        : exam.status === 'draft'
                                          ? 'Bản nháp'
                                          : 'Đang xử lý'}
                                </span>
                            </div>
                            <h1 className="text-2xl font-black text-text mb-1 font-heading">
                                {exam.title}
                            </h1>
                            {exam.description && (
                                <p className="text-sm text-text-light max-w-2xl">
                                    {exam.description}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => setEditMetadataOpen(true)}
                                className="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors cursor-pointer"
                            >
                                <PencilLine className="size-4" />
                                Chỉnh sửa
                            </button>
                            <button
                                onClick={() => setFeedbackOpen(prev => !prev)}
                                className={cn(
                                    'inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-xl transition-colors cursor-pointer',
                                    feedbackOpen
                                        ? 'text-white bg-primary border-2 border-primary'
                                        : 'text-text-light bg-white border-2 border-border hover:bg-background'
                                )}
                            >
                                <MessageSquareText className="size-4" />
                                Thảo luận & Đánh giá
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold text-red-600 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
                            >
                                <Trash2 className="size-4" />
                                Xóa
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 mt-5">
                        <StatBadge
                            icon={FileText}
                            label="Câu hỏi"
                            value={totalQuestions}
                            color="#2563EB"
                        />
                        <StatBadge
                            icon={Layers}
                            label="Phần thi"
                            value={exam.sections?.length || 0}
                            color="#16A34A"
                        />
                        <StatBadge
                            icon={Clock}
                            label="Thời gian"
                            value={`${exam.duration} phút`}
                            color="#F59E0B"
                        />
                        <StatBadge
                            icon={Eye}
                            label="Lượt xem"
                            value={exam.viewCount || 0}
                            color="#8B5CF6"
                        />
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Sections */}
                {exam.sections?.map((section, sIdx) => {
                    const sc = SECTION_CONFIG[section.sectionType] || SECTION_CONFIG.vocabulary
                    const isExpanded = expandedSections[sIdx] !== false
                    const sectionQCount =
                        section.blocks?.reduce((t, b) => t + (b.questions?.length || 0), 0) || 0

                    return (
                        <div
                            key={sIdx}
                            className="rounded-2xl border-2 border-border bg-white overflow-hidden"
                            style={{
                                boxShadow:
                                    '4px 4px 12px rgba(0,0,0,0.04), -2px -2px 8px rgba(255,255,255,0.6)',
                            }}
                        >
                            {/* Section header */}
                            <button
                                type="button"
                                onClick={() => toggleSection(sIdx)}
                                className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-background cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="flex size-10 items-center justify-center rounded-xl text-sm font-black text-white"
                                        style={{ backgroundColor: sc.color }}
                                    >
                                        {sc.icon}
                                    </span>
                                    <div className="text-left">
                                        <h3 className="text-base font-bold text-text">
                                            {section.sectionName || sc.name}
                                        </h3>
                                        <p className="text-xs text-text-muted mt-0.5">
                                            {section.blocks?.length || 0} blocks · {sectionQCount}{' '}
                                            câu · {section.duration} phút
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={e => {
                                            e.stopPropagation()
                                            setAddQuestionModal({
                                                open: true,
                                                sectionIndex: sIdx,
                                                sectionType: section.sectionType,
                                            })
                                        }}
                                        className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer border border-primary/20"
                                    >
                                        <Plus className="size-3.5" />
                                        Thêm câu hỏi
                                    </button>
                                    {isExpanded ? (
                                        <ChevronUp className="size-5 text-text-muted" />
                                    ) : (
                                        <ChevronDown className="size-5 text-text-muted" />
                                    )}
                                </div>
                            </button>

                            {/* Section content */}
                            {isExpanded && (
                                <div className="border-t-2 border-border px-6 py-5 space-y-4">
                                    {section.blocks?.length === 0 && (
                                        <div className="text-center py-8">
                                            <BookOpen className="mx-auto size-10 text-border" />
                                            <p className="mt-2 text-sm text-text-muted">
                                                Chưa có câu hỏi nào trong phần này
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setAddQuestionModal({
                                                        open: true,
                                                        sectionIndex: sIdx,
                                                        sectionType: section.sectionType,
                                                    })
                                                }
                                                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline cursor-pointer"
                                            >
                                                <Plus className="size-4" />
                                                Thêm câu hỏi đầu tiên
                                            </button>
                                        </div>
                                    )}

                                    {section.blocks?.map((block, bIdx) => {
                                        const hasContext =
                                            block.context?.text ||
                                            block.context?.audioUrl ||
                                            block.context?.imageUrl

                                        return (
                                            <div
                                                key={block._id || bIdx}
                                                className="rounded-xl border-2 border-border bg-background overflow-hidden"
                                            >
                                                {/* Block header */}
                                                <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-border">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span
                                                            className="flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                                                            style={{ backgroundColor: sc.color }}
                                                        >
                                                            {bIdx + 1}
                                                        </span>
                                                        <span className="text-sm font-semibold text-text truncate">
                                                            {block.title ||
                                                                block.questionType ||
                                                                `Block ${bIdx + 1}`}
                                                        </span>
                                                        <span className="text-[10px] text-text-muted shrink-0">
                                                            {block.questions?.length || 0} câu
                                                        </span>
                                                        {block.sourceBlockId && (
                                                            <span className="shrink-0 rounded bg-cyan-100 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                                                                Bank
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveBlock(sIdx, bIdx)
                                                        }
                                                        className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                                        title="Xóa block"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>

                                                {/* Context */}
                                                {hasContext && (
                                                    <div className="mx-4 mt-3 rounded-lg bg-cyan-50 border border-primary/20 p-3">
                                                        <p className="text-xs font-bold text-primary mb-1">
                                                            Context:
                                                        </p>
                                                        <p className="text-xs text-text-light line-clamp-3 whitespace-pre-wrap">
                                                            {block.context?.text}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Questions */}
                                                <div className="p-3 space-y-2">
                                                    {block.questions?.map((q, qIdx) => {
                                                        globalQuestionNumber++
                                                        const currentNumber = globalQuestionNumber
                                                        return (
                                                            <QuestionRow
                                                                key={q._id || qIdx}
                                                                question={q}
                                                                number={currentNumber}
                                                                sectionColor={sc.color}
                                                                onClick={() =>
                                                                    handleQuestionClick(
                                                                        q,
                                                                        currentNumber,
                                                                        section.sectionType,
                                                                        block.context,
                                                                        {
                                                                            sectionIndex: sIdx,
                                                                            blockIndex: bIdx,
                                                                            questionIndex: qIdx,
                                                                        }
                                                                    )
                                                                }
                                                                onRemove={() =>
                                                                    handleRemoveQuestion(
                                                                        sIdx,
                                                                        bIdx,
                                                                        qIdx
                                                                    )
                                                                }
                                                            />
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}

                {/* Empty state */}
                {(!exam.sections || exam.sections.length === 0) && (
                    <div className="rounded-2xl border-2 border-dashed border-border bg-white p-12 text-center">
                        <BookOpen className="mx-auto size-12 text-border" />
                        <h3 className="mt-4 text-lg font-bold text-text">
                            Đề thi chưa có cấu trúc
                        </h3>
                        <p className="mt-1 text-sm text-text-muted max-w-md mx-auto">
                            Vui lòng thiết lập cấu trúc đề thi trước khi thêm câu hỏi.
                        </p>
                    </div>
                )}
            </div>

            {/* ── Thảo luận & Đánh giá ── */}
            {feedbackOpen && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <ExamFeedbackPanel examId={examId} />
                </div>
            )}

            {/* ── Modals ── */}

            {/* Delete confirmation */}
            {showDeleteModal && (
                <DeleteExamModal
                    examTitle={exam.title}
                    loading={deleteLoading}
                    onConfirm={handleDeleteExam}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}

            {/* Add questions modal */}
            <AddQuestionToExamModal
                isOpen={addQuestionModal.open}
                onClose={() =>
                    setAddQuestionModal({ open: false, sectionIndex: null, sectionType: null })
                }
                examId={examId}
                sectionIndex={addQuestionModal.sectionIndex}
                sectionType={addQuestionModal.sectionType}
                onSuccess={fetchExam}
            />

            {/* Question preview modal */}
            <ExamQuestionPreviewModal
                isOpen={!!previewQuestion}
                onClose={() => setPreviewQuestion(null)}
                question={previewQuestion?.question}
                questionNumber={previewQuestion?.questionNumber}
                sectionType={previewQuestion?.sectionType}
                blockContext={previewQuestion?.blockContext}
                examLevel={exam?.level}
                onEdit={handleEditFromPreview}
            />

            {/* Edit exam metadata modal */}
            <EditExamMetadataModal
                isOpen={editMetadataOpen}
                onClose={() => setEditMetadataOpen(false)}
                exam={exam}
                onSuccess={fetchExam}
            />

            {/* Question edit modal */}
            <EditExamQuestionModal
                isOpen={!!editQuestion}
                onClose={() => setEditQuestion(null)}
                examId={examId}
                sectionIndex={editQuestion?.sectionIndex}
                blockIndex={editQuestion?.blockIndex}
                questionIndex={editQuestion?.questionIndex}
                questionData={editQuestion?.questionData}
                onSuccess={fetchExam}
            />
        </div>
    )
}

/* ── Question Row ── */
function QuestionRow({ question, number, sectionColor, onClick, onRemove }) {
    const correctOpt = question.options?.find(o => o.label === question.correctAnswer)

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={e => e.key === 'Enter' && onClick()}
            className="group flex items-center gap-3 rounded-lg bg-white border border-border px-3.5 py-3 transition-all hover:border-text-muted hover:shadow-sm cursor-pointer"
        >
            {/* Number */}
            <span
                className="flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{ backgroundColor: sectionColor }}
            >
                {number}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text line-clamp-1">
                    {question.questionText || `Câu ${number}`}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cta">
                        <CheckCircle2 className="size-3" />
                        {correctOpt
                            ? `${correctOpt.label}. ${correctOpt.text}`
                            : question.correctAnswer}
                    </span>
                    {question.points && question.points > 1 && (
                        <span className="text-[10px] text-text-muted">{question.points} điểm</span>
                    )}
                </div>
            </div>

            {/* Remove button */}
            <button
                type="button"
                onClick={e => {
                    e.stopPropagation()
                    onRemove()
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                title="Xóa câu hỏi"
            >
                <Trash2 className="size-3.5" />
            </button>
        </div>
    )
}

/* ── Stat Badge ── */
function StatBadge({ icon: Icon, label, value, color }) {
    return (
        <div className="flex items-center gap-2.5 rounded-xl border-2 border-border bg-white px-3.5 py-2.5">
            <div
                className="flex size-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}15` }}
            >
                <Icon className="size-4" style={{ color }} />
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    {label}
                </p>
                <p className="text-sm font-bold text-text">{value}</p>
            </div>
        </div>
    )
}

/* ── Delete Confirm Modal ── */
function DeleteExamModal({ examTitle, loading, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
            <div
                className="w-full max-w-md rounded-2xl bg-white p-6"
                style={{
                    boxShadow: '12px 12px 32px rgba(0,0,0,0.12)',
                }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-red-100">
                        <Trash2 className="size-5 text-red-600" />
                    </div>
                    <h3 className="text-base font-bold text-text">Xác nhận xóa đề thi</h3>
                </div>
                <p className="text-sm text-text-light mb-6">
                    Bạn có chắc chắn muốn xóa đề thi &ldquo;<strong>{examTitle}</strong>&rdquo;?
                    Hành động này không thể hoàn tác.
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="h-10 rounded-xl border-2 border-border px-5 text-sm font-semibold text-text-light hover:bg-surface transition-colors cursor-pointer"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="h-10 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer inline-flex items-center gap-2"
                    >
                        {loading && <Loader2 className="size-4 animate-spin" />}
                        {loading ? 'Đang xóa...' : 'Xóa đề thi'}
                    </button>
                </div>
            </div>
        </div>
    )
}
