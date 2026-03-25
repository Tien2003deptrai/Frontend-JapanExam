import { cn } from '@/lib/utils'
import { aiService } from '@/services'
import {
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Loader2,
    Sparkles,
    X,
    XCircle,
} from 'lucide-react'
import { useState } from 'react'

export default function ReviewItem({ question, examId }) {
    const [expanded, setExpanded] = useState(false)
    const [aiExplanation, setAiExplanation] = useState(null)
    const [aiTranslation, setAiTranslation] = useState(null)
    const [aiLoading, setAiLoading] = useState(false)
    const [aiError, setAiError] = useState(null)

    const q = question
    const isCorrect = q.isCorrect
    const isSkipped = !q.selectedAnswer

    // Explanation: ưu tiên data gốc, fallback AI
    const explanation = q.explanation || aiExplanation
    const translationVi = q.translationVi || aiTranslation

    const statusClass = isCorrect
        ? 'border-cta/40'
        : isSkipped
          ? 'border-text-muted/40'
          : 'border-destructive/40'

    const statusBg = isCorrect ? 'bg-cta' : isSkipped ? 'bg-text-muted' : 'bg-destructive'

    const handleAiExplain = async () => {
        if (!examId || !q.questionId) return
        setAiLoading(true)
        setAiError(null)
        try {
            const res = await aiService.explainExamQuestion({
                examId,
                questionId: q.questionId,
            })
            const data = res.data
            if (data?.explanation) setAiExplanation(data.explanation)
            if (data?.translationVi) setAiTranslation(data.translationVi)
        } catch (err) {
            setAiError(err?.response?.data?.message || 'Không thể tạo giải thích')
        } finally {
            setAiLoading(false)
        }
    }

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
                    {explanation ? (
                        <div className="rounded-lg bg-cyan-50 border border-primary/20 p-3">
                            <p className="text-xs font-bold text-primary mb-1">
                                Giải thích
                                {aiExplanation && !q.explanation && (
                                    <span className="ml-1.5 inline-flex items-center gap-1 rounded-md bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700">
                                        <Sparkles className="size-2.5" />
                                        AI
                                    </span>
                                )}
                            </p>
                            <p className="text-xs text-primary-dark whitespace-pre-line">
                                {explanation}
                            </p>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleAiExplain}
                            disabled={aiLoading}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer',
                                'bg-linear-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600',
                                'shadow-[0_2px_8px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_12px_rgba(139,92,246,0.35)]',
                                'disabled:opacity-50 disabled:cursor-not-allowed'
                            )}
                        >
                            {aiLoading ? (
                                <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                                <Sparkles className="size-3.5" />
                            )}
                            {aiLoading ? 'Đang tạo giải thích...' : 'Giải thích'}
                        </button>
                    )}

                    {/* AI Error */}
                    {aiError && <p className="text-xs text-destructive font-medium">{aiError}</p>}

                    {/* Translation */}
                    {translationVi && (
                        <div className="rounded-lg bg-purple-50 border border-purple-200 p-3">
                            <p className="text-xs font-bold text-purple-600 mb-1">
                                Dịch nghĩa
                                {aiTranslation && !q.translationVi && (
                                    <span className="ml-1.5 inline-flex items-center gap-1 rounded-md bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700">
                                        <Sparkles className="size-2.5" />
                                        AI
                                    </span>
                                )}
                            </p>
                            <p className="text-xs text-purple-800 whitespace-pre-line">
                                {translationVi}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
