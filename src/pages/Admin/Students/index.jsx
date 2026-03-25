import { ChevronLeft, ChevronRight, Search, UserPlus } from 'lucide-react'
import { useState } from 'react'

const PAGE_SIZE = 12

const LEVEL_BADGE = {
    N5: 'bg-primary/10 text-primary',
    N4: 'bg-cta/10 text-cta',
    N3: 'bg-secondary/10 text-secondary',
    N2: 'bg-warning/10 text-warning',
    N1: 'bg-destructive/10 text-destructive',
}

const mockStudents = Array.from({ length: 20 }, (_, i) => ({
    id: `student-${i + 1}`,
    name: `Học viên ${i + 1}`,
    email: `hv${i + 1}@email.com`,
    phone: `09${String(10000000 + i).slice(1)}`,
    status: i % 5 === 0 ? 'Ngưng học' : 'Đang học',
    level: ['N5', 'N4', 'N3', 'N2', 'N1'][i % 5],
    joinedAt: `0${(i % 9) + 1}/2024`,
}))

export default function AdminStudentsPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState('')

    const filtered = mockStudents.filter(
        s =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase())
    )
    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / PAGE_SIZE)
    const start = (currentPage - 1) * PAGE_SIZE
    const paginated = filtered.slice(start, start + PAGE_SIZE)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-text">Quản lý Học viên</h1>
                    <p className="mt-1 text-sm text-text-light">
                        Danh sách và quản lý tài khoản học viên.
                    </p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors">
                    <UserPlus className="size-4" />
                    Thêm học viên
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                <input
                    type="text"
                    placeholder="Tìm theo tên hoặc email..."
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value)
                        setCurrentPage(1)
                    }}
                    className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-border bg-surface">
                                <th className="px-4 py-3 font-semibold text-text">#</th>
                                <th className="px-4 py-3 font-semibold text-text">Họ tên</th>
                                <th className="px-4 py-3 font-semibold text-text">Email</th>
                                <th className="px-4 py-3 font-semibold text-text">Số điện thoại</th>
                                <th className="px-4 py-3 font-semibold text-text">Level</th>
                                <th className="px-4 py-3 font-semibold text-text">Trạng thái</th>
                                <th className="px-4 py-3 font-semibold text-text">Ngày đăng ký</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center text-text-muted"
                                    >
                                        Không tìm thấy học viên nào.
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((student, index) => (
                                    <tr
                                        key={student.id}
                                        className="border-b border-border/50 hover:bg-background transition"
                                    >
                                        <td className="px-4 py-3 text-text-muted">
                                            {start + index + 1}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-text">
                                            {student.name}
                                        </td>
                                        <td className="px-4 py-3 text-text-light">
                                            {student.email}
                                        </td>
                                        <td className="px-4 py-3 text-text-light">
                                            {student.phone}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEVEL_BADGE[student.level] || 'bg-surface text-text-muted'}`}
                                            >
                                                {student.level}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    student.status === 'Đang học'
                                                        ? 'bg-cta/10 text-cta'
                                                        : 'bg-surface text-text-muted'
                                                }`}
                                            >
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-text-light">
                                            {student.joinedAt}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3">
                        <p className="text-sm text-text-light">
                            Hiển thị {start + 1}–{Math.min(start + PAGE_SIZE, totalItems)} /{' '}
                            {totalItems}
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-light hover:bg-surface disabled:opacity-50 disabled:pointer-events-none transition-colors"
                            >
                                <ChevronLeft className="size-4" /> Trước
                            </button>
                            <span className="px-3 py-1.5 text-sm text-text-light">
                                Trang {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-light hover:bg-surface disabled:opacity-50 disabled:pointer-events-none transition-colors"
                            >
                                Sau <ChevronRight className="size-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
