import { PlusIcon } from 'lucide-react'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function QuestionHeading({ setIsOpen }) {
    const TAB_ITEMS = [
        { value: 'all', label: 'Tất cả' },
        { value: 'Từ vựng', label: 'Từ vựng' },
        { value: 'Ngữ pháp', label: 'Ngữ pháp' },
        { value: 'Đọc hiểu', label: 'Đọc hiểu' },
        { value: 'Nghe', label: 'Nghe' },
        { value: 'Nói', label: 'Nói' },
    ]
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900">Quản lý câu hỏi</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 cursor-pointer"
                >
                    <PlusIcon className="size-4" /> Tạo câu hỏi
                </button>
            </div>
            <TabsList variant="line" className="h-auto w-fit flex-wrap gap-1 bg-transparent p-0">
                {TAB_ITEMS.map(({ value, label }) => (
                    <TabsTrigger
                        key={value}
                        value={value}
                        className="rounded-lg px-3 py-1.5 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
                    >
                        {label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </div>
    )
}
