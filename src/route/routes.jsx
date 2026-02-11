import { TeacherLayout } from '@/components'
import { OverviewPage, StudentsPage, QuestionPage } from '@/pages'
import ProtectedRoute from '@/route/ProtectedRoute'

// Admin routes, chỉ cho role ADMIN
export const teacherRoutes = [
    {
        path: '/teacher',
        element: <ProtectedRoute element={<TeacherLayout />} />,
        children: [
            {
                index: true,
                element: <OverviewPage />,
            },
            {
                path: 'students',
                element: <StudentsPage />,
            },
            {
                path: 'question',
                element: <QuestionPage />,
            },
        ],
    },
]
