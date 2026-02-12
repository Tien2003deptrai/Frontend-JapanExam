import { useMemo, useState } from 'react'
import { QuestionCard, DropdownCard, MySpace, AddQuestion, QuestionHeading } from '@/components'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { questionData } from '@/mock/questionData'

export default function QuestionPage() {
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('all')

    const filteredQuestions = useMemo(() => {
        if (activeTab === 'all') return questionData
        return questionData.filter(q => q.category === activeTab)
    }, [activeTab])

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="">
            <MySpace>
                <MySpace.Heading className="bg-white p-5">
                    <QuestionHeading setIsOpen={() => setIsOpen(true)} />
                </MySpace.Heading>
                <MySpace.Body>
                    <TabsContent value={activeTab} className="mt-0 w-full outline-none">
                        <div className="flex flex-wrap gap-4">
                            {filteredQuestions.map(q => (
                                <QuestionCard
                                    key={q.id}
                                    data={q}
                                    className="w-full min-w-0 md:w-[calc(50%-8px)] 2xl:w-[calc(33.333333%-10.666666px)]"
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
                    </TabsContent>
                </MySpace.Body>
            </MySpace>
            <AddQuestion isOpen={isOpen} onClose={() => setIsOpen(false)} onSubmit={() => {}} />
        </Tabs>
    )
}
