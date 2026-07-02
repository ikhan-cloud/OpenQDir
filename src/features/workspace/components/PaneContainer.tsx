import { useEffect } from 'react'

import { ExplorerView } from '@/features/explorer'
import { useNavigationStore } from '@/features/navigation'
import { useWorkspaceStore } from '../store'

interface PaneContainerProps {
  paneId: string
}

export function PaneContainer({ paneId }: PaneContainerProps) {
  const panes = useWorkspaceStore((s) => s.panes)
  const setPanePath = useWorkspaceStore((s) => s.setPanePath)
  const navPath = useNavigationStore((s) => s.currentPath)
  const pane = panes.find((p) => p.id === paneId)

  useEffect(() => {
    if (pane && navPath !== pane.currentPath) {
      setPanePath(paneId, navPath)
    }
  }, [navPath, pane, paneId, setPanePath])

  return <ExplorerView />
}
