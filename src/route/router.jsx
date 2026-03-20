import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { adminRoutes, publicRoutes, studentRoutes, teacherRoutes } from './routes'

const routes = [
    { path: '/', element: <Navigate to="/login" replace /> },
    ...publicRoutes,
    ...studentRoutes,
    ...teacherRoutes,
    ...adminRoutes,
]

const router = createBrowserRouter(routes)

export default function Router() {
    return <RouterProvider router={router} />
}
