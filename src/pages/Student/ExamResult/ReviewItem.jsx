import { cn } from '@/lib/utils'
import { Check, CheckCircle2, ChevronDown, ChevronUp, X, XCircle } from 'lucide-react'
import { useState } from 'react'

export default function ReviewItem({ question }) {
    const [expanded, setExpanded] = useState(false)
    const q = question
    const isCorrect = q.isCorrect
    const isSkipped = !q.selectedAnswer

    const statusClass = isCorrect
        ? 'border-cta/40'
        : isSkipped
          ? 'border-text-muted/40'
          : 'border-destructive/40'

    const statusBg = isCorrect ? 'bg-cta' : isSkipped ? 'bg-text-muted' : 'bg-destructive'

    return (
        <div className={cn('rounded-xl border-2 overflow-hidden transition-colors', statusClass)}>
            {/* Header */}
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-3 p-3 bg-white hover:bg-background transition-colors cursor-pointer text-left"
            >
                <span
                    className={cn(
                        'flex size-6 items-center justify-center rounded-full text-xs font-bold text-white shrink-0',
                        statusBg
                    )}
                >
                    {isCorrect ? (
                        <Check className="size-3.5" />
                    ) : isSkipped ? (
                        <span>-</span>
                    ) : (
                        <X className="size-3.5" />
                    )}
                </span>
                <p className="text-sm text-text flex-1 truncate">{q.questionText}</p>
                <div className="flex items-center gap-2 shrink-0">
                    {q.sectionType && (
                        <span className="text-[10px] font-semibold text-text-muted uppercase">
                            {q.sectionType}
                        </span>
                    )}
                    {expanded ? (
                        <ChevronUp className="size-4 text-text-muted" />
                    ) : (
                        <ChevronDown className="size-4 text-text-muted" />
                    )}
                </div>
            </button>

            {/* Expanded detail */}
            {expanded && (
                <div className="border-t border-border/50 p-4 bg-surface space-y-3">
                    {q.blockContext && (
                        <div className="rounded-lg bg-white border border-border/50 p-3">
                            <p className="text-xs text-text-light whitespace-pre-line">
                                {q.blockContext}
                            </p>
                        </div>
                    )}

                    <p className="text-sm font-medium text-text">{q.questionText}</p>

                    {/* Options with correct/wrong highlighting */}
                    <div className="grid gap-1.5">
                        {(q.options || []).map(opt => {
                            const isUserChoice = q.selectedAnswer === opt.label
                            const isCorrectAnswer = q.correctAnswer === opt.label
                            let bg = 'bg-white'
                            let border = 'border-border/50'
                            let textColor = 'text-text-light'

                            if (isCorrectAnswer) {
                                bg = 'bg-green-50'
                                border = 'border-cta'
                                textColor = 'text-green-800'
                            } else if (isUserChoice && !isCorrect) {
                                bg = 'bg-red-50'
                                border = 'border-destructive'
                                textColor = 'text-red-800'
                            }

                            return (
                                <div
                                    key={opt.label}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg border-2 p-2.5',
                                        bg,
                                        border
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'flex size-6 items-center justify-center rounded-full border-2 text-xs font-bold shrink-0',
                                            border,
                                            textColor
                                        )}
                                    >
                                        {opt.label}
                                    </span>
                                    <span className={cn('text-sm flex-1', textColor)}>
                                        {opt.text}
                                    </span>
                                    {isCorrectAnswer && (
                                        <CheckCircle2 className="size-4 text-cta shrink-0" />
                                    )}
                                    {isUserChoice && !isCorrectAnswer && (
                                        <XCircle className="size-4 text-destructive shrink-0" />
                                    )}
                                    {isUserChoice && isCorrectAnswer && (
                                        <CheckCircle2 className="size-4 text-cta shrink-0" />
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                        <div className="rounded-lg bg-cyan-50 border border-primary/20 p-3">
                            <p className="text-xs font-bold text-primary mb-1">Giải thích</p>
                            <p className="text-xs text-primary-dark whitespace-pre-line">
                                {q.explanation}
                            </p>
                        </div>
                    )}
                    {q.translationVi && (
                        <div className="rounded-lg bg-purple-50 border border-purple-200 p-3">
                            <p className="text-xs font-bold text-purple-600 mb-1">Dịch nghĩa</p>
                            <p className="text-xs text-purple-800 whitespace-pre-line">
                                {q.translationVi}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
