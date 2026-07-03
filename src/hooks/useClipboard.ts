import { useContext, useCallback } from 'react'

import { FileSystemContext } from '@/services/fileSystemContext'
import { notificationService } from '@/services/notificationService'
import { useClipboardStore } from '@/features/clipboard'
import { useExplorerStore } from '@/features/explorer'
import { useNavigationStore } from '@/features/navigation'
import { useTreeStore } from '@/features/tree'
import { basename, dirname } from '@/lib/pathUtils'

export function useClipboard(paneId: string, tabId: string) {
  const ctx = useContext(FileSystemContext)
  if (!ctx) {
    throw new Error('useClipboard must be used within a FileSystemProvider')
  }

  const store = useClipboardStore
  const clipboard = useClipboardStore((s) => ({ type: s.type, paths: s.paths }))

  const copyRaw = store.getState().copy
  const cutRaw = store.getState().cut
  const clearRaw = store.getState().clear

  const navRefresh = useNavigationStore((s) => s.refresh)
  const treeRefreshNode = useTreeStore((s) => s.refreshNode)

  const copyItems = useCallback(() => {
    const tab = useExplorerStore.getState().panes[paneId]?.[tabId]
    const selected = tab?.selectedItems ?? []
    if (selected.length === 0) {
      notificationService.info('Copy', 'No items selected')
      return
    }
    copyRaw(selected)
    notificationService.info('Copied', `${selected.length} item(s) copied to clipboard`)
  }, [paneId, tabId, copyRaw])

  const cutItems = useCallback(() => {
    const tab = useExplorerStore.getState().panes[paneId]?.[tabId]
    const selected = tab?.selectedItems ?? []
    if (selected.length === 0) {
      notificationService.info('Cut', 'No items selected')
      return
    }
    cutRaw(selected)
    notificationService.info('Cut', `${selected.length} item(s) cut to clipboard`)
  }, [paneId, tabId, cutRaw])

  const pasteItems = useCallback(async () => {
    const state = store.getState()
    if (!state.type || state.paths.length === 0) {
      notificationService.info('Paste', 'Clipboard is empty')
      return
    }

    const navTab = useNavigationStore.getState().panes[paneId]?.[tabId]
    const targetPath = navTab?.currentPath
    if (!targetPath) return

    const { fileTransfer } = ctx

    for (const srcPath of state.paths) {
      const name = basename(srcPath)
      const dstPath = targetPath.endsWith('/') ? targetPath + name : targetPath + '/' + name
      try {
        if (state.type === 'copy') {
          await fileTransfer.copy(srcPath, dstPath)
        } else {
          await fileTransfer.move(srcPath, dstPath)
        }
      } catch (err) {
        notificationService.error('Paste failed', `${name}: ${String(err)}`)
      }
    }

    if (state.type === 'cut') {
      clearRaw()
    }

    const srcParents = state.paths.map((p) => dirname(p))
    const uniqueParents = [...new Set([...srcParents, dirname(targetPath)])]
    for (const parent of uniqueParents) {
      treeRefreshNode(paneId, tabId, parent)
    }
    navRefresh(paneId, tabId)

    const count = state.paths.length
    notificationService.success(
      'Paste complete',
      `${count} item(s) pasted to "${basename(targetPath) || targetPath}"`,
    )
  }, [paneId, tabId, ctx, store, navRefresh, treeRefreshNode, clearRaw])

  const clearClipboard = useCallback(() => {
    clearRaw()
  }, [clearRaw])

  return {
    clipboard,
    copyItems,
    cutItems,
    pasteItems,
    clearClipboard,
    hasClipboardItems: clipboard.type !== null && clipboard.paths.length > 0,
  }
}
