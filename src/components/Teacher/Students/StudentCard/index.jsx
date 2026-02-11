import { cn } from '@/lib/utils'

export default function StudentCard({ student, children, className, ...props }) {
    if (!student) return null

    return (
        <div
            className={cn(
                'group flex w-full flex-col rounded-lg border-transparent bg-white p-4 transition border-2 hover:border-primary',
                className
            )}
            {...props}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full" />
                    <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-gray-900">{student.name}</p>
                        <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-3 py-0.5 text-xs font-medium text-blue-700">
                            {student.class}
                        </span>
                    </div>
                </div>

                <div className="text-gray-500">{children}</div>
            </div>

            <div className="mt-4 flex flex-col gap-4">
                <div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Tiến độ</span>
                        <span className="font-medium text-gray-900">{student.progress}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-gray-200">
                        <div
                            className="h-2 rounded-full bg-green-500 transition-all duration-300"
                            style={{ width: `${student.progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
