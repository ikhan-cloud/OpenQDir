import { useContext, useCallback } from 'react'

import { FileSystemContext } from '@/services/fileSystemContext'
import { notificationService } from '@/services/notificationService'
import { useNavigationStore } from '@/features/navigation'
import { useTreeStore } from '@/features/tree'

function getParentDir(path: string): string {
  const i = path.lastIndexOf('/')
  return i > 0 ? path.slice(0, i) : '/'
}

function getName(path: string): string {
  return path.split('/').filter(Boolean).pop() ?? path
}

export function useFileTransfer(paneId: string, tabId: string) {
  const ctx = useContext(FileSystemContext)
  if (!ctx) {
    throw new Error('useFileTransfer must be used within a FileSystemProvider')
  }
  const fileTransfer = ctx.fileTransfer

  const navRefresh = useNavigationStore((s) => s.refresh)
  const treeRefreshNode = useTreeStore((s) => s.refreshNode)

  const copy = useCallback(
    async (source: string, destination: string) => {
      try {
        await fileTransfer.copy(source, destination)
        const name = getName(source)
        notificationService.success('Copied', `Copied "${name}"`)
        const parent = getParentDir(destination)
        treeRefreshNode(paneId, tabId, parent)
        navRefresh(paneId, tabId)
      } catch (err) {
        notificationService.error('Copy failed', String(err))
      }
    },
    [fileTransfer, paneId, tabId, navRefresh, treeRefreshNode],
  )

  const move = useCallback(
    async (source: string, destination: string) => {
      try {
        await fileTransfer.move(source, destination)
        const name = getName(source)
        notificationService.success('Moved', `Moved "${name}"`)
        const srcParent = getParentDir(source)
        const dstParent = getParentDir(destination)
        treeRefreshNode(paneId, tabId, srcParent)
        if (srcParent !== dstParent) {
          treeRefreshNode(paneId, tabId, dstParent)
        }
        navRefresh(paneId, tabId)
      } catch (err) {
        notificationService.error('Move failed', String(err))
      }
    },
    [fileTransfer, paneId, tabId, navRefresh, treeRefreshNode],
  )

  return { copy, move }
}
