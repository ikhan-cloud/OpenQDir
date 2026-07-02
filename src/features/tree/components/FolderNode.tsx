import { useCallback, useEffect } from 'react'

import { fileSystemService } from '@/services'
import { useNavigationStore } from '@/features/navigation'
import { useTreeStore } from '../store'
import { TreeToggle } from './TreeToggle'
import { TreeIcon } from './TreeIcon'
import { cn } from '@/lib/utils'

interface FolderNodeProps {
  path: string
  name: string
  depth: number
}

export function FolderNode({ path, name, depth }: FolderNodeProps) {
  const expandedPaths = useTreeStore((s) => s.expandedPaths)
  const loadedPaths = useTreeStore((s) => s.loadedPaths)
  const loadingPaths = useTreeStore((s) => s.loadingPaths)
  const childrenMap = useTreeStore((s) => s.childrenMap)
  const selectedPath = useTreeStore((s) => s.selectedPath)
  const toggleNode = useTreeStore((s) => s.toggleNode)
  const setNodeChildren = useTreeStore((s) => s.setNodeChildren)
  const addLoading = useTreeStore((s) => s.addLoading)
  const removeLoading = useTreeStore((s) => s.removeLoading)
  const navigate = useNavigationStore((s) => s.navigate)

  const isExpanded = expandedPaths.includes(path)
  const isLoading = loadingPaths.includes(path)
  const isLoaded = loadedPaths.includes(path)
  const isSelected = selectedPath === path
  const children = childrenMap[path] ?? []

  const loadChildren = useCallback(async () => {
    if (isLoaded) return
    addLoading(path)
    try {
      const entries = await fileSystemService.readDir(path)
      const dirs = entries
        .filter((e) => e.type === 'directory')
        .map((e) => e.path)
      setNodeChildren(path, dirs)
    } catch {
      setNodeChildren(path, [])
    } finally {
      removeLoading(path)
    }
  }, [path, isLoaded, addLoading, removeLoading, setNodeChildren])

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

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          'flex h-7 w-full items-center gap-1 rounded-sm px-1 text-sm transition-colors',
          isSelected
            ? 'bg-accent text-accent-foreground'
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
