import { ExamCard, ExamDropdown, ExamHeading, MySpace } from '@/components'
import EditExamMetadataModal from '@/components/Teacher/Exam/EditExamMetadataModal'
import { EmptyState } from '@/components/ui/States'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { examService } from '@/services/ExamService'
import { toast } from '@/utils/toast'
import { ScrollText } from 'lucide-react'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ExamPage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('all')
    const [exams, setExams] = useState([])
    const [loading, setLoading] = useState(true)
    const [editExam, setEditExam] = useState(null)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchExams = async () => {
            try {
                setLoading(true)
                const res = await examService.getExams()
                setExams(res.data || [])
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchExams()
    }, [])

    const filteredExams = useMemo(() => {
        let result = exams

        // Filter by level tab
        if (activeTab !== 'all') {
            const levelMap = { n1: 'N1', n2: 'N2', n3: 'N3', n4: 'N4', n5: 'N5' }
            const level = levelMap[activeTab]
            if (level) result = result.filter(exam => exam.level === level)
        }

        // Filter by search
        if (search.trim()) {
            const q = search.toLowerCase()
            result = result.filter(
                e =>
                    e.title?.toLowerCase().includes(q) ||
                    e.examCode?.toLowerCase().includes(q) ||
                    e.description?.toLowerCase().includes(q)
            )
        }

        return result
    }, [exams, activeTab, search])

    const handleDeleteExam = async id => {
        try {
            await examService.deleteExam(id)
            setExams(prev => prev.filter(exam => (exam._id || exam.id) !== id))
            toast.success('Đã xóa đề thi')
        } catch (error) {
            toast.error('Không thể xóa đề thi')
            console.error(error)
        }
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

    const handleEditSuccess = async () => {
        try {
            const res = await examService.getExams()
            setExams(res.data || [])
        } catch (error) {
            console.error(error)
        }
    }

    // Tab counts
    const examCounts = useMemo(() => {
        const counts = { all: exams.length, n1: 0, n2: 0, n3: 0, n4: 0, n5: 0 }
        for (const e of exams) {
            const key = e.level?.toLowerCase()
            if (key && counts[key] !== undefined) counts[key]++
        }
        return counts
    }, [exams])

    return (
        <Fragment>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <MySpace>
                    <MySpace.Heading className="bg-white p-5 shadow-sm">
                        <ExamHeading
                            onCreateExam={() => navigate('/teacher/exam/create')}
                            search={search}
                            onSearchChange={setSearch}
                        />
                    </MySpace.Heading>

                    <MySpace.Body>
                        {/* Stat summary */}
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <span className="text-sm text-text-light">
                                Hiển thị{' '}
                                <strong className="text-text">{filteredExams.length}</strong> /{' '}
                                {exams.length} đề thi
                            </span>
                        </div>

                        <TabsContent value={activeTab} className="mt-0 w-full outline-none">
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="size-8 animate-spin rounded-full border-4 border-border border-t-primary" />
                                </div>
                            ) : filteredExams.length === 0 ? (
                                <EmptyState
                                    icon={ScrollText}
                                    title="Chưa có đề thi nào"
                                    message={
                                        search.trim()
                                            ? 'Không tìm thấy đề thi phù hợp'
                                            : 'Nhấn "Tạo đề thi" để bắt đầu soạn đề'
                                    }
                                />
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                                    {filteredExams.map(exam => (
                                        <ExamCard key={exam._id || exam.id} data={exam}>
                                            <ExamDropdown
                                                onView={() =>
                                                    navigate(
                                                        `/teacher/exam/${exam._id || exam.id}/questions`
                                                    )
                                                }
                                                onEdit={() => setEditExam(exam)}
                                                onReport={() => handleReport(exam)}
                                                onDelete={() =>
                                                    handleDeleteExam(exam._id || exam.id)
                                                }
                                            />
                                        </ExamCard>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
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
        </Fragment>
    )
}
