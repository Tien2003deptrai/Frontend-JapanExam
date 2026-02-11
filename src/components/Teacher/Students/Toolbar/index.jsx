import { Search } from 'lucide-react'

export default function Toolbar({
    title = 'Danh sách học viên',
    searchTerm = '',
    onSearchChange,
    selectedClass = 'all',
    onClassChange,
    classOptions,
}) {

    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>

            <div className="flex items-center space-x-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm học viên..."
                        value={searchTerm}
                        onChange={(event) => onSearchChange?.(event.target.value)}
                        className="rounded-lg w-80 border border-gray-300 py-2 pl-10 pr-4"
                    />
                </div>
                <select
                    className="rounded-lg border border-gray-300 px-4 py-2"
                    value={selectedClass}
                    onChange={(event) => onClassChange?.(event.target.value)}
                >
                    {classOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}
