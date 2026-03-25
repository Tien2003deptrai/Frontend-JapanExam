import { cn } from '@/lib/utils'
import { Clock } from 'lucide-react'

export default function TimerDisplay({ seconds }) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    const pad = n => String(n).padStart(2, '0')
    const isLow = seconds < 300
    const isCritical = seconds < 60

    return (
        <div
            className={cn(
                'shrink-0 inline-flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-mono font-bold border-2',
                isCritical
                    ? 'bg-red-50 border-destructive text-destructive animate-pulse'
                    : isLow
                      ? 'bg-orange-50 border-warning text-warning'
                      : 'bg-cyan-50 border-primary/20 text-primary'
            )}
        >
            <Clock className="size-3.5" />
            {h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`}
        </div>
    )
}
