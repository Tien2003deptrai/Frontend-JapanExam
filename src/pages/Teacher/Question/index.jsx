import { CourseCard, DropdownCard } from '@/components'
import { questionData } from '@/mock/questionData'

export default function QuestionPage() {
    return (
        <div className="flex flex-wrap gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
                <CourseCard
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
                </CourseCard>
            ))}
        </div>
    )
}
