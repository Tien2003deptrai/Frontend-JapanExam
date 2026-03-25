import { AdminLayout, StudentLayout, TeacherLayout } from '@/components'
import { NotFoundState } from '@/components/ui'
import {
    AdminExamStructurePage,
    AdminOverviewPage,
    AdminStudentsPage,
    AdminTeachersPage,
    CreateExamPage,
    ExamDetailPage,
    ExamListPage,
    ExamPage,
    ExamQuestionsPage,
    ExamResultPage,
    ExamTakePage,
    OverviewPage,
    QuestionPage,
    RegisterPage,
    StudentIndexPage,
} from '@/pages'
import LoginPage from '@/pages/LoginPage'
import ProtectedRoute from '@/route/ProtectedRoute'

export const studentRoutes = [
    {
        path: '/',
        element: <StudentLayout />,
        children: [
            { index: true, element: <StudentIndexPage /> },
            { path: 'level/:level', element: <ExamListPage /> },
            { path: 'exam/:examId', element: <ExamDetailPage /> },
            { path: 'exam/:examId/take', element: <ExamTakePage /> },
            { path: 'exam/:examId/result/:attemptId', element: <ExamResultPage /> },
        ],
    },
]

export const publicRoutes = [
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
]

export const teacherRoutes = [
    {
        path: '/teacher',
        element: <ProtectedRoute element={<TeacherLayout />} allowedRoles={['teacher', 'admin']} />,
        children: [
            { index: true, element: <OverviewPage /> },
            { path: 'question', element: <QuestionPage /> },
            { path: 'exam', element: <ExamPage /> },
            { path: 'exam/create', element: <CreateExamPage /> },
            { path: 'exam/:examId/questions', element: <ExamQuestionsPage /> },
        ],
    },
]

export const adminRoutes = [
    {
        path: '/admin',
        element: <ProtectedRoute element={<AdminLayout />} allowedRoles={['admin']} />,
        children: [
            { index: true, element: <AdminOverviewPage /> },
            { path: 'teachers', element: <AdminTeachersPage /> },
            { path: 'students', element: <AdminStudentsPage /> },
            { path: 'exam-structure', element: <AdminExamStructurePage /> },
        ],
    },
]

export const notFoundRoute = {
    path: '*',
    element: (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <NotFoundState
                title="Không tìm thấy trang"
                message="Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển."
                actionLabel="Về trang chủ"
                onAction={() => (window.location.href = '/')}
            />
        </div>
    ),
}
