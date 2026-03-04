import { cn } from '@/lib/utils'

const SECTION_LABEL = '問題'

/**
 * Sidebar điều hướng câu hỏi theo từng 問題 (section).
 * @param {Object} props
 * @param {Array<Array<{ id: string, order: number }>>} props.sections - Mảng các section, mỗi phần tử là mảng câu hỏi
 * @param {number} props.questionsPerSection
 * @param {Record<string, string>} props.answers - Map questionId -> selected key
 * @param {function(number): void} props.onScrollToQuestion - Gọi với index câu (0-based)
 */
export default function ExamQuestionNav({
    sections,
    questionsPerSection,
    answers,
    onScrollToQuestion,
}) {
    return (
        <div className="p-5 flex flex-col gap-4">
            {sections.map((sectionQuestions, sectionIdx) => {
                if (!sectionQuestions?.length) return null
                const startIndex = sectionIdx * questionsPerSection

                return (
                    <div key={sectionIdx} className="px-10">
                        <p className="text-xl font-normal text-gray-700 mb-2">
                            {SECTION_LABEL}{sectionIdx + 1}:
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {sectionQuestions.map((q, i) => {
                                const globalIndex = startIndex + i
                                const isAnswered = answers[q.id] != null
                                return (
                                    <button
                                        key={q.id}
                                        type="button"
                                        onClick={() =>
                                            onScrollToQuestion(globalIndex)
                                        }
                                        className={cn(
                                            'w-8 h-8 rounded-full border-4 text-sm font-medium transition-colors',
                                            isAnswered
                                                ? 'border-blue-500 bg-blue-500 text-white'
                                                : 'border-blue-500 bg-white text-blue-600 hover:bg-blue-50',
                                        )}
                                    >
                                        {q.order}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
