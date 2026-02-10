import useAuthStore from '@/stores/authStore'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ element, allowedRoles }) => {
    const { isAuthenticated, user } = useAuthStore()

    if (!isAuthenticated || !allowedRoles.includes(user?.roles)) {
        return <Navigate to="/not-allowed" replace />
    }

    return element
}

export default ProtectedRoute
