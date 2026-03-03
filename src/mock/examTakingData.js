/**
 * Mock câu hỏi làm bài thi: mỗi câu có nội dung + 4 đáp án A, B, C, D.
 * Dùng cho trang /student/exam/:examId.
 */
import { examData } from './examData'
import { getExamQuestions } from './examQuestionsData'

const QUESTIONS_WITH_OPTIONS = [
    {
        order: 1,
        text: '問題1: ______ の ことばは ひらがなで どう かきますか。1 ＊ 2 ＊ 3 ＊ 4 から いちばん いい ものを ひとつ えらんでください。',
        options: [
            { key: 'A', text: 'あ' },
            { key: 'B', text: 'い' },
            { key: 'C', text: 'う' },
            { key: 'D', text: 'え' },
        ],
        correct: 'D',
    },
    {
        order: 2,
        text: "問題2: ______ の ことばは ひらがなで どう かきますか。1 ＊ 2 ＊ 3 ＊ 4 から いちばん いい ものを ひとつ えらんでください。",
        options: [
            { key: 'A', text: 'こんにちは (Konnichiwa)' },
            { key: 'B', text: 'おはようございます (Ohayō gozaimasu)' },
            { key: 'C', text: 'こんばんは (Konbanwa)' },
            { key: 'D', text: 'さようなら (Sayōnara)' },
        ],
        correct: 'B',
    },
    {
        order: 3,
        text: "問題3: ______ の ことばは ひらがなで どう かきますか。1 ＊ 2 ＊ 3 ＊ 4 から いちばん いい ものを ひとつ えらんでください。",
        options: [
            { key: 'A', text: 'すみません (Sumimasen)' },
            { key: 'B', text: 'ありがとう (Arigatō)' },
            { key: 'C', text: 'お願いします (Onegaishimasu)' },
            { key: 'D', text: 'いただきます (Itadakimasu)' },
        ],
        correct: 'B',
    },
    {
        order: 4,
        text: "問題4: ______ の ことばは ひらがなで どう かきますか。1 ＊ 2 ＊ 3 ＊ 4 から いちばん いい ものを ひとつ えらんでください。",
        options: [
            { key: 'A', text: '川 (kawa)' },
            { key: 'B', text: '山 (yama)' },
            { key: 'C', text: '木 (ki)' },
            { key: 'D', text: '人 (hito)' },
        ],
        correct: 'B',
    },
    {
        order: 5,
        text: '問題5: ______ の ことばは ひらがなで どう かきますか。1 ＊ 2 ＊ 3 ＊ 4 から いちばん いい ものを ひとつ えらんでください。',
        options: [
            { key: 'A', text: '赤 (aka - đỏ)' },
            { key: 'B', text: '青 (ao - xanh)' },
            { key: 'C', text: '食べます (Tabemasu - ăn)' },
            { key: 'D', text: '白 (shiro - trắng)' },
        ],
        correct: 'C',
    },
    {
        order: 6,
        text: "問題6: ______ の ことばは ひらがなで どう かきますか。1 ＊ 2 ＊ 3 ＊ 4 から いちばん いい ものを ひとつ えらんでください。",
        options: [
            { key: 'A', text: 'あなた (anata)' },
            { key: 'B', text: '彼 (kare)' },
            { key: 'C', text: '私 (watashi)' },
            { key: 'D', text: '彼女 (kanojo)' },
        ],
        correct: 'C',
    },
    {
        order: 7,
        text: "問題7: ______ の ことばは ひらがなで どう かきますか。1 ＊ 2 ＊ 3 ＊ 4 から いちばん いい ものを ひとつ えらんでください。",
        options: [
            { key: 'A', text: 'いち (ichi)' },
            { key: 'B', text: 'に (ni)' },
            { key: 'C', text: 'さん (san)' },
            { key: 'D', text: 'よん (yon)' },
        ],
        correct: 'C',
    },
    {
        order: 8,
        text: "問題8: ______ の ことばは ひらがなで どう かきますか。1 ＊ 2 ＊ 3 ＊ 4 から いちばん いい ものを ひとつ えらんでください。",
        options: [
            { key: 'A', text: '病院 (byōin - bệnh viện)' },
            { key: 'B', text: '学校 (gakkō - trường học)' },
            { key: 'C', text: '駅 (eki - ga)' },
            { key: 'D', text: '会社 (kaisha - công ty)' },
        ],
        correct: 'B',
    },
    {
        order: 9,
        text: '問題9: ______ の ことばは ひらがなで どう かきますか。1 ＊ 2 ＊ 3 ＊ 4 から いちばん いい ものを ひとつ えらんでください。',
        options: [
            { key: 'A', text: '月曜日 (getsuyōbi)' },
            { key: 'B', text: '水曜日 (suiyōbi)' },
            { key: 'C', text: '土曜日 (doyōbi)' },
            { key: 'D', text: '日曜日 (nichiyōbi)' },
        ],
        correct: 'D',
    },
    {
        order: 10,
        text: "問題10: ______ の ことばは ひらがなで どう かきますか。1 ＊ 2 ＊ 3 ＊ 4 から いちばん いい ものを ひとつ えらんでください。",
        options: [
            { key: 'A', text: 'お元気ですか。(O-genki desu ka.)' },
            { key: 'B', text: 'はじめまして。(Hajimemashite.)' },
            { key: 'C', text: 'いただきます。(Itadakimasu.)' },
            { key: 'D', text: 'ただいま。(Tadaima.)' },
        ],
        correct: 'A',
    },
]

/** Lấy câu hỏi làm bài (có đáp án A/B/C/D) cho đề thi. */
export function getExamTakingQuestions(examId) {
    const exam = examData.find((e) => e.id === examId)
    if (!exam) return []

    const total = Math.min(Number(exam.totalQuestions) || 60, 60)
    const withOptions = QUESTIONS_WITH_OPTIONS.map((q) => ({
        id: `q-${examId}-${q.order}`,
        examId,
        order: q.order,
        text: q.text,
        options: q.options,
        correct: q.correct,
    }))

    if (total <= withOptions.length) {
        return withOptions.slice(0, total)
    }

    const baseQuestions = getExamQuestions(examId)
    const rest = baseQuestions
        .slice(withOptions.length, total)
        .map((q, idx) => ({
            id: q.id,
            examId: q.examId,
            order: withOptions.length + idx + 1,
            text: q.title || q.description || `Câu hỏi ${withOptions.length + idx + 1}`,
            options: [
                { key: 'A', text: 'Đáp án A' },
                { key: 'B', text: 'Đáp án B' },
                { key: 'C', text: 'Đáp án C' },
                { key: 'D', text: 'Đáp án D' },
            ],
            correct: q.correct || 'A',
        }))

    return [...withOptions, ...rest]
}
