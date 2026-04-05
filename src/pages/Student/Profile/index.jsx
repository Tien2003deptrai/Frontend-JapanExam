import { LoadingSpinner } from '@/components/ui'
import { authService } from '@/services/AuthService'
import { examAttemptService } from '@/services/ExamAttemptService'
import { gamificationService } from '@/services/GamificationService'
import useAuthStore from '@/stores/authStore'
import { formatTotalTime } from '@/utils/helpers'
import {
    AlertCircle,
    Award,
    BarChart3,
    BookOpen,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    Edit3,
    Flame,
    LogOut,
    Mail,
    Phone,
    Save,
    Sparkles,
    Star,
    Target,
    TrendingUp,
    Trophy,
    X,
    XCircle,
    Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

const LEVEL_CONFIG = {
    N5: { light: 'bg-sky-50 text-sky-700 ring-sky-200', bar: 'bg-sky-500', color: '#0ea5e9' },
    N4: {
        light: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        bar: 'bg-emerald-500',
        color: '#10b981',
    },
    N3: {
        light: 'bg-violet-50 text-violet-700 ring-violet-200',
        bar: 'bg-violet-500',
        color: '#8b5cf6',
    },
    N2: {
        light: 'bg-amber-50 text-amber-700 ring-amber-200',
        bar: 'bg-amber-500',
        color: '#f59e0b',
    },
    N1: { light: 'bg-rose-50 text-rose-700 ring-rose-200', bar: 'bg-rose-500', color: '#f43f5e' },
}

const SECTION_NAME = {
    vocabulary: 'Từ vựng',
    grammar: 'Ngữ pháp',
    reading: 'Đọc hiểu',
    listening: 'Nghe hiểu',
}
const SECTION_COLOR = {
    vocabulary: '#0ea5e9',
    grammar: '#8b5cf6',
    reading: '#10b981',
    listening: '#f59e0b',
}

const RANK_CONFIG = {
    A: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300',
    B: 'bg-sky-100 text-sky-700 ring-1 ring-sky-300',
    C: 'bg-amber-100 text-amber-700 ring-1 ring-amber-300',
    D: 'bg-orange-100 text-orange-700 ring-1 ring-orange-300',
    F: 'bg-red-100 text-red-700 ring-1 ring-red-300',
}

function formatDuration(seconds) {
    if (!seconds) return '-'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}ph`
    return m > 0 ? `${m}ph${s > 0 ? ` ${s}s` : ''}` : `${s}s`
}

function formatDateShort(dateStr) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
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

function StatCard({ icon: Icon, label, value, gradient, iconBg }) {
    return (
        <div className={`relative rounded-2xl p-5 shadow-sm overflow-hidden ${gradient}`}>
            <div className="relative z-10">
                <div
                    className={`inline-flex size-10 items-center justify-center rounded-xl ${iconBg} mb-3`}
                >
                    <Icon className="size-5" />
                </div>
                <p className="text-2xl font-black tracking-tight text-white">{value}</p>
                <p className="text-xs font-medium text-white/70 mt-0.5">{label}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 size-24 rounded-full bg-white/10" />
            <div className="absolute -right-2 -top-6 size-16 rounded-full bg-white/5" />
        </div>
    )
}

/* ─── Tab button ─── */
function TabButton({ active, children, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                active
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-surface text-text-light hover:bg-border/30'
            }`}
        >
            {children}
        </button>
    )
}

/* ─── Custom tooltip for charts ─── */
function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl bg-white border border-border shadow-lg p-3 text-xs">
            <p className="font-semibold text-text mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }} className="font-medium">
                    {p.name}: {typeof p.value === 'number' ? Math.round(p.value) : p.value}%
                </p>
            ))}
        </div>
    )
}

