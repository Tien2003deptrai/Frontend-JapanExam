import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { teacherRoutes } from './routes'

const routes = [...teacherRoutes]

const router = createBrowserRouter(routes)

export default function Router() {
    return <RouterProvider router={router} />
}
