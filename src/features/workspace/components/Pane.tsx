import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { useWorkspaceStore } from '../store'

interface PaneProps {
  id: string
  children: ReactNode
}

export function Pane({ id, children }: PaneProps) {
  const activePaneId = useWorkspaceStore((s) => s.activePaneId)
  const setActivePane = useWorkspaceStore((s) => s.setActivePane)
  const isActive = activePaneId === id

  return (
    <div
      className={cn(
        'flex flex-1 flex-col overflow-hidden',
        isActive ? 'z-10' : 'z-0 opacity-70',
      )}
      onClick={() => setActivePane(id)}
      data-pane-id={id}
    >
      {children}
    </div>
  )
}
