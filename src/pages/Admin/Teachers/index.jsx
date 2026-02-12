import { useState } from 'react'
import { MySpace } from '@/components'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 12

const mockTeachers = Array.from({ length: 20 }, (_, i) => ({
    id: `teacher-${i + 1}`,
    name: `Giáo viên ${i + 1}`,
    email: `gv${i + 1}@school.jp`,
    phone: `09${String(10000000 + i).slice(1)}`,
    status: i % 4 === 0 ? 'Ngưng hoạt động' : 'Hoạt động',
    subject: ['N5', 'N4', 'N3', 'Ngữ pháp', 'Đọc hiểu'][i % 5],
    joinedAt: `0${(i % 9) + 1}/2024`,
}))

export default function AdminTeachersPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const totalItems = mockTeachers.length
    const totalPages = Math.ceil(totalItems / PAGE_SIZE)
    const start = (currentPage - 1) * PAGE_SIZE
    const paginatedTeachers = mockTeachers.slice(start, start + PAGE_SIZE)

    return (
        <MySpace>
            <MySpace.Heading className="bg-white p-5 shadow-sm">
                <h1 className="text-xl font-semibold text-gray-900">Quản lý Giáo viên</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Danh sách và quản lý tài khoản giáo viên.
                </p>
            </MySpace.Heading>
            <MySpace.Body>
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-4 py-3 font-semibold text-gray-900">#</th>
                                    <th className="px-4 py-3 font-semibold text-gray-900">Họ tên</th>
                                    <th className="px-4 py-3 font-semibold text-gray-900">Email</th>
                                    <th className="px-4 py-3 font-semibold text-gray-900">Số điện thoại</th>
                                    <th className="px-4 py-3 font-semibold text-gray-900">Môn / Level</th>
                                    <th className="px-4 py-3 font-semibold text-gray-900">Trạng thái</th>
                                    <th className="px-4 py-3 font-semibold text-gray-900">Ngày tham gia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedTeachers.map((teacher, index) => (
                                    <tr
                                        key={teacher.id}
                                        className="border-b border-gray-100 hover:bg-gray-50/80 transition"
                                    >
                                        <td className="px-4 py-3 text-gray-500">{start + index + 1}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {teacher.name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{teacher.email}</td>
                                        <td className="px-4 py-3 text-gray-600">{teacher.phone}</td>
                                        <td className="px-4 py-3 text-gray-600">{teacher.subject}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    teacher.status === 'Hoạt động'
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {teacher.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{teacher.joinedAt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3">
                        <p className="text-sm text-gray-600">
                            Hiển thị {start + 1}–{Math.min(start + PAGE_SIZE, totalItems)} / {totalItems}
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                <ChevronLeft className="size-4" />
                                Trước
                            </button>
                            <span className="px-3 py-1.5 text-sm text-gray-600">
                                Trang {currentPage} / {totalPages}
                            </span>
                            <button
                                type="button"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                Sau
                                <ChevronRight className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </MySpace.Body>
        </MySpace>
    )
}
