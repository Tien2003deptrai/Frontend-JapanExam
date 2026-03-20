import { cn } from '@/lib/utils'
import { createContext, useContext } from 'react'

const TabsContext = createContext({ value: '', onValueChange: _v => {} })

function Tabs({ value, onValueChange, className, children, ...props }) {
    return (
        <TabsContext.Provider value={{ value, onValueChange }}>
            <div className={cn(className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    )
}

function TabsList({ className, children, ...props }) {
    return (
        <div className={cn('inline-flex items-center gap-1', className)} role="tablist" {...props}>
            {children}
        </div>
    )
}

function TabsTrigger({ value, className, children, ...props }) {
    const ctx = useContext(TabsContext)
    const isActive = ctx.value === value
    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => ctx.onValueChange?.(value)}
            className={cn(className)}
            data-state={isActive ? 'active' : 'inactive'}
            {...props}
        >
            {children}
        </button>
    )
}

function TabsContent({ value, className, children, ...props }) {
    const ctx = useContext(TabsContext)
    if (ctx.value !== value) return null
    return (
        <div role="tabpanel" className={cn(className)} {...props}>
            {children}
        </div>
    )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
