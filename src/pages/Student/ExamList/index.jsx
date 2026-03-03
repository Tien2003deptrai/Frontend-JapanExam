import { useParams, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ExamListCard, Leaderboard, MySpace } from '@/components'
import { examService } from '@/services/ExamService'
import { leaderboardData } from '@/mock/leaderboardData'

const VALID_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']

export default function ExamListPage() {
    const { level } = useParams()
    const upperLevel = level?.toUpperCase()
    const [exams, setExams] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchExams() {
            setLoading(true)
            const data = await examService.getExamsByLevel(upperLevel)
            setExams(data)
            setLoading(false)
        }
        if (VALID_LEVELS.includes(upperLevel)) {
            fetchExams()
        }
    }, [upperLevel])

    if (!VALID_LEVELS.includes(upperLevel)) {
        return <Navigate to="/student" replace />
    }

    const rankings = leaderboardData[upperLevel] || []

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-[#6c757d] p-5 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-2xl font-semibold text-white">
                        Danh sách đề thi trình độ {upperLevel}
                    </h1>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-6">
                    {/* Exam grid */}
                    <div className="flex-1 min-w-0">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-lg border border-gray-200 p-5 h-40 animate-pulse"
                                    >
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                                    </div>
                                ))}
                            </div>
                        ) : exams.length === 0 ? (
                            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                                <p className="text-gray-500">
                                    Chưa có đề thi nào cho trình độ {upperLevel}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-4">
                                {exams.map((exam) => (
                                    <ExamListCard key={exam.id} exam={exam} className="w-full md:w-[calc(50%-8px)] 2xl:w-[calc(33.333333%-10.666666px)]" />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="hidden lg:block w-72 shrink-0">
                        <Leaderboard level={upperLevel} data={rankings} />
                    </div>
                </div>
            </div>
        </div>
    )
}
