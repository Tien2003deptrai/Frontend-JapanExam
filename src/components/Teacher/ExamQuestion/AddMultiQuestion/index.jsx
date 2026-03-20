import Modal from '@/components/ui/Modal'
import { cn } from '@/lib/utils'
import { questionData } from '@/mock/questionData'
import { useMemo, useState } from 'react'
import ExamQuestionCard from '../QuestionCard'

export default function AddMultiQuestion({ isOpen, onClose, onSubmit }) {
    const [selectedIds, setSelectedIds] = useState(new Set())

    const toggle = id => {
        setSelectedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const selectAll = () => setSelectedIds(new Set(questionData.map(q => q.id)))
    const clearAll = () => setSelectedIds(new Set())

    const selectedList = useMemo(
        () => questionData.filter(q => selectedIds.has(q.id)),
        [selectedIds]
    )

    const handleSubmit = e => {
        e.preventDefault()
        onSubmit?.(selectedList)
        setSelectedIds(new Set())
        onClose?.()
    }

    if (!isOpen) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Thêm câu hỏi vào đề" className="max-w-3xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                    <span className="text-sm text-gray-600">
                        Đã chọn <strong>{selectedIds.size}</strong> / {questionData.length} câu hỏi
                    </span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={selectAll}
                            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                        >
                            Chọn tất cả
                        </button>
                        <button
                            type="button"
                            onClick={clearAll}
                            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                        >
                            Bỏ chọn
                        </button>
                    </div>
                </div>

                <div className="max-h-[50vh] overflow-y-auto pr-1">
                    <div className="flex flex-wrap gap-3">
                        {questionData.map(q => (
                            <div
                                key={q.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => toggle(q.id)}
                                onKeyDown={e => e.key === 'Enter' && toggle(q.id)}
                                className={cn(
                                    'w-full cursor-pointer rounded-lg transition-[box-shadow,border-color] sm:w-[calc(50%-6px)]'
                                )}
                            >
                                <ExamQuestionCard className="w-full bg-[#F6F6F6]!" data={{ ...q }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(q.id)}
                                        onChange={() => toggle(q.id)}
                                        className="size-5 cursor-pointer accent-blue-600"
                                    />
                                </ExamQuestionCard>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-gray-200 w-30 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={selectedIds.size === 0}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        Thêm {selectedIds.size > 0 ? `(${selectedIds.size})` : ''} vào đề
                    </button>
                </div>
            </form>
        </Modal>
    )
}
