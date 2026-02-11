import { cn } from '@/lib/utils'

export default function CourseCard({ className, children, data, ...props }) {
    return (
        <div
            className={cn(
                'group w-full rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
                className
            )}
            {...props}
        >
            <div className="flex gap-4 p-3">
                <div className="relative h-[80px] w-[70px] shrink-0 overflow-hidden rounded-md bg-gray-100">
                    <img
                        src={data?.thumbnail}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                </div>

                <div className="min-w-0 flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="line-clamp-1 text-base sm:text-lg font-semibold text-gray-900">
                                {data?.title || 'Untitled'}
                            </h3>

                            <p className="mt-1 line-clamp-1 text-xs sm:text-sm text-gray-500">
                                {data?.category ? `${data.category} • ` : ''}
                                {data?.lessons ? `${data.lessons} lessons` : '—'} •{' '}
                                {data?.duration || '—'}
                            </p>
                        </div>

                        {data?.level && (
                            <span className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
                                {data.level}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        {data?.description && (
                            <p className="text-sm text-gray-600 leading-relaxed truncate">
                                {data.description}
                            </p>
                        )}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
