import { cn } from '@/lib/utils'
import { Flag } from 'lucide-react'

export default function QuestionItem({
    innerRef,
    question,
    index,
    selectedAnswer,
    isFlagged,
    onAnswer,
    onFlag,
}) {
    const q = question

    return (
        <div
            ref={innerRef}
            className={cn(
                'rounded-xl border-2 bg-white p-4 sm:p-5 transition-colors shadow-sm',
                isFlagged ? 'border-orange-400/50' : 'border-border'
            )}
        >
            {/* Block instruction (context is rendered at group level) */}
            {q.blockInstruction && !q.blockContext?.text && (
                <p className="text-xs text-text-muted italic mb-2">{q.blockInstruction}</p>
            )}

            {/* Question text + flag */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <p className="text-sm font-medium text-text">
                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary text-xs font-bold mr-2 shrink-0">
                        {index + 1}
                    </span>
                    {q.questionText}
                </p>
                <button
                    type="button"
                    onClick={onFlag}
                    title={isFlagged ? 'Bỏ đánh dấu' : 'Đánh dấu câu này'}
                    className={cn(
                        'shrink-0 size-7 rounded-md flex items-center justify-center transition-colors cursor-pointer',
                        isFlagged
                            ? 'bg-orange-500/10 text-orange-500'
                            : 'text-border hover:text-orange-500 hover:bg-orange-500/5'
                    )}
                >
                    <Flag className="size-3.5" />
                </button>
            </div>

            {/* Options */}
            <div className="grid gap-2">
                {(q.options || []).map(opt => {
                    const isSelected = selectedAnswer === opt.label
                    return (
                        <label
                            key={opt.label}
                            className={cn(
                                'flex items-center gap-3 rounded-lg border-2 p-3 cursor-pointer transition-all',
                                isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border/50 hover:border-text-muted hover:bg-background'
                            )}
                        >
                            <input
                                type="radio"
                                name={`q-${q._qid}`}
                                value={opt.label}
                                checked={isSelected}
                                onChange={() => onAnswer(opt.label)}
                                className="sr-only"
                            />
                            <span
                                className={cn(
                                    'flex size-7 items-center justify-center rounded-full border-2 text-xs font-bold shrink-0 transition-colors',
                                    isSelected
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-border text-text-light'
                                )}
                            >
                                {opt.label}
                            </span>
                            <span
                                className={cn(
                                    'text-sm',
                                    isSelected ? 'text-text font-medium' : 'text-text-light'
                                )}
                            >
                                {opt.text}
                            </span>
                        </label>
                    )
                })}
            </div>
        </div>
    )
}
