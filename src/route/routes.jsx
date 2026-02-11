import { TeacherLayout } from '@/components'
import { OverviewPage, QuestionPage, ExamPage, StudentPage } from '@/pages'
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
                path: 'student',
                element: <StudentPage />,
            },
            {
                path: 'question',
                element: <QuestionPage />,
            },
            {
                path: 'exam',
                element: <ExamPage />,
            },
        ],
    },
]
