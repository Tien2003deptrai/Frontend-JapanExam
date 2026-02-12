import { BarChart3, BookOpen, Calendar, Clock, FileText, TrendingUp, Users } from 'lucide-react'
import { recentAssignments, stats, upcomingLessons } from '@/mock/dashboardData'

export default function OverviewPage() {
    return (
        <div className="space-y-6 p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Tổng học viên</p>
                            <p className="text-3xl font-bold mt-2">{stats.totalStudents}</p>
                        </div>
                        <Users className="w-12 h-12 text-blue-200" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>+12% so với tháng trước</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Lớp đang dạy</p>
                            <p className="text-3xl font-bold mt-2">{stats.activeClasses}</p>
                        </div>
                        <BookOpen className="w-12 h-12 text-green-200" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span>4 lớp sáng, 4 lớp chiều</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Bài tập chờ chấm</p>
                            <p className="text-3xl font-bold mt-2">{stats.pendingAssignments}</p>
                        </div>
                        <FileText className="w-12 h-12 text-orange-200" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>5 bài hết hạn hôm nay</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Tiến độ TB</p>
                            <p className="text-3xl font-bold mt-2">{stats.averageProgress}%</p>
                        </div>
                        <BarChart3 className="w-12 h-12 text-purple-200" />
                    </div>
                    <div className="mt-4">
                        <div className="w-full bg-purple-400 rounded-full h-2">
                            <div
                                className="bg-white rounded-full h-2"
                                style={{ width: `${stats.averageProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                            Lịch dạy hôm nay
                        </h3>
                        <button className="text-blue-500 text-sm font-medium hover:underline">
                            Xem tất cả
                        </button>
                    </div>
                    <div className="space-y-3">
                        {upcomingLessons.map(lesson => (
                            <div
                                key={lesson.id}
                                className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg hover:bg-blue-100 transition"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {lesson.title}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">{lesson.class}</p>
                                    </div>
                                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                                        {lesson.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-orange-500" />
                            Bài tập gần đây
                        </h3>
                        <button className="text-orange-500 text-sm font-medium hover:underline">
                            Xem tất cả
                        </button>
                    </div>
                    <div className="space-y-3">
                        {recentAssignments.map(assignment => (
                            <div
                                key={assignment.id}
                                className="border border-gray-200 p-4 rounded-lg hover:border-orange-300 transition"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {assignment.title}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {assignment.class}
                                        </p>
                                    </div>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                        Hạn: {assignment.dueDate}
                                    </span>
                                </div>
                                <div className="flex items-center mt-3">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                        <div
                                            className="bg-orange-500 rounded-full h-2"
                                            style={{
                                                width: `${(assignment.submitted / assignment.total) * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {assignment.submitted}/{assignment.total}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
