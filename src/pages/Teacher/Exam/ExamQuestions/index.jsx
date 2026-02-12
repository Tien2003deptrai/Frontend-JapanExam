import { useParams } from 'react-router-dom'
import {
    MySpace,
    DropdownCard,
    ExamQuestionHeading,
    AddMultiQuestion,
    ExamQuestionCard,
    DropdownExamQuestion,
} from '@/components'
import { examData } from '@/mock/examData'
import { getExamQuestions } from '@/mock/examQuestionsData'
import { Fragment, useState } from 'react'

export default function ExamQuestionsPage() {
    const [isOpen, setIsOpen] = useState(false)
    const { examId } = useParams()

    const exam = examData.find(e => e.id === examId)
    const questions = getExamQuestions(examId)

    return (
        <Fragment>
            <MySpace>
                <MySpace.Heading className="bg-white p-5 shadow-sm">
                    <ExamQuestionHeading exam={exam} setIsOpen={() => setIsOpen(true)} />
                </MySpace.Heading>

                <MySpace.Body>
                    <div className="flex flex-wrap gap-4">
                        {questions.map(q => (
                            <ExamQuestionCard
                                key={q.id}
                                data={q}
                                className="w-full md:w-[calc(50%-8px)] 2xl:w-[calc(33.333333%-10.666666px)]"
                            >
                                <div onClick={e => e.stopPropagation()}>
                                    <DropdownExamQuestion onView={() => {}} onDelete={() => {}} />
                                </div>
                            </ExamQuestionCard>
                        ))}
                    </div>
                </MySpace.Body>
            </MySpace>
            {isOpen && (
                <AddMultiQuestion
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onSubmit={() => {}}
                />
            )}
        </Fragment>
    )
}
