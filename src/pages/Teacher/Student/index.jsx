import { useState } from 'react'
import { MySpace, StudentCard, Dropdown, HeadingStudent } from '@/components'
import { students as studentList } from '@/mock/dashboardData'

const classOptions = [
    { label: 'Tất cả lớp', value: 'all' },
    { label: 'JLPT N5', value: 'JLPT N5' },
    { label: 'JLPT N4', value: 'JLPT N4' },
    { label: 'JLPT N3', value: 'JLPT N3' },
]

export default function StudentPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedClass, setSelectedClass] = useState('all')

    return (
        <MySpace>
            <MySpace.Heading className="bg-white p-6 shadow-sm">
                <HeadingStudent
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    selectedClass={selectedClass}
                    onClassChange={setSelectedClass}
                    classOptions={classOptions}
                />
            </MySpace.Heading>
            <MySpace.Body>
                <div className="flex flex-wrap gap-4">
                    {studentList.map((student) => (
                        <StudentCard
                            key={`${student.name}-${student.class}`}
                            student={student}
                            className="w-full md:w-[calc(50%-8px)] 2xl:w-[calc(33.333333%-10.666666px)]"
                        >
                            <Dropdown />
                        </StudentCard>
                    ))}
                </div>
            </MySpace.Body>
        </MySpace>
    )
}
