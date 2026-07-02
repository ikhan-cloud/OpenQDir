import { useContext, useCallback, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useNavigationStore } from '@/features/navigation'
import type { NavigationStore, PaneNavState } from '@/features/navigation'
import { useExplorerStore } from '@/features/explorer'
import type { ExplorerStore, PaneExplorerState, SortMode, SortDirection, ViewMode } from '@/features/explorer'
import { useTreeStore } from '@/features/tree'
import type { TreeStore, PaneTreeState } from '@/features/tree'
import type { FileEntry } from '@/types'
import { useWorkspaceStore } from './store'
import { PaneIdContext } from './components/PaneIdContext'

function usePaneId(): string {
  return useContext(PaneIdContext)
}

function getDefaultPaneNav(): PaneNavState {
  return { currentPath: '', history: [''], historyIndex: 0 }
}

function getNavState(s: NavigationStore, paneId: string): PaneNavState {
  return s.panes[paneId] ?? getDefaultPaneNav()
}

function getDefaultExplorer(): PaneExplorerState {
  return {
    entries: [],
    loading: false,
    error: null,
    sortMode: 'name' as SortMode,
    sortDirection: 'asc' as SortDirection,
    viewMode: 'list' as ViewMode,
    selectedItems: [],
    activeItem: null,
    lastSelectedItem: null,
  }
}

function getExplorerState(s: ExplorerStore, paneId: string): PaneExplorerState {
  return s.panes[paneId] ?? getDefaultExplorer()
}

function getDefaultTree(): PaneTreeState {
  return {
    expandedPaths: [],
    loadedPaths: [],
    childrenMap: {},
    loadingPaths: [],
    selectedPath: null,
  }
}

function getTreeState(s: TreeStore, paneId: string): PaneTreeState {
  return s.panes[paneId] ?? getDefaultTree()
}

/* ─── Navigation ─── */

interface PaneNavActions {
  navigate: (path: string) => void
  goBack: () => void
  goForward: () => void
  goUp: () => void
  refresh: () => void
}

export interface PaneNavResult extends PaneNavState, PaneNavActions {
  canGoBack: boolean
  canGoForward: boolean
}

function usePaneNavForId(paneId: string): PaneNavResult {
  const state = useNavigationStore(
    useShallow((s) => {
      const p = getNavState(s, paneId)
      return {
        currentPath: p.currentPath,
        history: p.history,
        historyIndex: p.historyIndex,
        canGoBack: p.historyIndex > 0,
        canGoForward: p.historyIndex < p.history.length - 1,
      }
    }),
  )

  const navigateRaw = useNavigationStore((s) => s.navigate)
  const goBackRaw = useNavigationStore((s) => s.goBack)
  const goForwardRaw = useNavigationStore((s) => s.goForward)
  const goUpRaw = useNavigationStore((s) => s.goUp)
  const refreshRaw = useNavigationStore((s) => s.refresh)

  const navigate = useCallback((path: string) => navigateRaw(paneId, path), [navigateRaw, paneId])
  const goBack = useCallback(() => goBackRaw(paneId), [goBackRaw, paneId])
  const goForward = useCallback(() => goForwardRaw(paneId), [goForwardRaw, paneId])
  const goUp = useCallback(() => goUpRaw(paneId), [goUpRaw, paneId])
  const refresh = useCallback(() => refreshRaw(paneId), [refreshRaw, paneId])

  return useMemo(
    () => ({ ...state, navigate, goBack, goForward, goUp, refresh }),
    [state, navigate, goBack, goForward, goUp, refresh],
  )
}

export function usePaneNav(): PaneNavResult {
  return usePaneNavForId(usePaneId())
}

export function useActivePaneNav(): PaneNavResult {
  const activePaneId = useWorkspaceStore((s) => s.activePaneId)
  return usePaneNavForId(activePaneId || 'main')
}

/* ─── Explorer ─── */

