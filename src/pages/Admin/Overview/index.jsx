import { LoadingSpinner } from '@/components/ui'
import { adminService } from '@/services/AdminService'
import {
    BookOpen,
    CheckCircle2,
    ClipboardList,
    GraduationCap,
    Layers,
    TrendingUp,
    Users,
    XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const LEVEL_COLORS = {
    N5: 'bg-sky-500',
    N4: 'bg-emerald-500',
    N3: 'bg-violet-500',
    N2: 'bg-amber-500',
    N1: 'bg-rose-500',
}

function StatCard({ icon: Icon, label, value, sub, gradient }) {
    return (
        <div className={`relative rounded-2xl p-5 shadow-sm overflow-hidden ${gradient}`}>
            <div className="relative z-10">
                <div className="inline-flex size-10 items-center justify-center rounded-xl bg-white/20 text-white mb-3">
                    <Icon className="size-5" />
                </div>
                <p className="text-2xl font-black tracking-tight text-white">{value}</p>
                <p className="text-xs font-medium text-white/70 mt-0.5">{label}</p>
                {sub && <p className="text-[10px] text-white/50 mt-0.5">{sub}</p>}
            </div>
            <div className="absolute -right-4 -bottom-4 size-24 rounded-full bg-white/10" />
        </div>
    )
}

function formatDateTime(dateStr) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default function AdminOverviewPage() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [chartData, setChartData] = useState([])
    const [chartPeriod, setChartPeriod] = useState('week')
    const navigate = useNavigate()

    useEffect(() => {
        loadStats()
    }, [])

    useEffect(() => {
        loadChart()
    }, [chartPeriod])

    const loadStats = async () => {
        try {
            setLoading(true)
            const res = await adminService.getStatistics()
            setStats(res.data?.data || res.data)
        } catch {
            setStats(null)
        } finally {
            setLoading(false)
        }
    }

    const loadChart = async () => {
        try {
            const res = await adminService.getAttemptChart({ period: chartPeriod, count: 12 })
            const raw = res.data?.data || res.data || []
            setChartData(raw.map(d => ({ label: d._id, 'Lượt thi': d.count })))
        } catch {
            setChartData([])
        }
    }

    if (loading)
        return (
            <div className="flex justify-center py-24">
                <LoadingSpinner />
            </div>
        )

    if (!stats)
        return (
            <div className="text-center py-24 text-text-muted">
                <p className="font-semibold">Không thể tải dữ liệu.</p>
                <button onClick={loadStats} className="mt-2 text-sm text-primary hover:underline">
                    Thử lại
                </button>
            </div>
        )

    const { users, exams, questions, attempts, recentAttempts = [] } = stats

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-2xl font-bold text-text">Tổng quan hệ thống</h1>
                <p className="mt-1 text-sm text-text-light">Dữ liệu thống kê thời gian thực.</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard
                    icon={Users}
                    label="Tổng người dùng"
                    value={users?.total || 0}
                    sub={`${users?.creators || 0} người tạo đề`}
                    gradient="bg-linear-to-br from-primary to-primary-dark"
                />
                <StatCard
                    icon={BookOpen}
                    label="Đề thi"
                    value={exams?.total || 0}
                    gradient="bg-linear-to-br from-emerald-500 to-emerald-600"
                />
                <StatCard
                    icon={Layers}
                    label="Nhóm câu hỏi"
                    value={questions?.blocks || 0}
                    sub={`${questions?.total || 0} câu hỏi`}
                    gradient="bg-linear-to-br from-violet-500 to-purple-600"
                />
                <StatCard
                    icon={ClipboardList}
                    label="Lượt thi"
                    value={attempts?.total || 0}
                    gradient="bg-linear-to-br from-amber-400 to-orange-500"
                />
                <StatCard
                    icon={GraduationCap}
                    label="Người học"
                    value={(users?.total || 0) - (users?.creators || 0)}
                    gradient="bg-linear-to-br from-cta to-sky-600"
                />
            </div>

            {/* Two columns: Exams by level + Questions by section */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Exams by level */}
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <h2 className="font-heading text-base font-bold text-text mb-4 flex items-center gap-2">
                        <BookOpen className="size-4 text-primary" /> Đề thi theo cấp độ
                    </h2>
                    {(exams?.byLevel || []).length === 0 ? (
                        <p className="text-sm text-text-muted py-4 text-center">
                            Chưa có đề thi nào.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {exams.byLevel.map(lv => {
                                const pct =
                                    exams.total > 0 ? Math.round((lv.count / exams.total) * 100) : 0
                                return (
                                    <div key={lv._id} className="flex items-center gap-3">
                                        <span
                                            className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-black text-white ${LEVEL_COLORS[lv._id] || 'bg-gray-400'}`}
                                        >
                                            {lv._id}
                                        </span>
                                        <div className="flex-1">
                                            <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${LEVEL_COLORS[lv._id] || 'bg-gray-400'} transition-all duration-500`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-text w-12 text-right">
                                            {lv.count}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Questions by section */}
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <h2 className="font-heading text-base font-bold text-text mb-4 flex items-center gap-2">
                        <Layers className="size-4 text-primary" /> Khối câu hỏi theo phần
                    </h2>
                    {(questions?.bySection || []).length === 0 ? (
                        <p className="text-sm text-text-muted py-4 text-center">
                            Chưa có câu hỏi nào.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {questions.bySection.map(sec => (
                                <div
                                    key={sec._id}
                                    className="flex items-center justify-between rounded-xl bg-surface px-4 py-3"
                                >
                                    <span className="text-sm font-medium text-text capitalize">
                                        {sec._id}
                                    </span>
                                    <span className="text-sm font-bold text-text">{sec.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Attempt chart */}
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-base font-bold text-text flex items-center gap-2">
                        <TrendingUp className="size-4 text-primary" /> Lượt thi theo{' '}
                        {chartPeriod === 'week' ? 'tuần' : 'tháng'}
                    </h2>
                    <div className="flex gap-1 rounded-lg bg-surface p-1">
                        {[
                            { key: 'week', label: 'Tuần' },
                            { key: 'month', label: 'Tháng' },
                        ].map(opt => (
                            <button
                                key={opt.key}
                                onClick={() => setChartPeriod(opt.key)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                    chartPeriod === opt.key
                                        ? 'bg-white text-primary shadow-sm'
                                        : 'text-text-muted hover:text-text'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
                {chartData.length === 0 ? (
                    <p className="text-sm text-text-muted py-8 text-center">Chưa có dữ liệu.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: 12,
                                    border: '1px solid #E5E7EB',
                                    fontSize: 13,
                                }}
                            />
                            <Bar dataKey="Lượt thi" fill="#0891B2" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Recent attempts */}
            <div className="rounded-2xl border border-border bg-white shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <h2 className="font-heading text-base font-bold text-text flex items-center gap-2">
                        <TrendingUp className="size-4 text-primary" /> Lượt thi gần đây
                    </h2>
                </div>
                {recentAttempts.length === 0 ? (
                    <p className="text-sm text-text-muted py-8 text-center">
                        Chưa có lượt thi nào.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border bg-surface/50">
                                    <th className="px-5 py-3 font-semibold text-text-muted">
                                        Người học
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-text-muted">
                                        Đề thi
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-text-muted">
                                        Level
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-text-muted">
                                        Điểm
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-text-muted">
                                        Kết quả
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-text-muted">
                                        Thời gian
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentAttempts.map(att => (
                                    <tr
                                        key={att._id}
                                        className="border-b border-border/50 hover:bg-background/50 transition"
                                    >
                                        <td className="px-5 py-3">
                                            <div>
                                                <p className="font-medium text-text">
                                                    {att.user?.fullName || '-'}
                                                </p>
                                                <p className="text-xs text-text-muted">
                                                    {att.user?.email || ''}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-text">
                                            {att.exam?.title || att.exam?.examCode || '-'}
                                        </td>
                                        <td className="px-5 py-3">
                                            {att.exam?.level && (
                                                <span
                                                    className={`px-2 py-0.5 rounded-lg text-xs font-black text-white ${LEVEL_COLORS[att.exam.level] || 'bg-gray-400'}`}
                                                >
                                                    {att.exam.level}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3 font-bold text-text">
                                            {att.results?.totalScore ?? '-'}
                                        </td>
                                        <td className="px-5 py-3">
                                            {att.results?.passed ? (
                                                <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                                    <CheckCircle2 className="size-3.5" /> Đạt
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-red-500 text-xs font-bold">
                                                    <XCircle className="size-3.5" /> Chưa đạt
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3 text-text-muted text-xs">
                                            {formatDateTime(att.startTime)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
