import {
    BookOpen,
    FileText,
    GraduationCap,
    Home,
    LayoutList,
    ScrollText,
    UserCog,
    Users,
} from 'lucide-react'

export const menuItems = [
    { id: 'overview', label: 'Tổng quan', path: '/creator', icon: Home },
    { id: 'question', label: 'Ngân hàng câu hỏi', path: '/creator/question', icon: FileText },
    { id: 'exam', label: 'Quản lý đề thi', path: '/creator/exam', icon: ScrollText },
]

export const menuItemsAdmin = [
    { id: 'admin-overview', label: 'Tổng quan', path: '/admin', icon: Home },
    {
        id: 'admin-users',
        label: 'Quản lý người dùng',
        icon: Users,
        children: [
            { id: 'admin-teachers', label: 'Người tạo đề', path: '/admin/creators', icon: UserCog },
            {
                id: 'admin-students',
                label: 'Người học',
                path: '/admin/learners',
                icon: GraduationCap,
            },
        ],
    },
    {
        id: 'admin-exams',
        label: 'Quản lý đề thi',
        path: '/admin/exams',
        icon: BookOpen,
    },
    {
        id: 'admin-exam-structure',
        label: 'Cấu trúc đề thi',
        path: '/admin/exam-structure',
        icon: LayoutList,
    },
]
