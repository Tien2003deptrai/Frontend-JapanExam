import { Bell, Search } from 'lucide-react'
import { imageIcon, logoImage } from '@/constants/IconItem'

export default function TeacherHeader() {
    const showNotifications = false

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 z-10">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src={logoImage}
                            className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                        <span className="text-2xl font-bold text-gray-800">Sensei Tanaka</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="pl-10 pr-4 py-2 w-90 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div className="relative">
                            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                                <Bell className="w-6 h-6 text-gray-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                                    <div className="p-4 border-b border-gray-200">
                                        <h3 className="font-semibold text-gray-800">Thông báo</h3>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-800">Sensei Tanaka</p>
                                <p className="text-xs text-gray-600">Giáo viên</p>
                            </div>
                            <img src={imageIcon} className="w-10 h-10 rounded-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
