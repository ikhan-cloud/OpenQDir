import type { ReactNode } from 'react'

interface TabBarProps {
  children: ReactNode
}

let _tbRenders = 0

export function TabBar({ children }: TabBarProps) {
  console.debug('[TabBar] render #', ++_tbRenders)
  return (
    <div className="flex items-center border-b border-border bg-muted/30 pl-1 pr-1">
      {children}
    </div>
  )
}
