import { Home, Users, FileText } from 'lucide-react'

export const menuItems = [
    { id: 'overview', label: 'Tổng quan', path: '/teacher', icon: Home },
    { id: 'students', label: 'Học viên', path: '/teacher/students', icon: Users },
    { id: 'question', label: 'Câu hỏi', path: '/teacher/question', icon: FileText },
]
