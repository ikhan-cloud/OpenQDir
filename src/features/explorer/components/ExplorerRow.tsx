import { useCallback, useState } from 'react'

import { notificationService } from '@/services'
import type { FileEntry } from '@/types'
import { usePaneNav, usePaneExplorer } from '@/features/workspace/hooks'
import { ContextMenu } from '@/components/ContextMenu'
import type { ContextMenuDef } from '@/components/ContextMenu'
import { FileIcon } from './FileIcon'
import { cn } from '@/lib/utils'

interface ExplorerRowProps {
  entry: FileEntry
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getFileTypeLabel(entry: FileEntry): string {
  if (entry.type === 'directory') return 'Folder'
  if (entry.type === 'symlink') return 'Symlink'
  const i = entry.name.lastIndexOf('.')
  if (i === -1 || i === 0) return 'File'
  const ext = entry.name.slice(i + 1).toUpperCase()
  return `${ext} file`
}

const contextMenuItems: ContextMenuDef[] = [
  { id: 'clipboard.copy', label: 'Copy', shortcut: 'Ctrl+C' },
  { id: 'clipboard.cut', label: 'Cut', shortcut: 'Ctrl+X' },
  { id: 'clipboard.paste', label: 'Paste', shortcut: 'Ctrl+V' },
  { separator: true },
  { id: 'file.rename', label: 'Rename', shortcut: 'F2' },
  { id: 'file.delete', label: 'Delete', shortcut: 'Del' },
]

export function ExplorerRow({ entry }: ExplorerRowProps) {
  const { activeItem, selectItem, selectedItems } = usePaneExplorer()
  const { navigate } = usePaneNav()
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null)
  const isActive = activeItem === entry.path

  const handleClick = useCallback(() => {
    selectItem(entry.path)
  }, [entry.path, selectItem])

  const handleDoubleClick = useCallback(() => {
    if (entry.type === 'directory') {
      navigate(entry.path)
    } else {
      notificationService.info(
        'Open file',
        `Opening files is not yet implemented. (${entry.name})`,
      )
    }
  }, [entry, navigate])

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      selectItem(entry.path)
      setMenuPos({ x: e.clientX, y: e.clientY })
    },
    [entry.path, selectItem],
  )

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      const paths = selectedItems.includes(entry.path) && selectedItems.length > 0
        ? selectedItems
        : [entry.path]
      e.dataTransfer.setData('application/json', JSON.stringify(paths))
      e.dataTransfer.effectAllowed = 'move'
    },
    [selectedItems, entry.path],
  )

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        className={cn(
          'flex h-8 cursor-pointer items-center gap-3 rounded-sm px-2 text-sm transition-colors',
          isActive
            ? 'bg-accent text-accent-foreground'
            : 'text-foreground hover:bg-accent/50',
        )}
        role="row"
        aria-selected={isActive}
        data-path={entry.path}
      >
        <FileIcon type={entry.type} name={entry.name} />
        <span className="flex-1 truncate">{entry.name}</span>
        <span className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground sm:block">
          {entry.type === 'directory' ? '-' : formatSize(entry.size)}
        </span>
        <span className="hidden w-28 shrink-0 text-xs text-muted-foreground md:block">
          {getFileTypeLabel(entry)}
        </span>
        <span className="hidden w-36 shrink-0 text-right text-xs text-muted-foreground lg:block">
          {formatDate(entry.modifiedAt)}
        </span>
      </div>
      {menuPos && (
        <ContextMenu
          x={menuPos.x}
          y={menuPos.y}
          items={contextMenuItems}
          onClose={() => setMenuPos(null)}
        />
      )}
    </>
  )
}
