import { QuestionCard, DropdownCard, MySpace, AddQuestion } from '@/components'
import { questionData } from '@/mock/questionData'
import { PlusIcon } from 'lucide-react'
import { Fragment, useState } from 'react'

export default function QuestionPage() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Fragment>
            <MySpace>
                <MySpace.Heading className="bg-white p-5">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-900">Quản lý câu hỏi</h1>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="flex items-center gap-2 py-2 px-3 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 cursor-pointer"
                        >
                            <PlusIcon className="size-4" /> Tạo câu hỏi
                        </button>
                    </div>
                </MySpace.Heading>
                <MySpace.Body>
                    <div className="flex flex-wrap gap-4">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <QuestionCard
                                data={questionData[0]}
                                className="w-full md:w-[calc(50%-13.333333px)] 2xl:w-[calc(33.333333%-13.333333px)]"
                                key={index}
                            >
                                <DropdownCard
                                    onCreate={() => {}}
                                    onEdit={() => {}}
                                    onView={() => {}}
                                    onDelete={() => {}}
                                    onAddToCollection={() => {}}
                                />
                            </QuestionCard>
                        ))}
                    </div>
                </MySpace.Body>
            </MySpace>
            <AddQuestion
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={() => {}}
            />
        </Fragment>
    )
}
