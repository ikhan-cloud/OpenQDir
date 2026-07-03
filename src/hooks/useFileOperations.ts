import { useContext, useCallback } from 'react'

import { FileSystemContext } from '@/services/fileSystemContext'
import { notificationService } from '@/services/notificationService'
import { useNavigationStore } from '@/features/navigation'
import { useTreeStore } from '@/features/tree'

function getParentDir(path: string): string {
  const i = path.lastIndexOf('/')
  return i > 0 ? path.slice(0, i) : '/'
}

function getFileName(path: string): string {
  return path.split('/').filter(Boolean).pop() ?? path
}

export function useFileOperations(paneId: string, tabId: string) {
  const ctx = useContext(FileSystemContext)
  if (!ctx) {
    throw new Error('useFileOperations must be used within a FileSystemProvider')
  }
  const fileOps = ctx.fileOps

  const navRefresh = useNavigationStore((s) => s.refresh)
  const treeRefreshNode = useTreeStore((s) => s.refreshNode)

  const rename = useCallback(
    async (oldPath: string, newPath: string) => {
      try {
        await fileOps.rename(oldPath, newPath)
        const name = getFileName(newPath)
        notificationService.success('Renamed', `Renamed to "${name}"`)
        const parent = getParentDir(oldPath)
        treeRefreshNode(paneId, tabId, parent)
        navRefresh(paneId, tabId)
      } catch (err) {
        notificationService.error('Rename failed', String(err))
      }
    },
    [fileOps, paneId, tabId, navRefresh, treeRefreshNode],
  )

  const delete_ = useCallback(
    async (path: string) => {
      const name = getFileName(path)
      if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
      try {
        await fileOps.delete(path)
        notificationService.success('Deleted', `Deleted "${name}"`)
        const parent = getParentDir(path)
        treeRefreshNode(paneId, tabId, parent)
        navRefresh(paneId, tabId)
      } catch (err) {
        notificationService.error('Delete failed', String(err))
      }
    },
    [fileOps, paneId, tabId, navRefresh, treeRefreshNode],
  )

  const createFolder = useCallback(
    async (path: string) => {
      try {
        await fileOps.createFolder(path)
        const name = getFileName(path)
        notificationService.success('Folder created', `Created "${name}"`)
        const parent = getParentDir(path)
        treeRefreshNode(paneId, tabId, parent)
        navRefresh(paneId, tabId)
      } catch (err) {
        notificationService.error('Create folder failed', String(err))
      }
    },
    [fileOps, paneId, tabId, navRefresh, treeRefreshNode],
  )

  return { rename, delete: delete_, createFolder }
}
