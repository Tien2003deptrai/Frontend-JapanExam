import Modal from '@/components/ui/Modal'
import BlockBuilder from '../BlockBuilder'

/**
 * AddQuestion — opens a full-screen modal wrapping BlockBuilder.
 * Replaces the old simple form with the new builder supporting
 * standalone + group questions.
 */
export default function AddQuestion({ isOpen, onClose, onSubmit }) {
    const handleSuccess = () => {
        onSubmit?.()
        onClose?.()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl" title="Tạo câu hỏi mới">
            <div className="mt-2">
                <BlockBuilder onSuccess={handleSuccess} onCancel={onClose} />
            </div>
        </Modal>
    )
}
