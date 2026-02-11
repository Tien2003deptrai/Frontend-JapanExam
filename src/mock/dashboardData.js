export const stats = {
    totalStudents: 124,
    activeClasses: 8,
    pendingAssignments: 15,
    averageProgress: 78,
}

export const classes = [
    {
        id: 1,
        name: 'JLPT N5 基礎',
        students: 25,
        level: 'N5',
        schedule: 'Thứ 2, 4, 6 - 18:00',
        progress: 65,
    },
    {
        id: 2,
        name: 'JLPT N4 中級',
        students: 18,
        level: 'N4',
        schedule: 'Thứ 3, 5, 7 - 19:00',
        progress: 72,
    },
    {
        id: 3,
        name: 'JLPT N3 上級',
        students: 15,
        level: 'N3',
        schedule: 'Thứ 2, 4 - 20:00',
        progress: 58,
    },
    {
        id: 4,
        name: 'Hiragana & Katakana',
        students: 30,
        level: 'Beginner',
        schedule: 'Thứ 2, 3, 4, 5 - 17:00',
        progress: 85,
    },
]

export const recentAssignments = [
    {
        id: 1,
        title: 'Kanji Quiz - Chapter 5',
        class: 'JLPT N5',
        submitted: 20,
        total: 25,
        dueDate: '2026-02-15',
    },
    {
        id: 2,
        title: 'Grammar Exercise - て形',
        class: 'JLPT N4',
        submitted: 15,
        total: 18,
        dueDate: '2026-02-14',
    },
    {
        id: 3,
        title: 'Reading Comprehension',
        class: 'JLPT N3',
        submitted: 12,
        total: 15,
        dueDate: '2026-02-13',
    },
]

export const upcomingLessons = [
    {
        id: 1,
        title: 'Verb Conjugation Practice',
        class: 'JLPT N5',
        time: '18:00 - 19:30',
        date: '2026-02-12',
    },
    {
        id: 2,
        title: 'Particle Usage (は vs が)',
        class: 'JLPT N4',
        time: '19:00 - 20:30',
        date: '2026-02-12',
    },
    {
        id: 3,
        title: 'Kanji Writing Workshop',
        class: 'JLPT N3',
        time: '20:00 - 21:30',
        date: '2026-02-12',
    },
]

export const notifications = [
    {
        id: 1,
        message: 'Nguyễn Văn A đã nộp bài tập "Kanji Quiz"',
        time: '10 phút trước',
        type: 'submission',
    },
    {
        id: 2,
        message: 'Lớp JLPT N4 có 3 học viên mới đăng ký',
        time: '1 giờ trước',
        type: 'info',
    },
    {
        id: 3,
        message: 'Bài kiểm tra JLPT N5 sẽ diễn ra vào 15/02',
        time: '2 giờ trước',
        type: 'reminder',
    },
]

export const students = [
    {
        name: 'Nguyễn Văn A',
        class: 'JLPT N5',
        progress: 75,
        score: 8.5,
        attendance: '92%',
        avatar: 'bg-blue-500',
    },
    {
        name: 'Trần Thị B',
        class: 'JLPT N4',
        progress: 82,
        score: 9.0,
        attendance: '95%',
        avatar: 'bg-green-500',
    },
    {
        name: 'Lê Văn C',
        class: 'JLPT N3',
        progress: 68,
        score: 7.8,
        attendance: '88%',
        avatar: 'bg-purple-500',
    },
    {
        name: 'Phạm Thị D',
        class: 'JLPT N5',
        progress: 90,
        score: 9.2,
        attendance: '98%',
        avatar: 'bg-pink-500',
    },
]
