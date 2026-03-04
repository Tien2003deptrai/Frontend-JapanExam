import { cn } from '@/lib/utils'

/** Radio: visual tròn. unwrapped = không bọc label (dùng trong label cha). */
export default function Radio({
    id, name, value, checked, onChange, disabled = false,
    unwrapped = false, size = 20, className, ...rest
}) {
    const dot = Math.max(8, Math.round(size * 0.56))
    const Wrapper = unwrapped ? 'span' : 'label'
    return (
        <Wrapper
            htmlFor={unwrapped ? undefined : id}
            className={cn(
                'inline-flex shrink-0 cursor-pointer items-center',
                disabled && 'cursor-not-allowed opacity-50',
                className,
            )}
        >
            <input
                id={id}
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="sr-only"
                aria-checked={checked}
                {...rest}
            />
            <span
                className={cn(
                    'grid shrink-0 place-items-center rounded-full border-2 transition-colors',
                    checked ? 'border-blue-600 bg-blue-600' : 'border-gray-300',
                )}
                style={{ width: size, height: size }}
            >
                <span
                    className={cn('rounded-full bg-white transition-opacity', checked ? 'opacity-100' : 'opacity-0')}
                    style={{ width: dot, height: dot }}
                />
            </span>
        </Wrapper>
    )
}
