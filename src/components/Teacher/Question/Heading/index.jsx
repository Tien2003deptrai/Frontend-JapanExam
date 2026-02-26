import { PlusIcon, Search, FileUp, PenSquare } from 'lucide-react'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const TAB_ITEMS = [
    { value: 'all', label: 'Tất cả' },
    { value: 'Từ vựng', label: 'Từ vựng' },
    { value: 'Ngữ pháp', label: 'Ngữ pháp' },
    { value: 'Đọc hiểu', label: 'Đọc hiểu' },
    { value: 'Nghe', label: 'Nghe' },
    { value: 'Nói', label: 'Nói' },
]

export default function QuestionHeading({ onOpenAdd, onOpenImport }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">
                        Quản lý câu hỏi
                    </h1>
                </div>

                <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:min-w-[420px] lg:justify-end">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            inputMode="search"
                            placeholder="Tìm kiếm câu hỏi..."
                            aria-label="Tìm kiếm câu hỏi"
                            className="h-10 w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50 sm:w-auto sm:px-4"
                            >
                                <PlusIcon className="size-4 shrink-0" />
                                <span>Tạo câu hỏi</span>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-[220px]">
                            <DropdownMenuItem
                                inset={false}
                                className="flex h-11 cursor-pointer items-center gap-2"
                                onSelect={() => onOpenAdd?.()}
                            >
                                <PenSquare className="size-4" />
                                <span>Tạo mới</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                inset={false}
                                className="flex h-11 cursor-pointer items-center gap-2"
                                onSelect={() => onOpenImport?.()}
                            >
                                <FileUp className="size-4" />
                                <span>Thêm bộ đề</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="-mx-1 overflow-x-auto pb-1">
                <TabsList
                    variant="line"
                    className="inline-flex h-auto min-w-max gap-1 bg-transparent px-1 py-0"
                >
                    {TAB_ITEMS.map(({ value, label }) => (
                        <TabsTrigger
                            key={value}
                            value={value}
                            className="shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
                        >
                            {label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
        </div>
    )
}
