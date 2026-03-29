import { LoadingSpinner } from '@/components/ui'
import { examAttemptService } from '@/services/ExamAttemptService'
import useAuthStore from '@/stores/authStore'
import { Crown, Medal, Trophy, TrendingUp, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

const PERIODS = [
    { value: 'week', label: 'Tuần này' },
    { value: 'month', label: 'Tháng này' },
    { value: null, label: 'Tất cả' },
]

const LEVELS = [null, 'N5', 'N4', 'N3', 'N2', 'N1']

const TOP_ICONS = [
    { icon: Crown, bg: 'bg-amber-100 text-amber-600 ring-amber-300', text: 'text-amber-600' },
    { icon: Medal, bg: 'bg-slate-100 text-slate-500 ring-slate-300', text: 'text-slate-500' },
    { icon: Medal, bg: 'bg-orange-100 text-orange-500 ring-orange-300', text: 'text-orange-500' },
]

export default function LeaderboardPage() {
    const { user } = useAuthStore()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState('week')
    const [level, setLevel] = useState(null)

    useEffect(() => { loadLeaderboard() }, [period, level])

    const loadLeaderboard = async () => {
        try {
            setLoading(true)
            const res = await examAttemptService.getLeaderboard({ period, level })
            setData(res.data || [])
        } catch { setData([]) }
        finally { setLoading(false) }
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 rounded-2xl bg-amber-100 flex items-center justify-center">
                        <Trophy className="size-5 text-amber-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-text tracking-tight">Bảng xếp hạng</h1>
                        <p className="text-sm text-text-muted">Xem thứ hạng của bạn so với người học khác</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {PERIODS.map(p => (
                        <button key={p.label} onClick={() => setPeriod(p.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                period === p.value ? 'bg-primary text-white shadow-md' : 'bg-white text-text-light border border-border hover:bg-surface'
                            }`}>
                            {p.label}
                        </button>
                    ))}
                    <span className="w-px h-8 bg-border self-center mx-1" />
                    {LEVELS.map(l => (
                        <button key={l || 'all'} onClick={() => setLevel(l)}
                            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                                level === l ? 'bg-cta text-white shadow-md' : 'bg-white text-text-light border border-border hover:bg-surface'
                            }`}>
                            {l || 'Tất cả'}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><LoadingSpinner /></div>
                ) : data.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-border bg-white p-16 text-center">
                        <Users className="size-10 text-text-muted/30 mx-auto mb-3" />
                        <p className="font-semibold text-text-muted">Chưa có dữ liệu xếp hạng</p>
                        <p className="text-sm text-text-muted/70">Hãy hoàn thành bài thi để xuất hiện trên bảng xếp hạng.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {data.map((entry, idx) => {
                            const isMe = entry._id === user?._id
                            const topCfg = TOP_ICONS[idx]
                            return (
                                <div key={entry._id}
                                    className={`rounded-2xl border p-4 sm:p-5 flex items-center gap-4 transition-all ${
                                        isMe ? 'border-primary/30 bg-primary/5 shadow-md ring-1 ring-primary/20' : 'border-border bg-white hover:shadow-sm'
                                    }`}>
                                    {/* Rank */}
                                    <div className="shrink-0">
                                        {idx < 3 ? (
                                            <div className={`size-10 rounded-xl flex items-center justify-center ring-1 ${topCfg.bg}`}>
                                                <topCfg.icon className="size-5" />
                                            </div>
                                        ) : (
                                            <div className="size-10 rounded-xl bg-surface flex items-center justify-center text-sm font-bold text-text-muted">
                                                {idx + 1}
                                            </div>
                                        )}
                                    </div>

                                    {/* Avatar + Name */}
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="size-10 rounded-xl bg-linear-to-br from-primary/20 to-cta/20 flex items-center justify-center shrink-0">
                                            {entry.user?.avatar
                                                ? <img src={entry.user.avatar} className="size-full object-cover rounded-xl" alt="" />
                                                : <span className="text-sm font-bold text-primary">{entry.user?.fullName?.charAt(0) || '?'}</span>
                                            }
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`font-semibold text-sm truncate ${isMe ? 'text-primary' : 'text-text'}`}>
                                                {entry.user?.fullName || 'Ẩn danh'}
                                                {isMe && <span className="ml-1.5 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Bạn</span>}
                                            </p>
                                            <p className="text-xs text-text-muted">{entry.totalAttempts} bài · {entry.totalPassed} đạt</p>
                                        </div>
                                    </div>

                                    {/* Score */}
                                    <div className="text-right shrink-0">
                                        <p className={`text-xl font-black ${idx < 3 ? topCfg?.text : 'text-text'}`}>{entry.avgPercentage}%</p>
                                        <p className="text-[10px] text-text-muted font-medium">Điểm TB</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}