'use client'

import { Fragment } from 'react'
import { EyeIcon, MoreHorizontal, PencilIcon, RocketIcon, TrashIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export default function ExamDropdown({ status = 'draft', onView, onEdit, onToggleStatus, onDelete }) {
    const menuItems = [
        { label: 'Chi tiết đề thi', icon: EyeIcon, action: onView },
        { label: 'Chỉnh sửa thông tin', icon: PencilIcon, action: onEdit },
        {
            label: status === 'published' ? 'Chuyển sang nháp' : 'Xuất bản đề thi',
            icon: RocketIcon,
            action: onToggleStatus,
        },
        { label: 'Xóa đề thi', icon: TrashIcon, action: onDelete, variant: 'danger' },
    ]

    return (
        <Fragment>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800">
                        <MoreHorizontal className="size-5" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="min-w-[220px] py-2">
                    {menuItems.map((item) => (
                        <DropdownMenuItem
                            inset={false}
                            key={item.label}
                            onSelect={() => item.action?.()}
                            className={cn(
                                'h-11 text-sm cursor-pointer',
                                'flex items-center gap-3 text-sm',
                            )}
                        >
                            <item.icon className="size-5" />
                            <span>{item.label}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </Fragment>
    )
}
