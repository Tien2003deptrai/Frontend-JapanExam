import Badge from '@/components/ui/Badge'
import { LoadingPage } from '@/components/ui/Loading'
import SearchInput from '@/components/ui/SearchInput'
import { EmptyState, NotFoundState } from '@/components/ui/States'
import { examService } from '@/services'
import { formatDuration, JLPT_LEVELS, LEVEL_COLORS } from '@/utils/helpers'
import { BookOpen, ChevronRight, Clock, Star, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

const VALID_LEVELS = JLPT_LEVELS.map(l => l.toUpperCase())

export default function ExamListPage() {
    const { level } = useParams()
    const upperLevel = level?.toUpperCase()
    const [exams, setExams] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (!VALID_LEVELS.includes(upperLevel)) return
        setLoading(true)
        examService
            .getExamsByLevel(upperLevel)
            .then(res => setExams(res.data?.data || res.data || []))
            .catch(() => setExams([]))
            .finally(() => setLoading(false))
    }, [upperLevel])

    const filteredExams = useMemo(() => {
        let result = exams
        if (search.trim()) {
            const q = search.toLowerCase()
            result = result.filter(
                e => e.title?.toLowerCase().includes(q) || e.examCode?.toLowerCase().includes(q)
            )
        }
        return result
    }, [exams, search])

    if (!VALID_LEVELS.includes(upperLevel)) {
        return <Navigate to="/" replace />
    }

    const colors = LEVEL_COLORS[upperLevel]

    return (
        <div>
            {/* Header */}
            <div className={`${colors.bg} border-b ${colors.border}`}>
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex mb-5">
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
                            <li className="font-semibold text-text">Đề thi {upperLevel}</li>
                        </ol>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div
                            className={`size-14 rounded-xl ${colors.bg} border-2 ${colors.border} flex items-center justify-center`}
                        >
                            <span className={`text-2xl font-bold ${colors.text}`}>
                                {upperLevel}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-text">
                                Đề thi JLPT {upperLevel}
                            </h1>
                            <p className="text-sm text-text-light mt-0.5">
                                {exams.length} đề thi có sẵn
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Tìm đề thi theo tên, mã đề..."
                        className="flex-1"
                    />
                </div>

                {/* Results */}
                {loading ? (
                    <LoadingPage />
                ) : filteredExams.length === 0 ? (
                    search.trim() ? (
                        <NotFoundState />
                    ) : (
                        <EmptyState
                            icon={BookOpen}
                            title={`Chưa có đề thi ${upperLevel}`}
                            message="Đề thi sẽ được cập nhật sớm."
                        />
                    )
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredExams.map(exam => (
                            <ExamListCard key={exam._id || exam.id} exam={exam} colors={colors} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function ExamListCard({ exam, colors }) {
    const id = exam._id || exam.id
    return (
        <Link
            to={`/exam/${id}`}
            className="group flex flex-col rounded-xl bg-white border border-border-light p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
            <div className="flex items-center justify-between mb-3">
                <Badge variant="default" className={`${colors.bg} ${colors.text}`}>
                    {exam.level}
                </Badge>
            </div>

            <h3 className="text-base font-bold text-text line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                {exam.title}
            </h3>
            {exam.description && (
                <p className="text-xs text-text-muted line-clamp-2 mb-3">{exam.description}</p>
            )}

            <div className="mt-auto flex items-center gap-4 pt-3 border-t border-border-light">
                <span className="flex items-center gap-1.5 text-xs text-text-light">
                    <Clock className="size-3.5" />
                    {formatDuration(exam.duration)}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-text-light">
                    <BookOpen className="size-3.5" />
                    {exam.totalQuestions} câu
                </span>
                {exam.attemptCount > 0 && (
                    <span className="flex items-center gap-1.5 text-xs text-text-light">
                        <Users className="size-3.5" />
                        {exam.attemptCount}
                    </span>
                )}
                {exam.isFeatured && <Star className="size-3.5 text-warning ml-auto fill-warning" />}
            </div>
        </Link>
    )
}
