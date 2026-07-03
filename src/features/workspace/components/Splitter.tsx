import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface SplitterProps {
  onMouseDown: (e: React.MouseEvent) => void
  isDragging: boolean
  orientation?: 'horizontal' | 'vertical'
  children?: ReactNode
}

export function Splitter({
  onMouseDown,
  isDragging,
  orientation = 'horizontal',
  children,
}: SplitterProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className={cn(
        'relative flex items-center justify-center bg-transparent transition-colors',
        'hover:bg-accent/30',
        isDragging && 'bg-accent/40',
        orientation === 'horizontal'
          ? 'w-1 cursor-col-resize self-stretch'
          : 'h-1 cursor-row-resize self-stretch',
      )}
    >
      <div
        className={cn(
          'rounded-full transition-colors',
          orientation === 'horizontal' ? 'h-8 w-0.5' : 'w-8 h-0.5',
          isDragging ? 'bg-accent-foreground' : 'bg-border',
        )}
      />
      {children}
    </div>
  )
}
