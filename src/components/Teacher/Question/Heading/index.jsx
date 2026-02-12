import { PlusIcon, Search, FileUp, PenSquare } from 'lucide-react'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function QuestionHeading({ onOpenAdd, onOpenImport }) {
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
                <div className="flex items-center gap-2">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm câu hỏi..."
                            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 cursor-pointer"
                            >
                                <PlusIcon className="size-4" /> Tạo câu hỏi
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[220px]">
                            <DropdownMenuItem
                                inset={false}
                                className="cursor-pointer h-11"
                                onSelect={() => onOpenAdd?.()}
                            >
                                <PenSquare className="size-5" />
                                Tạo mới
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                inset={false}
                                className="cursor-pointer h-11"
                                onSelect={() => onOpenImport?.()}
                            >
                                <FileUp className="size-5" />
                                Thêm bộ đề
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
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
