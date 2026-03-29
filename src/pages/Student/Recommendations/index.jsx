import { LoadingSpinner } from '@/components/ui'
import { examAttemptService } from '@/services/ExamAttemptService'
import { AlertTriangle, BookOpen, ChevronRight, Lightbulb, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SECTION_NAME = { vocabulary: 'Từ vựng', grammar: 'Ngữ pháp', reading: 'Đọc hiểu', listening: 'Nghe hiểu' }
const LEVEL_CONFIG = {
    N5: 'bg-sky-50 text-sky-700 ring-sky-200',
    N4: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    N3: 'bg-violet-50 text-violet-700 ring-violet-200',
    N2: 'bg-amber-50 text-amber-700 ring-amber-200',
    N1: 'bg-rose-50 text-rose-700 ring-rose-200',
}

export default function RecommendationsPage() {
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => { loadRecommendations() }, [])

    const loadRecommendations = async () => {
        try {
            setLoading(true)
            const res = await examAttemptService.getRecommendations()
            setData(res.data)
        } catch { setData(null) }
        finally { setLoading(false) }
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Lightbulb className="size-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-text tracking-tight">Gợi ý bài thi</h1>
                        <p className="text-sm text-text-muted">Phân tích điểm yếu và đề xuất bài thi phù hợp</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><LoadingSpinner /></div>
                ) : !data ? (
                    <div className="rounded-2xl border-2 border-dashed border-border bg-white p-16 text-center">
                        <Target className="size-10 text-text-muted/30 mx-auto mb-3" />
                        <p className="font-semibold text-text-muted">Chưa đủ dữ liệu</p>
                        <p className="text-sm text-text-muted/70">Hoàn thành ít nhất 1 bài thi để nhận gợi ý.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Weakest section */}
                        {data.weakestSection && (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="size-4 text-amber-600" />
                                    <h3 className="text-sm font-bold text-amber-800">Kỹ năng cần cải thiện</h3>
                                </div>
                                <p className="text-sm text-amber-700">
                                    <strong>{SECTION_NAME[data.weakestSection._id] || data.weakestSection._id}</strong> là kỹ năng yếu nhất của bạn
                                    với điểm trung bình <strong>{Math.round(data.weakestSection.avgScore)}%</strong>.
                                    Hãy tập trung luyện tập phần này nhiều hơn!
                                </p>
                            </div>
                        )}

                        {/* Unattempted levels */}
                        {data.unattemptedLevels?.length > 0 && (
                            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <BookOpen className="size-4 text-blue-600" />
                                    <h3 className="text-sm font-bold text-blue-800">Cấp độ chưa thử</h3>
                                </div>
                                <p className="text-sm text-blue-700">
                                    Bạn chưa làm bài thi ở cấp độ: {data.unattemptedLevels.map(l => (
                                        <span key={l} className={`inline-block mx-0.5 px-2 py-0.5 rounded-full text-xs font-bold ring-1 ${LEVEL_CONFIG[l] || ''}`}>{l}</span>
                                    ))}
                                </p>
                            </div>
                        )}

                        {/* Weak levels */}
                        {data.weakLevels?.length > 0 && (
                            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Target className="size-4 text-red-600" />
                                    <h3 className="text-sm font-bold text-red-800">Cấp độ cần cải thiện</h3>
                                </div>
                                <p className="text-sm text-red-700">
                                    Điểm trung bình dưới 60% ở: {data.weakLevels.map(l => (
                                        <span key={l} className={`inline-block mx-0.5 px-2 py-0.5 rounded-full text-xs font-bold ring-1 ${LEVEL_CONFIG[l] || ''}`}>{l}</span>
                                    ))}
                                </p>
                            </div>
                        )}

                        {/* Recommended exams */}
                        {data.recommendedExams?.length > 0 && (
                            <div>
                                <h2 className="text-base font-bold text-text mb-4 flex items-center gap-2">
                                    <Lightbulb className="size-4 text-primary" />Bài thi gợi ý
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {data.recommendedExams.map(exam => (
                                        <div key={exam._id}
                                            onClick={() => navigate(`/exam/${exam._id}`)}
                                            className="group rounded-2xl border border-border bg-white p-5 shadow-sm hover:border-primary/30 hover:shadow-md transition cursor-pointer">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ring-1 ${LEVEL_CONFIG[exam.level] || 'bg-gray-100 text-gray-600 ring-gray-200'}`}>
                                                    {exam.level}
                                                </span>
                                                <ChevronRight className="size-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition" />
                                            </div>
                                            <p className="font-semibold text-sm text-text truncate">{exam.title || exam.examCode}</p>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                                                <span>{exam.totalQuestions} câu</span>
                                                <span>{exam.duration} phút</span>
                                                <span>{exam.totalPoints} điểm</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}