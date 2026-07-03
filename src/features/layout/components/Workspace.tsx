import { useEffect } from 'react'
import type { ReactNode } from 'react'

import { WorkspaceLayout, useWorkspaceStore } from '@/features/workspace'

interface WorkspaceProps {
  children?: ReactNode
}

export function Workspace({ children }: WorkspaceProps) {
  const layout = useWorkspaceStore((s) => s.layout)
  const setLayout = useWorkspaceStore((s) => s.setLayout)
  const panesInitialized = useWorkspaceStore((s) => s.panes.length > 0)

  useEffect(() => {
    if (!panesInitialized) {
      setLayout(layout)
    }
  }, [setLayout, panesInitialized, layout])

  return <WorkspaceLayout>{children}</WorkspaceLayout>
}
