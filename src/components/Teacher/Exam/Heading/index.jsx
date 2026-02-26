import { PlusIcon } from 'lucide-react'
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
    { value: 'approved', label: 'Đã duyệt' },
    { value: 'pending', label: 'Chưa duyệt' },
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

export default function ExamHeading({ setIsModalOpen }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                    <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                        Quản lý đề thi
                    </h1>
                    <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">
                        Thiết lập, lên lịch và theo dõi các đề thi JLPT cho học viên.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:justify-end">
                    <div className="w-full sm:w-[220px]">
                        <Select>
                            <SelectTrigger className="h-10 w-full rounded-lg border border-gray-300 px-3">
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
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-black transition hover:bg-gray-50 sm:w-auto"
                    >
                        <PlusIcon className="h-4 w-4 shrink-0" />
                        <span>Tạo đề thi</span>
                    </button>
                </div>
            </div>

            <div className="-mx-1 overflow-x-auto pb-1">
                <TabsList
                    variant="line"
                    className="inline-flex h-auto min-w-max gap-2 bg-transparent px-1 py-0"
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
