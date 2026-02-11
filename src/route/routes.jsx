import TeacherLayout from '@/layouts/TeacherLayout'
import OverviewPage from '@/pages/Teacher/Overview'
import QuestionPage from '@/pages/Teacher/Question'
import StudentsPage from '@/pages/Teacher/Students'
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
