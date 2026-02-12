import { cn } from '@/lib/utils'

export default function SelectToggle({ checked, onToggle, className = '', ...props }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={e => {
                e.stopPropagation()
                onToggle?.()
            }}
            className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                checked ? 'bg-primary' : 'bg-gray-200',
                className
            )}
            {...props}
        >
            <span
                className={cn(
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform',
                    checked ? 'translate-x-5' : 'translate-x-0.5'
                )}
                style={{ marginTop: 1 }}
            />
        </button>
    )
}
