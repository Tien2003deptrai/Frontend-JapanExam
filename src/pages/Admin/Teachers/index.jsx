import { LoadingSpinner } from '@/components/ui'
import { adminService } from '@/services/AdminService'
import {
    ChevronLeft,
    ChevronRight,
    Lock,
    MoreHorizontal,
    Search,
    Shield,
    ShieldOff,
    Trash2,
    Unlock,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

const PAGE_SIZE = 15

const STATUS_BADGE = {
    active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    locked: 'bg-red-50 text-red-600 ring-1 ring-red-200',
}

function formatDate(d) {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

export default function AdminTeachersPage() {
    const [users, setUsers] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [actionMenu, setActionMenu] = useState(null)
    const menuRef = useRef(null)

    const totalPages = Math.ceil(total / PAGE_SIZE)

    const load = useCallback(async () => {
        try {
            setLoading(true)
            const res = await adminService.getUsers({
                page,
                limit: PAGE_SIZE,
                role: 'creator',
                search: search || undefined,
            })
            const d = res.data
            setUsers(d.data || [])
            setTotal(d.pagination?.total || 0)
        } catch {
            setUsers([])
            setTotal(0)
        } finally {
            setLoading(false)
        }
    }, [page, search])

    useEffect(() => {
        load()
    }, [load])

    useEffect(() => {
        const h = e => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setActionMenu(null)
        }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [])

    const handleToggleStatus = async userId => {
        try {
            await adminService.toggleUserStatus(userId)
            load()
        } catch {
            /* silent */
        }
        setActionMenu(null)
    }

    const handleUpdateRole = async (userId, role) => {
        try {
            await adminService.updateUserRole(userId, role)
            load()
        } catch {
            /* silent */
        }
        setActionMenu(null)
    }

    const handleDelete = async userId => {
        if (!confirm('Xác nhận xóa người dùng này?')) return
        try {
            await adminService.deleteUser(userId)
            load()
        } catch {
            /* silent */
        }
        setActionMenu(null)
    }

    const start = (page - 1) * PAGE_SIZE

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-text">
                        Quản lý Người tạo đề
                    </h1>
                    <p className="mt-1 text-sm text-text-light">
                        Danh sách tài khoản có vai trò "creator".
                    </p>
                </div>
                <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                    {total} người
                </span>
            </div>

            <div className="relative max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                <input
                    type="text"
                    placeholder="Tìm theo tên hoặc email..."
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value)
                        setPage(1)
                    }}
                    className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border bg-surface/50">
                                    <th className="px-5 py-3 font-semibold text-text-muted w-12">
                                        #
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-text-muted">
                                        Họ tên
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-text-muted">
                                        Email
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-text-muted">
                                        Trạng thái
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-text-muted">
                                        Ngày tạo
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-text-muted w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-12 text-center text-text-muted"
                                        >
                                            Không tìm thấy người tạo đề nào.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u, idx) => (
                                        <tr
                                            key={u._id}
                                            className="border-b border-border/50 hover:bg-background/50 transition"
                                        >
                                            <td className="px-5 py-3 text-text-muted">
                                                {start + idx + 1}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                        <span className="text-xs font-bold text-primary">
                                                            {u.fullName?.charAt(0) || 'U'}
                                                        </span>
                                                    </div>
                                                    <span className="font-medium text-text">
                                                        {u.fullName || '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-text-light">{u.email}</td>
                                            <td className="px-5 py-3">
                                                <span
                                                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[u.status] || STATUS_BADGE.active}`}
                                                >
                                                    {u.status === 'locked'
                                                        ? 'Đã khóa'
                                                        : 'Hoạt động'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-text-muted">
                                                {formatDate(u.createdAt)}
                                            </td>
                                            <td className="px-5 py-3 relative">
                                                <button
                                                    onClick={() =>
                                                        setActionMenu(
                                                            actionMenu === u._id ? null : u._id
                                                        )
                                                    }
                                                    className="p-1.5 rounded-lg hover:bg-surface transition cursor-pointer"
                                                >
                                                    <MoreHorizontal className="size-4 text-text-muted" />
                                                </button>
                                                {actionMenu === u._id && (
                                                    <div
                                                        ref={menuRef}
                                                        className="absolute right-5 top-10 z-50 w-48 bg-white rounded-xl border border-border shadow-lg py-1"
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                handleToggleStatus(u._id)
                                                            }
                                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-surface transition text-left cursor-pointer"
                                                        >
                                                            {u.status === 'locked' ? (
                                                                <>
                                                                    <Unlock className="size-4 text-emerald-600" />
                                                                    Mở khóa
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Lock className="size-4 text-amber-600" />
                                                                    Khóa tài khoản
                                                                </>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateRole(u._id, 'user')
                                                            }
                                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-surface transition text-left cursor-pointer"
                                                        >
                                                            <ShieldOff className="size-4 text-text-muted" />
                                                            Chuyển thành Người học
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateRole(u._id, 'admin')
                                                            }
                                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-surface transition text-left cursor-pointer"
                                                        >
                                                            <Shield className="size-4 text-violet-600" />
                                                            Nâng lên Admin
                                                        </button>
                                                        <hr className="my-1 border-border" />
                                                        <button
                                                            onClick={() => handleDelete(u._id)}
                                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive-light transition text-left cursor-pointer"
                                                        >
                                                            <Trash2 className="size-4" />
                                                            Xóa
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-3">
                            <p className="text-sm text-text-light">
                                Hiển thị {start + 1}-{Math.min(start + PAGE_SIZE, total)} / {total}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-light hover:bg-surface disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
                                >
                                    <ChevronLeft className="size-4" /> Trước
                                </button>
                                <span className="px-3 py-1.5 text-sm text-text-light">
                                    Trang {page} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-light hover:bg-surface disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
                                >
                                    Sau <ChevronRight className="size-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
