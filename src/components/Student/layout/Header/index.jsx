import { Link } from 'react-router-dom'

const navLinks = [
    { path: '/student', label: 'Trang chủ' },
    { path: '/student/learn', label: 'Học tiếng Nhật Online' },
    { path: '/student/jlpt', label: 'Luyện thi JLPT' },
    { path: '/student/library', label: 'Thư viện tài liệu' },
]

export default function StudentHeader() {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/student" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">G</span>
                        </div>
                        <span className="text-2xl font-bold text-red-600">GOJAPAN</span>
                    </Link>

                    <nav className="flex items-center gap-6">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
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
