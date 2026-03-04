import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Leaderboard({ level, data = [], className = '' }) {
    return (
        <div
            className={cn(
                'bg-white rounded-lg border border-gray-200 overflow-hidden',
                className,
            )}
        >
            <div className="flex items-center gap-2 p-4 border-b border-gray-100">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="text-base font-semibold text-gray-800">
                    Bảng xếp hạng {level}
                </h3>
            </div>

            <ul className="divide-y divide-gray-100">
                {data.map((entry) => (
                    <li
                        key={entry.rank}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-sm text-gray-700">
                            <span className="font-semibold mr-1">
                                {entry.rank}.
                            </span>
                            {entry.name}
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                            {entry.score}
                        </span>
                    </li>
                ))}
            </ul>

            {data.length === 0 && (
                <div className="p-6 text-center text-sm text-gray-400">
                    Chưa có dữ liệu xếp hạng
                </div>
            )}
        </div>
    )
}
