import {
    AddQuestion,
    EditBlockFullModal,
    ImportQuestion,
    MySpace,
    QuestionCard,
    QuestionDetailModal,
    QuestionHeading,
} from '@/components'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { questionBlockService } from '@/services/QuestionBlockService'
import useAuthStore from '@/stores/authStore'
import { Loader2, PencilLine, Trash2 } from 'lucide-react'
import { Fragment, useCallback, useEffect, useState } from 'react'

const PAGE_LIMIT = 20

export default function QuestionPage() {
    const user = useAuthStore(s => s.user)
    const [addOpen, setAddOpen] = useState(false)
    const [importOpen, setImportOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('all')
    const [searchValue, setSearchValue] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [viewingBlock, setViewingBlock] = useState(null)
    const [editingBlock, setEditingBlock] = useState(null)

    // API state
    const [blocks, setBlocks] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [hasMore, setHasMore] = useState(false)

    // Debounce search input (400ms)
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchValue), 400)
        return () => clearTimeout(timer)
    }, [searchValue])

    // Fetch blocks from API
    const fetchBlocks = useCallback(
        async (pageNum = 1, append = false) => {
            setLoading(true)
            try {
                const body = {
                    page: pageNum,
                    limit: PAGE_LIMIT,
                }
                if (activeTab !== 'all') {
                    body.section = activeTab
                }
                if (debouncedSearch.trim()) {
                    body.search = debouncedSearch.trim()
                }

                const res = await questionBlockService.getBlocks(body)
                const data = res?.data || []
                const pagination = res?.pagination || {}

                if (append) {
                    setBlocks(prev => [...prev, ...data])
                } else {
                    setBlocks(data)
                }
                setTotal(pagination.total || 0)
                setHasMore(pagination.hasNext || false)
                setPage(pageNum)
            } catch (err) {
                console.error('Failed to fetch blocks:', err)
            } finally {
                setLoading(false)
            }
        },
        [activeTab, debouncedSearch]
    )

    // Refetch when tab or search changes
    useEffect(() => {
        fetchBlocks(1, false)
    }, [fetchBlocks])

    const handleCreated = useCallback(() => {
        fetchBlocks(1, false)
        setAddOpen(false)
    }, [fetchBlocks])

    const handleLoadMore = () => {
        if (hasMore && !loading) {
            fetchBlocks(page + 1, true)
        }
    }

    const handleTabChange = tab => {
        setActiveTab(tab)
        setPage(1)
    }

    const handleDelete = async blockId => {
        try {
            await questionBlockService.deleteBlock(blockId)
            fetchBlocks(1, false)
        } catch (err) {
            console.error('Failed to delete block:', err)
        }
    }

    const handleEditQuestion = (questionData, blockId) => {
        // TODO: Implement question editing modal/flow
        alert(
            `Chức năng sửa câu hỏi sẽ được cập nhật trong phiên bản tiếp theo.\nCâu hỏi: ${questionData.questionText}`
        )
    }

    const handleEditBlock = blockData => {
        setEditingBlock(blockData)
    }

    const handleBlockUpdated = () => {
        // Refresh the list after updating a block
        fetchBlocks(page, false)
    }

    const handleDeleteQuestion = () => {
        // Refresh the list after deleting a question
        fetchBlocks(page, false)
    }

    const handleImport = async items => {
        // Convert parsed items to the payload shape expected by createBlocks
        const payload = {
            items: items.map(item => ({
                section: item.section,
                level: item.level,
                questionType: item.questionType || '',
                title: item.title || '',
                difficulty: item.difficulty || 'medium',
                tags: item.tags || [],
                instructions: item.instructions || '',
                context: item.context || undefined,
                questions: (item.questions || []).map(q => ({
                    questionText: q.questionText,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation || '',
                    translationVi: q.translationVi || '',
                    difficulty: q.difficulty || item.difficulty || 'medium',
                })),
            })),
        }
        await questionBlockService.createBlocks(payload)
        // Refresh list after successful import
        fetchBlocks(1, false)
    }

    return (
        <Fragment>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="">
                <MySpace>
                    <MySpace.Heading className="bg-white p-5">
                        <QuestionHeading
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                            onOpenAdd={() => setAddOpen(true)}
                            onOpenImport={() => setImportOpen(true)}
                            searchValue={searchValue}
                            onSearchChange={setSearchValue}
                        />
                    </MySpace.Heading>
                    <MySpace.Body>
                        <TabsContent value={activeTab} className="mt-0 w-full outline-none">
                            {/* Loading state (first load) */}
                            {loading && blocks.length === 0 && (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="size-6 animate-spin text-primary" />
                                    <span className="ml-2 text-sm text-text-light">
                                        Đang tải...
                                    </span>
                                </div>
                            )}

                            {/* Empty state */}
                            {!loading && blocks.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <p className="text-base font-semibold text-text-light">
                                        Không tìm thấy câu hỏi nào
                                    </p>
                                    <p className="mt-1 text-sm text-text-muted">
                                        {debouncedSearch
                                            ? 'Thử tìm kiếm với từ khóa khác'
                                            : 'Hãy tạo câu hỏi đầu tiên'}
                                    </p>
                                </div>
                            )}

                            {/* Question list */}
                            {blocks.length > 0 && (
                                <>
                                    <div className="flex flex-wrap gap-4">
                                        {blocks.map(block => {
                                            const isOwner =
                                                user?.role === 'admin' ||
                                                block.createdBy?._id === user?._id ||
                                                block.createdBy === user?._id
                                            return (
                                                <QuestionCard
                                                    key={block._id}
                                                    data={block}
                                                    onClick={() => setViewingBlock(block)}
                                                    className="w-full min-w-0 md:w-[calc(50%-8px)] 2xl:w-[calc(33.333333%-10.666666px)]"
                                                >
                                                    {isOwner && (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                type="button"
                                                                title="Chỉnh sửa"
                                                                onClick={e => {
                                                                    e.stopPropagation()
                                                                    setEditingBlock(block)
                                                                }}
                                                                className="rounded-md p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                                                            >
                                                                <PencilLine className="size-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                title="Xóa"
                                                                onClick={e => {
                                                                    e.stopPropagation()
                                                                    handleDelete(block._id)
                                                                }}
                                                                className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </QuestionCard>
                                            )
                                        })}
                                    </div>

                                    {/* Load more */}
                                    {hasMore && (
                                        <div className="mt-6 flex justify-center">
                                            <button
                                                type="button"
                                                onClick={handleLoadMore}
                                                disabled={loading}
                                                className="inline-flex h-10 items-center gap-2 rounded-xl border-2 border-border bg-white px-5 text-sm font-semibold text-text-light transition-all duration-200 hover:bg-surface disabled:opacity-50 cursor-pointer"
                                            >
                                                {loading ? (
                                                    <Loader2 className="size-4 animate-spin" />
                                                ) : null}
                                                {loading ? 'Đang tải...' : 'Xem thêm'}
                                            </button>
                                        </div>
                                    )}

                                    {/* Total count */}
                                    <div className="mt-4 text-center text-xs text-text-muted">
                                        Hiển thị {blocks.length} / {total} nhóm câu hỏi
                                    </div>
                                </>
                            )}
                        </TabsContent>
                    </MySpace.Body>
                </MySpace>
            </Tabs>
            <AddQuestion
                isOpen={addOpen}
                onClose={() => setAddOpen(false)}
                onSubmit={handleCreated}
            />
            <ImportQuestion
                isOpen={importOpen}
                onClose={() => setImportOpen(false)}
                onImport={handleImport}
            />
            <QuestionDetailModal
                isOpen={!!viewingBlock}
                onClose={() => setViewingBlock(null)}
                blockData={viewingBlock}
                onEdit={handleEditBlock}
                onDelete={handleDeleteQuestion}
            />{' '}
            <EditBlockFullModal
                isOpen={!!editingBlock}
                onClose={() => setEditingBlock(null)}
                blockId={editingBlock?._id}
                onSuccess={handleBlockUpdated}
            />{' '}
        </Fragment>
    )
}
