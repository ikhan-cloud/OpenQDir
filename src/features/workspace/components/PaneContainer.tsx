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

let _pcRenders = 0
let _pcEffectReg = 0

export function PaneContainer({ paneId }: PaneContainerProps) {
  console.debug('[PaneContainer] render #', ++_pcRenders, 'paneId:', paneId)

  const panes = useWorkspaceStore((s) => s.panes)
  const createTab = useWorkspaceStore((s) => s.createTab)
  const closeTab = useWorkspaceStore((s) => s.closeTab)
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab)

  const pane = panes.find((p) => p.id === paneId)

  /* Register pane + all its tabs in sub-stores on mount */
  useEffect(() => {
    console.debug('[PaneContainer] effect: register pane #', ++_pcEffectReg, 'paneId:', paneId)
    const navStore = useNavigationStore.getState()
    const explorerStore = useExplorerStore.getState()
    const treeStore = useTreeStore.getState()

    navStore.registerPane(paneId)
    explorerStore.registerPane(paneId)
    treeStore.registerPane(paneId)

    const currentPane = useWorkspaceStore.getState().panes.find((p) => p.id === paneId)
    if (currentPane) {
      for (const tab of currentPane.tabs) {
        navStore.registerTab(paneId, tab.id, undefined)
        explorerStore.registerTab(paneId, tab.id)
        treeStore.registerTab(paneId, tab.id)
      }
    }

    return () => {
      navStore.unregisterPane(paneId)
      explorerStore.unregisterPane(paneId)
      treeStore.unregisterPane(paneId)
    }
  }, [])

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
