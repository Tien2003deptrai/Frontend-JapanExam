import { Activity, BookOpen, ClipboardList, GraduationCap, TrendingUp, Users } from 'lucide-react'

const STATS = [
    {
        label: 'Giáo viên',
        value: 24,
        icon: Users,
        color: 'bg-primary/10 text-primary',
        change: '+3 tháng này',
    },
    {
        label: 'Học viên',
        value: 356,
        icon: GraduationCap,
        color: 'bg-cta/10 text-cta',
        change: '+28 tháng này',
    },
    {
        label: 'Đề thi',
        value: 48,
        icon: BookOpen,
        color: 'bg-secondary/10 text-secondary',
        change: '+5 tháng này',
    },
    {
        label: 'Lượt thi',
        value: 1240,
        icon: ClipboardList,
        color: 'bg-warning/10 text-warning',
        change: '+180 tháng này',
    },
]

const RECENT_ACTIVITIES = [
    { text: 'Giáo viên Tanaka tạo đề thi N3 mới', time: '5 phút trước' },
    { text: 'Học viên Nguyễn Văn A hoàn thành đề N5-001', time: '12 phút trước' },
    { text: '3 học viên mới đăng ký tài khoản', time: '1 giờ trước' },
    { text: 'Giáo viên Yamada cập nhật ngân hàng câu hỏi N4', time: '2 giờ trước' },
    { text: 'Hệ thống backup dữ liệu tự động hoàn tất', time: '6 giờ trước' },
]

export default function AdminOverviewPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-heading text-2xl font-bold text-text">Tổng quan hệ thống</h1>
                <p className="mt-1 text-sm text-text-light">
                    Thống kê và hoạt động gần đây của hệ thống.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {STATS.map(stat => (
                    <div
                        key={stat.label}
                        className="rounded-xl border border-border bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-text-light">{stat.label}</p>
                            <div className={`rounded-lg p-2 ${stat.color}`}>
                                <stat.icon className="size-5" />
                            </div>
                        </div>
                        <p className="mt-2 text-3xl font-bold text-text">
                            {stat.value.toLocaleString()}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-cta">
                            <TrendingUp className="size-3" />
                            {stat.change}
                        </p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-border bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-border px-5 py-4">
                    <Activity className="size-5 text-primary" />
                    <h2 className="font-heading text-lg font-semibold text-text">
                        Hoạt động gần đây
                    </h2>
                </div>
                <ul className="divide-y divide-border">
                    {RECENT_ACTIVITIES.map((activity, i) => (
                        <li key={i} className="flex items-center justify-between px-5 py-3.5">
                            <div className="flex items-center gap-3">
                                <span className="size-2 rounded-full bg-primary" />
                                <span className="text-sm text-text">{activity.text}</span>
                            </div>
                            <span className="shrink-0 text-xs text-text-muted">
                                {activity.time}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
