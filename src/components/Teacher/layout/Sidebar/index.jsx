import { menuItems } from '@/constants/MenuItem'
import { NavLink } from 'react-router-dom'

export default function TeacherSidebar() {
    return (
        <aside className="w-80 bg-white text-gray-900 transition-all duration-300 flex flex-col border-r border-gray-200 shadow-sm">
            {' '}
            <nav className="flex-1 p-5 space-y-5">
                {menuItems.map(item => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) =>
                            `w-full flex items-center ${'justify-start space-x-3'} p-3 rounded-lg transition ${
                                isActive
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-sm font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}
