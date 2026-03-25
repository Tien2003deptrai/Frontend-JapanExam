import { Outlet } from 'react-router-dom'
import StudentFooter from './StudentFooter'
import StudentHeader from './StudentHeader'

export default function StudentLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <StudentHeader />
            <main className="flex-1">
                <Outlet />
            </main>
            <StudentFooter />
        </div>
    )
}
