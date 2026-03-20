import {
    AddQuestion,
    DropdownCard,
    ImportQuestion,
    MySpace,
    QuestionCard,
    QuestionHeading,
} from '@/components'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { questionData } from '@/mock/questionData'
import { Fragment, useCallback, useMemo, useState } from 'react'

export default function QuestionPage() {
    const [addOpen, setAddOpen] = useState(false)
    const [importOpen, setImportOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('all')
    const [refreshKey, setRefreshKey] = useState(0)

    const handleCreated = useCallback(() => {
        // Increment key to trigger future data re-fetch when list API is wired
        setRefreshKey(k => k + 1)
        setAddOpen(false)
    }, [])

    const filteredQuestions = useMemo(() => {
        if (activeTab === 'all') return questionData
        return questionData.filter(q => q.category === activeTab)
    }, [activeTab])

    return (
        <Fragment>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="">
                <MySpace>
                    <MySpace.Heading className="bg-white p-5">
                        <QuestionHeading
                            onOpenAdd={() => setAddOpen(true)}
                            onOpenImport={() => setImportOpen(true)}
                        />
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
            </Tabs>
            <AddQuestion
                isOpen={addOpen}
                onClose={() => setAddOpen(false)}
                onSubmit={handleCreated}
            />
            <ImportQuestion
                isOpen={importOpen}
                onClose={() => setImportOpen(false)}
                onImport={() => {}}
            />
        </Fragment>
    )
}
