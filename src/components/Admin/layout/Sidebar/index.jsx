import { menuItemsAdmin } from '@/constants/MenuItem'
import { NavLink } from 'react-router-dom'

export default function AdminSidebar() {
    return (
        <aside className="w-80 bg-white text-gray-900 transition-all duration-300 flex flex-col border-r border-gray-200 shadow-sm">
            <nav className="flex-1 p-5 space-y-1">
                {menuItemsAdmin.map(item => {
                    if (item.children) {
                        return (
                            <div key={item.id} className="space-y-1">
                                <div className="flex items-center justify-start space-x-3 p-3 rounded-lg text-gray-700">
                                    <item.icon className="w-6 h-6 shrink-0" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </div>
                                <div className="pl-9 space-y-1">
                                    {item.children.map(child => (
                                        <NavLink
                                            key={child.id}
                                            to={child.path}
                                            className={({ isActive }) =>
                                                `w-full flex items-center justify-start space-x-3 p-2.5 rounded-lg transition text-sm ${
                                                    isActive
                                                        ? 'bg-gray-100 text-gray-900 font-medium'
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                }`
                                            }
                                        >
                                            {child.icon && (
                                                <child.icon className="w-5 h-5 shrink-0" />
                                            )}
                                            <span>{child.label}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                    return (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) =>
                                `w-full flex items-center justify-start space-x-3 p-3 rounded-lg transition ${
                                    isActive
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`
                            }
                        >
                            <item.icon className="w-6 h-6 shrink-0" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </NavLink>
                    )
                })}
            </nav>
        </aside>
    )
}
