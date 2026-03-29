import { LoadingSpinner } from '@/components/ui'
import { bookmarkService } from '@/services/BookmarkService'
import {
    AlertCircle,
    Bookmark,
    BookmarkX,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const SECTION_NAME = {
    vocabulary: 'Từ vựng',
    grammar: 'Ngữ pháp',
    reading: 'Đọc hiểu',
    listening: 'Nghe hiểu',
}
const SECTION_COLOR = {
    vocabulary: 'bg-sky-100 text-sky-700',
    grammar: 'bg-violet-100 text-violet-700',
    reading: 'bg-emerald-100 text-emerald-700',
    listening: 'bg-amber-100 text-amber-700',
}
const SECTION_FILTERS = [
    { value: null, label: 'Tất cả' },
    { value: 'vocabulary', label: 'Từ vựng' },
    { value: 'grammar', label: 'Ngữ pháp' },
    { value: 'reading', label: 'Đọc hiểu' },
    { value: 'listening', label: 'Nghe hiểu' },
]

export default function BookmarksPage() {
    const [bookmarks, setBookmarks] = useState([])
    const [loading, setLoading] = useState(true)
    const [sectionType, setSectionType] = useState(null)
    const [expandedId, setExpandedId] = useState(null)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        loadBookmarks()
    }, [sectionType])

    const loadBookmarks = async () => {
        try {
            setLoading(true)
            const res = await bookmarkService.getMyBookmarks({ sectionType, limit: 50 })
            setBookmarks(res.data || [])
            setTotal(res.total || 0)
        } catch {
            setBookmarks([])
        } finally {
            setLoading(false)
        }
    }

    const removeBookmark = async item => {
        try {
            await bookmarkService.toggle({
                examId: item.examId,
                questionId: item.questionId,
                sectionType: item.sectionType,
            })
            setBookmarks(prev => prev.filter(b => b._id !== item._id))
            setTotal(prev => prev - 1)
        } catch {
            /* silent */
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 rounded-2xl bg-amber-100 flex items-center justify-center">
                        <Bookmark className="size-5 text-amber-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-text tracking-tight">
                            Câu hỏi đã lưu
                        </h1>
                        <p className="text-sm text-text-muted">{total} câu hỏi</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {SECTION_FILTERS.map(f => (
                        <button
                            key={f.label}
                            onClick={() => setSectionType(f.value)}
                            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                                sectionType === f.value
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white text-text-light border border-border hover:bg-surface'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner />
                    </div>
                ) : bookmarks.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-border bg-white p-16 text-center">
                        <Bookmark className="size-10 text-text-muted/30 mx-auto mb-3" />
                        <p className="font-semibold text-text-muted">Chưa lưu câu hỏi nào</p>
                        <p className="text-sm text-text-muted/70 mt-2 leading-relaxed">
                            Bạn có thể lưu câu hỏi bằng cách nhấn biểu tượng{' '}
                            <Bookmark className="inline size-3.5 -mt-0.5" /> bên cạnh mỗi câu hỏi
                            khi:
                        </p>
                        <ul className="text-sm text-text-muted/70 mt-2 space-y-1">
                            <li>
                                Đang <strong>làm bài thi</strong> (cạnh nút cờ đánh dấu)
                            </li>
                            <li>
                                Xem <strong>kết quả bài thi</strong> (phần chi tiết từng câu)
                            </li>
                            <li>
                                Trang <strong>Câu sai</strong> (ôn tập câu trả lời sai)
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookmarks.map((item, idx) => {
                            const q = item.question
                            if (!q) return null
                            const isExpanded = expandedId === item._id

                            return (
                                <div
                                    key={item._id}
                                    className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm"
                                >
                                    <div
                                        className="p-4 flex items-start gap-3 cursor-pointer"
                                        onClick={() => setExpandedId(isExpanded ? null : item._id)}
                                    >
                                        <span className="size-8 rounded-lg bg-surface flex items-center justify-center text-sm font-bold text-text-muted shrink-0">
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-text">
                                                {q.questionText}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${SECTION_COLOR[item.sectionType] || 'bg-gray-100 text-gray-600'}`}
                                                >
                                                    {SECTION_NAME[item.sectionType] ||
                                                        item.sectionType}
                                                </span>
                                                {item.examLevel && (
                                                    <span className="text-[10px] text-text-muted">
                                                        {item.examLevel}
                                                    </span>
                                                )}
                                                {item.examTitle && (
                                                    <span className="text-[10px] text-text-muted truncate">
                                                        · {item.examTitle}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation()
                                                    removeBookmark(item)
                                                }}
                                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition"
                                                title="Bỏ lưu"
                                            >
                                                <BookmarkX className="size-4" />
                                            </button>
                                            {isExpanded ? (
                                                <ChevronUp className="size-4 text-text-muted" />
                                            ) : (
                                                <ChevronDown className="size-4 text-text-muted" />
                                            )}
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="px-4 pb-4 space-y-2">
                                            {q.options?.map(opt => (
                                                <div
                                                    key={opt.label}
                                                    className={`px-4 py-2.5 rounded-xl border text-sm ${
                                                        opt.label === q.correctAnswer
                                                            ? 'border-emerald-300 bg-emerald-50'
                                                            : 'border-border bg-white'
                                                    }`}
                                                >
                                                    <span className="font-bold mr-2">
                                                        {opt.label}.
                                                    </span>
                                                    {opt.text}
                                                    {opt.label === q.correctAnswer && (
                                                        <CheckCircle2 className="inline size-4 text-emerald-500 ml-2" />
                                                    )}
                                                </div>
                                            ))}
                                            {q.explanation && (
                                                <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                                                    <p className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                                                        <AlertCircle className="size-3.5" />
                                                        Giải thích
                                                    </p>
                                                    <div
                                                        className="text-xs text-blue-800 leading-relaxed"
                                                        dangerouslySetInnerHTML={{
                                                            __html: q.explanation,
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
