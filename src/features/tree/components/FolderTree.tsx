import { useEffect } from 'react'

import { useFileSystem } from '@/services'
import { useActivePaneNav, useActivePaneTree } from '@/features/workspace/hooks'
import { FolderNode } from './FolderNode'

export function FolderTree() {
  const { currentPath } = useActivePaneNav()
  const { loadedPaths, loadingPaths, childrenMap, setNodeChildren, addLoading, removeLoading, expandToPath } = useActivePaneTree()
  const fs = useFileSystem()

  useEffect(() => {
    async function loadRoot() {
      if (loadedPaths.includes('/')) return
      addLoading('/')
      try {
        const entries = await fs.readDir('/')
        const dirs = entries
          .filter((e) => e.type === 'directory')
          .map((e) => e.path)
        setNodeChildren('/', dirs)
      } catch {
        setNodeChildren('/', [])
      } finally {
        removeLoading('/')
      }
    }
    loadRoot()
  }, [loadedPaths, setNodeChildren, addLoading, removeLoading, fs])

  useEffect(() => {
    if (currentPath && currentPath !== '/') {
      expandToPath(currentPath)
    }
  }, [currentPath, expandToPath])

  const rootLoaded = loadedPaths.includes('/')
  const rootLoading = loadingPaths.includes('/')
  const rootChildren = childrenMap['/'] ?? []

  return (
    <div className="flex h-full w-60 flex-col border-r border-sidebar-border bg-sidebar text-sm">
      <div className="flex h-9 items-center border-b border-sidebar-border px-3 text-xs font-medium text-muted-foreground">
        FOLDERS
      </div>
      <div className="flex-1 overflow-auto py-1">
        {rootLoading && !rootLoaded && (
          <div className="flex items-center justify-center py-4">
            <svg
              className="h-4 w-4 animate-spin text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
            </svg>
          </div>
        )}

        {rootLoaded && rootChildren.length === 0 && (
          <div className="px-3 py-2 text-xs text-muted-foreground">
            No folders found
          </div>
        )}

        {rootChildren.map((childPath) => {
          const name = childPath.split('/').filter(Boolean).pop() ?? childPath
          return (
            <FolderNode
              key={childPath}
              path={childPath}
              name={name}
              depth={0}
            />
          )
        })}
      </div>
    </div>
  )
}
