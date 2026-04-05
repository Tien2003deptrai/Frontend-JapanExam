import { ExamCard, ExamDropdown, ExamHeading, MySpace } from '@/components'
import EditExamMetadataModal from '@/components/Teacher/Exam/EditExamMetadataModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/States'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { examService } from '@/services/ExamService'
import { toast } from '@/utils/toast'
import { ChevronLeft, ChevronRight, ScrollText } from 'lucide-react'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PAGE_LIMIT = 12

export default function ExamPage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('all')
    const [exams, setExams] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [editExam, setEditExam] = useState(null)
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)
    const searchTimer = useRef(null)
    const [debouncedSearch, setDebouncedSearch] = useState('')

    // Debounce search
    useEffect(() => {
        clearTimeout(searchTimer.current)
        searchTimer.current = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1)
        }, 400)
        return () => clearTimeout(searchTimer.current)
    }, [search])

    const fetchExams = useCallback(async () => {
        try {
            setLoading(true)
            const levelMap = { n1: 'N1', n2: 'N2', n3: 'N3', n4: 'N4', n5: 'N5' }
            const params = { page, limit: PAGE_LIMIT, sort: sortBy }
            if (activeTab !== 'all' && levelMap[activeTab]) params.level = levelMap[activeTab]
            if (debouncedSearch.trim()) params.search = debouncedSearch.trim()
            const res = await examService.getExams(params)
            setExams(res.data || [])
            setTotal(res.total || 0)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [page, activeTab, sortBy, debouncedSearch])

    useEffect(() => {
        fetchExams()
    }, [fetchExams])

    const handleTabChange = val => {
        setActiveTab(val)
        setPage(1)
    }

    const handleSortChange = val => {
        setSortBy(val)
        setPage(1)
    }

    const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT))

    const handleDeleteExam = async () => {
        try {
            await examService.deleteExam(confirmDeleteId)
            toast.success('Đã xóa đề thi')
            fetchExams()
        } catch (error) {
            toast.error('Không thể xóa đề thi')
            console.error(error)
        }
        setConfirmDeleteId(null)
    }

    const handleReport = exam => {
        const subject = encodeURIComponent(`[Báo cáo] Đề thi: ${exam.title}`)
        const body = encodeURIComponent(
            `Tôi muốn báo cáo/phản hồi về đề thi:\n\n` +
                `- Tên đề: ${exam.title}\n` +
                `- Mã đề: ${exam.examCode || 'N/A'}\n` +
                `- Cấp độ: ${exam.level}\n\n` +
                `Nội dung phản hồi:\n`
        )
        window.open(`mailto:admin@jlptinsight.vn?subject=${subject}&body=${body}`)
    }

    const handleEditSuccess = () => fetchExams()

    return (
        <Fragment>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <MySpace>
                    <MySpace.Heading className="bg-white p-5 shadow-sm border-b border-gray-100">
                        <ExamHeading
                            onCreateExam={() => navigate('/creator/exam/create')}
                            search={search}
                            onSearchChange={setSearch}
                        />
                    </MySpace.Heading>

                    <MySpace.Body>
                        {/* Controls bar */}
                        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                            <span className="text-sm text-text-light">
                                Hiển thị <strong className="text-text">{exams.length}</strong> /{' '}
                                {total} đề thi
                            </span>
                            <div className="flex items-center gap-2">
                                <select
                                    value={sortBy}
                                    onChange={e => handleSortChange(e.target.value)}
                                    className="h-9 px-3 pr-8 text-xs font-medium rounded-lg border border-border bg-white text-text cursor-pointer"
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="oldest">Cũ nhất</option>
                                </select>
                            </div>
                        </div>

                        <TabsContent value={activeTab} className="mt-0 w-full outline-none">
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="size-8 animate-spin rounded-full border-4 border-border border-t-primary" />
                                </div>
                            ) : exams.length === 0 ? (
                                <EmptyState
                                    icon={ScrollText}
                                    title="Chưa có đề thi nào"
                                    message={
                                        debouncedSearch.trim()
                                            ? 'Không tìm thấy đề thi phù hợp'
                                            : 'Nhấn "Tạo đề thi" để bắt đầu soạn đề'
                                    }
                                />
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                                    {exams.map(exam => (
                                        <ExamCard key={exam._id || exam.id} data={exam}>
                                            <ExamDropdown
                                                onView={() =>
                                                    navigate(
                                                        `/creator/exam/${exam._id || exam.id}/questions`
                                                    )
                                                }
                                                onEdit={() => setEditExam(exam)}
                                                onReport={() => handleReport(exam)}
                                                onDelete={() =>
                                                    setConfirmDeleteId(exam._id || exam.id)
                                                }
                                            />
                                        </ExamCard>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    className="inline-flex items-center justify-center size-9 rounded-lg border border-border bg-white text-text-muted hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    <ChevronLeft className="size-4" />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(
                                        p => p === 1 || p === totalPages || Math.abs(p - page) <= 1
                                    )
                                    .reduce((acc, p, i, arr) => {
                                        if (i > 0 && p - arr[i - 1] > 1) acc.push('...')
                                        acc.push(p)
                                        return acc
                                    }, [])
                                    .map((item, i) =>
                                        item === '...' ? (
                                            <span
                                                key={`dots-${i}`}
                                                className="px-1 text-text-muted"
                                            >
                                                …
                                            </span>
                                        ) : (
                                            <button
                                                key={item}
                                                onClick={() => setPage(item)}
                                                className={`inline-flex items-center justify-center size-9 rounded-lg text-sm font-semibold cursor-pointer ${
                                                    page === item
                                                        ? 'bg-primary text-white'
                                                        : 'border border-border bg-white text-text hover:bg-surface'
                                                }`}
                                            >
                                                {item}
                                            </button>
                                        )
                                    )}
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page >= totalPages}
                                    className="inline-flex items-center justify-center size-9 rounded-lg border border-border bg-white text-text-muted hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    <ChevronRight className="size-4" />
                                </button>
                            </div>
                        )}
                    </MySpace.Body>
                </MySpace>
            </Tabs>

            {/* Edit exam metadata modal */}
            <EditExamMetadataModal
                isOpen={!!editExam}
                onClose={() => setEditExam(null)}
                exam={editExam}
                onSuccess={handleEditSuccess}
            />

            <ConfirmDialog
                isOpen={!!confirmDeleteId}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={handleDeleteExam}
                title="Xóa đề thi"
                message="Bạn có chắc chắn muốn xóa đề thi này? Hành động này không thể hoàn tác."
                confirmText="Xóa"
                variant="danger"
            />
        </Fragment>
    )
}
