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

let _wlRenders = 0

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  console.debug('[WorkspaceLayout] render #', ++_wlRenders, 'panes.length:', useWorkspaceStore.getState().panes.length)

  const panes = useWorkspaceStore((s) => s.panes)
  const layout = useWorkspaceStore((s) => s.layout)

  if (panes.length === 0) {
    return (
      <main className="flex flex-1 flex-col overflow-auto bg-background">
        {children}
      </main>
    )
  }

  return renderLayout(layout, panes)
}
