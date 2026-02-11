'use client'

import { Fragment } from 'react'
import { MoreHorizontal, EyeIcon, MessageSquare, RefreshCw, TrashIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'

/**
 * @param {{ onView?: () => void; onMessage?: () => void; onChangeClass?: () => void; onRemove?: () => void }} props
 */

export default function Dropdown({ onView, onMessage, onChangeClass, onRemove } = {}) {
    const menuItems = [
        { label: 'Xem chi tiết', icon: <EyeIcon className="size-5" />, action: onView },
        { label: 'Gửi tin nhắn', icon: <MessageSquare className="size-5" />, action: onMessage },
        { label: 'Điều chỉnh lớp học', icon: <RefreshCw className="size-5" />, action: onChangeClass },
        { label: 'Loại khỏi lớp', icon: <TrashIcon className="size-5" />, action: onRemove },
    ]

    return (
        <Fragment>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800">
                        <MoreHorizontal className="size-5" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="min-w-[220px] py-3">
                    {menuItems.map((item) => (
                        <DropdownMenuItem
                            inset={false}
                            key={item.label}
                            className="h-11 text-sm cursor-pointer"
                            onSelect={() => item.action?.()}
                        >
                            <span className="mr-3">{item.icon}</span>
                            <span>{item.label}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </Fragment>
    )
}
