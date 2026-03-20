import { ExamCard, ExamDropdown, ExamHeading, MySpace } from '@/components'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { examService } from '@/services/ExamService'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ExamPage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('n1')
    const [exams, setExams] = useState([])
    const [loading, setLoading] = useState(true)

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

    const filteredExamsByTab = useMemo(() => {
        if (activeTab === 'approved') {
            return exams.filter(exam => exam.status === 'published')
        }
        if (activeTab === 'pending') {
            return exams.filter(exam => exam.status === 'draft')
        }
        const levelMap = { n1: 'N1', n2: 'N2', n3: 'N3', n4: 'N4', n5: 'N5' }
        const level = levelMap[activeTab]
        return level ? exams.filter(exam => exam.level === level) : exams
    }, [exams, activeTab])

    const handleToggleStatus = async id => {
        try {
            const exam = exams.find(e => (e._id || e.id) === id)
            if (!exam) return
            if (exam.status === 'published') {
                await examService.updateExam({ examId: id, status: 'draft' })
            } else {
                await examService.publishExam(id)
            }
            // Refresh list
            const res = await examService.getExams()
            setExams(res.data || [])
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteExam = async id => {
        try {
            await examService.deleteExam(id)
            setExams(prev => prev.filter(exam => (exam._id || exam.id) !== id))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Fragment>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="">
                <MySpace>
                    <MySpace.Heading className="bg-white p-5 shadow-sm">
                        <ExamHeading onCreateExam={() => navigate('/teacher/exam/create')} />
                    </MySpace.Heading>

                    <MySpace.Body>
                        <TabsContent value={activeTab} className="mt-0 w-full outline-none">
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="size-8 animate-spin rounded-full border-4 border-[#E2E8F0] border-t-[#2563EB]" />
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-4">
                                    {filteredExamsByTab.map(exam => (
                                        <ExamCard
                                            key={exam._id || exam.id}
                                            data={exam}
                                            className="w-full md:w-[calc(50%-8px)] 2xl:w-[calc(33.333333%-10.666666px)]"
                                        >
                                            <ExamDropdown
                                                status={exam.status}
                                                onView={() =>
                                                    navigate(
                                                        `/teacher/exam/${exam._id || exam.id}/questions`
                                                    )
                                                }
                                                onEdit={() => {}}
                                                onToggleStatus={() =>
                                                    handleToggleStatus(exam._id || exam.id)
                                                }
                                                onDelete={() =>
                                                    handleDeleteExam(exam._id || exam.id)
                                                }
                                            />
                                        </ExamCard>
                                    ))}
                                    {filteredExamsByTab.length === 0 && (
                                        <div className="flex w-full flex-col items-center justify-center py-16 text-center">
                                            <p className="text-sm font-medium text-[#64748B]">
                                                Chưa có đề thi nào
                                            </p>
                                            <p className="text-xs text-[#94A3B8]">
                                                Nhấn &quot;Tạo đề thi&quot; để bắt đầu
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </TabsContent>
                    </MySpace.Body>
                </MySpace>
            </Tabs>
        </Fragment>
    )
}
