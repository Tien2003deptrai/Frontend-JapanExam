import { Link } from 'react-router-dom'

export default function ExamCodeList({ examCodes, skillLabel }) {
    return (
        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
                Bước 2: Chọn mã đề {skillLabel}
            </h2>
            <div className="flex flex-wrap gap-3 w-full">
                {examCodes.map(({ code }) => (
                    <Link
                        key={code}
                        to={`/student/practice/${code}`}
                        className="relative flex items-center justify-center w-12 h-10 shrink-0 rounded-md border-2 border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50 text-gray-500 font-normal transition-colors"
                    >
                        {code}
                    </Link>
                ))}
            </div>
        </section>
    )
}
