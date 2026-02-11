import { cn } from '@/lib/utils'

const statusClasses = {
    published: 'bg-green-50 text-green-600 border-green-200',
    draft: 'bg-amber-50 text-amber-600 border-amber-200',
}

export default function ExamCard({ data, children, className }) {
    if (!data) return null

    const statusClass =
        statusClasses[data.status] ||
        'bg-gray-50 text-gray-600 border-gray-200'

    return (
        <div
            className={cn(
                'group relative flex w-full gap-4 rounded-lg bg-white p-4 border-2 border-transparent hover:border-primary cursor-pointer',
                className
            )}
        >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                <img
                    src={data.thumbnail}
                    alt={data.title}
                    className="h-full w-full object-cover"
                />
                <span className="absolute bottom-1 left-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white">
                    {data.level}
                </span>
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
                        {data.title}
                    </h3>

                    <span
                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusClass}`}
                    >
                        {data.status === 'published'
                            ? 'Đã xuất bản'
                            : 'Bản nháp'}
                    </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                    {data.schedule}
                </p>

                <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
                    <span>{data.duration}</span>
                    <span className="text-gray-300">•</span>
                    <span>{data.totalQuestions} câu</span>
                </div>
            </div>

            {/* Dropdown */}
            <div className="absolute right-3 bottom-3">
                {children}
            </div>
        </div>
    )
}
