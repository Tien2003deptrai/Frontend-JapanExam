import { FileText, GraduationCap, Home, LayoutList, ScrollText, UserCog, Users } from 'lucide-react'

export const menuItems = [
    { id: 'overview', label: 'Tổng quan', path: '/teacher', icon: Home },
    { id: 'question', label: 'Ngân hàng câu hỏi', path: '/teacher/question', icon: FileText },
    { id: 'exam', label: 'Quản lý đề thi', path: '/teacher/exam', icon: ScrollText },
]

export const menuItemsAdmin = [
    { id: 'admin-overview', label: 'Tổng quan', path: '/admin', icon: Home },
    {
        id: 'admin-users',
        label: 'Quản lý người dùng',
        icon: Users,
        children: [
            { id: 'admin-teachers', label: 'Giáo viên', path: '/admin/teachers', icon: UserCog },
            {
                id: 'admin-students',
                label: 'Học viên',
                path: '/admin/students',
                icon: GraduationCap,
            },
        ],
    },
    {
        id: 'admin-exam-structure',
        label: 'Quản lý cấu trúc đề thi',
        path: '/admin/exam-structure',
        icon: LayoutList,
    },
]
