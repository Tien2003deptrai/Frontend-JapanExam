export const parseDurationMinutes = durationStr => {
    if (!durationStr) return 60
    const match = String(durationStr).match(/(\d+)\s*phút/)
    return match ? parseInt(match[1], 10) : 60
}

export const formatCountdown = seconds => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return [h, m, s].map(n => String(n).padStart(2, '0')).join(':')
}
