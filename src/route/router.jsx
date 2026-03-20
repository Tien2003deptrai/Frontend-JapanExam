import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { adminRoutes, studentRoutes, teacherRoutes } from './routes'

const routes = [
    { path: '/', element: <Navigate to="/login" replace /> },
    ...studentRoutes,
    ...teacherRoutes,
    ...adminRoutes,
]

const router = createBrowserRouter(routes)

export default function Router() {
    return <RouterProvider router={router} />
}