interface PaneExplorerActions {
  setEntries: (entries: FileEntry[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSortMode: (mode: SortMode) => void
  setSortDirection: (direction: SortDirection) => void
  setViewMode: (mode: ViewMode) => void
  selectItem: (path: string) => void
  setActiveItem: (path: string | null) => void
  clearSelection: () => void
  moveSelectionUp: (sortedPaths: string[]) => void
  moveSelectionDown: (sortedPaths: string[]) => void
  moveSelectionHome: (sortedPaths: string[]) => void
  moveSelectionEnd: (sortedPaths: string[]) => void
}

export interface PaneExplorerResult extends PaneExplorerState, PaneExplorerActions {}

function usePaneExplorerForId(paneId: string): PaneExplorerResult {
  const state = useExplorerStore(useShallow((s) => getExplorerState(s, paneId)))

  const setEntriesRaw = useExplorerStore((s) => s.setEntries)
  const setLoadingRaw = useExplorerStore((s) => s.setLoading)
  const setErrorRaw = useExplorerStore((s) => s.setError)
  const setSortModeRaw = useExplorerStore((s) => s.setSortMode)
  const setSortDirectionRaw = useExplorerStore((s) => s.setSortDirection)
  const setViewModeRaw = useExplorerStore((s) => s.setViewMode)
  const selectItemRaw = useExplorerStore((s) => s.selectItem)
  const setActiveItemRaw = useExplorerStore((s) => s.setActiveItem)
  const clearSelectionRaw = useExplorerStore((s) => s.clearSelection)
  const moveSelectionUpRaw = useExplorerStore((s) => s.moveSelectionUp)
  const moveSelectionDownRaw = useExplorerStore((s) => s.moveSelectionDown)
  const moveSelectionHomeRaw = useExplorerStore((s) => s.moveSelectionHome)
  const moveSelectionEndRaw = useExplorerStore((s) => s.moveSelectionEnd)

  const setEntries = useCallback((entries: FileEntry[]) => setEntriesRaw(paneId, entries), [setEntriesRaw, paneId])
  const setLoading = useCallback((loading: boolean) => setLoadingRaw(paneId, loading), [setLoadingRaw, paneId])
  const setError = useCallback((error: string | null) => setErrorRaw(paneId, error), [setErrorRaw, paneId])
  const setSortMode = useCallback((mode: SortMode) => setSortModeRaw(paneId, mode), [setSortModeRaw, paneId])
  const setSortDirection = useCallback((d: SortDirection) => setSortDirectionRaw(paneId, d), [setSortDirectionRaw, paneId])
  const setViewMode = useCallback((mode: ViewMode) => setViewModeRaw(paneId, mode), [setViewModeRaw, paneId])
  const selectItem = useCallback((path: string) => selectItemRaw(paneId, path), [selectItemRaw, paneId])
  const setActiveItem = useCallback((path: string | null) => setActiveItemRaw(paneId, path), [setActiveItemRaw, paneId])
  const clearSelection = useCallback(() => clearSelectionRaw(paneId), [clearSelectionRaw, paneId])
  const moveSelectionUp = useCallback((paths: string[]) => moveSelectionUpRaw(paneId, paths), [moveSelectionUpRaw, paneId])
  const moveSelectionDown = useCallback((paths: string[]) => moveSelectionDownRaw(paneId, paths), [moveSelectionDownRaw, paneId])
  const moveSelectionHome = useCallback((paths: string[]) => moveSelectionHomeRaw(paneId, paths), [moveSelectionHomeRaw, paneId])
  const moveSelectionEnd = useCallback((paths: string[]) => moveSelectionEndRaw(paneId, paths), [moveSelectionEndRaw, paneId])

  return useMemo(
    () => ({
      ...state,
      setEntries,
      setLoading,
      setError,
      setSortMode,
      setSortDirection,
      setViewMode,
      selectItem,
      setActiveItem,
      clearSelection,
      moveSelectionUp,
      moveSelectionDown,
      moveSelectionHome,
      moveSelectionEnd,
    }),
    [state, setEntries, setLoading, setError, setSortMode, setSortDirection, setViewMode, selectItem, setActiveItem, clearSelection, moveSelectionUp, moveSelectionDown, moveSelectionHome, moveSelectionEnd],
  )
}

export function usePaneExplorer(): PaneExplorerResult {
  return usePaneExplorerForId(usePaneId())
}

/* ─── Tree ─── */

interface PaneTreeActions {
  expandNode: (path: string) => void
  collapseNode: (path: string) => void
  toggleNode: (path: string) => void
  expandToPath: (path: string) => void
  setNodeChildren: (path: string, children: string[]) => void
  addLoading: (path: string) => void
  removeLoading: (path: string) => void
  setSelectedPath: (path: string | null) => void
}

export interface PaneTreeResult extends PaneTreeState, PaneTreeActions {}

function usePaneTreeForId(paneId: string): PaneTreeResult {
  const state = useTreeStore(useShallow((s) => getTreeState(s, paneId)))

  const expandNodeRaw = useTreeStore((s) => s.expandNode)
  const collapseNodeRaw = useTreeStore((s) => s.collapseNode)
  const toggleNodeRaw = useTreeStore((s) => s.toggleNode)
  const expandToPathRaw = useTreeStore((s) => s.expandToPath)
  const setNodeChildrenRaw = useTreeStore((s) => s.setNodeChildren)
  const addLoadingRaw = useTreeStore((s) => s.addLoading)
  const removeLoadingRaw = useTreeStore((s) => s.removeLoading)
  const setSelectedPathRaw = useTreeStore((s) => s.setSelectedPath)

  const expandNode = useCallback((path: string) => expandNodeRaw(paneId, path), [expandNodeRaw, paneId])
  const collapseNode = useCallback((path: string) => collapseNodeRaw(paneId, path), [collapseNodeRaw, paneId])
  const toggleNode = useCallback((path: string) => toggleNodeRaw(paneId, path), [toggleNodeRaw, paneId])
  const expandToPath = useCallback((path: string) => expandToPathRaw(paneId, path), [expandToPathRaw, paneId])
  const setNodeChildren = useCallback((path: string, children: string[]) => setNodeChildrenRaw(paneId, path, children), [setNodeChildrenRaw, paneId])
  const addLoading = useCallback((path: string) => addLoadingRaw(paneId, path), [addLoadingRaw, paneId])
  const removeLoading = useCallback((path: string) => removeLoadingRaw(paneId, path), [removeLoadingRaw, paneId])
  const setSelectedPath = useCallback((path: string | null) => setSelectedPathRaw(paneId, path), [setSelectedPathRaw, paneId])

  return useMemo(
    () => ({
      ...state,
      expandNode,
      collapseNode,
      toggleNode,
      expandToPath,
      setNodeChildren,
      addLoading,
      removeLoading,
      setSelectedPath,
    }),
    [state, expandNode, collapseNode, toggleNode, expandToPath, setNodeChildren, addLoading, removeLoading, setSelectedPath],
  )
}

export function usePaneTree(): PaneTreeResult {
  return usePaneTreeForId(usePaneId())
}

export function useActivePaneTree(): PaneTreeResult {
  const activePaneId = useWorkspaceStore((s) => s.activePaneId)
  return usePaneTreeForId(activePaneId || 'main')
}
