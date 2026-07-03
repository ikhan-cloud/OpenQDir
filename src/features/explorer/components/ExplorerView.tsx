import { useEffect, useState, useMemo, useCallback } from 'react'

import { useFileSystem } from '@/services'
import { filenameSearchService } from '@/services/searchService'
import { useDebounce } from '@/hooks/useDebounce'
import { usePaneNav, usePaneExplorer, usePaneFileTransfer } from '@/features/workspace/hooks'
import { ExplorerTable } from './ExplorerTable'
import { ExplorerEmpty } from './ExplorerEmpty'
import { FileDetails } from './FileDetails'

export function ExplorerView() {
  const { currentPath } = usePaneNav()
  const { entries, loading, error, activeItem, filterQuery, setEntries, setLoading, setError, clearSelection, setFilterQuery } = usePaneExplorer()
  const fs = useFileSystem()
  const { move } = usePaneFileTransfer()

  const [localQuery, setLocalQuery] = useState(filterQuery)
  const debouncedQuery = useDebounce(localQuery, 300)
  const [dragOverCount, setDragOverCount] = useState(0)

  useEffect(() => {
    setFilterQuery(debouncedQuery)
  }, [debouncedQuery, setFilterQuery])

  useEffect(() => {
    setLocalQuery('')
    setFilterQuery('')
  }, [currentPath, setFilterQuery])

  useEffect(() => {
    if (!currentPath) {
      setEntries([])
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    clearSelection()

    fs.readDir(currentPath).then(
      (result) => {
        if (!cancelled) {
          setEntries(result)
          setLoading(false)
        }
      },
      (err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load directory')
        }
      },
    )

    return () => {
      cancelled = true
    }
  }, [currentPath, setEntries, setLoading, setError, clearSelection, fs])

  const filtered = useMemo(
    () => filterQuery
      ? entries.filter((e) => filenameSearchService.match(e.name, filterQuery))
      : entries,
    [entries, filterQuery],
  )

  const selectedEntry = activeItem ? entries.find((e) => e.path === activeItem) ?? null : null

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (!currentPath) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [currentPath])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOverCount((c) => c + 1)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverCount((c) => c - 1)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setDragOverCount(0)
      if (!currentPath) return
      const raw = e.dataTransfer.getData('application/json')
      if (!raw) return
      const paths: string[] = JSON.parse(raw)
      for (const src of paths) {
        const name = src.split('/').filter(Boolean).pop() ?? 'item'
        const dest = `${currentPath}/${name}`
        if (src !== dest) {
          await move(src, dest)
        }
      }
    },
    [currentPath, move],
  )

  if (!currentPath) return null

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <svg
          className="h-6 w-6 animate-spin text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
        </svg>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <svg
            className="h-12 w-12 text-destructive/50"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex flex-1 flex-col ${dragOverCount > 0 ? 'bg-accent/10' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex h-8 items-center gap-1.5 border-b border-border px-2">
        <svg
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          placeholder="Filter files..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
        />
        {localQuery && (
          <button
            onClick={() => setLocalQuery('')}
            className="text-muted-foreground hover:text-foreground"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <ExplorerEmpty />
      ) : filtered.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">No results matching &quot;{localQuery}&quot;</p>
        </div>
      ) : (
        <>
          <ExplorerTable entries={filtered} />
          <FileDetails entry={selectedEntry} />
        </>
      )}
    </div>
  )
}
