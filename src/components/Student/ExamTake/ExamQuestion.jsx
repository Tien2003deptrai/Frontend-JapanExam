import { Label } from '@/components/ui/label'
import Radio from '@/components/ui/Radio'
import { cn } from '@/lib/utils'

/** Một block câu hỏi trắc nghiệm với 4 đáp án A/B/C/D, dùng Radio. */
export default function ExamQuestion({
    question,
    value,
    onValueChange,
    className = '',
}) {
    return (
        <div className={cn(className)}>
            <p className="mb-5 text-base text-gray-900">
                {question.order}. {question.text}
            </p>
            <div className="grid gap-2">
                {question.options.map((opt) => {
                    const inputId = `${question.id}-${opt.key}`
                    const isChecked = value === opt.key
                    return (
                        <Label
                            key={opt.key}
                            htmlFor={inputId}
                            className={'flex cursor-pointer items-center gap-3 rounded p-2 transition-colors'}
                        >
                            <div className="flex items-center gap-3">
                                <Radio
                                    className="size-6"
                                    id={inputId}
                                    name={question.id}
                                    value={opt.key}
                                    checked={isChecked}
                                    onChange={(e) =>
                                        onValueChange(e.target.value)
                                    }
                                    size={20}
                                />
                                <span className="text-base leading-tight text-gray-800">
                                    {opt.text}
                                </span>
                            </div>
                        </Label>
                    )
                })}
            </div>
        </div>
    )
}
