import { cn } from '@/lib/utils'
import { BookOpen, Headphones, MessageSquare, Pencil, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

// Inline data (practice feature not yet connected to API)
const SKILLS = [
    { id: 'nghe', label: 'Nghe', icon: Headphones, count: 0 },
    { id: 'doc', label: 'Đọc', icon: BookOpen, count: 0 },
    { id: 'ngu-phap', label: 'Ngữ pháp', icon: Pencil, count: 0 },
    { id: 'tu-vung', label: 'Từ vựng', icon: MessageSquare, count: 0 },
]
const SKILL_LABELS = { nghe: 'Nghe', doc: 'Đọc', 'ngu-phap': 'Ngữ pháp', 'tu-vung': 'Từ vựng' }
const getExamCodesBySkill = () => []
const MOST_PRACTICED = []

export default function PracticeListPage() {
    const [selectedSkill, setSelectedSkill] = useState('nghe')
    const examCodes = getExamCodesBySkill(selectedSkill)
    const skillLabel = SKILL_LABELS[selectedSkill]

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-linear-to-r from-primary-dark via-primary to-primary-light py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-2xl font-bold text-white font-heading">Luyện đề JLPT</h1>
                    <p className="text-sm text-white/80 mt-1">
                        Chọn kỹ năng và mã đề để bắt đầu luyện tập
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                {/* Skill tabs */}
                <div className="rounded-xl border-2 border-border bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-text mb-4">Bước 1: Chọn kỹ năng</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {SKILLS.map(skill => {
                            const Icon = skill.icon
                            const isActive = selectedSkill === skill.id
                            return (
                                <button
                                    key={skill.id}
                                    type="button"
                                    onClick={() => setSelectedSkill(skill.id)}
                                    className={cn(
                                        'flex flex-col items-center gap-1.5 py-4 px-3 rounded-xl border-2 transition-all cursor-pointer',
                                        isActive
                                            ? 'bg-primary text-white border-primary shadow-md'
                                            : 'bg-white border-border text-text-light hover:border-primary/50 hover:bg-primary/5'
                                    )}
                                >
                                    <Icon className="size-7" />
                                    <span className="text-sm font-semibold">{skill.label}</span>
                                    <span
                                        className={cn(
                                            'text-xs',
                                            isActive ? 'text-white/80' : 'text-text-muted'
                                        )}
                                    >
                                        {skill.count} đề
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Exam codes */}
                <div className="rounded-xl border-2 border-border bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-text mb-4">
                        <BookOpen className="inline size-4 mr-1.5 text-primary" />
                        Bước 2: Chọn mã đề {skillLabel}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {examCodes.map(({ code }) => (
                            <Link
                                key={code}
                                to={`/student/practice/${code}`}
                                className="flex items-center justify-center size-11 rounded-lg border-2 border-border bg-white hover:border-primary hover:bg-primary/5 text-text-light hover:text-primary font-semibold text-sm transition-colors"
                            >
                                {code}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Most practiced */}
                <div className="rounded-xl border-2 border-border bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-text mb-4">
                        <TrendingUp className="inline size-4 mr-1.5 text-cta" />
                        Được luyện nhiều nhất
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {MOST_PRACTICED.map(({ code, count }) => (
                            <Link
                                key={code}
                                to={`/student/practice/${code}`}
                                className="flex items-center justify-between p-4 rounded-xl border-2 border-border bg-white hover:border-primary hover:bg-primary/5 transition-colors group"
                            >
                                <span className="font-bold text-text group-hover:text-primary transition-colors">
                                    Đề {code}
                                </span>
                                <span className="text-xs text-text-muted">
                                    {count.toLocaleString('vi-VN')} lượt
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
