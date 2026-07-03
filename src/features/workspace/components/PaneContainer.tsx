import { useEffect } from 'react'

import { ExplorerView } from '@/features/explorer'
import { useNavigationStore } from '@/features/navigation'
import { useExplorerStore } from '@/features/explorer'
import { useTreeStore } from '@/features/tree'
import { useWorkspaceStore } from '../store'
import { PaneIdContext } from './PaneIdContext'

interface PaneContainerProps {
  paneId: string
}

export function PaneContainer({ paneId }: PaneContainerProps) {
  const panes = useWorkspaceStore((s) => s.panes)
  const setPanePath = useWorkspaceStore((s) => s.setPanePath)
  const navPath = useNavigationStore((s) => s.panes[paneId]?.currentPath)

  const pane = panes.find((p) => p.id === paneId)
  const activeTab = pane?.tabs.find((t) => t.id === pane?.activeTabId)

  useEffect(() => {
    useNavigationStore.getState().registerPane(paneId)
    useExplorerStore.getState().registerPane(paneId)
    useTreeStore.getState().registerPane(paneId)
  }, [paneId])

  useEffect(() => {
    if (activeTab && navPath !== undefined && navPath !== activeTab.currentPath) {
      setPanePath(paneId, navPath)
    }
  }, [navPath, activeTab, paneId, setPanePath])

  return (
    <PaneIdContext.Provider value={paneId}>
      <ExplorerView />
    </PaneIdContext.Provider>
  )
}
