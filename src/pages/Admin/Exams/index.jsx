import { ConfirmDialog, LoadingSpinner } from '@/components/ui'
import { examService } from '@/services/ExamService'
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Eye,
    Globe,
    MoreHorizontal,
    Search,
    Send,
    Trash2,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PAGE_SIZE = 15

const LEVEL_BADGE = {
    N5: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
    N4: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    N3: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
    N2: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    N1: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
}

const STATUS_MAP = {
    draft: { label: 'Nháp', cls: 'bg-gray-100 text-gray-600' },
    published: {
        label: 'Đã xuất bản',
        cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    },
    archived: { label: 'Đã lưu trữ', cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
}

function formatDate(d) {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

export default function AdminExamsPage() {
    const [exams, setExams] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [levelFilter, setLevelFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [loading, setLoading] = useState(true)
    const [actionMenu, setActionMenu] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const menuRef = useRef(null)
    const navigate = useNavigate()

    const totalPages = Math.ceil(total / PAGE_SIZE)

    const load = useCallback(async () => {
        try {
            setLoading(true)
            const body = { page, limit: PAGE_SIZE }
            if (search) body.search = search
            if (levelFilter) body.level = levelFilter
            if (statusFilter) body.status = statusFilter
            const res = await examService.getExams(body)
            setExams(res.data || [])
            setTotal(res.pagination?.total || 0)
        } catch {
            setExams([])
            setTotal(0)
        } finally {
            setLoading(false)
        }
    }, [page, search, levelFilter, statusFilter])

    useEffect(() => {
        load()
    }, [load])

    useEffect(() => {
        const h = e => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setActionMenu(null)
        }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [])

    const handlePublish = async examId => {
        try {
            await examService.publishExam(examId)
            load()
        } catch {}
        setActionMenu(null)
    }

    const handleDelete = examId => {
        setConfirmDelete(examId)
        setActionMenu(null)
    }

    const executeDelete = async () => {
        try {
            await examService.deleteExam(confirmDelete)
            load()
        } catch {}
        setConfirmDelete(null)
    }

    const start = (page - 1) * PAGE_SIZE

    return (
        <div className="space-y-6">
            <div className="sticky top-0 z-20 bg-white -mx-6 -mt-6 px-6 pt-6 pb-4 border-b border-gray-100 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-text">
                            Quản lý Đề thi
                        </h1>
                        <p className="mt-1 text-sm text-text-light">
                            Tất cả đề thi trong hệ thống.
                        </p>
                    </div>
                    <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                        {total} đề thi
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative max-w-xs flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, mã đề..."
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                        className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                    />
                </div>
                <select
                    value={levelFilter}
                    onChange={e => {
                        setLevelFilter(e.target.value)
                        setPage(1)
                    }}
                    className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition cursor-pointer"
                >
                    <option value="">Tất cả level</option>
                    {['N5', 'N4', 'N3', 'N2', 'N1'].map(l => (
                        <option key={l} value={l}>
                            {l}
                        </option>
                    ))}
                </select>
                <select
                    value={statusFilter}
                    onChange={e => {
                        setStatusFilter(e.target.value)
                        setPage(1)
                    }}
                    className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition cursor-pointer"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="draft">Nháp</option>
                    <option value="published">Đã xuất bản</option>
                    <option value="archived">Lưu trữ</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border bg-surface/50">
                                    <th className="px-5 py-3 font-semibold text-text-muted w-12">
                                        #
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-text-muted">
                                        Tên đề thi
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-text-muted">
                                        Level
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-text-muted">
                                        Trạng thái
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-text-muted">
                                        Người tạo
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-text-muted">
                                        Lượt thi
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-text-muted">
                                        Ngày tạo
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-text-muted w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-5 py-12 text-center text-text-muted"
                                        >
                                            Không tìm thấy đề thi nào.
                                        </td>
                                    </tr>
                                ) : (
                                    exams.map((ex, idx) => {
                                        const st = STATUS_MAP[ex.status] || STATUS_MAP.draft
                                        return (
                                            <tr
                                                key={ex._id}
                                                className="border-b border-border/50 hover:bg-background/50 transition"
                                            >
                                                <td className="px-5 py-3 text-text-muted">
                                                    {start + idx + 1}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div>
                                                        <p className="font-medium text-text">
                                                            {ex.title || '-'}
                                                        </p>
                                                        <p className="text-xs text-text-muted">
                                                            {ex.examCode || ''}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span
                                                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-black ${LEVEL_BADGE[ex.level] || 'bg-gray-100 text-gray-600'}`}
                                                    >
                                                        {ex.level}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.cls}`}
                                                    >
                                                        {ex.isPublic && (
                                                            <Globe className="size-3" />
                                                        )}
                                                        {st.label}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-text-light">
                                                    {ex.createdBy?.fullName || '-'}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2 text-text-muted">
                                                        <Eye className="size-3.5" />
                                                        {ex.viewCount || 0}
                                                        <span className="text-border">|</span>
                                                        <BookOpen className="size-3.5" />
                                                        {ex.attemptCount || 0}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 text-text-muted">
                                                    {formatDate(ex.createdAt)}
                                                </td>
                                                <td className="px-5 py-3 relative">
                                                    <button
                                                        onClick={() =>
                                                            setActionMenu(
                                                                actionMenu === ex._id
                                                                    ? null
                                                                    : ex._id
                                                            )
                                                        }
                                                        className="p-1.5 rounded-lg hover:bg-surface transition cursor-pointer"
                                                    >
                                                        <MoreHorizontal className="size-4 text-text-muted" />
                                                    </button>
                                                    {actionMenu === ex._id && (
                                                        <div
                                                            ref={menuRef}
                                                            className="absolute right-5 top-10 z-50 w-48 bg-white rounded-xl border border-border shadow-lg py-1"
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    navigate(
                                                                        `/creator/exam/${ex._id}/questions`
                                                                    )
                                                                    setActionMenu(null)
                                                                }}
                                                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-surface transition text-left cursor-pointer"
                                                            >
                                                                <Eye className="size-4 text-primary" />
                                                                Xem chi tiết
                                                            </button>
                                                            {ex.status === 'draft' && (
                                                                <button
                                                                    onClick={() =>
                                                                        handlePublish(ex._id)
                                                                    }
                                                                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-surface transition text-left cursor-pointer"
                                                                >
                                                                    <Send className="size-4 text-emerald-600" />
                                                                    Xuất bản
                                                                </button>
                                                            )}
                                                            <hr className="my-1 border-border" />
                                                            <button
                                                                onClick={() => handleDelete(ex._id)}
                                                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive-light transition text-left cursor-pointer"
                                                            >
                                                                <Trash2 className="size-4" />
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-3">
                            <p className="text-sm text-text-light">
                                Hiển thị {start + 1}-{Math.min(start + PAGE_SIZE, total)} / {total}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-light hover:bg-surface disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
                                >
                                    <ChevronLeft className="size-4" /> Trước
                                </button>
                                <span className="px-3 py-1.5 text-sm text-text-light">
                                    Trang {page} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-light hover:bg-surface disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
                                >
                                    Sau <ChevronRight className="size-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <ConfirmDialog
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={executeDelete}
                title="Xóa đề thi"
                message="Bạn có chắc chắn muốn xóa đề thi này? Hành động này không thể hoàn tác."
                confirmText="Xóa"
                variant="danger"
            />
        </div>
    )
}
