import { useEffect } from 'react'

import { useFileSystem } from '@/services'
import { useNavigationStore } from '@/features/navigation'
import { useExplorerStore } from '../store'
import { ExplorerTable } from './ExplorerTable'
import { ExplorerEmpty } from './ExplorerEmpty'
import { FileDetails } from './FileDetails'

export function ExplorerView() {
  const currentPath = useNavigationStore((s) => s.currentPath)
  const entries = useExplorerStore((s) => s.entries)
  const loading = useExplorerStore((s) => s.loading)
  const error = useExplorerStore((s) => s.error)
  const activeItem = useExplorerStore((s) => s.activeItem)
  const setEntries = useExplorerStore((s) => s.setEntries)
  const setLoading = useExplorerStore((s) => s.setLoading)
  const setError = useExplorerStore((s) => s.setError)
  const clearSelection = useExplorerStore((s) => s.clearSelection)
  const fs = useFileSystem()

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

  const selectedEntry = activeItem ? entries.find((e) => e.path === activeItem) ?? null : null

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

  if (entries.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <ExplorerEmpty />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <ExplorerTable entries={entries} />
      <FileDetails entry={selectedEntry} />
    </div>
  )
}
