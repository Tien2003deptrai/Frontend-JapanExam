import { useEffect, useMemo, useState } from 'react'
import { PlusIcon, Search } from 'lucide-react'
import { AddExam, ExamCard, ExamDropdown, MySpace } from '@/components'
import { examService } from '@/services/ExamService'

export default function ExamPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [exams, setExams] = useState([])

    useEffect(() => {
        let isMounted = true

        const fetchExams = async () => {
            try {
                const data = await examService.getExams()
                if (isMounted) {
                    setExams(data)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchExams()
        return () => {
            isMounted = false
        }
    }, [])

    const filteredExams = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase()
        if (!keyword) return exams

        return exams.filter(
            (exam) =>
                exam.title.toLowerCase().includes(keyword) ||
                exam.level.toLowerCase().includes(keyword) ||
                exam.description.toLowerCase().includes(keyword)
        )
    }, [exams, searchTerm])

    const handleCreateExam = async (payload) => {
        const newExam = await examService.createExam(payload)
        setExams((prev) => [newExam, ...prev])
    }

    const handleToggleStatus = async (id) => {
        const updatedExam = await examService.toggleExamStatus(id)
        setExams((prev) => prev.map((exam) => (exam.id === id ? updatedExam : exam)))
    }

    const handleDeleteExam = async (id) => {
        await examService.deleteExam(id)
        setExams((prev) => prev.filter((exam) => exam.id !== id))
    }

    return (
        <>
            <MySpace>
                <MySpace.Heading className="bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Quản lý đề thi</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Thiết lập, lên lịch và theo dõi các đề thi JLPT cho học viên.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    placeholder="Tìm kiếm đề thi..."
                                    className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-black border border-gray-200a cursor-pointer"
                            >
                                <PlusIcon className="h-4 w-4" />
                                Tạo đề thi
                            </button>
                        </div>
                    </div>
                </MySpace.Heading>

                <MySpace.Body>
                    <div className="flex flex-wrap gap-4">
                        {filteredExams.map((exam) => (
                            <ExamCard
                                key={exam.id}
                                data={exam}
                                className="w-full md:w-[calc(50%-8px)] 2xl:w-[calc(33.333333%-10.666666px)]"
                            >
                                <ExamDropdown
                                    status={exam.status}
                                    onView={() => { }}
                                    onEdit={() => { }}
                                    onToggleStatus={() => handleToggleStatus(exam.id)}
                                    onDelete={() => handleDeleteExam(exam.id)}
                                />
                            </ExamCard>
                        ))}
                    </div>
                </MySpace.Body>
            </MySpace>

            <AddExam isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateExam} />
        </>
    )
}
