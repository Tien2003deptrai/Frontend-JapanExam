import { LoadingSpinner } from '@/components/ui'
import { authService } from '@/services/AuthService'
import { examAttemptService } from '@/services/ExamAttemptService'
import useAuthStore from '@/stores/authStore'
import {
    BarChart3,
    BookOpen,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    Edit3,
    LogOut,
    Mail,
    Phone,
    Save,
    Sparkles,
    Target,
    TrendingUp,
    Trophy,
    X,
    XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LEVEL_CONFIG = {
    N5: { light: 'bg-sky-50 text-sky-700 ring-sky-200',            bar: 'bg-sky-500' },
    N4: { light: 'bg-emerald-50 text-emerald-700 ring-emerald-200', bar: 'bg-emerald-500' },
    N3: { light: 'bg-violet-50 text-violet-700 ring-violet-200',    bar: 'bg-violet-500' },
    N2: { light: 'bg-amber-50 text-amber-700 ring-amber-200',       bar: 'bg-amber-500' },
    N1: { light: 'bg-rose-50 text-rose-700 ring-rose-200',          bar: 'bg-rose-500' },
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
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatDateTime(dateStr) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function StatCard({ icon: Icon, label, value, gradient, iconBg }) {
    return (
        <div className={`relative rounded-2xl p-5 shadow-sm overflow-hidden ${gradient}`}>
            <div className="relative z-10">
                <div className={`inline-flex size-10 items-center justify-center rounded-xl ${iconBg} mb-3`}>
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

export default function ProfilePage() {
    const { user, logout, login: updateUser } = useAuthStore()
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({ fullName: '', phoneNumber: '' })
    const [saving, setSaving] = useState(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { loadProfile(); loadStats() }, [])

    useEffect(() => {
        if (user) setForm({ fullName: user.fullName || '', phoneNumber: user.phoneNumber || '' })
    }, [user])

    const loadProfile = async () => {
        try {
            const res = await authService.getMe()
            const freshUser = res.data?.data?.user || res.data?.data
            if (freshUser) updateUser(freshUser, useAuthStore.getState().token)
        } catch { /* silent */ }
    }

    const loadStats = async () => {
        try {
            setLoading(true)
            const res = await examAttemptService.getProfileStats()
            setStats(res.data)
        } catch { setStats(null) }
        finally { setLoading(false) }
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            const res = await authService.updateProfile(form)
            const u = res.data?.data?.user || res.data?.data
            if (u) updateUser(u, useAuthStore.getState().token)
            setEditing(false)
        } catch { /* silent */ }
        finally { setSaving(false) }
    }

    const summary = stats?.summary || {}
    const byLevel = stats?.byLevel || []
    const recentAttempts = stats?.recentAttempts || []
    const passRate = summary.totalAttempts ? Math.round((summary.totalPassed / summary.totalAttempts) * 100) : 0
    const avatarLetter = user?.fullName?.charAt(0)?.toUpperCase() || 'U'

    const roleLabel = user?.role === 'admin' ? 'Admin' : user?.role === 'creator' ? 'Người tạo đề' : 'Người học'

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
            <div className="relative h-52 bg-linear-to-br from-primary-dark via-primary to-cta overflow-hidden">
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                    <defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                </svg>
                <div className="absolute top-6 right-12 size-32 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute bottom-0 left-1/3 size-40 rounded-full bg-white/5 blur-3xl" />
            </div>

            <div className="max-w-5xl mx-auto px-4 pb-16">
                <div className="-mt-20 relative z-10">
                    <div className="bg-white rounded-3xl shadow-xl border border-border/50 p-6">
                        <div className="flex flex-col sm:flex-row gap-5 sm:items-start">
                            <div className="relative shrink-0">
                                <div className="size-28 rounded-2xl ring-4 ring-white shadow-lg bg-linear-to-br from-primary/20 to-cta/20 flex items-center justify-center">
                                    {user?.avatar
                                        ? <img src={user.avatar} alt="avatar" className="size-full object-cover rounded-2xl" />
                                        : <span className="text-4xl font-black text-primary">{avatarLetter}</span>}
                                </div>
                                <span className="absolute bottom-1.5 right-1.5 size-3.5 rounded-full bg-emerald-400 ring-2 ring-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                                {editing ? (
                                    <div className="space-y-3 max-w-sm">
                                        <div>
                                            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">Họ và tên</label>
                                            <input type="text" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                                                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">Số điện thoại</label>
                                            <input type="text" value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
                                                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                                                placeholder="Chưa cập nhật" />
                                        </div>
                                        <div className="flex gap-2 pt-1">
                                            <button onClick={handleSave} disabled={saving}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60">
                                                <Save className="size-3.5" />{saving ? 'Đang lưu…' : 'Lưu'}
                                            </button>
                                            <button onClick={() => setEditing(false)}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface text-text-light text-sm font-semibold hover:bg-border/30 transition">
                                                <X className="size-3.5" />Hủy
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h1 className="text-2xl font-black text-text tracking-tight">{user?.fullName}</h1>
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary ring-1 ring-primary/20">{roleLabel}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-text-light">
                                            <span className="inline-flex items-center gap-1.5"><Mail className="size-3.5 text-text-muted" />{user?.email}</span>
                                            {user?.phoneNumber && <span className="inline-flex items-center gap-1.5"><Phone className="size-3.5 text-text-muted" />{user.phoneNumber}</span>}
                                            <span className="inline-flex items-center gap-1.5"><Calendar className="size-3.5 text-text-muted" />Tham gia {user?.createdAt ? formatDateShort(user.createdAt) : '-'}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {!editing && (
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => setEditing(true)}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-white text-sm font-semibold text-text hover:bg-surface transition shadow-xs">
                                        <Edit3 className="size-3.5" />Sửa
                                    </button>
                                    <button onClick={() => { logout(); navigate('/login') }}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-sm font-semibold text-red-600 hover:bg-red-100 transition ring-1 ring-red-200">
                                        <LogOut className="size-3.5" />Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24"><LoadingSpinner /></div>
                ) : (
                    <div className="mt-8 space-y-8">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            <StatCard icon={BookOpen}     label="Lần thi"         value={summary.totalAttempts || 0}
                                gradient="bg-linear-to-br from-primary to-primary-dark" iconBg="bg-white/20 text-white" />
                            <StatCard icon={CheckCircle2} label="Đạt"             value={summary.totalPassed || 0}
                                gradient="bg-linear-to-br from-emerald-500 to-emerald-600" iconBg="bg-white/20 text-white" />
                            <StatCard icon={XCircle}      label="Chưa đạt"        value={(summary.totalAttempts || 0) - (summary.totalPassed || 0)}
                                gradient="bg-linear-to-br from-rose-400 to-rose-600" iconBg="bg-white/20 text-white" />
                            <StatCard icon={TrendingUp}   label="Trung bình"      value={`${Math.round(summary.avgPercentage || 0)}%`}
                                gradient="bg-linear-to-br from-cta to-sky-600" iconBg="bg-white/20 text-white" />
                            <StatCard icon={Trophy}       label="Cao nhất"        value={`${Math.round(summary.bestScore || 0)}%`}
                                gradient="bg-linear-to-br from-amber-400 to-orange-500" iconBg="bg-white/20 text-white" />
                            <StatCard icon={Clock}        label="Tổng thời gian"  value={summary.totalTime ? `${Math.round(summary.totalTime / 60)}ph` : '0ph'}
                                gradient="bg-linear-to-br from-violet-500 to-purple-600" iconBg="bg-white/20 text-white" />
                        </div>

                        {(summary.totalAttempts || 0) > 0 && (
                            <div className="rounded-2xl bg-linear-to-r from-primary/5 via-white to-cta/5 border border-primary/10 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Sparkles className="size-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-text">Tỷ lệ đạt tổng thể</p>
                                        <p className="text-xs text-text-muted">{summary.totalPassed} / {summary.totalAttempts} bài thi</p>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-text-light">0%</span>
                                        <span className="text-primary">{passRate}%</span>
                                        <span className="text-text-light">100%</span>
                                    </div>
                                    <div className="h-3 rounded-full bg-primary/10 overflow-hidden">
                                        <div className="h-full rounded-full bg-linear-to-r from-primary to-cta transition-all duration-700" style={{ width: `${passRate}%` }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {byLevel.length > 0 && (
                            <div>
                                <h2 className="text-base font-bold text-text mb-4 flex items-center gap-2">
                                    <BarChart3 className="size-4 text-primary" />Thống kê theo cấp độ
                                </h2>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {byLevel.map(lv => {
                                        const cfg = LEVEL_CONFIG[lv._id] || { light: 'bg-gray-100 text-gray-700 ring-gray-200', bar: 'bg-gray-400' }
                                        const pr = lv.attempts > 0 ? Math.round((lv.passed / lv.attempts) * 100) : 0
                                        return (
                                            <div key={lv._id} className="rounded-2xl border border-border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-black ring-1 ${cfg.light}`}>JLPT {lv._id}</span>
                                                    <span className="text-xs font-semibold text-text-muted bg-surface px-2.5 py-1 rounded-full">{lv.attempts} lần thi</span>
                                                </div>
                                                <div className="flex items-end justify-between mb-3">
                                                    <div>
                                                        <p className="text-3xl font-black text-text">{pr}%</p>
                                                        <p className="text-xs text-text-muted">Tỷ lệ đạt</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-text">{Math.round(lv.bestScore)}%</p>
                                                        <p className="text-xs text-text-muted">Cao nhất</p>
                                                    </div>
                                                </div>
                                                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                    <div className={`h-full rounded-full ${cfg.bar} transition-all duration-700`} style={{ width: `${pr}%` }} />
                                                </div>
                                                <p className="text-xs text-text-muted mt-2">Trung bình: <span className="font-semibold text-text">{Math.round(lv.avgPercentage)}%</span></p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        <div>
                            <h2 className="text-base font-bold text-text mb-4 flex items-center gap-2">
                                <Target className="size-4 text-primary" />Lịch sử làm đề gần đây
                            </h2>
                            {recentAttempts.length === 0 ? (
                                <div className="rounded-2xl border-2 border-dashed border-border bg-white p-16 text-center">
                                    <div className="size-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="size-7 text-primary/40" />
                                    </div>
                                    <p className="font-semibold text-text-muted mb-1">Chưa có lịch sử</p>
                                    <p className="text-sm text-text-muted/70 mb-5">Hoàn thành đề thi đầu tiên để xem kết quả tại đây.</p>
                                    <button onClick={() => navigate('/')}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition">
                                        Xem đề thi<ChevronRight className="size-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentAttempts.map((att, idx) => {
                                        const lvCfg = LEVEL_CONFIG[att.exam?.level]
                                        const passed = att.results?.passed
                                        const pct = att.results?.percentage ?? 0
                                        return (
                                            <div key={att._id} onClick={() => navigate(`/exam/${att.exam?._id}/result/${att._id}`)}
                                                className="group rounded-2xl border border-border bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-primary/30 hover:shadow-md transition cursor-pointer">
                                                <div className="hidden sm:flex size-9 rounded-xl bg-surface items-center justify-center text-sm font-bold text-text-muted shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="font-semibold text-text truncate text-sm">{att.exam?.title || att.exam?.examCode || '-'}</p>
                                                        {att.exam?.level && (
                                                            <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-black ring-1 ${lvCfg?.light || 'bg-gray-100 text-gray-600 ring-gray-200'}`}>
                                                                {att.exam.level}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                                                        <span className="flex items-center gap-1"><Calendar className="size-3" />{formatDateTime(att.startTime)}</span>
                                                        <span className="flex items-center gap-1"><Clock className="size-3" />{formatDuration(att.duration)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <div className={`size-14 rounded-2xl flex flex-col items-center justify-center ${passed ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                                        <p className={`text-lg font-black leading-none ${passed ? 'text-emerald-600' : 'text-red-500'}`}>{pct}%</p>
                                                        <p className={`text-[9px] font-semibold ${passed ? 'text-emerald-500' : 'text-red-400'}`}>{att.results?.totalScore}/{att.results?.maxScore}</p>
                                                    </div>
                                                    <div className="text-right hidden xs:block">
                                                        {passed
                                                            ? <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold"><CheckCircle2 className="size-3.5" />Đạt</span>
                                                            : <span className="flex items-center gap-1 text-red-500 text-xs font-bold"><XCircle className="size-3.5" />Chưa đạt</span>}
                                                        {att.results?.rank && (
                                                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-lg text-xs font-black ${RANK_CONFIG[att.results.rank] || ''}`}>Hạng {att.results.rank}</span>
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
                    </div>
                )}
            </div>
        </div>
    )
}