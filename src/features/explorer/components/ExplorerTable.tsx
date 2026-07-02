import { useMemo } from 'react'

import type { FileEntry } from '@/types'
import { useExplorerStore } from '../store'
import type { SortMode, SortDirection } from '../store'
import { ExplorerRow } from './ExplorerRow'

function sortEntries(
  entries: FileEntry[],
  mode: SortMode,
  direction: SortDirection,
): FileEntry[] {
  const sorted = [...entries].sort((a, b) => {
    const dirA = a.type === 'directory' ? 0 : 1
    const dirB = b.type === 'directory' ? 0 : 1
    if (dirA !== dirB) return dirA - dirB

    let cmp = 0
    switch (mode) {
      case 'name':
        cmp = a.name.localeCompare(b.name)
        break
      case 'type': {
        const extA = a.name.split('.').pop() ?? ''
        const extB = b.name.split('.').pop() ?? ''
        cmp = extA.localeCompare(extB)
        break
      }
      case 'size':
        cmp = a.size - b.size
        break
      case 'modified':
        cmp = new Date(a.modifiedAt).getTime() - new Date(b.modifiedAt).getTime()
        break
    }
    return direction === 'asc' ? cmp : -cmp
  })
  return sorted
}

const sortColumns: { mode: SortMode; label: string; align: string; hide: string }[] = [
  { mode: 'name', label: 'Name', align: 'text-left', hide: '' },
  { mode: 'size', label: 'Size', align: 'text-right', hide: 'hidden sm:block' },
  { mode: 'type', label: 'Type', align: 'text-left', hide: 'hidden md:block' },
  { mode: 'modified', label: 'Date modified', align: 'text-right', hide: 'hidden lg:block' },
]

interface ExplorerTableProps {
  entries: FileEntry[]
}

export function ExplorerTable({ entries }: ExplorerTableProps) {
  const sortMode = useExplorerStore((s) => s.sortMode)
  const sortDirection = useExplorerStore((s) => s.sortDirection)
  const setSortMode = useExplorerStore((s) => s.setSortMode)
  const setSortDirection = useExplorerStore((s) => s.setSortDirection)

  const sorted = useMemo(
    () => sortEntries(entries, sortMode, sortDirection),
    [entries, sortMode, sortDirection],
  )

  function handleSort(mode: SortMode) {
    if (sortMode === mode) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortMode(mode)
      setSortDirection('asc')
    }
  }

  return (
    <div className="flex flex-1 flex-col" role="table" aria-label="Folder contents">
      <div className="flex h-8 items-center gap-3 border-b border-border px-2 text-xs font-medium text-muted-foreground" role="row">
        {sortColumns.map((col) => (
          <button
            key={col.mode}
            onClick={() => handleSort(col.mode)}
            className={`flex items-center gap-1 transition-colors hover:text-foreground ${col.align} ${col.hide}`}
            style={col.mode === 'name' ? { flex: 1 } : col.mode === 'size' ? { width: 96 } : col.mode === 'type' ? { width: 112 } : { width: 144 }}
          >
            {col.label}
            {sortMode === col.mode && (
              <svg
                className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
              </svg>
            )}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        {sorted.map((entry) => (
          <ExplorerRow key={entry.path} entry={entry} />
        ))}
      </div>
    </div>
  )
}
