import { Headphones, BookOpen, PenLine, Mic } from 'lucide-react'

export const SKILLS = [
    { id: 'nghe', label: 'Đề thi NGHE', icon: Headphones, count: 42 },
    { id: 'doc', label: 'Đề thi ĐỌC', icon: BookOpen, count: 52 },
    { id: 'viet', label: 'Đề thi VIẾT', icon: PenLine, count: 60 },
    { id: 'noi', label: 'Đề thi NÓI', icon: Mic, count: 162 },
]

export const SKILL_LABELS = {
    nghe: 'NGHE',
    doc: 'ĐỌC',
    viet: 'VIẾT',
    noi: 'NÓI',
}

export function getExamCodesBySkill(skillId) {
    const count = SKILLS.find(s => s.id === skillId)?.count ?? 42
    return Array.from({ length: count }, (_, i) => {
        const code = String(i + 1).padStart(2, '0')
        let isVip = false
        if (skillId === 'nghe') {
            isVip = i >= 9 && i < 41
        } else {
            isVip = i % 3 === 0
        }
        return { code, isVip }
    })
}

export const MOST_PRACTICED = [
    { code: '01', count: 24941, isVip: false },
    { code: '02', count: 14657, isVip: false },
    { code: '03', count: 8895, isVip: false },
    { code: '04', count: 7412, isVip: false },
    { code: '05', count: 6130, isVip: false },
    { code: '10', count: 5619, isVip: true },
    { code: '11', count: 3735, isVip: true },
    { code: '13', count: 3274, isVip: true },
    { code: '16', count: 2803, isVip: true },
]

// --- Mock câu hỏi riêng cho luyện đề (practice) ---

const PRACTICE_QUESTIONS_BASE = [
    {
        order: 1,
        text: '【Luyện】問題1: ______ の ことばは ひらがなで どう かきますか。1 ＊ 2 ＊ 3 ＊ 4 から いちばん いい ものを ひとつ えらんでください。',
        options: [
            { key: 'A', text: 'あ' },
            { key: 'B', text: 'い' },
            { key: 'C', text: 'う' },
            { key: 'D', text: 'え' },
        ],
        correct: 'A',
    },
    {
        order: 2,
        text: '【Luyện】問題2: 次の ことばの 読み方は どれですか。',
        options: [
            { key: 'A', text: 'にほん' },
            { key: 'B', text: 'にっぽん' },
            { key: 'C', text: 'にほんご' },
            { key: 'D', text: 'にちよう' },
        ],
        correct: 'A',
    },
    {
        order: 3,
        text: '【Luyện】問題3: ______ に 何を 入れますか。',
        options: [
            { key: 'A', text: 'です' },
            { key: 'B', text: 'だ' },
            { key: 'C', text: 'である' },
            { key: 'D', text: 'でした' },
        ],
        correct: 'A',
    },
    {
        order: 4,
        text: '【Luyện】問題4: 正しい 文は どれですか。',
        options: [
            { key: 'A', text: 'わたしは 学生です。' },
            { key: 'B', text: 'わたしは 学生だ。' },
            { key: 'C', text: 'わたしは 学生。' },
            { key: 'D', text: 'わたし 学生です。' },
        ],
        correct: 'A',
    },
    {
        order: 5,
        text: '【Luyện】問題5: きのう ______ を 読みました。',
        options: [
            { key: 'A', text: 'ほん' },
            { key: 'B', text: 'てがみ' },
            { key: 'C', text: 'しんぶん' },
            { key: 'D', text: 'じしょ' },
        ],
        correct: 'A',
    },
    {
        order: 6,
        text: '【Luyện】問題6: あした 天気が ______ でしょう。',
        options: [
            { key: 'A', text: 'いい' },
            { key: 'B', text: 'よい' },
            { key: 'C', text: 'いいてんき' },
            { key: 'D', text: 'はれる' },
        ],
        correct: 'A',
    },
    {
        order: 7,
        text: '【Luyện】問題7: これは ______ の 本です。',
        options: [
            { key: 'A', text: 'わたし' },
            { key: 'B', text: 'わたしの' },
            { key: 'C', text: 'わたしは' },
            { key: 'D', text: 'わたしに' },
        ],
        correct: 'B',
    },
    {
        order: 8,
        text: '【Luyện】問題8: 毎日 何 ______ 起きますか。',
        options: [
            { key: 'A', text: '時に' },
            { key: 'B', text: '時間に' },
            { key: 'C', text: '時が' },
            { key: 'D', text: '時間が' },
        ],
        correct: 'A',
    },
    {
        order: 9,
        text: '【Luyện】問題9: 日本 ______ 来ました。',
        options: [
            { key: 'A', text: 'から' },
            { key: 'B', text: 'まで' },
            { key: 'C', text: 'に' },
            { key: 'D', text: 'で' },
        ],
        correct: 'C',
    },
    {
        order: 10,
        text: '【Luyện】問題10: この りんごは ______ おいしいです。',
        options: [
            { key: 'A', text: 'とても' },
            { key: 'B', text: 'もう' },
            { key: 'C', text: 'まだ' },
            { key: 'D', text: 'また' },
        ],
        correct: 'A',
    },
]

/** Số câu hỏi mặc định cho mỗi đề luyện */
const DEFAULT_PRACTICE_QUESTION_COUNT = 10

/**
 * Tạo danh sách câu hỏi practice đúng format (có id) theo mã đề.
 */
function getPracticeQuestions(code) {
    const prefix = `practice-${code}`
    const total = Math.min(DEFAULT_PRACTICE_QUESTION_COUNT, PRACTICE_QUESTIONS_BASE.length)
    return PRACTICE_QUESTIONS_BASE.slice(0, total).map(q => ({
        id: `${prefix}-${q.order}`,
        order: q.order,
        text: q.text,
        options: q.options,
        correct: q.correct,
    }))
}

/**
 * Lấy thông tin đề luyện (exam + questions) theo mã đề.
 */
export function getPracticeExam(code) {
    const exam = {
        title: `Luyện đề - Mã đề ${code}`,
        level: 'Luyện tập',
    }
    const questions = getPracticeQuestions(code)
    return { exam, questions }
}
