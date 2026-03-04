import { Outlet } from 'react-router-dom'
import StudentHeader from '@/components/Student/layout/Header'
import StudentFooter from '@/components/Student/layout/Footer'

export default function StudentLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <StudentHeader />
            <main className="flex-1">
                <Outlet />
            </main>
            <StudentFooter />
        </div>
    )
}
