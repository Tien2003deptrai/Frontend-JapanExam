import { AdminLayout, StudentLayout, TeacherLayout } from '@/components'
import { NotFoundState } from '@/components/ui'
import {
    AdminExamStructurePage,
    AdminExamsPage,
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
    ProfilePage,
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
            {
                path: 'profile',
                element: <ProtectedRoute element={<ProfilePage />} allowedRoles={[]} />,
            },
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

export const creatorRoutes = [
    {
        path: '/creator',
        element: <ProtectedRoute element={<TeacherLayout />} allowedRoles={['creator', 'admin']} />,
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
            { path: 'creators', element: <AdminTeachersPage /> },
            { path: 'learners', element: <AdminStudentsPage /> },
            { path: 'exams', element: <AdminExamsPage /> },
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
