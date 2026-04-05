import { useCallback, useRef, useState } from 'react'

/**
 * HighlightableText – allows users to select and highlight text.
 * Highlights are stored in local state (client-side only, non-persistent).
 */
export default function HighlightableText({ text, className = '' }) {
    const [highlights, setHighlights] = useState([])
    const containerRef = useRef(null)

    const handleMouseUp = useCallback(() => {
        const selection = window.getSelection()
        if (!selection || selection.isCollapsed || !containerRef.current) return

        const range = selection.getRangeAt(0)
        if (!containerRef.current.contains(range.commonAncestorContainer)) return

        const selectedText = selection.toString().trim()
        if (!selectedText) return

        // Find start/end offsets within the full text
        const fullText = containerRef.current.textContent || ''
        const startOffset = getTextOffset(
            containerRef.current,
            range.startContainer,
            range.startOffset
        )
        const endOffset = getTextOffset(containerRef.current, range.endContainer, range.endOffset)

        if (startOffset < 0 || endOffset < 0 || startOffset >= endOffset) return

        setHighlights(prev => {
            // Check if this highlight overlaps with existing ones – merge them
            const newHighlight = { start: startOffset, end: endOffset }
            const merged = mergeHighlights([...prev, newHighlight])
            return merged
        })

        selection.removeAllRanges()
    }, [])

    const handleClearHighlight = useCallback((e, idx) => {
        e.stopPropagation()
        setHighlights(prev => prev.filter((_, i) => i !== idx))
    }, [])

    const segments = buildSegments(text, highlights)

    return (
        <p
            ref={containerRef}
            onMouseUp={handleMouseUp}
            className={`whitespace-pre-line select-text cursor-text ${className}`}
        >
            {segments.map((seg, i) =>
                seg.highlighted ? (
                    <mark
                        key={i}
                        className="bg-yellow-200/80 text-inherit rounded-sm px-0 cursor-pointer hover:bg-yellow-300/80 transition-colors"
                        title="Nhấn để bỏ highlight"
                        onClick={e => handleClearHighlight(e, seg.highlightIndex)}
                    >
                        {seg.text}
                    </mark>
                ) : (
                    <span key={i}>{seg.text}</span>
                )
            )}
        </p>
    )
}

/** Calculate text offset from the start of a container node. */
function getTextOffset(root, node, offset) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let totalOffset = 0

    while (walker.nextNode()) {
        if (walker.currentNode === node) {
            return totalOffset + offset
        }
        totalOffset += walker.currentNode.textContent.length
    }
    return -1
}

/** Merge overlapping highlights. */
function mergeHighlights(highlights) {
    if (highlights.length <= 1) return highlights
    const sorted = [...highlights].sort((a, b) => a.start - b.start)
    const merged = [sorted[0]]

    for (let i = 1; i < sorted.length; i++) {
        const last = merged[merged.length - 1]
        if (sorted[i].start <= last.end) {
            last.end = Math.max(last.end, sorted[i].end)
        } else {
            merged.push(sorted[i])
        }
    }
    return merged
}

/** Build text segments with highlight info. */
function buildSegments(text, highlights) {
    if (!highlights.length) return [{ text, highlighted: false }]

    const sorted = [...highlights].sort((a, b) => a.start - b.start)
    const segments = []
    let pos = 0

    sorted.forEach((h, idx) => {
        if (h.start > pos) {
            segments.push({ text: text.slice(pos, h.start), highlighted: false })
        }
        segments.push({
            text: text.slice(h.start, h.end),
            highlighted: true,
            highlightIndex: idx,
        })
        pos = h.end
    })

    if (pos < text.length) {
        segments.push({ text: text.slice(pos), highlighted: false })
    }

    return segments
}
