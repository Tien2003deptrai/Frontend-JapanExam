import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const LEVEL_OPTIONS = [
    { value: 'all', label: 'Tất cả' },
    { value: 'vocabulary', label: 'Từ vựng' },
    { value: 'grammar', label: 'Ngữ pháp' },
    { value: 'reading', label: 'Đọc hiểu' },
    { value: 'listening', label: 'Nghe' },
    { value: 'speaking', label: 'Nói' },
]

export default function ExamQuestionHeading({ exam }) {
    const navigate = useNavigate()

    return (
        <div className="flex  flex-col gap-4">
            <div className="flex justify-between gap-3">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate('/teacher/exam')}
                        className="inline-flex w-fit items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại đề thi
                    </button>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            Danh sách câu hỏi - {exam.title}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {exam.level} • {exam.totalQuestions} câu • {exam.duration} -{' '}
                            {exam.description}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 sm:items-center sm:justify-end">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm câu hỏi..."
                            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* bộ lọc modal */}
                    <Select>
                        <SelectTrigger className="w-48 rounded-lg border border-gray-300 px-4 py-2">
                            <SelectValue placeholder="Theo kĩ năng" />
                        </SelectTrigger>
                        <SelectContent>
                            {LEVEL_OPTIONS.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
