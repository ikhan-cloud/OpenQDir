import { useEffect } from 'react'
import type { ReactNode } from 'react'

import { WorkspaceLayout, useWorkspaceStore } from '@/features/workspace'

interface WorkspaceProps {
  children?: ReactNode
}

let _wsRenders = 0

export function Workspace({ children }: WorkspaceProps) {
  console.debug('[Workspace] render #', ++_wsRenders, 'panesInitialized:', useWorkspaceStore.getState().panes.length > 0)

  useEffect(() => {
    const state = useWorkspaceStore.getState()
    console.debug('[Workspace] effect: setLayout', state.layout, 'panesInitialized:', state.panes.length > 0)
    if (state.panes.length === 0) {
      state.setLayout(state.layout)
    }
  }, [])

  return <WorkspaceLayout>{children}</WorkspaceLayout>
}
