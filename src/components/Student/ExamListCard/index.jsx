import { Clock, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export default function ExamListCard({ exam, className }) {
    return (
        <div
            className={cn(
                'bg-white rounded-lg border border-gray-200 p-5 flex flex-col gap-3 shadow-sm',
                className
            )}
        >
            <h3 className="text-base font-semibold text-gray-800 leading-snug">{exam.title}</h3>

            <div className="flex flex-col gap-1.5 text-sm text-gray-500 border-b border-gray-200 pb-5">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{exam.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{exam.attempts.toLocaleString('vi-VN')} người đã thi</span>
                </div>
            </div>

            <div className="mt-auto pt-2 text-center">
                <Link
                    to={`/student/exam/${exam.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-md uppercase tracking-wide transition-colors"
                >
                    Bắt đầu thi
                </Link>
            </div>
        </div>
    )
}
