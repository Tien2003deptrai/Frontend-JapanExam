import { Home, Users, FileText, ScrollText } from 'lucide-react'

export const menuItems = [
    { id: 'overview', label: 'Tổng quan', path: '/teacher', icon: Home },
    { id: 'student', label: 'Quản lý học viên', path: '/teacher/student', icon: Users },
    { id: 'question', label: 'Ngân hàng câu hỏi', path: '/teacher/question', icon: FileText },
    { id: 'exam', label: 'Quản lý đề thi', path: '/teacher/exam', icon: ScrollText },
]
