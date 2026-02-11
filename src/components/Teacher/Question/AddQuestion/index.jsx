import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'

export default function AddQuestion({ isOpen, onClose, onSubmit }) {
    const [form, setForm] = useState({
        title: '',
        level: 'N5',
        A: '',
        B: '',
        C: '',
        D: '',
        correct: 'A',
    })

    const setField = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }))

    const handleSave = e => {
        e.preventDefault()
        onSubmit?.(form)
        onClose()
        setForm({ title: '', level: 'N5', A: '', B: '', C: '', D: '', correct: 'A' })
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl" title="Thêm câu hỏi">
                <form onSubmit={handleSave} className="space-y-4 mt-5">
                    <div className="space-y-2">
                        <textarea
                            value={form.title}
                            onChange={setField('title')}
                            className="min-h-[100px] w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-black"
                            placeholder="Nhập nội dung câu hỏi..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Level</label>
                            <Select
                                value={form.level}
                                onValueChange={v => setForm(prev => ({ ...prev, level: v }))}
                            >
                                <SelectTrigger className="h-10 w-full rounded-xl border-gray-200">
                                    <SelectValue placeholder="Chọn level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="N5">N5</SelectItem>
                                    <SelectItem value="N4">N4</SelectItem>
                                    <SelectItem value="N3">N3</SelectItem>
                                    <SelectItem value="N2">N2</SelectItem>
                                    <SelectItem value="N1">N1</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Đáp án đúng</label>
                            <Select
                                value={form.correct}
                                onValueChange={v => setForm(prev => ({ ...prev, correct: v }))}
                            >
                                <SelectTrigger className="h-10 w-full rounded-xl border-gray-200">
                                    <SelectValue placeholder="Chọn đáp án đúng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">A</SelectItem>
                                    <SelectItem value="B">B</SelectItem>
                                    <SelectItem value="C">C</SelectItem>
                                    <SelectItem value="D">D</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['A', 'B', 'C', 'D'].map(k => (
                            <div key={k} className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">
                                    Đáp án {k}
                                </label>
                                <input
                                    value={form[k]}
                                    onChange={setField(k)}
                                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-black"
                                    placeholder={`Nhập đáp án ${k}`}
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-900"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
