import { BookOpen, Clock, Plus, Settings2 } from 'lucide-react'

const STRUCTURES = [
    {
        id: 'n5',
        label: 'JLPT N5',
        duration: 60,
        totalQuestions: 60,
        sections: [
            { name: 'Từ vựng', count: 20, time: 15 },
            { name: 'Ngữ pháp', count: 20, time: 20 },
            { name: 'Đọc hiểu', count: 15, time: 15 },
            { name: 'Nghe', count: 25, time: 25 },
        ],
    },
    {
        id: 'n4',
        label: 'JLPT N4',
        duration: 70,
        totalQuestions: 65,
        sections: [
            { name: 'Từ vựng', count: 22, time: 15 },
            { name: 'Ngữ pháp', count: 18, time: 20 },
            { name: 'Đọc hiểu', count: 15, time: 20 },
            { name: 'Nghe', count: 28, time: 30 },
        ],
    },
    {
        id: 'n3',
        label: 'JLPT N3',
        duration: 95,
        totalQuestions: 70,
        sections: [
            { name: 'Từ vựng', count: 25, time: 20 },
            { name: 'Ngữ pháp', count: 20, time: 25 },
            { name: 'Đọc hiểu', count: 15, time: 25 },
            { name: 'Nghe', count: 30, time: 35 },
        ],
    },
    {
        id: 'n2',
        label: 'JLPT N2',
        duration: 105,
        totalQuestions: 75,
        sections: [
            { name: 'Từ vựng', count: 25, time: 20 },
            { name: 'Ngữ pháp', count: 20, time: 25 },
            { name: 'Đọc hiểu', count: 20, time: 30 },
            { name: 'Nghe', count: 32, time: 35 },
        ],
    },
    {
        id: 'n1',
        label: 'JLPT N1',
        duration: 110,
        totalQuestions: 80,
        sections: [
            { name: 'Từ vựng', count: 25, time: 20 },
            { name: 'Ngữ pháp', count: 20, time: 25 },
            { name: 'Đọc hiểu', count: 25, time: 35 },
            { name: 'Nghe', count: 35, time: 40 },
        ],
    },
]

export default function AdminExamStructurePage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-text">
                        Quản lý cấu trúc đề thi
                    </h1>
                    <p className="mt-1 text-sm text-text-light">
                        Thiết lập thời gian, số câu và các phần thi theo từng level JLPT.
                    </p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors">
                    <Plus className="size-4" />
                    Thêm mẫu cấu trúc
                </button>
            </div>

            {/* Structure Cards */}
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                {STRUCTURES.map(structure => (
                    <div
                        key={structure.id}
                        className="rounded-xl border border-border bg-white p-5 shadow-sm transition hover:shadow-md"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                                    <BookOpen className="size-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="font-heading font-semibold text-text">
                                        {structure.label}
                                    </h2>
                                    <div className="mt-0.5 flex items-center gap-2 text-sm text-text-light">
                                        <Clock className="size-4" />
                                        <span>{structure.duration} phút</span>
                                        <span className="text-border">•</span>
                                        <span>{structure.totalQuestions} câu</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="rounded-lg p-2 text-text-muted hover:bg-surface hover:text-text transition-colors"
                                title="Chỉnh sửa"
                            >
                                <Settings2 className="size-5" />
                            </button>
                        </div>
                        <ul className="mt-4 space-y-2 border-t border-border pt-4">
                            {structure.sections.map((section, i) => (
                                <li key={i} className="flex items-center justify-between text-sm">
                                    <span className="text-text">{section.name}</span>
                                    <span className="text-text-muted">
                                        {section.count} câu · {section.time} phút
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}
