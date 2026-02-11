import { cn } from '@/lib/utils'
import { XIcon } from 'lucide-react'

export default function Modal({ isOpen, onClose, children, title = '', className = '' }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 opacity-100" onClick={onClose} />
            <div
                className={cn(
                    'relative bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-auto',
                    className
                )}
            >
                <div className="p-5">
                    <div className="flex items-center justify-center relative">
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer absolute top-0 right-0"
                        >
                            <XIcon className="size-5" />
                        </button>
                    </div>
                    <div className="mt-5">{children}</div>
                </div>
            </div>
        </div>
    )
}
