import type { ReactNode } from 'react'

interface TabBarProps {
  children: ReactNode
}

export function TabBar({ children }: TabBarProps) {
  return (
    <div className="flex items-center border-b border-border bg-muted/30 pl-1 pr-1">
      {children}
    </div>
  )
}
