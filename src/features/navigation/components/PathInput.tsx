import { useState, useRef, useCallback, useEffect } from 'react'

import { useFileSystem, notificationService } from '@/services'
import { useNavigationStore } from '../store'

export function PathInput() {
  const currentPath = useNavigationStore((s) => s.currentPath)
  const navigate = useNavigationStore((s) => s.navigate)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(currentPath)
  const [validating, setValidating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const fs = useFileSystem()

  useEffect(() => {
    if (!editing) {
      setDraft(currentPath)
    }
  }, [currentPath, editing])

  const handleFocus = useCallback(() => {
    setDraft(currentPath)
    setEditing(true)
  }, [currentPath])

  const handleBlur = useCallback(() => {
    setEditing(false)
    setDraft(currentPath)
  }, [currentPath])

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        const path = draft.trim()
        if (!path) return

        setValidating(true)
        try {
          const exists = await fs.exists(path)
          if (exists) {
            navigate(path)
          } else {
            notificationService.error('Folder does not exist', `"${path}" could not be found.`)
          }
        } catch {
          notificationService.error('Validation error', 'An error occurred while checking the path.')
        } finally {
          setValidating(false)
          setEditing(false)
        }
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        setDraft(currentPath)
        setEditing(false)
      }
    },
    [draft, currentPath, navigate, fs],
  )

  return (
    <div className="relative flex flex-1 items-center">
      <input
        ref={inputRef}
        type="text"
        value={editing ? draft : currentPath}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="No folder open"
        disabled={validating}
        className="h-7 w-full rounded border border-transparent bg-transparent px-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-input focus:bg-background disabled:opacity-50"
      />
      {validating && (
        <div className="pointer-events-none absolute right-2 flex items-center">
          <svg
            className="h-3.5 w-3.5 animate-spin text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
            />
          </svg>
        </div>
      )}
    </div>
  )
}
