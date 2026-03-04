import { Link } from 'react-router-dom'
import { MessageCircle, Phone, ExternalLink } from 'lucide-react'

const footerLinks = [
    { path: '/student', label: 'Trang chủ' },
    { path: '/student/learn', label: 'Học tiếng Nhật' },
    { path: '/student/jlpt', label: 'Luyện thi JLPT' },
    { path: '/student/library', label: 'Thư viện tài liệu' },
]

const communityLinks = [
    { label: 'Trang Facebook', url: '#' },
    { label: 'Nhóm tiếng Nhật Online', url: '#' },
    { label: 'Nhóm Zalo học tiếng Nhật', url: '#' },
    { label: 'Nhóm Zalo luyện thi', url: '#' },
]

const appLinks = [
    { label: 'Ứng dụng cho iPhone', url: '#' },
    { label: 'Ứng dụng cho Android', url: '#' },
]

export default function StudentFooter() {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Column 1 - Company Info */}
                    <div>
                        <Link to="/student" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">G</span>
                            </div>
                            <span className="text-xl font-bold text-red-600">GOJAPAN</span>
                        </Link>
                        <p className="text-sm text-gray-600 mb-2">
                            Công ty Cổ phần Tập đoàn Giáo dục và Tuyển dụng Unigate
                        </p>
                        <p className="text-sm text-gray-600">MST: 0123456789</p>
                        <p className="text-sm text-gray-600 mb-2">
                            Địa chỉ: Tầng 4, CEO Tower, Mễ Trì, Hà Nội
                        </p>
                        <p className="text-sm text-gray-600">Hotline: 0247.101.9868</p>
                        <p className="text-sm text-gray-600">Email: lienhe@gojapan.vn</p>
                    </div>

                    {/* Column 2 - Links */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Liên kết</h4>
                        <ul className="space-y-2">
                            {footerLinks.map(link => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 - Community */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Cộng đồng</h4>
                        <ul className="space-y-2">
                            {communityLinks.map(link => (
                                <li key={link.label}>
                                    <a
                                        href={link.url}
                                        className="text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4 - Download App */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Tải ứng dụng</h4>
                        <ul className="space-y-2">
                            {appLinks.map(link => (
                                <li key={link.label}>
                                    <a
                                        href={link.url}
                                        className="text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1"
                                    >
                                        {link.label}
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="bg-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm">COPYRIGHT ©2020 Gojapan. ALL RIGHTS RESERVED.</p>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                                aria-label="Messenger"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </button>
                            <a
                                href="tel:02471019868"
                                className="flex items-center gap-2 px-4 py-2 bg-orange-500 rounded-full hover:bg-orange-600 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                <span>0247.101.9868</span>
                            </a>
                            <Link
                                to="/student/trial"
                                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                            >
                                HỌC THỬ MIỄN PHÍ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
