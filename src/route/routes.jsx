import { TeacherLayout, AdminLayout } from '@/components'
import {
    OverviewPage,
    QuestionPage,
    ExamPage,
    ExamQuestionsPage,
    StudentPage,
    AdminOverviewPage,
    AdminTeachersPage,
    AdminStudentsPage,
    AdminExamStructurePage,
} from '@/pages'
import ProtectedRoute from '@/route/ProtectedRoute'

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
