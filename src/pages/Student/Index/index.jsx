import Button from '@/components/ui/Button'
import { JLPT_LEVELS, LEVEL_COLORS } from '@/utils/helpers'
import { ArrowRight, Award, BookOpen, Clock, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const levelInfo = {
    N5: { label: 'Sơ cấp', duration: '105 phút', desc: 'Từ vựng · Ngữ pháp · Đọc · Nghe' },
    N4: { label: 'Sơ trung cấp', duration: '125 phút', desc: 'Từ vựng · Ngữ pháp · Đọc · Nghe' },
    N3: { label: 'Trung cấp', duration: '125 phút', desc: 'Từ vựng · Ngữ pháp · Đọc · Nghe' },
    N2: { label: 'Trung cao cấp', duration: '155 phút', desc: 'Từ vựng · Ngữ pháp · Đọc · Nghe' },
    N1: { label: 'Cao cấp', duration: '170 phút', desc: 'Từ vựng · Ngữ pháp · Đọc · Nghe' },
}

const features = [
    {
        icon: BookOpen,
        title: 'Đề thi phong phú',
        desc: 'Hàng trăm đề thi mô phỏng theo chuẩn JLPT',
    },
    { icon: Clock, title: 'Giới hạn thời gian', desc: 'Luyện thi với thời gian thực như thi thật' },
    { icon: Award, title: 'Chấm điểm tự động', desc: 'Xem kết quả và giải thích chi tiết ngay' },
    { icon: Users, title: 'Miễn phí', desc: 'Hoàn toàn miễn phí cho tất cả học viên' },
]

export default function StudentIndexPage() {
    return (
        <div>
            {/* ── Hero Section ── */}
            <section className="relative bg-linear-to-br from-primary-dark via-primary to-primary-light overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 size-80 bg-white/5 rounded-full" />
                <div className="absolute -bottom-10 -left-10 size-60 bg-white/5 rounded-full" />

                <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
                    <div className="max-w-2xl">
                        <span className="inline-block px-3 py-1 bg-white/15 text-white text-sm font-medium rounded-full mb-4 backdrop-blur-sm">
                            日本語能力試験
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                            Luyện thi JLPT <span className="text-secondary">trực tuyến</span>
                        </h1>
                        <p className="text-lg text-white/80 mb-8 leading-relaxed">
                            Hệ thống đề thi mô phỏng chuẩn JLPT từ N5 đến N1. Luyện tập không giới
                            hạn, chấm điểm tự động, giải thích chi tiết.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link to="#levels">
                                <Button size="lg" className="shadow-lg">
                                    Bắt đầu luyện thi
                                    <ArrowRight className="size-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map(f => (
                        <div
                            key={f.title}
                            className="bg-white rounded-xl border border-border-light p-5 shadow-sm flex items-start gap-4"
                        >
                            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <f.icon className="size-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-text text-sm">{f.title}</h3>
                                <p className="text-xs text-text-light mt-1">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Level Cards ── */}
            <section id="levels" className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-text">Chọn cấp độ JLPT</h2>
                    <p className="text-text-light mt-2">Chọn cấp độ phù hợp với trình độ của bạn</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {JLPT_LEVELS.map(level => {
                        const info = levelInfo[level]
                        const colors = LEVEL_COLORS[level]
                        return (
                            <Link
                                key={level}
                                to={`/level/${level.toLowerCase()}`}
                                className="group bg-white rounded-xl border border-border-light p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                            >
                                <div
                                    className={`inline-flex items-center justify-center size-14 rounded-xl ${colors.bg} mb-4`}
                                >
                                    <span className={`text-2xl font-bold ${colors.text}`}>
                                        {level}
                                    </span>
                                </div>
                                <h3 className="font-bold text-text text-lg mb-1">{info.label}</h3>
                                <p className="text-xs text-text-muted mb-3">{info.desc}</p>
                                <div className="flex items-center gap-1.5 text-xs text-text-light">
                                    <Clock className="size-3.5" />
                                    <span>{info.duration}</span>
                                </div>
                                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    Xem đề thi
                                    <ArrowRight className="size-4" />
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}
