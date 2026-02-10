import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { adminRoutes } from './routes'

const routes = [...adminRoutes]

const router = createBrowserRouter(routes)

export default function Router() {
    return <RouterProvider router={router} />
}
