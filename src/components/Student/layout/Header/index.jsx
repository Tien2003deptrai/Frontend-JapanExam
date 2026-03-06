import { logoImage } from '@/constants/IconItem'
import { Link } from 'react-router-dom'

const navLinks = [
    { path: '/student', label: 'Trang chủ' },
    { path: '/student/learn', label: 'Học tiếng Nhật Online' },
    { path: '/student/practice-list', label: 'Luyện thi JLPT' },
    { path: '/student/library', label: 'Thư viện tài liệu' },
]

export default function StudentHeader() {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-3 md:px-4">
                <div className="flex flex-wrap items-center justify-between gap-3 py-3 md:py-0 md:h-16 md:gap-6">
                    <Link to="/student" className="flex items-center gap-2 shrink-0">
                        <img
                            src={logoImage}
                            alt="JLPT Insight"
                            className="w-8 h-8 md:w-10 md:h-10"
                        />
                        <span className="text-lg md:text-2xl font-bold text-gray-800">
                            JLPT Insight
                        </span>
                    </Link>

                    <nav className="flex flex-wrap items-center gap-3 md:gap-6">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-sm md:text-base text-gray-700 hover:text-red-600 font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    )
}
