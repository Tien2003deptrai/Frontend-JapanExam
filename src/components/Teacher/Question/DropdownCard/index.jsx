'use client'

import { MoreHorizontal, PencilIcon, TrashIcon, PlusIcon, EyeIcon, HeartIcon } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Fragment } from 'react'

export default function DropdownCard({ onCreate, onEdit, onView, onDelete, onAddToCollection }) {
    const dropdownList = [
        { label: 'Tạo mới', icon: <PlusIcon className="size-5" />, action: onCreate },
        { label: 'Chỉnh sửa', icon: <PencilIcon className="size-5" />, action: onEdit },
        { label: 'Chi tiết', icon: <EyeIcon className="size-5" />, action: onView },
        { label: 'Xóa', icon: <TrashIcon className="size-5" />, action: onDelete },
        {
            label: 'Thêm vào bộ sưu tập',
            icon: <HeartIcon className="size-5" />,
            action: onAddToCollection,
        },
    ]

    return (
        <Fragment>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <MoreHorizontal className="size-5" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" sideOffset={8} className="min-w-[220px] py-3">
                    {dropdownList.map(item => (
                        <DropdownMenuItem
                            inset={false}
                            key={item.label}
                            onSelect={() => item.action?.()}
                            className="h-11 text-sm cursor-pointer"
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
