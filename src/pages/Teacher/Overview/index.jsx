import { examService, questionBlockService } from '@/services'
import {
    AlertCircle,
    BarChart3,
    BookOpen,
    Clock,
    FileText,
    Layers,
    Loader2,
    ScrollText,
    TrendingUp,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function OverviewPage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [stats, setStats] = useState({
        totalExams: 0,
        examsByLevel: {},
        totalBlocks: 0,
        recentExams: [],
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true)
                const [examsRes, blocksRes] = await Promise.all([
                    examService.getExams({ limit: 100 }),
                    questionBlockService.getBlocks({ limit: 1 }),
                ])

                const exams = examsRes.data || []
                const totalBlocks = blocksRes.total || 0

                const examsByLevel = {}
                for (const exam of exams) {
                    const level = exam.level || 'Khác'
                    examsByLevel[level] = (examsByLevel[level] || 0) + 1
                }

                const recentExams = [...exams]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)

                setStats({
                    totalExams: exams.length,
                    examsByLevel,
                    totalBlocks,
                    recentExams,
                })
            } catch (err) {
                setError(err?.response?.data?.message || 'Không thể tải dữ liệu')
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle className="size-10 text-destructive mb-3" />
                <p className="text-sm text-text-light">{error}</p>
            </div>
        )
    }

    const STAT_CARDS = [
        {
            label: 'Tổng đề thi',
            value: stats.totalExams,
            icon: ScrollText,
            gradient: 'from-primary to-primary-dark',
            link: '/teacher/exam',
        },
        {
            label: 'Ngân hàng câu hỏi',
            value: stats.totalBlocks,
            icon: Layers,
            gradient: 'from-cta to-green-600',
            link: '/teacher/question',
            suffix: 'blocks',
        },
        {
            label: 'Cấp độ phổ biến nhất',
            value: Object.entries(stats.examsByLevel).sort((a, b) => b[1] - a[1])[0]?.[0] || '—',
            icon: TrendingUp,
            gradient: 'from-orange-500 to-orange-600',
        },
        {
            label: 'Đề thi gần đây',
            value: stats.recentExams.length,
            icon: Clock,
            gradient: 'from-purple-500 to-purple-600',
            suffix: 'đề mới',
        },
    ]

    const LEVELS = ['N1', 'N2', 'N3', 'N4', 'N5']
    const maxLevel = Math.max(...LEVELS.map(l => stats.examsByLevel[l] || 0), 1)

    return (
        <div className="space-y-6 p-5">
            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {STAT_CARDS.map(card => {
                    const Icon = card.icon
                    return (
                        <div
                            key={card.label}
                            className={`bg-linear-to-br ${card.gradient} rounded-xl p-5 text-white shadow-md`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/80 text-xs font-medium">
                                        {card.label}
                                    </p>
                                    <p className="text-3xl font-black mt-1.5">{card.value}</p>
                                </div>
                                <Icon className="size-10 text-white/30" />
                            </div>
                            {card.link && (
                                <Link
                                    to={card.link}
                                    className="mt-3 inline-flex items-center text-xs text-white/80 hover:text-white transition-colors"
                                >
                                    Xem chi tiết →
                                </Link>
                            )}
                            {card.suffix && !card.link && (
                                <p className="mt-3 text-xs text-white/70">{card.suffix}</p>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Two-column cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Exams by level chart */}
                <div className="bg-white rounded-xl border-2 border-border p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-text flex items-center gap-2 mb-5">
                        <BarChart3 className="size-4 text-primary" />
                        Đề thi theo cấp độ
                    </h3>
                    <div className="space-y-3">
                        {LEVELS.map(level => {
                            const count = stats.examsByLevel[level] || 0
                            const pct = Math.round((count / maxLevel) * 100)
                            return (
                                <div key={level}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-semibold text-text">
                                            {level}
                                        </span>
                                        <span className="text-xs text-text-muted">
                                            {count} đề thi
                                        </span>
                                    </div>
                                    <div className="h-2.5 rounded-full bg-surface overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all duration-500"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Recent exams */}
                <div className="bg-white rounded-xl border-2 border-border p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-text flex items-center gap-2">
                            <FileText className="size-4 text-orange-500" />
                            Đề thi gần đây
                        </h3>
                        <Link
                            to="/teacher/exam"
                            className="text-primary text-xs font-semibold hover:underline"
                        >
                            Xem tất cả
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {stats.recentExams.length === 0 ? (
                            <p className="text-sm text-text-muted text-center py-6">
                                Chưa có đề thi nào
                            </p>
                        ) : (
                            stats.recentExams.map(exam => (
                                <Link
                                    key={exam._id || exam.id}
                                    to={`/teacher/exam/${exam._id || exam.id}/questions`}
                                    className="block border-2 border-border p-3 rounded-xl hover:border-primary/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-text truncate">
                                                {exam.title}
                                            </p>
                                            <p className="text-xs text-text-light mt-0.5">
                                                {exam.level} · {exam.totalQuestions || 0} câu ·{' '}
                                                {typeof exam.duration === 'number'
                                                    ? `${exam.duration} phút`
                                                    : exam.duration}
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-[10px] bg-background text-text-muted px-2 py-0.5 rounded font-medium">
                                            {exam.createdAt
                                                ? new Date(exam.createdAt).toLocaleDateString(
                                                      'vi-VN'
                                                  )
                                                : ''}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-xl border-2 border-border p-5 shadow-sm">
                <h3 className="text-sm font-bold text-text mb-4">Thao tác nhanh</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Link
                        to="/teacher/exam/create"
                        className="flex items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <ScrollText className="size-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-text">Tạo đề thi mới</p>
                            <p className="text-xs text-text-muted">Soạn đề thi JLPT mới</p>
                        </div>
                    </Link>
                    <Link
                        to="/teacher/question"
                        className="flex items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-cta/50 hover:bg-cta/5 transition-all"
                    >
                        <div className="size-10 rounded-lg bg-cta/10 flex items-center justify-center shrink-0">
                            <BookOpen className="size-5 text-cta" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-text">Ngân hàng câu hỏi</p>
                            <p className="text-xs text-text-muted">Quản lý và tạo câu hỏi</p>
                        </div>
                    </Link>
                    <Link
                        to="/teacher/exam"
                        className="flex items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-orange-400/50 hover:bg-orange-50 transition-all"
                    >
                        <div className="size-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                            <Layers className="size-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-text">Quản lý đề thi</p>
                            <p className="text-xs text-text-muted">Xem và chỉnh sửa đề thi</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
