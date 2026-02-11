import React from 'react'
import { Search } from 'lucide-react'
import { students } from '@/mock/dashboardData'

export default function StudentsPage() {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-gray-800">Danh sách học viên</h3>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm học viên..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option>Tất cả lớp</option>
                        <option>JLPT N5</option>
                        <option>JLPT N4</option>
                        <option>JLPT N3</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Học viên</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Lớp</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tiến độ</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Điểm TB</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tham gia</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((student, idx) => (
                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-4 px-4">
                                    <div className="flex items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full ${student.avatar} flex items-center justify-center text-white font-semibold mr-3`}
                                        >
                                            {student.name.charAt(0)}
                                        </div>
                                        <span className="font-medium text-gray-800">{student.name}</span>
                                    </div>
                                </td>

                                <td className="py-4 px-4">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                        {student.class}
                                    </span>
                                </td>

                                <td className="py-4 px-4">
                                    <div className="flex items-center">
                                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                            <div
                                                className="bg-green-500 rounded-full h-2"
                                                style={{ width: `${student.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium">{student.progress}%</span>
                                    </div>
                                </td>

                                <td className="py-4 px-4">
                                    <span className="font-semibold text-gray-800">{student.score}</span>
                                </td>

                                <td className="py-4 px-4">
                                    <span className="text-sm text-gray-600">{student.attendance}</span>
                                </td>

                                <td className="py-4 px-4">
                                    <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
