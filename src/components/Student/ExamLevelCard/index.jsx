import { cn } from '@/lib/utils'

export default function ExamLevelCard({ examLevel, className, ...props }) {
    return (
        <div className={cn("bg-white rounded-lg shadow-sm flex flex-col min-w-0 overflow-hidden", className)} {...props}>
            <div className="flex items-center justify-center rounded-t-lg bg-gradient-to-br from-blue-700 via-blue-500 to-cyan-300 p-4">
                <h1 className="text-2xl font-bold text-white">{examLevel.level}</h1>
            </div>
            <div className="flex flex-col gap-3 items-center justify-center p-5 text-center min-w-0">
                <p className="text-md text-gray-700 font-medium w-full">Cấu trúc đề thi bao gồm:</p>
                <ul className="text-md text-gray-600 space-y-1 w-full list-none px-2 break-words">
                    {Array.isArray(examLevel.sections)
                        ? examLevel.sections.map((section, i) => (
                              <li key={i} className="text-center">
                                  {section}
                              </li>
                          ))
                        : null}
                </ul>
            </div>
            <div className="flex items-center justify-center p-4 pt-0">
                <button className="px-5 py-2.5 rounded-md border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer font-medium whitespace-nowrap">
                    XEM DANH SÁCH ĐỀ THI
                </button>
            </div>
        </div>
    )
}
