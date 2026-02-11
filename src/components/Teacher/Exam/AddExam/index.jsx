import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

const initialForm = {
    title: '',
    description: '',
    level: 'N5',
    status: 'draft',
    totalQuestions: 50,
    duration: 60,
    schedule: '',
}

export default function AddExam({ isOpen, onClose, onSubmit }) {
    const [form, setForm] = useState(initialForm)

    const setField = (field) => (event) => {
        const value = event?.target ? event.target.value : event
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const payload = {
            ...form,
            schedule: form.schedule || 'Chưa cập nhật',
            duration: `${form.duration} phút`,
            totalQuestions: Number(form.totalQuestions),
        }

        await onSubmit?.(payload)
        setForm(initialForm)
        onClose?.()
    }

    const handleClose = () => {
        setForm(initialForm)
        onClose?.()
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl" title="Tạo đề thi">
            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Tiêu đề đề thi</label>
                    <input
                        value={form.title}
                        onChange={setField('title')}
                        className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-black"
                        placeholder="Nhập tên đề thi..."
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Mô tả ngắn</label>
                    <textarea
                        value={form.description}
                        onChange={setField('description')}
                        className="min-h-[100px] w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-black"
                        placeholder="Đề thi gồm những phần nào, mục tiêu là gì..."
                        required
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Trình độ</label>
                        <Select value={form.level} onValueChange={(value) => setForm((prev) => ({ ...prev, level: value }))}>
                            <SelectTrigger className="h-11 w-full rounded-xl border-gray-200">
                                <SelectValue placeholder="Chọn level" />
                            </SelectTrigger>
                            <SelectContent>
                                {['N5', 'N4', 'N3', 'N2', 'N1'].map((level) => (
                                    <SelectItem key={level} value={level}>
                                        {level}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Trạng thái</label>
                        <Select
                            value={form.status}
                            onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
                        >
                            <SelectTrigger className="h-11 w-full rounded-xl border-gray-200">
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Nháp</SelectItem>
                                <SelectItem value="published">Xuất bản</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Số câu hỏi</label>
                        <input
                            type="number"
                            min="10"
                            value={form.totalQuestions}
                            onChange={setField('totalQuestions')}
                            className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Thời lượng (phút)</label>
                        <input
                            type="number"
                            min="10"
                            value={form.duration}
                            onChange={setField('duration')}
                            className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Lịch thi dự kiến</label>
                    <input
                        type="datetime-local"
                        value={form.schedule}
                        onChange={setField('schedule')}
                        className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
                    >
                        Lưu đề thi
                    </button>
                </div>
            </form>
        </Modal>
    )
}
