import { cn } from '@/lib/utils'

export default function QuestionSidebar({
    sectionMeta,
    questions,
    answers,
    flagged,
    currentSection,
    setCurrentSection,
    scrollToQuestion,
}) {
    return (
        <aside
            className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-white overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 56px)', position: 'sticky', top: 56 }}
        >
            <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
                    Danh sách câu hỏi
                </p>

                {sectionMeta.map((sec, secIdx) => (
                    <div key={sec.sectionType} className="mb-4">
                        <button
                            type="button"
                            onClick={() => setCurrentSection(secIdx)}
                            className={cn(
                                'text-xs font-semibold mb-2 cursor-pointer transition-colors',
                                currentSection === secIdx
                                    ? 'text-primary'
                                    : 'text-text-light hover:text-text'
                            )}
                        >
                            {sec.sectionName}
                        </button>

                        <div className="grid grid-cols-6 gap-1.5">
                            {questions
                                .slice(sec.startIdx, sec.startIdx + sec.count)
                                .map((q, qi) => {
                                    const globalIdx = sec.startIdx + qi
                                    const qId = q._qid
                                    const isAnswered = !!answers[qId]
                                    const isFlagged = flagged.has(qId)

                                    return (
                                        <button
                                            key={qId}
                                            type="button"
                                            onClick={() => scrollToQuestion(qId)}
                                            className={cn(
                                                'relative size-8 rounded text-xs font-semibold transition-colors cursor-pointer',
                                                isAnswered
                                                    ? 'bg-primary text-white'
                                                    : 'bg-surface text-text-light hover:bg-border/50'
                                            )}
                                        >
                                            {globalIdx + 1}
                                            {isFlagged && (
                                                <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-orange-500 border border-white" />
                                            )}
                                        </button>
                                    )
                                })}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    )
}
