import { MOST_PRACTICED } from '@/mock/praticeData'

export default function MostPracticedSection() {
    return (
        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
                Các đề được luyện nhiều nhất
            </h2>
            <div className="w-full h-px bg-gray-200 mb-4" />
            <div className="flex flex-wrap gap-3 w-full">
                {MOST_PRACTICED.map(({ code, count }) => (
                    <div
                        key={code}
                        className="w-full min-w-0 md:w-[calc(50%-8px)] 2xl:w-[calc(33.333333%-10.666666px)]"
                    >
                        <button
                            type="button"
                            className="relative flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-colors text-left w-full shadow-sm"
                        >
                            <span className="font-semibold text-gray-800">Đề {code}</span>
                            <span className="text-sm text-gray-500 mt-1">
                                {count.toLocaleString('vi-VN')} lượt thi
                            </span>
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}