export default function ProfilePage() {
    const { user, logout, login: updateUser } = useAuthStore()
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({ fullName: '', phoneNumber: '' })
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')
    const [studyGoal, setStudyGoal] = useState(null)
    const [achievements, setAchievements] = useState([])

    useEffect(() => {
        loadProfile()
        loadStats()
        loadAchievements()
        loadStudyGoal()
    }, [])

    useEffect(() => {
        if (user) setForm({ fullName: user.fullName || '', phoneNumber: user.phoneNumber || '' })
    }, [user])

    const loadProfile = async () => {
        try {
            const res = await authService.getMe()
            const freshUser = res.data?.data?.user || res.data?.data
            if (freshUser) updateUser(freshUser, useAuthStore.getState().token)
        } catch {
            /* silent */
        }
    }

    const loadStats = async () => {
        try {
            setLoading(true)
            const res = await examAttemptService.getProfileStats()
            setStats(res.data)
        } catch {
            setStats(null)
        } finally {
            setLoading(false)
        }
    }

    const loadAchievements = async () => {
        try {
            const res = await gamificationService.getAchievements()
            setAchievements(res.data || [])
            // Also check for new ones
            await gamificationService.checkNewAchievements()
        } catch {
            /* silent */
        }
    }

    const loadStudyGoal = async () => {
        try {
            const res = await gamificationService.getStudyGoal()
            setStudyGoal(res.data)
        } catch {
            /* silent */
        }
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            const res = await authService.updateProfile(form)
            const u = res.data?.data?.user || res.data?.data
            if (u) updateUser(u, useAuthStore.getState().token)
            setEditing(false)
        } catch {
            /* silent */
        } finally {
            setSaving(false)
        }
    }

    const summary = stats?.summary || {}
    const byLevel = stats?.byLevel || []
    const recentAttempts = stats?.recentAttempts || []
    const streak = stats?.streak || 0
    const charts = stats?.charts || {}
    const comparison = stats?.comparison
    const passRate = summary.totalAttempts
        ? Math.round((summary.totalPassed / summary.totalAttempts) * 100)
        : 0
    const avatarLetter = user?.fullName?.charAt(0)?.toUpperCase() || 'U'
    const roleLabel =
        user?.role === 'admin' ? 'Admin' : user?.role === 'creator' ? 'Người tạo đề' : 'Người học'

    // Prepare chart data
    const dailyChartData = (charts.scoresByDay || []).map(d => ({
        date: d._id.slice(5), // MM-DD
        'Trung bình': Math.round(d.avgPercentage),
        'Cao nhất': Math.round(d.bestPercentage),
        count: d.count,
    }))

    const sectionChartData = (charts.scoresBySection || []).map(s => ({
        section: SECTION_NAME[s._id] || s._id,
        score: Math.round(s.avgScore),
        fullMark: 100,
    }))

    const accuracyData = (charts.accuracyByLevel || []).map(a => ({
        level: a._id,
        Đúng: a.totalCorrect,
        Sai: a.totalWrong,
        'Bỏ qua': a.totalSkipped,
    }))

    const ACCURACY_COLORS = ['#10b981', '#f43f5e', '#94a3b8']

    const earnedCount = achievements.filter(a => a.earned).length

    const ICON_MAP = {
        rocket: Zap,
        swords: Award,
        flame: Flame,
        zap: Zap,
        'calendar-check': Calendar,
        'calendar-heart': Calendar,
        crown: Trophy,
        'check-circle': CheckCircle2,
        award: Award,
        star: Star,
        medal: Trophy,
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
            {/* Hero */}
            <div className="relative h-52 bg-linear-to-br from-primary-dark via-primary to-cta overflow-hidden">
                <svg
                    className="absolute inset-0 w-full h-full opacity-10"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid slice"
                >
                    <defs>
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path
                                d="M 10 0 L 0 0 0 10"
                                fill="none"
                                stroke="white"
                                strokeWidth="0.5"
                            />
                        </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                </svg>
                <div className="absolute top-6 right-12 size-32 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute bottom-0 left-1/3 size-40 rounded-full bg-white/5 blur-3xl" />
            </div>

            <div className="max-w-5xl mx-auto px-4 pb-16">
                {/* Profile card */}
                <div className="-mt-20 relative z-10">
                    <div className="bg-white rounded-3xl shadow-xl border border-border/50 p-6">
                        <div className="flex flex-col sm:flex-row gap-5 sm:items-start">
                            <div className="relative shrink-0">
                                <div className="size-28 rounded-2xl ring-4 ring-white shadow-lg bg-linear-to-br from-primary/20 to-cta/20 flex items-center justify-center">
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt="avatar"
                                            className="size-full object-cover rounded-2xl"
                                        />
                                    ) : (
                                        <span className="text-4xl font-black text-primary">
                                            {avatarLetter}
                                        </span>
                                    )}
                                </div>
                                <span className="absolute bottom-1.5 right-1.5 size-3.5 rounded-full bg-emerald-400 ring-2 ring-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                                {editing ? (
                                    <div className="space-y-3 max-w-sm">
                                        <div>
                                            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
                                                Họ và tên
                                            </label>
                                            <input
                                                type="text"
                                                value={form.fullName}
                                                onChange={e =>
                                                    setForm(f => ({
                                                        ...f,
                                                        fullName: e.target.value,
                                                    }))
                                                }
                                                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
                                                Số điện thoại
                                            </label>
                                            <input
                                                type="text"
                                                value={form.phoneNumber}
                                                onChange={e =>
                                                    setForm(f => ({
                                                        ...f,
                                                        phoneNumber: e.target.value,
                                                    }))
                                                }
                                                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                                                placeholder="Chưa cập nhật"
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-1">
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60"
                                            >
                                                <Save className="size-3.5" />
                                                {saving ? 'Đang lưu…' : 'Lưu'}
                                            </button>
                                            <button
                                                onClick={() => setEditing(false)}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface text-text-light text-sm font-semibold hover:bg-border/30 transition"
                                            >
                                                <X className="size-3.5" />
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h1 className="text-2xl font-black text-text tracking-tight">
                                                {user?.fullName}
                                            </h1>
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary ring-1 ring-primary/20">
                                                {roleLabel}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-text-light">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Mail className="size-3.5 text-text-muted" />
                                                {user?.email}
                                            </span>
                                            {user?.phoneNumber && (
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Phone className="size-3.5 text-text-muted" />
                                                    {user.phoneNumber}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1.5">
                                                <Calendar className="size-3.5 text-text-muted" />
                                                Tham gia{' '}
                                                {user?.createdAt
                                                    ? formatDateShort(user.createdAt)
                                                    : '-'}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {!editing && (
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-white text-sm font-semibold text-text hover:bg-surface transition shadow-xs"
                                    >
                                        <Edit3 className="size-3.5" />
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => {
                                            logout()
                                            navigate('/login')
                                        }}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-sm font-semibold text-red-600 hover:bg-red-100 transition ring-1 ring-red-200"
                                    >
                                        <LogOut className="size-3.5" />
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="mt-8 space-y-8">
                        {/* Stat cards row + streak */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                            <StatCard
                                icon={Flame}
                                label="Streak"
                                value={`${streak} ngày`}
                                gradient="bg-linear-to-br from-orange-400 to-red-500"
                                iconBg="bg-white/20 text-white"
                            />
                            <StatCard
                                icon={BookOpen}
                                label="Lần thi"
                                value={summary.totalAttempts || 0}
                                gradient="bg-linear-to-br from-primary to-primary-dark"
                                iconBg="bg-white/20 text-white"
                            />
                            <StatCard
                                icon={CheckCircle2}
                                label="Đạt"
                                value={summary.totalPassed || 0}
                                gradient="bg-linear-to-br from-emerald-500 to-emerald-600"
                                iconBg="bg-white/20 text-white"
                            />
                            <StatCard
                                icon={XCircle}
                                label="Chưa đạt"
                                value={(summary.totalAttempts || 0) - (summary.totalPassed || 0)}
                                gradient="bg-linear-to-br from-rose-400 to-rose-600"
                                iconBg="bg-white/20 text-white"
                            />
                            <StatCard
                                icon={AlertCircle}
                                label="Câu trả lời sai"
                                value={summary.totalWrongAnswers || 0}
                                gradient="bg-linear-to-br from-red-500 to-pink-600"
                                iconBg="bg-white/20 text-white"
                            />
                            <StatCard
                                icon={TrendingUp}
                                label="Trung bình"
                                value={`${Math.round(summary.avgPercentage || 0)}%`}
                                gradient="bg-linear-to-br from-cta to-sky-600"
                                iconBg="bg-white/20 text-white"
                            />
                            <StatCard
                                icon={Trophy}
                                label="Cao nhất"
                                value={`${Math.round(summary.bestScore || 0)}%`}
                                gradient="bg-linear-to-br from-amber-400 to-orange-500"
                                iconBg="bg-white/20 text-white"
                            />
                            <StatCard
                                icon={Clock}
                                label="Tổng thời gian"
                                value={formatTotalTime(summary.totalTime)}
                                gradient="bg-linear-to-br from-violet-500 to-purple-600"
                                iconBg="bg-white/20 text-white"
                            />
                        </div>

                        {/* Study Goals Widget */}
                        {studyGoal && (
                            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                                <h3 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
                                    <Target className="size-4 text-primary" />
                                    Mục tiêu học tập
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-text-light">Câu hỏi hôm nay</span>
                                            <span className="text-primary">
                                                {studyGoal.progress?.daily?.questionsAnswered || 0}{' '}
                                                / {studyGoal.progress?.daily?.target || 20}
                                            </span>
                                        </div>
                                        <div className="h-3 rounded-full bg-primary/10 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-linear-to-r from-primary to-cta transition-all duration-700"
                                                style={{
                                                    width: `${Math.min(100, ((studyGoal.progress?.daily?.questionsAnswered || 0) / (studyGoal.progress?.daily?.target || 20)) * 100)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-text-light">
                                                Bài thi tuần này
                                            </span>
                                            <span className="text-cta">
                                                {studyGoal.progress?.weekly?.examsCompleted || 0} /{' '}
                                                {studyGoal.progress?.weekly?.target || 3}
                                            </span>
                                        </div>
                                        <div className="h-3 rounded-full bg-cta/10 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-linear-to-r from-cta to-emerald-500 transition-all duration-700"
                                                style={{
                                                    width: `${Math.min(100, ((studyGoal.progress?.weekly?.examsCompleted || 0) / (studyGoal.progress?.weekly?.target || 3)) * 100)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pass rate bar */}
                        {(summary.totalAttempts || 0) > 0 && (
                            <div className="rounded-2xl bg-linear-to-r from-primary/5 via-white to-cta/5 border border-primary/10 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Sparkles className="size-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-text">
                                            Tỷ lệ đạt tổng thể
                                        </p>
                                        <p className="text-xs text-text-muted">
                                            {summary.totalPassed} / {summary.totalAttempts} bài thi
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-text-light">0%</span>
                                        <span className="text-primary">{passRate}%</span>
                                        <span className="text-text-light">100%</span>
                                    </div>
                                    <div className="h-3 rounded-full bg-primary/10 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-linear-to-r from-primary to-cta transition-all duration-700"
                                            style={{ width: `${passRate}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2">
                            <TabButton
                                active={activeTab === 'overview'}
                                onClick={() => setActiveTab('overview')}
                            >
                                Tổng quan
                            </TabButton>
                            <TabButton
                                active={activeTab === 'charts'}
                                onClick={() => setActiveTab('charts')}
                            >
                                Biểu đồ
                            </TabButton>
                            <TabButton
                                active={activeTab === 'history'}
                                onClick={() => setActiveTab('history')}
                            >
                                Lịch sử
                            </TabButton>
                            <TabButton
                                active={activeTab === 'achievements'}
                                onClick={() => setActiveTab('achievements')}
                            >
                                Thành tựu ({earnedCount}/{achievements.length})
                            </TabButton>
                        </div>

                        {/* ═══════ Overview Tab ═══════ */}
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                {/* Level breakdown */}
                                {byLevel.length > 0 && (
                                    <div>
                                        <h2 className="text-base font-bold text-text mb-4 flex items-center gap-2">
                                            <BarChart3 className="size-4 text-primary" />
                                            Thống kê theo cấp độ
                                        </h2>
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {byLevel.map(lv => {
                                                const cfg = LEVEL_CONFIG[lv._id] || {
                                                    light: 'bg-gray-100 text-gray-700 ring-gray-200',
                                                    bar: 'bg-gray-400',
                                                }
                                                const pr =
                                                    lv.attempts > 0
                                                        ? Math.round(
                                                              (lv.passed / lv.attempts) * 100
                                                          )
                                                        : 0
                                                return (
                                                    <div
                                                        key={lv._id}
                                                        className="rounded-2xl border border-border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="flex items-center justify-between mb-4">
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs font-black ring-1 ${cfg.light}`}
                                                            >
                                                                JLPT {lv._id}
                                                            </span>
                                                            <span className="text-xs font-semibold text-text-muted bg-surface px-2.5 py-1 rounded-full">
                                                                {lv.attempts} lần thi
                                                            </span>
                                                        </div>
                                                        <div className="flex items-end justify-between mb-3">
                                                            <div>
                                                                <p className="text-3xl font-black text-text">
                                                                    {pr}%
                                                                </p>
                                                                <p className="text-xs text-text-muted">
                                                                    Tỷ lệ đạt
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm font-bold text-text">
                                                                    {Math.round(lv.bestScore)}%
                                                                </p>
                                                                <p className="text-xs text-text-muted">
                                                                    Cao nhất
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${cfg.bar} transition-all duration-700`}
                                                                style={{ width: `${pr}%` }}
                                                            />
                                                        </div>
                                                        <p className="text-xs text-text-muted mt-2">
                                                            Trung bình:{' '}
                                                            <span className="font-semibold text-text">
                                                                {Math.round(lv.avgPercentage)}%
                                                            </span>
                                                        </p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Comparison */}
                                {comparison && (
                                    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                                        <h3 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
                                            <TrendingUp className="size-4 text-primary" />
                                            So sánh 2 lần thi gần nhất
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {comparison.map((att, idx) => {
                                                const isLatest = idx === 0
                                                return (
                                                    <div
                                                        key={att._id}
                                                        className={`rounded-xl p-4 ${isLatest ? 'bg-primary/5 border border-primary/20' : 'bg-surface border border-border'}`}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span
                                                                className={`text-xs font-bold ${isLatest ? 'text-primary' : 'text-text-muted'}`}
                                                            >
                                                                {isLatest
                                                                    ? 'Lần mới nhất'
                                                                    : 'Lần trước'}
                                                            </span>
                                                            <span className="text-xs text-text-muted">
                                                                {formatDateShort(att.startTime)}
                                                            </span>
                                                        </div>
                                                        <p className="text-2xl font-black text-text">
                                                            {att.results?.percentage || 0}%
                                                        </p>
                                                        <p className="text-xs text-text-muted">
                                                            {att.results?.totalScore}/
                                                            {att.results?.maxScore} điểm ·{' '}
                                                            {formatDuration(att.duration)}
                                                        </p>
                                                        {att.results?.sectionScores?.map(ss => (
                                                            <div
                                                                key={ss.sectionType}
                                                                className="mt-2"
                                                            >
                                                                <div className="flex justify-between text-xs">
                                                                    <span className="text-text-muted">
                                                                        {SECTION_NAME[
                                                                            ss.sectionType
                                                                        ] || ss.sectionType}
                                                                    </span>
                                                                    <span className="font-semibold text-text">
                                                                        {ss.correctAnswers}/
                                                                        {ss.totalQuestions}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        {comparison.length === 2 && (
                                            <div className="mt-3 text-center">
                                                {comparison[0].results?.percentage >
                                                comparison[1].results?.percentage ? (
                                                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                                        Tiến bộ +
                                                        {comparison[0].results.percentage -
                                                            comparison[1].results.percentage}
                                                        %
                                                    </span>
                                                ) : comparison[0].results?.percentage <
                                                  comparison[1].results?.percentage ? (
                                                    <span className="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                                                        Giảm{' '}
                                                        {comparison[1].results.percentage -
                                                            comparison[0].results.percentage}
                                                        %
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                                                        Không đổi
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══════ Charts Tab ═══════ */}
                        {activeTab === 'charts' && (
                            <div className="space-y-8">
                                {/* Daily scores chart */}
                                {dailyChartData.length > 0 && (
                                    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                                        <h3 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
                                            <TrendingUp className="size-4 text-primary" />
                                            Điểm theo ngày (30 ngày gần nhất)
                                        </h3>
                                        <ResponsiveContainer width="100%" height={280}>
                                            <AreaChart data={dailyChartData}>
                                                <defs>
                                                    <linearGradient
                                                        id="colorAvg"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="5%"
                                                            stopColor="#6366f1"
                                                            stopOpacity={0.3}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="#6366f1"
                                                            stopOpacity={0}
                                                        />
                                                    </linearGradient>
                                                    <linearGradient
                                                        id="colorBest"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="5%"
                                                            stopColor="#10b981"
                                                            stopOpacity={0.3}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="#10b981"
                                                            stopOpacity={0}
                                                        />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#e2e8f0"
                                                />
                                                <XAxis
                                                    dataKey="date"
                                                    tick={{ fontSize: 11 }}
                                                    stroke="#94a3b8"
                                                />
                                                <YAxis
                                                    domain={[0, 100]}
                                                    tick={{ fontSize: 11 }}
                                                    stroke="#94a3b8"
                                                />
                                                <Tooltip content={<ChartTooltip />} />
                                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                                <Area
                                                    type="monotone"
                                                    dataKey="Trung bình"
                                                    stroke="#6366f1"
                                                    fill="url(#colorAvg)"
                                                    strokeWidth={2}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="Cao nhất"
                                                    stroke="#10b981"
                                                    fill="url(#colorBest)"
                                                    strokeWidth={2}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* Skills radar */}
                                {sectionChartData.length > 0 && (
                                    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                                        <h3 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
                                            <Sparkles className="size-4 text-primary" />
                                            Điểm trung bình theo kỹ năng
                                        </h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <RadarChart data={sectionChartData}>
                                                <PolarGrid stroke="#e2e8f0" />
                                                <PolarAngleAxis
                                                    dataKey="section"
                                                    tick={{ fontSize: 12, fill: '#475569' }}
                                                />
                                                <PolarRadiusAxis
                                                    angle={90}
                                                    domain={[0, 100]}
                                                    tick={{ fontSize: 10 }}
                                                />
                                                <Radar
                                                    name="Điểm TB"
                                                    dataKey="score"
                                                    stroke="#6366f1"
                                                    fill="#6366f1"
                                                    fillOpacity={0.3}
                                                    strokeWidth={2}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* Accuracy by level */}
                                {accuracyData.length > 0 && (
                                    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                                        <h3 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
                                            <BarChart3 className="size-4 text-primary" />
                                            Tỷ lệ đúng/sai theo cấp độ
                                        </h3>
                                        <ResponsiveContainer width="100%" height={280}>
                                            <BarChart data={accuracyData}>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#e2e8f0"
                                                />
                                                <XAxis
                                                    dataKey="level"
                                                    tick={{ fontSize: 12 }}
                                                    stroke="#94a3b8"
                                                />
                                                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                                                <Tooltip />
                                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                                <Bar
                                                    dataKey="Đúng"
                                                    fill="#10b981"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                                <Bar
                                                    dataKey="Sai"
                                                    fill="#f43f5e"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                                <Bar
                                                    dataKey="Bỏ qua"
                                                    fill="#94a3b8"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {dailyChartData.length === 0 && sectionChartData.length === 0 && (
                                    <div className="rounded-2xl border-2 border-dashed border-border bg-white p-16 text-center">
                                        <BarChart3 className="size-10 text-text-muted/30 mx-auto mb-3" />
                                        <p className="font-semibold text-text-muted">
                                            Chưa có dữ liệu biểu đồ
                                        </p>
                                        <p className="text-sm text-text-muted/70">
                                            Hoàn thành ít nhất 1 bài thi để xem biểu đồ tiến bộ.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══════ History Tab ═══════ */}
                        {activeTab === 'history' && (
                            <div>
                                <h2 className="text-base font-bold text-text mb-4 flex items-center gap-2">
                                    <Target className="size-4 text-primary" />
                                    Lịch sử làm đề gần đây
                                </h2>
                                {recentAttempts.length === 0 ? (
                                    <div className="rounded-2xl border-2 border-dashed border-border bg-white p-16 text-center">
                                        <div className="size-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
                                            <BookOpen className="size-7 text-primary/40" />
                                        </div>
                                        <p className="font-semibold text-text-muted mb-1">
                                            Chưa có lịch sử
                                        </p>
                                        <p className="text-sm text-text-muted/70 mb-5">
                                            Hoàn thành đề thi đầu tiên để xem kết quả tại đây.
                                        </p>
                                        <button
                                            onClick={() => navigate('/')}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
                                        >
                                            Xem đề thi
                                            <ChevronRight className="size-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {recentAttempts.map((att, idx) => {
                                            const lvCfg = LEVEL_CONFIG[att.exam?.level]
                                            const passed = att.results?.passed
                                            const pct = att.results?.percentage ?? 0
                                            return (
                                                <div
                                                    key={att._id}
                                                    onClick={() =>
                                                        navigate(
                                                            `/exam/${att.exam?._id}/result/${att._id}`
                                                        )
                                                    }
                                                    className="group rounded-2xl border border-border bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-primary/30 hover:shadow-md transition cursor-pointer"
                                                >
                                                    <div className="hidden sm:flex size-9 rounded-xl bg-surface items-center justify-center text-sm font-bold text-text-muted shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p className="font-semibold text-text truncate text-sm">
                                                                {att.exam?.title ||
                                                                    att.exam?.examCode ||
                                                                    '-'}
                                                            </p>
                                                            {att.exam?.level && (
                                                                <span
                                                                    className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-black ring-1 ${lvCfg?.light || 'bg-gray-100 text-gray-600 ring-gray-200'}`}
                                                                >
                                                                    {att.exam.level}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="size-3" />
                                                                {formatDateTime(att.startTime)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="size-3" />
                                                                {formatDuration(att.duration)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <div
                                                            className={`size-14 rounded-2xl flex flex-col items-center justify-center ${passed ? 'bg-emerald-50' : 'bg-red-50'}`}
                                                        >
                                                            <p
                                                                className={`text-lg font-black leading-none ${passed ? 'text-emerald-600' : 'text-red-500'}`}
                                                            >
                                                                {pct}%
                                                            </p>
                                                            <p
                                                                className={`text-[9px] font-semibold ${passed ? 'text-emerald-500' : 'text-red-400'}`}
                                                            >
                                                                {att.results?.totalScore}/
                                                                {att.results?.maxScore}
                                                            </p>
                                                        </div>
                                                        <div className="text-right hidden xs:block">
                                                            {passed ? (
                                                                <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                                                    <CheckCircle2 className="size-3.5" />
                                                                    Đạt
                                                                </span>
                                                            ) : (
                                                                <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
                                                                    <XCircle className="size-3.5" />
                                                                    Chưa đạt
                                                                </span>
                                                            )}
                                                            {att.results?.rank && (
                                                                <span
                                                                    className={`inline-block mt-1 px-2 py-0.5 rounded-lg text-xs font-black ${RANK_CONFIG[att.results.rank] || ''}`}
                                                                >
                                                                    Hạng {att.results.rank}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <ChevronRight className="size-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition hidden sm:block" />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══════ Achievements Tab ═══════ */}
                        {activeTab === 'achievements' && (
                            <div>
                                <h2 className="text-base font-bold text-text mb-4 flex items-center gap-2">
                                    <Trophy className="size-4 text-amber-500" />
                                    Thành tựu ({earnedCount}/{achievements.length})
                                </h2>
                                {achievements.length === 0 ? (
                                    <div className="rounded-2xl border-2 border-dashed border-border bg-white p-16 text-center">
                                        <Trophy className="size-10 text-text-muted/30 mx-auto mb-3" />
                                        <p className="font-semibold text-text-muted">
                                            Chưa có thành tựu nào
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {achievements.map(ach => {
                                            const IconComp = ICON_MAP[ach.icon] || Award
                                            return (
                                                <div
                                                    key={ach._id}
                                                    className={`rounded-2xl border p-5 transition-all ${
                                                        ach.earned
                                                            ? 'border-amber-200 bg-linear-to-br from-amber-50 to-orange-50 shadow-sm'
                                                            : 'border-border bg-white opacity-50 grayscale'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div
                                                            className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${
                                                                ach.earned
                                                                    ? 'bg-amber-100 text-amber-600'
                                                                    : 'bg-gray-100 text-gray-400'
                                                            }`}
                                                        >
                                                            <IconComp className="size-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p
                                                                className={`font-bold text-sm ${ach.earned ? 'text-text' : 'text-text-muted'}`}
                                                            >
                                                                {ach.titleVi}
                                                            </p>
                                                            <p className="text-xs text-text-muted mt-0.5">
                                                                {ach.descriptionVi}
                                                            </p>
                                                            {ach.earned && ach.earnedAt && (
                                                                <p className="text-[10px] text-amber-600 font-semibold mt-1">
                                                                    Đạt được{' '}
                                                                    {formatDateShort(ach.earnedAt)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
