/**
 * Ngân hàng câu hỏi JLPT theo level. Mỗi đề thi lấy random từ pool theo level + totalQuestions.
 * Cấu trúc: { level, title, description, correct, category }
 */
import { examData } from './examData'

const THUMB =
    'https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/18/53/13/185313ef-21ff-7e9e-60e7-f354ad3a53bd/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x630wa.png'

const QUESTION_POOL = [
    // ---------- N5: Từ vựng, Ngữ pháp, Đọc hiểu ----------
    ...[
        {
            level: 'N5',
            title: 'Từ 「勉強」đọc là gì?',
            description: 'Chọn cách đọc đúng của từ Kanji.',
            correct: 'A',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: 'Từ 「学校」đọc là gì?',
            description: 'Chọn cách đọc đúng.',
            correct: 'B',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: '「水」có cách đọc là?',
            description: 'Chọn cách đọc Hiragana đúng.',
            correct: 'C',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: '「食べる」nghĩa là gì?',
            description: 'Chọn nghĩa đúng.',
            correct: 'A',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: 'Từ nào đồng nghĩa với 「大きい」?',
            description: 'Chọn từ đồng nghĩa.',
            correct: 'C',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: '「新しい」đọc là?',
            description: 'Cách đọc đúng của từ.',
            correct: 'B',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: '「友達」nghĩa là gì?',
            description: 'Chọn nghĩa tiếng Việt.',
            correct: 'A',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: 'Kanji 「人」đọc là?',
            description: 'Cách đọc On-yomi/Kun-yomi.',
            correct: 'D',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: '「昨日」đọc là?',
            description: 'Chọn cách đọc đúng.',
            correct: 'B',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: '「電車」nghĩa là gì?',
            description: 'Chọn nghĩa đúng.',
            correct: 'A',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: '「暑い」trái nghĩa với từ nào?',
            description: 'Chọn từ trái nghĩa.',
            correct: 'C',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: '「仕事」đọc là?',
            description: 'Cách đọc đúng.',
            correct: 'B',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: '「映画」nghĩa là gì?',
            description: 'Chọn nghĩa.',
            correct: 'A',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: '「病院」đọc là?',
            description: 'Chọn cách đọc.',
            correct: 'D',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: '「料理」nghĩa là gì?',
            description: 'Chọn nghĩa đúng.',
            correct: 'B',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: '「旅行」đọc là?',
            description: 'Cách đọc đúng.',
            correct: 'A',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: '「便利」nghĩa là gì?',
            description: 'Chọn nghĩa.',
            correct: 'C',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: '「宿題」đọc là?',
            description: 'Chọn cách đọc.',
            correct: 'B',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: '「質問」nghĩa là gì?',
            description: 'Chọn nghĩa.',
            correct: 'A',
            category: 'Từ vựng',
        },
        {
            level: 'N5',
            title: '「会議」đọc là?',
            description: 'Cách đọc đúng.',
            correct: 'D',
            category: 'Từ vựng',
        },
    ].map((q, i) => ({ ...q, _id: `n5-v-${i}` })),
    ...[
        {
            level: 'N5',
            title: 'Câu 「私は学生です」có nghĩa là gì?',
            description: 'Chọn bản dịch đúng sang tiếng Việt.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: 'Trợ từ 「で」trong 「電車で行きます」biểu thị gì?',
            description: 'Phân tích chức năng ngữ pháp.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: 'Điền trợ từ: 「日本（ ）来ました」',
            description: 'Chọn trợ từ phù hợp.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: '「〜ませんか」dùng để làm gì?',
            description: 'Chọn cách dùng đúng.',
            correct: 'C',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: 'Điền: 「毎日 7時（ ）起きます」',
            description: 'Chọn trợ từ thời gian.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: '「〜たい」biểu thị gì?',
            description: 'Chọn ý nghĩa ngữ pháp.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: '「〜てください」dùng khi nào?',
            description: 'Chọn cách dùng đúng.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: '「〜ことがあります」nghĩa là gì?',
            description: 'Chọn ý nghĩa.',
            correct: 'C',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: 'Trợ từ 「に」trong 「3時に」biểu thị gì?',
            description: 'Chọn chức năng.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: '「〜なければなりません」nghĩa là?',
            description: 'Chọn ý nghĩa đúng.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: '「〜ほうがいい」dùng để?',
            description: 'Chọn cách dùng.',
            correct: 'D',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: 'Điền: 「これは 私（ ）本です」',
            description: 'Chọn trợ từ sở hữu.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: '「〜ので」biểu thị gì?',
            description: 'Chọn ý nghĩa.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: '「〜前に」nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'C',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: '「〜てから」dùng để?',
            description: 'Chọn cách dùng.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: '「〜たり〜たり」biểu thị?',
            description: 'Chọn ý nghĩa.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: 'Điền: 「机の上（ ）本が あります」',
            description: 'Chọn trợ từ vị trí.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: '「〜でしょう」dùng khi?',
            description: 'Chọn cách dùng.',
            correct: 'C',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: '「〜かもしれません」nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N5',
            title: '「〜なくてはいけません」tương đương?',
            description: 'Chọn cấu trúc tương đương.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
    ].map((q, i) => ({ ...q, _id: `n5-g-${i}` })),
    ...[
        {
            level: 'N5',
            title: 'Đọc hiểu: 「明日は雨です。」→ Ý chính?',
            description: 'Chọn ý đúng theo câu.',
            correct: 'A',
            category: 'Đọc hiểu',
        },
        {
            level: 'N5',
            title: 'Đoạn ngắn: 「田中さんは学生です。毎日学校へ行きます。」Tanaka làm gì?',
            description: 'Chọn đáp án đúng.',
            correct: 'B',
            category: 'Đọc hiểu',
        },
        {
            level: 'N5',
            title: '「ここで写真を撮ってもいいですか。」→ Người nói muốn gì?',
            description: 'Chọn ý đúng.',
            correct: 'C',
            category: 'Đọc hiểu',
        },
        {
            level: 'N5',
            title: '「今日は休みです。だから、家で本を読みます。」→ Hôm nay làm gì?',
            description: 'Chọn đáp án.',
            correct: 'A',
            category: 'Đọc hiểu',
        },
        {
            level: 'N5',
            title: '「このりんごは甘いです。」→ 「甘い」ý chỉ gì?',
            description: 'Chọn nghĩa phù hợp ngữ cảnh.',
            correct: 'B',
            category: 'Đọc hiểu',
        },
        {
            level: 'N5',
            title: 'Đọc: 「駅はあそこです。」→ Hỏi vị trí nào?',
            description: 'Chọn đáp án đúng.',
            correct: 'D',
            category: 'Đọc hiểu',
        },
        {
            level: 'N5',
            title: '「私はコーヒーが好きです。でも、今日はお茶を飲みます。」→ Hôm nay uống gì?',
            description: 'Chọn đáp án.',
            correct: 'A',
            category: 'Đọc hiểu',
        },
        {
            level: 'N5',
            title: '「会議は 2時からです。」→ Khi nào bắt đầu?',
            description: 'Chọn thông tin đúng.',
            correct: 'B',
            category: 'Đọc hiểu',
        },
        {
            level: 'N5',
            title: '「この部屋は広いです。」→ 「広い」nghĩa là?',
            description: 'Chọn nghĩa.',
            correct: 'C',
            category: 'Đọc hiểu',
        },
        {
            level: 'N5',
            title: 'Đoạn: 「土曜日、友達と映画を見ます。」→ Thứ mấy? Làm gì?',
            description: 'Chọn đáp án đúng.',
            correct: 'A',
            category: 'Đọc hiểu',
        },
        {
            level: 'N5',
            title: '「ここに名前を書いてください。」→ Yêu cầu gì?',
            description: 'Chọn ý đúng.',
            correct: 'B',
            category: 'Đọc hiểu',
        },
        {
            level: 'N5',
            title: '「明日、テストがあります。」→ Thông tin gì?',
            description: 'Chọn đáp án.',
            correct: 'D',
            category: 'Đọc hiểu',
        },
        {
            level: 'N5',
            title: '「すみません、トイレはどこですか。」→ Hỏi gì?',
            description: 'Chọn ý đúng.',
            correct: 'A',
            category: 'Đọc hiểu',
        },
        {
            level: 'N5',
            title: '「この本は面白いです。」→ 「面白い」ý chỉ?',
            description: 'Chọn nghĩa.',
            correct: 'C',
            category: 'Đọc hiểu',
        },
        {
            level: 'N5',
            title: '「毎朝 6時に起きます。」→ Thói quen gì?',
            description: 'Chọn đáp án.',
            correct: 'B',
            category: 'Đọc hiểu',
        },
    ].map((q, i) => ({ ...q, _id: `n5-r-${i}` })),

    // ---------- N4 ----------
    ...[
        {
            level: 'N4',
            title: '「〜ように」dùng để diễn đạt gì?',
            description: 'Ngữ pháp N4.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: 'Ý nghĩa của 「〜てみる」?',
            description: 'Chọn cách dùng đúng.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「〜そうだ」（伝聞）nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'C',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「〜たら」và 「〜とき」khác nhau thế nào?',
            description: 'Chọn sự khác biệt.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「〜ておく」dùng để?',
            description: 'Chọn cách dùng.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「〜かもしれない」biểu thị?',
            description: 'Chọn ý nghĩa.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「〜ようにする」nghĩa là?',
            description: 'Chọn ý nghĩa đúng.',
            correct: 'C',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「〜てしまう」biểu thị?',
            description: 'Chọn sắc thái.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「〜ところだ」dùng khi?',
            description: 'Chọn thời điểm dùng.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「〜ばかり」nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'D',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「〜のに」biểu thị?',
            description: 'Chọn ý nghĩa.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「〜そうだ」（様態）ví dụ?',
            description: 'Chọn cách dùng.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「〜てある」và 「〜ている」khác nhau?',
            description: 'Chọn sự khác biệt.',
            correct: 'C',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「〜ことにする」nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「〜ように言う」nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「敬語」- 「お〜になる」là dạng?',
            description: 'Chọn loại kính ngữ.',
            correct: 'C',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「〜やすい」／「〜にくい」dùng thế nào?',
            description: 'Chọn cách dùng.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「〜てあげる」biểu thị?',
            description: 'Chọn ý nghĩa.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「〜てもらう」dùng khi?',
            description: 'Chọn cách dùng.',
            correct: 'D',
            category: 'Ngữ pháp',
        },
        {
            level: 'N4',
            title: '「〜だろう」và 「〜でしょう」khác nhau?',
            description: 'Chọn sự khác biệt.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
    ].map((q, i) => ({ ...q, _id: `n4-g-${i}` })),
    ...[
        {
            level: 'N4',
            title: 'Từ vựng N4: 「確認」đọc là?',
            description: 'Chọn cách đọc đúng.',
            correct: 'A',
            category: 'Từ vựng',
        },
        {
            level: 'N4',
            title: '「説明」nghĩa là gì?',
            description: 'Chọn nghĩa.',
            correct: 'B',
            category: 'Từ vựng',
        },
        {
            level: 'N4',
            title: '「準備」đọc là?',
            description: 'Chọn cách đọc.',
            correct: 'C',
            category: 'Từ vựng',
        },
        {
            level: 'N4',
            title: '「参加」nghĩa là?',
            description: 'Chọn nghĩa đúng.',
            correct: 'A',
            category: 'Từ vựng',
        },
        {
            level: 'N4',
            title: '「意見」đọc là?',
            description: 'Chọn cách đọc.',
            correct: 'B',
            category: 'Từ vựng',
        },
        {
            level: 'N4',
            title: '「経験」nghĩa là?',
            description: 'Chọn nghĩa.',
            correct: 'D',
            category: 'Từ vựng',
        },
        {
            level: 'N4',
            title: '「予定」đọc là?',
            description: 'Chọn cách đọc.',
            correct: 'A',
            category: 'Từ vựng',
        },
        {
            level: 'N4',
            title: '「理由」nghĩa là?',
            description: 'Chọn nghĩa.',
            correct: 'B',
            category: 'Từ vựng',
        },
        {
            level: 'N4',
            title: '「注意」đọc là?',
            description: 'Chọn cách đọc.',
            correct: 'C',
            category: 'Từ vựng',
        },
        {
            level: 'N4',
            title: '「都合」nghĩa là?',
            description: 'Chọn nghĩa.',
            correct: 'A',
            category: 'Từ vựng',
        },
    ].map((q, i) => ({ ...q, _id: `n4-v-${i}` })),
    ...[
        {
            level: 'N4',
            title: 'Đọc hiểu N4: Đoạn văn ngắn - ý chính?',
            description: 'Chọn ý chính đoạn.',
            correct: 'B',
            category: 'Đọc hiểu',
        },
        {
            level: 'N4',
            title: 'Điền từ phù hợp vào chỗ trống.',
            description: 'Chọn từ đúng ngữ cảnh.',
            correct: 'A',
            category: 'Đọc hiểu',
        },
        {
            level: 'N4',
            title: 'Câu hỏi suy luận theo nội dung.',
            description: 'Chọn đáp án suy ra được.',
            correct: 'C',
            category: 'Đọc hiểu',
        },
        {
            level: 'N4',
            title: 'Tìm câu đồng nghĩa với câu cho sẵn.',
            description: 'Chọn câu tương đương.',
            correct: 'B',
            category: 'Đọc hiểu',
        },
        {
            level: 'N4',
            title: 'Sắp xếp từ thành câu đúng.',
            description: 'Chọn thứ tự đúng.',
            correct: 'A',
            category: 'Đọc hiểu',
        },
    ].map((q, i) => ({ ...q, _id: `n4-r-${i}` })),

    // ---------- N3 ----------
    ...[
        {
            level: 'N3',
            title: '「〜ことになっている」biểu thị gì?',
            description: 'Ngữ pháp N3.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N3',
            title: '「〜ば〜ほど」nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N3',
            title: '「〜つもりだ」và 「〜予定だ」khác nhau?',
            description: 'Chọn sự khác biệt.',
            correct: 'C',
            category: 'Ngữ pháp',
        },
        {
            level: 'N3',
            title: '「〜ようにしている」nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N3',
            title: '「〜わけだ」dùng khi?',
            description: 'Chọn cách dùng.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N3',
            title: '「〜ものだ」biểu thị?',
            description: 'Chọn ý nghĩa.',
            correct: 'D',
            category: 'Ngữ pháp',
        },
        {
            level: 'N3',
            title: '「〜てならない」nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N3',
            title: '「〜に違いない」dùng để?',
            description: 'Chọn cách dùng.',
            correct: 'C',
            category: 'Ngữ pháp',
        },
        {
            level: 'N3',
            title: '「〜ところを」nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N3',
            title: '「敬語」N3: 「お〜いただく」là?',
            description: 'Chọn loại kính ngữ.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N3',
            title: '「〜にしたがって」nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N3',
            title: '「〜からには」biểu thị?',
            description: 'Chọn ý nghĩa.',
            correct: 'C',
            category: 'Ngữ pháp',
        },
        {
            level: 'N3',
            title: '「〜ものの」nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N3',
            title: '「〜くせに」dùng khi?',
            description: 'Chọn cách dùng.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N3',
            title: '「〜おかげで」và 「〜せいで」khác nhau?',
            description: 'Chọn sự khác biệt.',
            correct: 'D',
            category: 'Ngữ pháp',
        },
    ].map((q, i) => ({ ...q, _id: `n3-g-${i}` })),
    ...[
        {
            level: 'N3',
            title: 'Từ vựng N3: 「影響」đọc là?',
            description: 'Chọn cách đọc.',
            correct: 'A',
            category: 'Từ vựng',
        },
        {
            level: 'N3',
            title: '「環境」nghĩa là?',
            description: 'Chọn nghĩa.',
            correct: 'B',
            category: 'Từ vựng',
        },
        {
            level: 'N3',
            title: '「開発」đọc là?',
            description: 'Chọn cách đọc.',
            correct: 'C',
            category: 'Từ vựng',
        },
        {
            level: 'N3',
            title: '「調査」nghĩa là?',
            description: 'Chọn nghĩa.',
            correct: 'A',
            category: 'Từ vựng',
        },
        {
            level: 'N3',
            title: '「責任」đọc là?',
            description: 'Chọn cách đọc.',
            correct: 'B',
            category: 'Từ vựng',
        },
    ].map((q, i) => ({ ...q, _id: `n3-v-${i}` })),
    ...[
        {
            level: 'N3',
            title: 'Đọc hiểu N3: Đoạn văn trung - ý chính?',
            description: 'Chọn ý chính.',
            correct: 'A',
            category: 'Đọc hiểu',
        },
        {
            level: 'N3',
            title: 'Câu hỏi chi tiết theo đoạn.',
            description: 'Chọn thông tin đúng.',
            correct: 'B',
            category: 'Đọc hiểu',
        },
        {
            level: 'N3',
            title: 'Suy luận thái độ tác giả.',
            description: 'Chọn đáp án phù hợp.',
            correct: 'C',
            category: 'Đọc hiểu',
        },
    ].map((q, i) => ({ ...q, _id: `n3-r-${i}` })),

    // ---------- N2 ----------
    ...[
        {
            level: 'N2',
            title: 'Câu hỏi đọc hiểu N2 - Đoạn văn ngắn.',
            description: 'Chọn đáp án đúng theo nội dung.',
            correct: 'D',
            category: 'Đọc hiểu',
        },
        {
            level: 'N2',
            title: 'Ngữ pháp N2: 「〜に限らず」nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N2',
            title: '「〜にわたって」dùng khi?',
            description: 'Chọn cách dùng.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N2',
            title: 'Đọc hiểu: ý chính đoạn văn.',
            description: 'Chọn ý chính.',
            correct: 'C',
            category: 'Đọc hiểu',
        },
        {
            level: 'N2',
            title: '「〜をめぐって」nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N2',
            title: 'Từ vựng N2: 「実施」đọc là?',
            description: 'Chọn cách đọc.',
            correct: 'B',
            category: 'Từ vựng',
        },
        {
            level: 'N2',
            title: 'Đọc hiểu: câu hỏi chi tiết.',
            description: 'Chọn thông tin đúng.',
            correct: 'D',
            category: 'Đọc hiểu',
        },
        {
            level: 'N2',
            title: '「〜に基づいて」nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'A',
            category: 'Ngữ pháp',
        },
        {
            level: 'N2',
            title: '「〜に際して」dùng khi?',
            description: 'Chọn cách dùng.',
            correct: 'C',
            category: 'Ngữ pháp',
        },
        {
            level: 'N2',
            title: 'Đọc hiểu: suy luận từ đoạn.',
            description: 'Chọn đáp án suy ra được.',
            correct: 'B',
            category: 'Đọc hiểu',
        },
    ].map((q, i) => ({ ...q, _id: `n2-${i}` })),

    // ---------- N1 ----------
    ...[
        {
            level: 'N1',
            title: 'Câu hỏi N1 - Phân tích văn bản.',
            description: 'Chọn ý chính của tác giả.',
            correct: 'A',
            category: 'Đọc hiểu',
        },
        {
            level: 'N1',
            title: 'Ngữ pháp N1: 「〜であれ〜であれ」nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N1',
            title: '「〜を余儀なくされた」dùng khi?',
            description: 'Chọn cách dùng.',
            correct: 'C',
            category: 'Ngữ pháp',
        },
        {
            level: 'N1',
            title: 'Đọc hiểu N1: ý chính bài luận.',
            description: 'Chọn ý chính.',
            correct: 'A',
            category: 'Đọc hiểu',
        },
        {
            level: 'N1',
            title: '「〜ならでは」nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'D',
            category: 'Ngữ pháp',
        },
        {
            level: 'N1',
            title: 'Từ vựng N1: 「顕著」đọc là?',
            description: 'Chọn cách đọc.',
            correct: 'B',
            category: 'Từ vựng',
        },
        {
            level: 'N1',
            title: 'Đọc hiểu: phân tích lập luận.',
            description: 'Chọn đáp án đúng.',
            correct: 'A',
            category: 'Đọc hiểu',
        },
        {
            level: 'N1',
            title: '「〜とあって」nghĩa là?',
            description: 'Chọn ý nghĩa.',
            correct: 'C',
            category: 'Ngữ pháp',
        },
        {
            level: 'N1',
            title: '「〜きれない」biểu thị?',
            description: 'Chọn ý nghĩa.',
            correct: 'B',
            category: 'Ngữ pháp',
        },
        {
            level: 'N1',
            title: 'Đọc hiểu: thái độ tác giả.',
            description: 'Chọn đáp án phù hợp.',
            correct: 'A',
            category: 'Đọc hiểu',
        },
    ].map((q, i) => ({ ...q, _id: `n1-${i}` })),
]

/** Tạo số giả ngẫu nhiên từ seed (string). Cùng seed → cùng chuỗi số. */
function seededRandom(seed) {
    let h = 0
    for (let i = 0; i < seed.length; i++) {
        h = (h << 5) - h + seed.charCodeAt(i)
        h |= 0
    }
    return function () {
        h = Math.imul(1664525, h) + 1013904223
        return ((h >>> 0) % 1e6) / 1e6
    }
}

/** Shuffle mảng theo seed (cùng seed → cùng thứ tự). */
function shuffleWithSeed(arr, seed) {
    const rng = seededRandom(seed)
    const out = [...arr]
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1))
        ;[out[i], out[j]] = [out[j], out[i]]
    }
    return out
}

/** Lấy danh sách câu hỏi cho đề thi: random từ pool theo level, số lượng = totalQuestions của đề. */
export function getExamQuestions(examId) {
    const exam = examData.find(e => e.id === examId)
    if (!exam) return []

    const level = exam.level
    const total = Number(exam.totalQuestions) || 60
    const pool = QUESTION_POOL.filter(q => q.level === level)
    if (pool.length === 0) return []

    const shuffled = shuffleWithSeed(pool, String(examId))
    const take = Math.min(total, shuffled.length)
    return shuffled.slice(0, take).map((q, index) => ({
        id: `q-${examId}-${index + 1}`,
        examId,
        order: index + 1,
        title: q.title,
        description: q.description,
        level: q.level,
        correct: q.correct,
        category: q.category,
        thumbnail: THUMB,
    }))
}

// Giữ export cũ để tương thích (không dùng nữa, getExamQuestions sinh theo examId)
export const examQuestionsByExamId = {}
