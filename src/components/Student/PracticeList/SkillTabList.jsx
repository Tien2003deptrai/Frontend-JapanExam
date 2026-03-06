import { cn } from '@/lib/utils'
import { SKILLS } from '@/mock/praticeData'

export default function SkillTabList({ selectedSkill, onSelectSkill }) {
    return (
        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Bước 1: Chọn kỹ năng</h2>
            <div className="flex w-full gap-3">
                {SKILLS.map(skill => {
                    const Icon = skill.icon
                    const isActive = selectedSkill === skill.id
                    return (
                        <button
                            key={skill.id}
                            type="button"
                            onClick={() => onSelectSkill(skill.id)}
                            className={cn(
                                'flex flex-1 flex-col items-center justify-center gap-1 min-w-0 py-4 px-5 rounded-lg border-2 transition-colors',
                                isActive
                                    ? 'rounded-t-lg bg-gradient-to-br from-blue-700 via-blue-500 to-cyan-300 text-white'
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                            )}
                        >
                            <Icon
                                className={cn('w-8 h-8', isActive ? 'text-white' : 'text-gray-600')}
                            />
                            <span className="text-sm font-medium">{skill.label}</span>
                            <span
                                className={cn(
                                    'text-sm',
                                    isActive ? 'text-blue-100' : 'text-gray-500'
                                )}
                            >
                                {skill.count}
                            </span>
                        </button>
                    )
                })}
            </div>
        </section>
    )
}
