import { AlertTriangle, Loader2, Send, X } from 'lucide-react'

function ModalOverlay({ children, onClose }) {
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 size-7 rounded-md flex items-center justify-center text-text-muted hover:text-text hover:bg-surface transition-colors cursor-pointer"
                >
                    <X className="size-4" />
                </button>
                {children}
            </div>
        </div>
    )
}

export function TabWarningModal({ tabSwitchCount, onClose }) {
    return (
        <ModalOverlay onClose={onClose}>
            <div className="text-center">
                <AlertTriangle className="size-12 text-warning mx-auto mb-3" />
                <h3 className="text-lg font-bold text-text mb-2">Cảnh báo!</h3>
                <p className="text-sm text-text-light mb-1">Bạn đã chuyển ra khỏi tab bài thi.</p>
                <p className="text-xs text-orange-500 font-semibold mb-4">
                    Số lần chuyển tab: {tabSwitchCount}
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    className="h-10 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
                >
                    Quay lại làm bài
                </button>
            </div>
        </ModalOverlay>
    )
}

export function ConfirmSubmitModal({
    answeredCount,
    totalCount,
    error,
    submitting,
    onClose,
    onSubmit,
}) {
    return (
        <ModalOverlay onClose={onClose}>
            <div className="text-center">
                <Send className="size-10 text-orange-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-text mb-2">Xác nhận nộp bài?</h3>
                <p className="text-sm text-text-light mb-1">
                    Bạn đã trả lời <span className="font-bold text-primary">{answeredCount}</span> /{' '}
                    {totalCount} câu hỏi.
                </p>
                {answeredCount < totalCount && (
                    <p className="text-xs text-orange-500 font-semibold mb-4">
                        Còn {totalCount - answeredCount} câu chưa trả lời!
                    </p>
                )}
                {error && <p className="text-xs text-destructive mb-2">{error}</p>}
                <div className="flex gap-3 justify-center mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-10 px-5 rounded-lg border-2 border-border text-sm font-semibold text-text-light hover:bg-background transition-colors cursor-pointer"
                    >
                        Tiếp tục làm
                    </button>
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={submitting}
                        className="h-10 px-5 rounded-lg bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                    >
                        {submitting && <Loader2 className="size-4 animate-spin" />}
                        Nộp bài
                    </button>
                </div>
            </div>
        </ModalOverlay>
    )
}
