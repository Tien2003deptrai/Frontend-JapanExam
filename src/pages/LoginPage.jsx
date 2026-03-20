import { authService } from '@/services/AuthService'
import useAuthStore from '@/stores/authStore'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const login = useAuthStore(s => s.login)
    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const { data } = await authService.login({ email, password })
            login(data.data.user, data.data.token)
            const role = data.data.user?.role
            if (role === 'admin') navigate('/admin', { replace: true })
            else if (role === 'teacher') navigate('/teacher', { replace: true })
            else navigate('/student', { replace: true })
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#EFF6FF] via-white to-[#F0F9FF] px-4">
            <div
                className="w-full max-w-md rounded-3xl bg-white p-8"
                style={{
                    border: '3px solid rgba(255,255,255,0.7)',
                    boxShadow:
                        '12px 12px 32px rgba(0,0,0,0.08), -6px -6px 16px rgba(255,255,255,0.8), inset 0 2px 0 rgba(255,255,255,0.6)',
                }}
            >
                <div className="mb-8 text-center">
                    <h1
                        className="text-2xl font-black text-[#1E293B]"
                        style={{ fontFamily: "'Noto Serif JP', serif" }}
                    >
                        JLPT Exam
                    </h1>
                    <p className="mt-2 text-sm text-[#64748B]">Đăng nhập để tiếp tục</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label
                            htmlFor="email"
                            className="block text-xs font-semibold text-[#475569]"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="h-11 w-full rounded-xl border-2 border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#1E293B] outline-none transition-all duration-200 placeholder:text-[#94A3B8] hover:border-[#CBD5E1] focus:border-[#2563EB] focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label
                            htmlFor="password"
                            className="block text-xs font-semibold text-[#475569]"
                        >
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="h-11 w-full rounded-xl border-2 border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#1E293B] outline-none transition-all duration-200 placeholder:text-[#94A3B8] hover:border-[#CBD5E1] focus:border-[#2563EB] focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="h-11 w-full rounded-xl bg-[#2563EB] text-sm font-bold text-white transition-all duration-200 hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        style={{ boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    )
}
