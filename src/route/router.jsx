import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { adminRoutes, notFoundRoute, publicRoutes, studentRoutes, teacherRoutes } from './routes'

const routes = [...publicRoutes, ...studentRoutes, ...teacherRoutes, ...adminRoutes, notFoundRoute]

const router = createBrowserRouter(routes)

export default function Router() {
    return <RouterProvider router={router} />
}
