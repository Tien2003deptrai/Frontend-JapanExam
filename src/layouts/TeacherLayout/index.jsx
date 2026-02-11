import { Outlet } from 'react-router-dom'
import { TeacherHeader, TeacherSidebar } from '@/components'

export default function TeacherLayout() {
    return (
        <div className="h-screen bg-gray-100 overflow-hidden flex flex-col">
            <TeacherHeader />
            <div className="flex flex-1 overflow-hidden">
                <TeacherSidebar />
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
