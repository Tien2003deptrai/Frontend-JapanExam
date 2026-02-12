import Modal from '@/components/ui/Modal'
import { Upload } from 'lucide-react'

export default function ImportQuestion({ isOpen, onClose, onImport }) {
    const handleSubmit = e => {
        e.preventDefault()
        onImport?.()
        onClose?.()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl" title="Thêm bộ đề">
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                        Kéo thả file hoặc nhấn để chọn file (Excel, CSV)
                    </p>
                    <input type="file" className="mt-3 text-sm" accept=".xlsx,.xls,.csv" />
                </div>
                <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg w-30 cursor-pointer border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="rounded-lg w-30 cursor-pointer bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                    >
                        Import
                    </button>
                </div>
            </form>
        </Modal>
    )
}
