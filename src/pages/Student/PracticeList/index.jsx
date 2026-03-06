import { useState } from 'react'
import { getExamCodesBySkill, SKILL_LABELS } from '@/mock/praticeData'
import { PracticeListHeader, SkillTabList, ExamCodeList, MostPracticedSection } from '@/components'

export default function PracticeListPage() {
    const [selectedSkill, setSelectedSkill] = useState('nghe')
    const examCodes = getExamCodesBySkill(selectedSkill)
    const skillLabel = SKILL_LABELS[selectedSkill]

    return (
        <div className="bg-white min-h-screen">
            <PracticeListHeader />

            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                <SkillTabList selectedSkill={selectedSkill} onSelectSkill={setSelectedSkill} />
                <ExamCodeList examCodes={examCodes} skillLabel={skillLabel} />
                <MostPracticedSection />
            </div>
        </div>
    )
}
