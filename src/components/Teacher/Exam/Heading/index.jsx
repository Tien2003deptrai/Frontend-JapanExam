import { FilterIcon, PlusIcon, Search } from 'lucide-react'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const TAB_ITEMS = [
    { value: 'n1', label: 'Đề N1' },
    { value: 'n2', label: 'Đề N2' },
    { value: 'n3', label: 'Đề N3' },
    { value: 'n4', label: 'Đề N4' },
    { value: 'n5', label: 'Đề N5' },
    { value: 'approved', label: 'Đã Duyệt' },
    { value: 'pending', label: 'Chưa Duyệt' },
]

const LEVEL_OPTIONS = [
    { value: 'all', label: 'Tất cả' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'yesterday', label: 'Hôm qua' },
    { value: 'this_week', label: 'Tuần này' },
    { value: 'last_week', label: 'Tuần trước' },
]

export default function ExamHeading({ searchTerm, setSearchTerm, setIsModalOpen }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1 flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold text-gray-900">Quản lý đề thi</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Thiết lập, lên lịch và theo dõi các đề thi JLPT cho học viên.
                    </p>
                </div>

                <div className="flex gap-3 sm:items-center sm:justify-end">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={event => setSearchTerm(event.target.value)}
                            placeholder="Tìm kiếm đề thi..."
                            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* bộ lọc modal */}
                    <Select>
                        <SelectTrigger className="w-48 rounded-lg border border-gray-300 px-4 py-2">
                            <SelectValue placeholder="Theo ngày tạo đề thi" />
                        </SelectTrigger>
                        <SelectContent>
                            {LEVEL_OPTIONS.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-black border border-gray-200 cursor-pointer"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Tạo đề thi
                    </button>
                </div>
            </div>

            <TabsList variant="line" className="h-auto w-fit flex-wrap gap-5 bg-transparent p-0">
                {TAB_ITEMS.map(({ value, label }) => (
                    <TabsTrigger
                        key={value}
                        value={value}
                        className="rounded-lg px-3 py-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
                    >
                        {label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </div>
    )
}
