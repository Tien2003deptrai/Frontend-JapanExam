import { cn } from '@/lib/utils'
import { aiService, examService } from '@/services'
import { AlertCircle, Edit3, Loader2, Save, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Modal chỉnh sửa 1 câu hỏi embedded trong đề thi
 */
export default function EditExamQuestionModal({
    isOpen,
    onClose,
    examId,
    sectionIndex,
    blockIndex,
    questionIndex,
    questionData,
    onSuccess,
    level,
    sectionType,
    blockContext,
}) {
    const [animateIn, setAnimateIn] = useState(false)
    const [saving, setSaving] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)
    const [errors, setErrors] = useState(/** @type {Record<string, string>} */ ({}))
    const overlayRef = useRef(null)

    const [form, setForm] = useState({
        questionText: '',
        options: [
            { label: '1', text: '' },
            { label: '2', text: '' },
            { label: '3', text: '' },
            { label: '4', text: '' },
        ],
        correctAnswer: '1',
        explanation: '',
        translationVi: '',
        points: 1,
    })

    useEffect(() => {
        if (isOpen && questionData) {
            setForm({
                questionText: questionData.questionText || '',
                options:
                    questionData.options?.length > 0
                        ? questionData.options.map(o => ({ label: o.label, text: o.text }))
                        : [
                              { label: '1', text: '' },
                              { label: '2', text: '' },
                              { label: '3', text: '' },
                              { label: '4', text: '' },
                          ],
                correctAnswer: questionData.correctAnswer || '1',
                explanation: questionData.explanation || '',
                translationVi: questionData.translationVi || '',
                points: questionData.points || 1,
            })
            setErrors({})
        }
    }, [isOpen, questionData])

    useEffect(() => {
        if (isOpen) requestAnimationFrame(() => setAnimateIn(true))
        else setAnimateIn(false)
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return
        const handler = e => e.key === 'Escape' && onClose?.()
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [isOpen, onClose])

    useEffect(() => {
        if (!isOpen) return
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prev
        }
    }, [isOpen])

    const validate = () => {
        const errs = /** @type {Record<string, string>} */ ({})
        if (!form.questionText.trim()) errs.questionText = 'Vui lòng nhập nội dung câu hỏi'
        if (form.options.some(o => !o.text.trim())) errs.options = 'Vui lòng nhập đầy đủ các đáp án'
        if (!form.correctAnswer) errs.correctAnswer = 'Vui lòng chọn đáp án đúng'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSave = async () => {
        if (!validate()) return
        try {
            setSaving(true)
            await examService.updateExamQuestion({
                examId,
                sectionIndex,
                blockIndex,
                questionIndex,
                questionData: form,
            })
            onSuccess?.()
            onClose()
        } catch (err) {
            console.error('Failed to update question:', err)
            alert('Có lỗi xảy ra khi cập nhật câu hỏi')
        } finally {
            setSaving(false)
        }
    }

    const updateOption = (index, value) => {
        setForm(prev => ({
            ...prev,
            options: prev.options.map((o, i) => (i === index ? { ...o, text: value } : o)),
        }))
    }

    const handleAiExplain = async () => {
        if (aiLoading || !form.questionText.trim()) return
        try {
            setAiLoading(true)
            const res = await aiService.generateExplanation({
                questionText: form.questionText,
                options: form.options,
                correctAnswer: form.correctAnswer,
                level: level || 'N5',
                sectionType: sectionType || 'vocabulary',
                context: blockContext || undefined,
                questionId: undefined,
            })
            const data = res.data || res
            if (data.explanation) {
                setForm(prev => ({
                    ...prev,
                    explanation: data.explanation,
                    ...(data.translationVi ? { translationVi: data.translationVi } : {}),
                }))
            }
        } catch (err) {
            console.error('AI explain failed:', err)
        } finally {
            setAiLoading(false)
        }
    }

    const handleOverlayClick = e => {
        if (e.target === overlayRef.current) onClose?.()
    }

    if (!isOpen) return null

    return createPortal(
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className={cn(
                'fixed inset-0 z-50 flex items-center justify-center p-4 transition-[background-color] duration-150',
                animateIn ? 'bg-[#0F172A]/50' : 'bg-transparent'
            )}
            role="dialog"
            aria-modal="true"
        >
            <div
                className={cn(
                    'relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white transition-[opacity,transform] duration-150',
                    animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                )}
                style={{
                    border: '3px solid rgba(255,255,255,0.7)',
                    boxShadow:
                        '12px 12px 32px rgba(0,0,0,0.12), -6px -6px 16px rgba(255,255,255,0.8), inset 0 2px 0 rgba(255,255,255,0.6)',
                }}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b-2 border-[#E2E8F0] bg-white px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-[#F97316]/10">
                            <Edit3 className="size-4 text-[#F97316]" />
                        </div>
                        <h2 className="text-lg font-black text-[#1E293B]">Chỉnh sửa câu hỏi</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-2 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#475569] transition-colors cursor-pointer"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-5 px-6 py-5">
                    {/* Question text */}
                    <div>
                        <label className="block text-sm font-bold text-[#1E293B] mb-2">
                            Nội dung câu hỏi <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={form.questionText}
                            onChange={e =>
                                setForm(prev => ({ ...prev, questionText: e.target.value }))
                            }
                            rows={3}
                            className={cn(
                                'w-full rounded-xl border-2 p-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none resize-none transition-colors',
                                errors.questionText
                                    ? 'border-red-300 focus:border-red-400'
                                    : 'border-[#E2E8F0] focus:border-[#2563EB]'
                            )}
                            placeholder="Nhập nội dung câu hỏi..."
                        />
                        {errors.questionText && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle className="size-3" />
                                {errors.questionText}
                            </p>
                        )}
                    </div>

                    {/* Options */}
                    <div>
                        <label className="block text-sm font-bold text-[#1E293B] mb-2">
                            Đáp án <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {form.options.map((opt, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm(prev => ({
                                                ...prev,
                                                correctAnswer: opt.label,
                                            }))
                                        }
                                        className={cn(
                                            'flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold border-2 transition-colors cursor-pointer',
                                            form.correctAnswer === opt.label
                                                ? 'border-[#22C55E] bg-[#22C55E] text-white'
                                                : 'border-[#E2E8F0] text-[#94A3B8] hover:border-[#94A3B8]'
                                        )}
                                        title={`Chọn ${opt.label} là đáp án đúng`}
                                    >
                                        {opt.label}
                                    </button>
                                    <input
                                        type="text"
                                        value={opt.text}
                                        onChange={e => updateOption(i, e.target.value)}
                                        placeholder={`Đáp án ${opt.label}`}
                                        className="flex-1 h-10 rounded-xl border-2 border-[#E2E8F0] px-3 text-sm text-[#1E293B] placeholder:text-[#CBD5E1] focus:border-[#2563EB] focus:outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                        {errors.options && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle className="size-3" />
                                {errors.options}
                            </p>
                        )}
                        <p className="mt-1.5 text-[11px] text-[#94A3B8]">
                            Click vào số để chọn đáp án đúng (đang chọn:{' '}
                            <span className="font-bold text-[#22C55E]">{form.correctAnswer}</span>)
                        </p>
                    </div>

                    {/* Explanation */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-bold text-[#1E293B]">Giải thích</label>
                            <button
                                type="button"
                                onClick={handleAiExplain}
                                disabled={aiLoading || !form.questionText.trim()}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-violet-500 to-indigo-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-violet-600 hover:to-indigo-600 disabled:opacity-50 transition-all cursor-pointer"
                                title="Tạo giải thích bằng AI"
                            >
                                {aiLoading ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                    <Sparkles className="size-3.5" />
                                )}
                                {aiLoading ? 'Đang tạo...' : 'AI giải thích'}
                            </button>
                        </div>
                        <textarea
                            value={form.explanation}
                            onChange={e =>
                                setForm(prev => ({ ...prev, explanation: e.target.value }))
                            }
                            rows={2}
                            className="w-full rounded-xl border-2 border-[#E2E8F0] p-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none resize-none"
                            placeholder="Giải thích đáp án (không bắt buộc)..."
                        />
                    </div>

                    {/* Translation */}
                    <div>
                        <label className="block text-sm font-bold text-[#1E293B] mb-2">
                            Dịch tiếng Việt
                        </label>
                        <input
                            type="text"
                            value={form.translationVi}
                            onChange={e =>
                                setForm(prev => ({ ...prev, translationVi: e.target.value }))
                            }
                            className="w-full h-10 rounded-xl border-2 border-[#E2E8F0] px-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none"
                            placeholder="Dịch nghĩa tiếng Việt (không bắt buộc)..."
                        />
                    </div>

                    {/* Points */}
                    <div>
                        <label className="block text-sm font-bold text-[#1E293B] mb-2">Điểm</label>
                        <input
                            type="number"
                            min="1"
                            value={form.points}
                            onChange={e =>
                                setForm(prev => ({
                                    ...prev,
                                    points: parseInt(e.target.value) || 1,
                                }))
                            }
                            className="w-24 h-10 rounded-xl border-2 border-[#E2E8F0] px-3 text-sm text-[#1E293B] focus:border-[#2563EB] focus:outline-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 flex justify-end gap-2 rounded-b-3xl border-t-2 border-[#E2E8F0] bg-white px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-10 rounded-xl border-2 border-[#E2E8F0] px-5 text-sm font-semibold text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="h-10 rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors cursor-pointer inline-flex items-center gap-2"
                    >
                        {saving ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Save className="size-4" />
                        )}
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}
