import axiosInstance from '../axiosInstance'

class AdminService {
    /** GET /admin/statistics */
    getStatistics() {
        return axiosInstance.post('/admin/statistics')
    }

    /** GET /admin/users — paginated, filterable */
    getUsers({ page = 1, limit = 20, role, status, search } = {}) {
        return axiosInstance.post('/admin/users', { page, limit, role, status, search })
    }

    /** Update role */
    updateUserRole(userId, role) {
        return axiosInstance.post('/admin/users/update-role', { userId, role })
    }

    /** Toggle active/locked */
    toggleUserStatus(userId) {
        return axiosInstance.post('/admin/users/toggle-status', { userId })
    }

    /** Delete user */
    deleteUser(userId) {
        return axiosInstance.post('/admin/users/delete', { userId })
    }
}

export const adminService = new AdminService()
