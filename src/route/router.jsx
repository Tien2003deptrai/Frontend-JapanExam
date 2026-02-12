import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { teacherRoutes, adminRoutes } from './routes'

const routes = [...teacherRoutes, ...adminRoutes]

const router = createBrowserRouter(routes)

export default function Router() {
    return <RouterProvider router={router} />
}
