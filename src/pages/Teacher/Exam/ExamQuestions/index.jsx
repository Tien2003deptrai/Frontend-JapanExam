import {
    AddMultiQuestion,
    DropdownExamQuestion,
    ExamPreview,
    MySpace,
    QuestionDisplayCard,
} from '@/components'
import { examService } from '@/services'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function ExamQuestionsPage() {
    const [isOpen, setIsOpen] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [exam, setExam] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const { examId } = useParams()
    const navigate = useNavigate()

    // Handle exam deletion
    const handleDeleteExam = async () => {
        try {
            setDeleteLoading(true)
            const response = await examService.deleteExam(examId)
            if (response.success) {
                navigate('/teacher/exam')
                // You can add a toast notification here
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi xóa đề thi')
        } finally {
            setDeleteLoading(false)
            setShowDeleteModal(false)
        }
    }

    // Handle exam editing
    const handleEditExam = () => {
        // Navigate to edit page or open edit modal
        navigate(`/teacher/exam/${examId}/edit`)
    }

    // Refresh exam data
    const refreshExam = async () => {
        try {
            setLoading(true)
            const response = await examService.getExamById(examId)
            if (response.success) {
                setExam(response.data.exam)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải lại đề thi')
        } finally {
            setLoading(false)
        }
    }

    // Fetch exam data
    useEffect(() => {
        const fetchExam = async () => {
            try {
                setLoading(true)
                const response = await examService.getExamById(examId)
                if (response.success) {
                    setExam(response.data.exam)
                } else {
                    setError('Không tìm thấy đề thi')
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải đề thi')
            } finally {
                setLoading(false)
            }
        }

        if (examId) {
            fetchExam()
        }
    }, [examId])

    // Show loading state
    if (loading) {
        return (
            <MySpace>
                <MySpace.Heading className="bg-white p-5 shadow-sm">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                </MySpace.Heading>
                <MySpace.Body>
                    <div className="text-center py-8 text-gray-500">Đang tải đề thi...</div>
                </MySpace.Body>
            </MySpace>
        )
    }

    // Show error state
    if (error || !exam) {
        return (
            <MySpace>
                <MySpace.Heading className="bg-white p-5 shadow-sm">
                    <h1 className="text-lg font-semibold text-red-600">
                        {error || 'Không tìm thấy đề thi'}
                    </h1>
                </MySpace.Heading>
                <MySpace.Body>
                    <div className="text-center py-8 text-gray-500">
                        Vui lòng kiểm tra lại hoặc tạo đề thi mới.
                    </div>
                </MySpace.Body>
            </MySpace>
        )
    }

    // Convert exam format for compatibility with existing component
    const examForDisplay = {
        title: exam.title,
        level: exam.level,
        totalQuestions: exam.totalQuestions || 0,
        duration: `${exam.duration} phút`,
        description: exam.description || '',
        ...exam,
    }

    // Extract questions from exam sections
    const questions =
        exam.sections?.flatMap(
            section =>
                section.blocks?.flatMap(
                    block =>
                        block.questions?.map((question, index) => ({
                            id: question._id || `${block._id || section._id}-q${index}`,
                            ...question,
                            sectionType: section.sectionType,
                            blockId: block._id,
                        })) || []
                ) || []
        ) || []

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        {/* Breadcrumb */}
                        <nav className="flex mb-4" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                <li className="inline-flex items-center">
                                    <button
                                        onClick={() => navigate('/teacher/exam')}
                                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                        </svg>
                                        Danh sách đề thi
                                    </button>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <svg
                                            className="w-3 h-3 text-gray-400 mx-1"
                                            fill="none"
                                            viewBox="0 0 6 10"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 9 4-4-4-4"
                                            />
                                        </svg>
                                        <span className="ml-1 text-sm font-medium text-gray-500">
                                            Chi tiết đề thi
                                        </span>
                                    </div>
                                </li>
                            </ol>
                        </nav>

                        {/* Main Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            exam.level === 'N5'
                                                ? 'bg-green-100 text-green-800'
                                                : exam.level === 'N4'
                                                  ? 'bg-blue-100 text-blue-800'
                                                  : exam.level === 'N3'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : exam.level === 'N2'
                                                      ? 'bg-orange-100 text-orange-800'
                                                      : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {exam.level}
                                    </span>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            exam.status === 'published'
                                                ? 'bg-green-100 text-green-800'
                                                : exam.status === 'draft'
                                                  ? 'bg-gray-100 text-gray-800'
                                                  : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {exam.status === 'published'
                                            ? 'Đã xuất bản'
                                            : exam.status === 'draft'
                                              ? 'Bản nháp'
                                              : 'Đang xử lý'}
                                    </span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {exam.title}
                                </h1>
                                {exam.description && (
                                    <p className="text-gray-600 max-w-2xl">{exam.description}</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPreviewOpen(true)}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                    Xem trước
                                </button>

                                <button
                                    onClick={handleEditExam}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                    Chỉnh sửa
                                </button>

                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Tổng câu hỏi</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {questions.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Số phần thi</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {exam.sections?.length || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <svg
                                    className="w-6 h-6 text-yellow-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Thời gian</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {exam.duration} phút
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <svg
                                    className="w-6 h-6 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Lượt xem</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {exam.viewCount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sections Overview */}
                {exam.sections && exam.sections.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border mb-8">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Cấu trúc đề thi</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid gap-4">
                                {exam.sections.map((section, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium ${
                                                    section.sectionType === 'vocabulary'
                                                        ? 'bg-blue-500'
                                                        : section.sectionType === 'grammar'
                                                          ? 'bg-green-500'
                                                          : section.sectionType === 'reading'
                                                            ? 'bg-yellow-500'
                                                            : 'bg-purple-500'
                                                }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    {section.sectionName}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {section.sectionType}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm text-gray-600">
                                            <span>{section.questionCount} câu hỏi</span>
                                            <span>{section.duration} phút</span>
                                            <span>{section.points} điểm</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Questions Section */}
                <div className="bg-white rounded-xl shadow-sm border">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Danh sách câu hỏi
                            </h2>
                            <button
                                onClick={() => setIsOpen(true)}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                Thêm câu hỏi
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {questions.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {questions.map(q => (
                                    <QuestionDisplayCard
                                        key={q.id}
                                        data={q}
                                        className="cursor-pointer"
                                    >
                                        <DropdownExamQuestion
                                            onView={() => {}}
                                            onDelete={() => {}}
                                        />
                                    </QuestionDisplayCard>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="mb-4">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Chưa có câu hỏi nào trong đề thi này
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {exam.sections
                                        ? `Đề thi có ${exam.sections.length} phần nhưng chưa có câu hỏi nào. Thêm câu hỏi để hoàn thiện đề thi.`
                                        : 'Đề thi chưa được thiết lập cấu trúc. Vui lòng thêm các phần thi và câu hỏi.'}
                                </p>
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    Thêm câu hỏi đầu tiên
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setShowDeleteModal(false)}
                        ></div>
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg
                                            className="h-6 w-6 text-red-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                                            Xác nhận xóa đề thi
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Bạn có chắc chắn muốn xóa đề thi "
                                                <strong>{exam.title}</strong>"? Hành động này không
                                                thể hoàn tác và tất cả dữ liệu liên quan sẽ bị mất.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    disabled={deleteLoading}
                                    onClick={handleDeleteExam}
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {deleteLoading ? 'Đang xóa...' : 'Xóa đề thi'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <ExamPreview
                isOpen={previewOpen}
                onClose={() => setPreviewOpen(false)}
                exam={exam}
                questions={questions}
            />

            {isOpen && (
                <AddMultiQuestion
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onSubmit={async success => {
                        if (success) {
                            await refreshExam()
                        }
                        setIsOpen(false)
                    }}
                />
            )}
        </div>
    )
}
