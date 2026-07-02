import { useCallback } from 'react'

import { notificationService } from '@/services'
import type { FileEntry } from '@/types'
import { useNavigationStore } from '@/features/navigation'
import { useExplorerStore } from '../store'
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

export function ExplorerRow({ entry }: ExplorerRowProps) {
  const activeItem = useExplorerStore((s) => s.activeItem)
  const selectItem = useExplorerStore((s) => s.selectItem)
  const navigate = useNavigationStore((s) => s.navigate)
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

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
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
  )
}
