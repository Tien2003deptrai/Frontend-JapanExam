import { ExamLevelCard } from '@/components'

const jlptLevels = [
    {
        level: 'N5',
        sections: ['Từ vựng - Ngữ pháp - Đọc hiểu (75 ph)', 'Nghe (30 ph)'],
    },
    {
        level: 'N4',
        sections: ['Từ vựng - Ngữ pháp - Đọc hiểu (90 ph)', 'Nghe (35 ph)'],
    },
    {
        level: 'N3',
        sections: ['Từ vựng - Ngữ pháp - Đọc hiểu (90 ph)', 'Nghe (35 ph)'],
    },
    {
        level: 'N2',
        sections: ['Từ vựng - Ngữ pháp - Đọc hiểu (105 ph)', 'Nghe (50 ph)'],
    },
    {
        level: 'N1',
        sections: ['Từ vựng - Ngữ pháp - Đọc hiểu (110 ph)', 'Nghe (60 ph)'],
    },
]

export default function StudentIndexPage() {
    return (
        <div>
            {/* Hero Section */}
            <section>
                <img src="https://gojapan.vn/thi-thu-jlpt/wp-content/uploads/2021/07/Banner-GoJa-1920x1080-1.jpg" alt="Hero" className="w-full h-full object-cover" />
            </section>

            {/* JLPT Level Selection Section */}
            <section className="max-w-7xl mx-auto py-16 px-4">
                <div className="flex flex-wrap gap-4">
                    {jlptLevels.map((jlpt) => (
                        <ExamLevelCard
                            key={jlpt.level}
                            examLevel={jlpt}
                            className="w-full min-w-0 md:w-[calc(50%-8px)] 2xl:w-[calc(33.333333%-10.666666px)]"
                        />
                    ))}
                </div>
            </section>
        </div>
    )
}
