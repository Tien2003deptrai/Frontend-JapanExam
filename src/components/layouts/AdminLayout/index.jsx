import { Outlet } from 'react-router-dom'
import { AdminHeader, AdminSidebar } from '@/components'

export default function AdminLayout() {
    return (
        <div className="h-screen bg-gray-100 overflow-hidden flex flex-col">
            <AdminHeader />
            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar />
                <main className="flex-1 overflow-y-auto bg-[#F6F6F6]">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
