import React, { useRef, useState } from 'react'
import Modal from '@/components/ui/Modal'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

export default function AddQuestion({ isOpen, onClose, onSubmit }) {
    const initialForm = useRef({
        title: '',
        level: 'N5',
        A: '',
        B: '',
        C: '',
        D: '',
        correct: 'A',
    })

    const [formData, setFormData] = useState({ ...initialForm.current })

    const resetForm = () => setFormData({ ...initialForm.current })

    const handleChange = (key, value) => {
        const nextValue = value?.target ? value.target.value : value
        setFormData((prev) => ({ ...prev, [key]: nextValue }))
    }

    const handleSave = (e) => {
        e.preventDefault()
        onSubmit?.(formData)
        resetForm()
        onClose?.()
    }

    const handleClose = () => {
        resetForm()
        onClose?.()
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl" title="Thêm câu hỏi">
            <form onSubmit={handleSave} className="space-y-4 mt-5">
                <div className="space-y-2">
                    <textarea
                        value={formData.title}
                        onChange={(e) => handleChange('title', e)}
                        className="min-h-[100px] w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-black"
                        placeholder="Nhập nội dung câu hỏi..."
                        required
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Level</label>
                        <Select value={formData.level} onValueChange={(v) => handleChange('level', v)}>
                            <SelectTrigger className="h-10 w-full rounded-xl border-gray-200">
                                <SelectValue placeholder="Chọn level" />
                            </SelectTrigger>
                            <SelectContent>
                                {['N5', 'N4', 'N3', 'N2', 'N1'].map((lv) => (
                                    <SelectItem key={lv} value={lv}>
                                        {lv}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Đáp án đúng</label>
                        <Select value={formData.correct} onValueChange={(v) => handleChange('correct', v)}>
                            <SelectTrigger className="h-10 w-full rounded-xl border-gray-200">
                                <SelectValue placeholder="Chọn đáp án đúng" />
                            </SelectTrigger>
                            <SelectContent>
                                {['A', 'B', 'C', 'D'].map((k) => (
                                    <SelectItem key={k} value={k}>
                                        {k}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['A', 'B', 'C', 'D'].map((k) => (
                        <div key={k} className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Đáp án {k}</label>
                            <input
                                value={formData[k]}
                                onChange={(e) => handleChange(k, e)}
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
                        onClick={handleClose}
                        className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button type="submit" className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-900">
                        Lưu
                    </button>
                </div>
            </form>
        </Modal>
    )
}
