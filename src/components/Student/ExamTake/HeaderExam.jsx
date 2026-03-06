export default function HeaderExam({ exam, totalMinutes, totalScore }) {
    const showTimer = totalMinutes != null
    const showScore = totalScore != null

    return (
        <header className="sticky top-0 z-10 border-b bg-[#6c757d] shadow-sm">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 py-5">
                <div>
                    <h1 className="text-2xl font-semibold text-white">{exam.title}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <span className="rounded-full bg-[#0dcaf0] px-3 py-1 font-semibold text-white text-sm">
                        Cấp độ: {exam.level}
                    </span>
                    {showTimer && (
                        <span className="rounded-full bg-[#0dcaf0] px-3 py-1 font-semibold text-white text-sm">
                            {totalMinutes} phút
                        </span>
                    )}
                    {showScore && (
                        <span className="rounded-full bg-[#0dcaf0] px-3 py-1 font-semibold text-white text-sm">
                            Tổng điểm: {totalScore}
                        </span>
                    )}
                </div>
            </div>
        </header>
    )
}
