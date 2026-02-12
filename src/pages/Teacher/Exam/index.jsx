import { Fragment, useEffect, useMemo, useState } from 'react'
import { AddExam, ExamCard, ExamDropdown, ExamHeading, MySpace } from '@/components'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { examService } from '@/services/ExamService'

export default function ExamPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState('approved')
    const [exams, setExams] = useState([])

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const data = await examService.getExams()
                setExams(data)
            } catch (error) {
                console.error(error)
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

    const filteredExams = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase()
        if (!keyword) return filteredExamsByTab
        return filteredExamsByTab.filter(
            exam =>
                exam.title?.toLowerCase().includes(keyword) ||
                exam.level?.toLowerCase().includes(keyword) ||
                exam.description?.toLowerCase().includes(keyword)
        )
    }, [filteredExamsByTab, searchTerm])

    const handleCreateExam = async payload => {
        const newExam = await examService.createExam(payload)
        setExams(prev => [newExam, ...prev])
    }

    const handleToggleStatus = async id => {
        const updatedExam = await examService.toggleExamStatus(id)
        setExams(prev => prev.map(exam => (exam.id === id ? updatedExam : exam)))
    }

    const handleDeleteExam = async id => {
        await examService.deleteExam(id)
        setExams(prev => prev.filter(exam => exam.id !== id))
    }

    return (
        <Fragment>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="">
                <MySpace>
                    <MySpace.Heading className="bg-white p-5 shadow-sm">
                        <ExamHeading
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            setIsModalOpen={setIsModalOpen}
                        />
                    </MySpace.Heading>

                    <MySpace.Body>
                        <TabsContent value={activeTab} className="mt-0 w-full outline-none">
                            <div className="flex flex-wrap gap-4">
                                {filteredExams.map(exam => (
                                    <ExamCard
                                        key={exam.id}
                                        data={exam}
                                        className="w-full md:w-[calc(50%-8px)] 2xl:w-[calc(33.333333%-10.666666px)]"
                                    >
                                        <ExamDropdown
                                            status={exam.status}
                                            onView={() => {}}
                                            onEdit={() => {}}
                                            onToggleStatus={() => handleToggleStatus(exam.id)}
                                            onDelete={() => handleDeleteExam(exam.id)}
                                        />
                                    </ExamCard>
                                ))}
                            </div>
                        </TabsContent>
                    </MySpace.Body>
                </MySpace>
            </Tabs>

            <AddExam
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateExam}
            />
        </Fragment>
    )
}
