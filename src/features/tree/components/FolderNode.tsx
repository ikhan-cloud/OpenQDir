import { useCallback, useEffect, useState } from 'react'

import { useFileSystem } from '@/services'
import { useActivePaneNav, useActivePaneTree, useActivePaneFileTransfer } from '@/features/workspace/hooks'
import { TreeToggle } from './TreeToggle'
import { TreeIcon } from './TreeIcon'
import { cn } from '@/lib/utils'

interface FolderNodeProps {
  path: string
  name: string
  depth: number
}

export function FolderNode({ path, name, depth }: FolderNodeProps) {
  const { expandedPaths, loadedPaths, loadingPaths, childrenMap, selectedPath, toggleNode, setNodeChildren, addLoading, removeLoading } = useActivePaneTree()
  const { navigate } = useActivePaneNav()
  const { move } = useActivePaneFileTransfer()
  const fs = useFileSystem()

  const [dragOver, setDragOver] = useState(0)

  const isExpanded = expandedPaths.includes(path)
  const isLoading = loadingPaths.includes(path)
  const isLoaded = loadedPaths.includes(path)
  const isSelected = selectedPath === path
  const children = childrenMap[path] ?? []

  const loadChildren = useCallback(async () => {
    if (isLoaded) return
    addLoading(path)
    try {
      const entries = await fs.readDir(path)
      const dirs = entries
        .filter((e) => e.type === 'directory')
        .map((e) => e.path)
      setNodeChildren(path, dirs)
    } catch {
      setNodeChildren(path, [])
    } finally {
      removeLoading(path)
    }
  }, [path, isLoaded, addLoading, removeLoading, setNodeChildren, fs])

  useEffect(() => {
    if (isExpanded && !isLoaded) {
      loadChildren()
    }
  }, [isExpanded, isLoaded, loadChildren])

  const handleClick = useCallback(() => {
    navigate(path)
  }, [path, navigate])

  const handleToggle = useCallback(() => {
    toggleNode(path)
  }, [path, toggleNode])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver((c) => c + 1)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver((c) => c - 1)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(0)
      const raw = e.dataTransfer.getData('application/json')
      if (!raw) return
      const paths: string[] = JSON.parse(raw)
      for (const src of paths) {
        const itemName = src.split('/').filter(Boolean).pop() ?? 'item'
        const dest = `${path}/${itemName}`
        if (src !== dest) {
          await move(src, dest)
        }
      }
    },
    [path, move],
  )

  return (
    <div>
      <button
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex h-7 w-full items-center gap-1 rounded-sm px-1 text-sm transition-colors',
          isSelected
            ? 'bg-accent text-accent-foreground'
            : dragOver > 0
              ? 'bg-accent/50 ring-1 ring-accent'
              : 'text-foreground hover:bg-accent/50',
        )}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
        aria-selected={isSelected}
      >
        <TreeToggle expanded={isExpanded} loading={isLoading} onClick={handleToggle} />
        <TreeIcon />
        <span className="truncate">{name}</span>
      </button>

      {isExpanded && children.length > 0 && (
        <div>
          {children.map((childPath) => {
            const childName = childPath.split('/').filter(Boolean).pop() ?? childPath
            return (
              <FolderNode
                key={childPath}
                path={childPath}
                name={childName}
                depth={depth + 1}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
