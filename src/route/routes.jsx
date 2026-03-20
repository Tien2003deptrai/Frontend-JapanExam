import { AdminLayout, StudentLayout, TeacherLayout } from '@/components'
import {
    AdminExamStructurePage,
    AdminOverviewPage,
    AdminStudentsPage,
    AdminTeachersPage,
    ExamListPage,
    ExamPage,
    ExamQuestionsPage,
    ExamTakePage,
    OverviewPage,
    PracticeListPage,
    PracticeTakePage,
    QuestionPage,
    StudentIndexPage,
    StudentPage,
} from '@/pages'
import LoginPage from '@/pages/LoginPage'
import ProtectedRoute from '@/route/ProtectedRoute'

export const studentRoutes = [
    {
        path: '/student',
        element: <StudentLayout />,
        children: [
            { index: true, element: <StudentIndexPage /> },
            { path: 'level/:level', element: <ExamListPage /> },
            { path: 'exam/:examId', element: <ExamTakePage /> },
            { path: 'practice-list', element: <PracticeListPage /> },
            { path: 'practice/:code', element: <PracticeTakePage /> },
        ],
    },
]

export const publicRoutes = [
    {
        path: '/login',
        element: <LoginPage />,
    },
]

export const teacherRoutes = [
    {
        path: '/teacher',
        element: <ProtectedRoute element={<TeacherLayout />} />,
        children: [
            { index: true, element: <OverviewPage /> },
            { path: 'student', element: <StudentPage /> },
            { path: 'question', element: <QuestionPage /> },
            { path: 'exam', element: <ExamPage /> },
            { path: 'exam/:examId/questions', element: <ExamQuestionsPage /> },
        ],
    },
]

export const adminRoutes = [
    {
        path: '/admin',
        element: <ProtectedRoute element={<AdminLayout />} />,
        children: [
            { index: true, element: <AdminOverviewPage /> },
            { path: 'teachers', element: <AdminTeachersPage /> },
            { path: 'students', element: <AdminStudentsPage /> },
            { path: 'exam-structure', element: <AdminExamStructurePage /> },
        ],
    },
]
