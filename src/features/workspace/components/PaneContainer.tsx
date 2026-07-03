import { useCallback, useEffect } from 'react'

import { ExplorerView } from '@/features/explorer'
import { useNavigationStore } from '@/features/navigation'
import { useExplorerStore } from '@/features/explorer'
import { useTreeStore } from '@/features/tree'
import { useWorkspaceStore } from '../store'
import { PaneIdContext } from './PaneIdContext'
import { TabBar, Tab, NewTabButton } from '../tabs'

interface PaneContainerProps {
  paneId: string
}

export function PaneContainer({ paneId }: PaneContainerProps) {
  const panes = useWorkspaceStore((s) => s.panes)
  const setPanePath = useWorkspaceStore((s) => s.setPanePath)
  const createTab = useWorkspaceStore((s) => s.createTab)
  const closeTab = useWorkspaceStore((s) => s.closeTab)
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab)

  const pane = panes.find((p) => p.id === paneId)
  const activeTab = pane?.tabs.find((t) => t.id === pane?.activeTabId)

  /* Register pane + all its tabs in sub-stores on mount */
  useEffect(() => {
    const navStore = useNavigationStore.getState()
    const explorerStore = useExplorerStore.getState()
    const treeStore = useTreeStore.getState()

    navStore.registerPane(paneId)
    explorerStore.registerPane(paneId)
    treeStore.registerPane(paneId)

    const currentPane = useWorkspaceStore.getState().panes.find((p) => p.id === paneId)
    if (currentPane) {
      for (const tab of currentPane.tabs) {
        navStore.registerTab(paneId, tab.id, tab.currentPath || undefined)
        explorerStore.registerTab(paneId, tab.id)
        treeStore.registerTab(paneId, tab.id)
      }
    }

    return () => {
      navStore.unregisterPane(paneId)
      explorerStore.unregisterPane(paneId)
      treeStore.unregisterPane(paneId)
    }
  }, [paneId])

  /* Sync the active tab's nav path back to the tab state */
  const navPathForTab = useNavigationStore((s) => {
    if (!activeTab) return undefined
    return s.panes[paneId]?.[activeTab.id]?.currentPath
  })

  useEffect(() => {
    if (activeTab && navPathForTab !== undefined && navPathForTab !== activeTab.currentPath) {
      setPanePath(paneId, navPathForTab)
    }
  }, [navPathForTab, activeTab, paneId, setPanePath])

  const handleTabClose = useCallback(
    (tabId: string) => {
      closeTab(paneId, tabId)
    },
    [closeTab, paneId],
  )

  const handleNewTab = useCallback(() => {
    createTab(paneId)
  }, [createTab, paneId])

  const handleTabClick = useCallback(
    (tabId: string) => {
      setActiveTab(paneId, tabId)
    },
    [setActiveTab, paneId],
  )

  return (
    <PaneIdContext.Provider value={paneId}>
      <div className="flex flex-col flex-1 overflow-hidden">
        <TabBar>
          {pane?.tabs.map((tab) => (
            <Tab
              key={tab.id}
              id={tab.id}
              title={tab.name}
              isActive={tab.id === pane.activeTabId}
              onClose={handleTabClose}
              onClick={handleTabClick}
            />
          ))}
          <NewTabButton onClick={handleNewTab} />
        </TabBar>
        <ExplorerView />
      </div>
    </PaneIdContext.Provider>
  )
}
