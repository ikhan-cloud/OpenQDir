import { useEffect } from 'react'
import type { ReactNode } from 'react'

import { WorkspaceLayout, useWorkspaceStore } from '@/features/workspace'

interface WorkspaceProps {
  children?: ReactNode
}

export function Workspace({ children }: WorkspaceProps) {
  const initPanes = useWorkspaceStore((s) => s.initPanes)
  const panesInitialized = useWorkspaceStore((s) => s.panes.length > 0)

  useEffect(() => {
    if (!panesInitialized) {
      initPanes(['main'])
    }
  }, [initPanes, panesInitialized])

  return <WorkspaceLayout>{children}</WorkspaceLayout>
}
