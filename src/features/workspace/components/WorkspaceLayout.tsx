import type { ReactNode } from 'react'

import { useWorkspaceStore } from '../store'
import { Pane } from './Pane'
import { PaneContainer } from './PaneContainer'

interface WorkspaceLayoutProps {
  children?: ReactNode
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const panes = useWorkspaceStore((s) => s.panes)
  const layout = useWorkspaceStore((s) => s.layout)
  const activePaneId = useWorkspaceStore((s) => s.activePaneId)

  if (panes.length === 0) {
    return (
      <main className="flex flex-1 flex-col overflow-auto bg-background">
        {children}
      </main>
    )
  }

  const activePane = panes.find((p) => p.id === activePaneId)
  const hasPath = activePane && activePane.currentPath.length > 0

  if (!hasPath) {
    return (
      <main className="flex flex-1 flex-col overflow-auto bg-background">
        {children}
      </main>
    )
  }

  if (layout === 'single') {
    return (
      <main className="flex flex-1 flex-col overflow-auto bg-background">
        {panes.map((pane) => (
          <Pane key={pane.id} id={pane.id}>
            <PaneContainer paneId={pane.id} />
          </Pane>
        ))}
      </main>
    )
  }

  return null
}
