import { useParams } from 'react-router-dom'
import { MySpace, QuestionCard, DropdownCard, ExamQuestionHeading } from '@/components'
import { examData } from '@/mock/examData'
import { getExamQuestions } from '@/mock/examQuestionsData'

export default function ExamQuestionsPage() {
    const { examId } = useParams()

    const exam = examData.find(e => e.id === examId)
    const questions = getExamQuestions(examId)

    return (
        <MySpace>
            <MySpace.Heading className="bg-white p-5 shadow-sm">
                <ExamQuestionHeading exam={exam} />
            </MySpace.Heading>

            <MySpace.Body>
                <div className="flex flex-wrap gap-4">
                    {questions.map(q => (
                        <QuestionCard
                            key={q.id}
                            data={q}
                            className="w-full md:w-[calc(50%-8px)] 2xl:w-[calc(33.333333%-10.666666px)]"
                        >
                            <div onClick={e => e.stopPropagation()}>
                                <DropdownCard
                                    onCreate={() => {}}
                                    onEdit={() => {}}
                                    onView={() => {}}
                                    onDelete={() => {}}
                                    onAddToCollection={() => {}}
                                />
                            </div>
                        </QuestionCard>
                    ))}
                </div>
            </MySpace.Body>
        </MySpace>
    )
}
