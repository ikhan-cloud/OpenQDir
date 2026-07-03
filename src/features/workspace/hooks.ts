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
import { useFileOperations as useFileOps } from '@/hooks/useFileOperations'
import { useFileTransfer as useFileXfer } from '@/hooks/useFileTransfer'
import { useClipboard as useClip } from '@/hooks/useClipboard'
import { PaneIdContext } from './components/PaneIdContext'

function usePaneId(): string {
  return useContext(PaneIdContext)
}

function useActiveTabId(paneId: string): string {
  return useWorkspaceStore(
    useShallow((s) => s.panes.find((p) => p.id === paneId)?.activeTabId ?? 'tab1'),
  )
}

function getDefaultPaneNav(): PaneNavState {
  return { currentPath: '', history: [''], historyIndex: 0 }
}

function getNavState(s: NavigationStore, paneId: string, tabId: string): PaneNavState {
  return s.panes[paneId]?.[tabId] ?? getDefaultPaneNav()
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
    filterQuery: '',
  }
}

function getExplorerState(s: ExplorerStore, paneId: string, tabId: string): PaneExplorerState {
  return s.panes[paneId]?.[tabId] ?? getDefaultExplorer()
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

function getTreeState(s: TreeStore, paneId: string, tabId: string): PaneTreeState {
  return s.panes[paneId]?.[tabId] ?? getDefaultTree()
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
  const tabId = useActiveTabId(paneId)

  const state = useNavigationStore(
    useShallow((s) => {
      const p = getNavState(s, paneId, tabId)
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

  const navigate = useCallback(
    (path: string) => navigateRaw(paneId, tabId, path),
    [navigateRaw, paneId, tabId],
  )
  const goBack = useCallback(() => goBackRaw(paneId, tabId), [goBackRaw, paneId, tabId])
  const goForward = useCallback(() => goForwardRaw(paneId, tabId), [goForwardRaw, paneId, tabId])
  const goUp = useCallback(() => goUpRaw(paneId, tabId), [goUpRaw, paneId, tabId])
  const refresh = useCallback(() => refreshRaw(paneId, tabId), [refreshRaw, paneId, tabId])

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
  setFilterQuery: (query: string) => void
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
  const tabId = useActiveTabId(paneId)

  const state = useExplorerStore(useShallow((s) => getExplorerState(s, paneId, tabId)))

  const setEntriesRaw = useExplorerStore((s) => s.setEntries)
  const setLoadingRaw = useExplorerStore((s) => s.setLoading)
  const setErrorRaw = useExplorerStore((s) => s.setError)
  const setSortModeRaw = useExplorerStore((s) => s.setSortMode)
  const setSortDirectionRaw = useExplorerStore((s) => s.setSortDirection)
  const setViewModeRaw = useExplorerStore((s) => s.setViewMode)
  const setFilterQueryRaw = useExplorerStore((s) => s.setFilterQuery)
  const selectItemRaw = useExplorerStore((s) => s.selectItem)
  const setActiveItemRaw = useExplorerStore((s) => s.setActiveItem)
  const clearSelectionRaw = useExplorerStore((s) => s.clearSelection)
  const moveSelectionUpRaw = useExplorerStore((s) => s.moveSelectionUp)
  const moveSelectionDownRaw = useExplorerStore((s) => s.moveSelectionDown)
  const moveSelectionHomeRaw = useExplorerStore((s) => s.moveSelectionHome)
  const moveSelectionEndRaw = useExplorerStore((s) => s.moveSelectionEnd)

  const setEntries = useCallback(
    (entries: FileEntry[]) => setEntriesRaw(paneId, tabId, entries),
    [setEntriesRaw, paneId, tabId],
  )
  const setLoading = useCallback(
    (loading: boolean) => setLoadingRaw(paneId, tabId, loading),
    [setLoadingRaw, paneId, tabId],
  )
  const setError = useCallback(
    (error: string | null) => setErrorRaw(paneId, tabId, error),
    [setErrorRaw, paneId, tabId],
  )
  const setSortMode = useCallback(
    (mode: SortMode) => setSortModeRaw(paneId, tabId, mode),
    [setSortModeRaw, paneId, tabId],
  )
  const setSortDirection = useCallback(
    (d: SortDirection) => setSortDirectionRaw(paneId, tabId, d),
    [setSortDirectionRaw, paneId, tabId],
  )
  const setViewMode = useCallback(
    (mode: ViewMode) => setViewModeRaw(paneId, tabId, mode),
    [setViewModeRaw, paneId, tabId],
  )
  const setFilterQuery = useCallback(
    (query: string) => setFilterQueryRaw(paneId, tabId, query),
    [setFilterQueryRaw, paneId, tabId],
  )
  const selectItem = useCallback(
    (path: string) => selectItemRaw(paneId, tabId, path),
    [selectItemRaw, paneId, tabId],
  )
  const setActiveItem = useCallback(
    (path: string | null) => setActiveItemRaw(paneId, tabId, path),
    [setActiveItemRaw, paneId, tabId],
  )
  const clearSelection = useCallback(
    () => clearSelectionRaw(paneId, tabId),
    [clearSelectionRaw, paneId, tabId],
  )
  const moveSelectionUp = useCallback(
    (paths: string[]) => moveSelectionUpRaw(paneId, tabId, paths),
    [moveSelectionUpRaw, paneId, tabId],
  )
  const moveSelectionDown = useCallback(
    (paths: string[]) => moveSelectionDownRaw(paneId, tabId, paths),
    [moveSelectionDownRaw, paneId, tabId],
  )
  const moveSelectionHome = useCallback(
    (paths: string[]) => moveSelectionHomeRaw(paneId, tabId, paths),
    [moveSelectionHomeRaw, paneId, tabId],
  )
  const moveSelectionEnd = useCallback(
    (paths: string[]) => moveSelectionEndRaw(paneId, tabId, paths),
    [moveSelectionEndRaw, paneId, tabId],
  )

  return useMemo(
    () => ({
      ...state,
      setEntries,
      setLoading,
      setError,
      setSortMode,
      setSortDirection,
      setViewMode,
      setFilterQuery,
      selectItem,
      setActiveItem,
      clearSelection,
      moveSelectionUp,
      moveSelectionDown,
      moveSelectionHome,
      moveSelectionEnd,
    }),
    [
      state, setEntries, setLoading, setError,
      setSortMode, setSortDirection, setViewMode, setFilterQuery,
      selectItem, setActiveItem, clearSelection,
      moveSelectionUp, moveSelectionDown, moveSelectionHome, moveSelectionEnd,
    ],
  )
}

export function usePaneExplorer(): PaneExplorerResult {
  return usePaneExplorerForId(usePaneId())
}

export function useActivePaneExplorer(): PaneExplorerResult {
  const activePaneId = useWorkspaceStore((s) => s.activePaneId)
  return usePaneExplorerForId(activePaneId || 'main')
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
  const tabId = useActiveTabId(paneId)

  const state = useTreeStore(useShallow((s) => getTreeState(s, paneId, tabId)))

  const expandNodeRaw = useTreeStore((s) => s.expandNode)
  const collapseNodeRaw = useTreeStore((s) => s.collapseNode)
  const toggleNodeRaw = useTreeStore((s) => s.toggleNode)
  const expandToPathRaw = useTreeStore((s) => s.expandToPath)
  const setNodeChildrenRaw = useTreeStore((s) => s.setNodeChildren)
  const addLoadingRaw = useTreeStore((s) => s.addLoading)
  const removeLoadingRaw = useTreeStore((s) => s.removeLoading)
  const setSelectedPathRaw = useTreeStore((s) => s.setSelectedPath)

  const expandNode = useCallback(
    (path: string) => expandNodeRaw(paneId, tabId, path),
    [expandNodeRaw, paneId, tabId],
  )
  const collapseNode = useCallback(
    (path: string) => collapseNodeRaw(paneId, tabId, path),
    [collapseNodeRaw, paneId, tabId],
  )
  const toggleNode = useCallback(
    (path: string) => toggleNodeRaw(paneId, tabId, path),
    [toggleNodeRaw, paneId, tabId],
  )
  const expandToPath = useCallback(
    (path: string) => expandToPathRaw(paneId, tabId, path),
    [expandToPathRaw, paneId, tabId],
  )
  const setNodeChildren = useCallback(
    (path: string, children: string[]) => setNodeChildrenRaw(paneId, tabId, path, children),
    [setNodeChildrenRaw, paneId, tabId],
  )
  const addLoading = useCallback(
    (path: string) => addLoadingRaw(paneId, tabId, path),
    [addLoadingRaw, paneId, tabId],
  )
  const removeLoading = useCallback(
    (path: string) => removeLoadingRaw(paneId, tabId, path),
    [removeLoadingRaw, paneId, tabId],
  )
  const setSelectedPath = useCallback(
    (path: string | null) => setSelectedPathRaw(paneId, tabId, path),
    [setSelectedPathRaw, paneId, tabId],
  )

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
    [
      state, expandNode, collapseNode, toggleNode, expandToPath,
      setNodeChildren, addLoading, removeLoading, setSelectedPath,
    ],
  )
}

export function usePaneTree(): PaneTreeResult {
  return usePaneTreeForId(usePaneId())
}

export function useActivePaneTree(): PaneTreeResult {
  const activePaneId = useWorkspaceStore((s) => s.activePaneId)
  return usePaneTreeForId(activePaneId || 'main')
}

/* ─── File Operations ─── */

export function usePaneFileOperations() {
  const paneId = usePaneId()
  const tabId = useActiveTabId(paneId)
  return useFileOps(paneId, tabId)
}

export function useActivePaneFileOperations() {
  const activePaneId = useWorkspaceStore((s) => s.activePaneId)
  const paneId = activePaneId || 'main'
  const tabId = useActiveTabId(paneId)
  return useFileOps(paneId, tabId)
}

/* ─── File Transfer ─── */

export function usePaneFileTransfer() {
  const paneId = usePaneId()
  const tabId = useActiveTabId(paneId)
  return useFileXfer(paneId, tabId)
}

export function useActivePaneFileTransfer() {
  const activePaneId = useWorkspaceStore((s) => s.activePaneId)
  const paneId = activePaneId || 'main'
  const tabId = useActiveTabId(paneId)
  return useFileXfer(paneId, tabId)
}

/* ─── Clipboard ─── */

export function usePaneClipboard() {
  const paneId = usePaneId()
  const tabId = useActiveTabId(paneId)
  return useClip(paneId, tabId)
}

export function useActivePaneClipboard() {
  const activePaneId = useWorkspaceStore((s) => s.activePaneId)
  const paneId = activePaneId || 'main'
  const tabId = useActiveTabId(paneId)
  return useClip(paneId, tabId)
}
