import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { PlusIcon, Search } from 'lucide-react'

const LEVEL_OPTIONS = [
    { value: 'all', label: 'Tất cả' },
    { value: 'vocabulary', label: 'Từ vựng' },
    { value: 'grammar', label: 'Ngữ pháp' },
    { value: 'reading', label: 'Đọc hiểu' },
    { value: 'listening', label: 'Nghe' },
    { value: 'speaking', label: 'Nói' },
]

export default function ExamQuestionHeading({ exam }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3">
                <div className="flex-1 flex flex-col gap-2">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Quay lại đề thi - Danh sách câu hỏi - {exam.title}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {exam.level} • {exam.totalQuestions} câu • {exam.duration} -{' '}
                        {exam.description}
                    </p>
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

                    {/* thêm câu hỏi */}
                    <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-black border border-gray-200 cursor-pointer"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Thêm câu hỏi
                    </button>
                </div>
            </div>
        </div>
    )
}
