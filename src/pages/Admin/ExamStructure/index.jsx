import { LoadingSpinner } from '@/components/ui'
import { adminService } from '@/services/AdminService'
import { BookOpen, CheckCircle2, Clock, FileText, Layers, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const STRUCTURES = [
    {
        id: 'N5',
        label: 'JLPT N5',
        duration: 105,
        totalQuestions: 95,
        color: 'from-sky-500 to-cyan-400',
        sections: [
            { name: 'Từ vựng', key: 'vocabulary', count: 30, time: 30 },
            { name: 'Ngữ pháp', key: 'grammar', count: 25, time: 25 },
            { name: 'Đọc hiểu', key: 'reading', count: 10, time: 20 },
            { name: 'Nghe', key: 'listening', count: 30, time: 30 },
        ],
    },
    {
        id: 'N4',
        label: 'JLPT N4',
        duration: 125,
        totalQuestions: 100,
        color: 'from-emerald-500 to-teal-400',
        sections: [
            { name: 'Từ vựng', key: 'vocabulary', count: 30, time: 30 },
            { name: 'Ngữ pháp', key: 'grammar', count: 25, time: 30 },
            { name: 'Đọc hiểu', key: 'reading', count: 15, time: 30 },
            { name: 'Nghe', key: 'listening', count: 30, time: 35 },
        ],
    },
    {
        id: 'N3',
        label: 'JLPT N3',
        duration: 140,
        totalQuestions: 105,
        color: 'from-violet-500 to-purple-400',
        sections: [
            { name: 'Từ vựng', key: 'vocabulary', count: 35, time: 30 },
            { name: 'Ngữ pháp', key: 'grammar', count: 25, time: 35 },
            { name: 'Đọc hiểu', key: 'reading', count: 15, time: 35 },
            { name: 'Nghe', key: 'listening', count: 30, time: 40 },
        ],
    },
    {
        id: 'N2',
        label: 'JLPT N2',
        duration: 155,
        totalQuestions: 107,
        color: 'from-amber-500 to-orange-400',
        sections: [
            { name: 'Từ vựng', key: 'vocabulary', count: 32, time: 30 },
            { name: 'Ngữ pháp', key: 'grammar', count: 22, time: 35 },
            { name: 'Đọc hiểu', key: 'reading', count: 20, time: 40 },
            { name: 'Nghe', key: 'listening', count: 33, time: 50 },
        ],
    },
    {
        id: 'N1',
        label: 'JLPT N1',
        duration: 170,
        totalQuestions: 103,
        color: 'from-rose-500 to-pink-400',
        sections: [
            { name: 'Từ vựng', key: 'vocabulary', count: 25, time: 25 },
            { name: 'Ngữ pháp', key: 'grammar', count: 20, time: 35 },
            { name: 'Đọc hiểu', key: 'reading', count: 25, time: 50 },
            { name: 'Nghe', key: 'listening', count: 33, time: 60 },
        ],
    },
]

const SECTION_ICONS = {
    vocabulary: FileText,
    grammar: Layers,
    reading: BookOpen,
    listening: TrendingUp,
}

export default function AdminExamStructurePage() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        ;(async () => {
            try {
                const res = await adminService.getStatistics()
                setStats(res?.data || res)
            } catch {
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const examsByLevel = stats?.examsByLevel || []
    const getExamCount = level => {
        const found = examsByLevel.find(e => e._id === level)
        return found?.count || 0
    }

    if (loading)
        return (
            <div className="flex justify-center py-20">
                <LoadingSpinner />
            </div>
        )

    return (
        <div className="space-y-8 p-4 lg:p-6">
            <div>
                <h1 className="font-heading text-2xl font-bold text-text">Cấu trúc đề thi JLPT</h1>
                <p className="mt-1 text-sm text-text-light">
                    Tham khảo cấu trúc chuẩn JLPT kết hợp thống kê đề thi thực tế trong hệ thống.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {STRUCTURES.map(structure => {
                    const examCount = getExamCount(structure.id)
                    return (
                        <div
                            key={structure.id}
                            className="group rounded-2xl border border-border bg-white shadow-sm overflow-hidden transition hover:shadow-md"
                        >
                            {/* Header with gradient */}
                            <div className={`relative bg-linear-to-r ${structure.color} px-6 py-4`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            {structure.label}
                                        </h2>
                                        <div className="mt-1 flex items-center gap-3 text-sm text-white/80">
                                            <span className="flex items-center gap-1">
                                                <Clock className="size-3.5" /> {structure.duration}{' '}
                                                phút
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CheckCircle2 className="size-3.5" />{' '}
                                                {structure.totalQuestions} câu
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-white">
                                            {examCount}
                                        </p>
                                        <p className="text-xs text-white/70">đề thi</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sections */}
                            <div className="p-5 space-y-3">
                                {structure.sections.map((section, i) => {
                                    const Icon = SECTION_ICONS[section.key] || FileText
                                    const pct = Math.round(
                                        (section.time / structure.duration) * 100
                                    )
                                    return (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface">
                                                <Icon className="size-4 text-text-muted" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-medium text-text">
                                                        {section.name}
                                                    </span>
                                                    <span className="text-text-muted">
                                                        {section.count} câu · {section.time} phút
                                                    </span>
                                                </div>
                                                <div className="mt-1.5 h-1.5 w-full rounded-full bg-surface overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full bg-linear-to-r ${structure.color}`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
