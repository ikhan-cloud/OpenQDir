import type { ReactNode } from 'react'

import { get } from '../layouts/layoutRegistry'
import { useWorkspaceStore, type PaneState } from '../store'

interface WorkspaceLayoutProps {
  children?: ReactNode
}

function renderLayout(layout: string, panes: PaneState[]) {
  const Renderer = get(layout)
  if (!Renderer) return null
  return <Renderer panes={panes} />
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
  const activeTab = activePane?.tabs.find((t) => t.id === activePane.activeTabId)
  const hasPath = activeTab && activeTab.currentPath.length > 0

  if (!hasPath) {
    return (
      <main className="flex flex-1 flex-col overflow-auto bg-background">
        {children}
      </main>
    )
  }

  return renderLayout(layout, panes)
}
