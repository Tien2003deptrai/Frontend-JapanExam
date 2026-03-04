import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { teacherRoutes, adminRoutes, studentRoutes } from './routes'

const routes = [...studentRoutes, ...teacherRoutes, ...adminRoutes]

const router = createBrowserRouter(routes)

export default function Router() {
    return <RouterProvider router={router} />
}
