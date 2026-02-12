import { MySpace } from '@/components'
import { iconExam } from '@/constants/IconItem'
import { mockStructures } from '@/mock/structureData'
import { Clock, Plus, Settings2 } from 'lucide-react'

export default function AdminExamStructurePage() {
    return (
        <MySpace>
            <MySpace.Heading className="bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            Quản lý cấu trúc đề thi
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Thiết lập thời gian, số câu và các phần thi theo từng level JLPT.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <Plus className="size-4" />
                        Thêm mẫu cấu trúc
                    </button>
                </div>
            </MySpace.Heading>
            <MySpace.Body>
                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                    {mockStructures.map(structure => (
                        <div
                            key={structure.id}
                            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <img src={iconExam} className="w-12 h-12 rounded-xl" />
                                    <div>
                                        <h2 className="font-semibold text-gray-900">
                                            {structure.label}
                                        </h2>
                                        <div className="mt-0.5 flex items-center gap-2 text-sm text-gray-500">
                                            <Clock className="size-4" />
                                            <span>{structure.duration} phút</span>
                                            <span className="text-gray-300">•</span>
                                            <span>{structure.totalQuestions} câu</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                    title="Chỉnh sửa"
                                >
                                    <Settings2 className="size-5" />
                                </button>
                            </div>
                            <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                                {structure.sections.map((section, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <span className="text-gray-700">{section.name}</span>
                                        <span className="text-gray-500">
                                            {section.count} câu · {section.time} phút
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </MySpace.Body>
        </MySpace>
    )
}
