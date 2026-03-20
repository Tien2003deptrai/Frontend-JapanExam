'use client'

import AddQuestion from '@/components/Teacher/Question/AddQuestion'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EyeIcon, HeartIcon, MoreHorizontal, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { Fragment, useState } from 'react'

export default function DropdownCard({ onCreate, onEdit, onView, onDelete, onAddToCollection }) {
    const [modalKey, setModalKey] = useState(false)

    const dropdownList = [
        { label: 'Tạo mới', icon: <PlusIcon className="size-5" />, action: onCreate },
        {
            label: 'Chỉnh sửa',
            icon: <PencilIcon className="size-5" />,
            action: () => setModalKey(true),
        },
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
                    <div onClick={e => e.stopPropagation()}>
                        <MoreHorizontal className="size-5 cursor-pointer hover:text-gray-600" />
                    </div>
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

            {modalKey && (
                <AddQuestion
                    isOpen={modalKey}
                    onClose={() => setModalKey(false)}
                    onSubmit={() => {}}
                />
            )}
        </Fragment>
    )
}
