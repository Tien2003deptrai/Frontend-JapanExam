import { cn } from '@/lib/utils'
import { formatCountdown } from '@/utils/formatTime'

export default function TimerExam({ secondsLeft }) {
    return (
        <span
            className={cn(
                'text-[28px] font-medium tabular-nums text-center border-3 border-[#ffc107] px-8 py-2 rounded-full text-[#ffc107]'
            )}
        >
            {secondsLeft != null ? formatCountdown(secondsLeft) : '--:--:--'}
        </span>
    )
}
