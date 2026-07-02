import { cn } from '@/lib/utils'

interface TreeToggleProps {
  expanded: boolean
  loading?: boolean
  onClick: () => void
}

export function TreeToggle({ expanded, loading = false, onClick }: TreeToggleProps) {
  if (loading) {
    return (
      <svg
        className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
      </svg>
    )
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="flex h-4 w-4 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
      aria-label={expanded ? 'Collapse' : 'Expand'}
    >
      <svg
        className={cn('h-3 w-3 transition-transform duration-150', expanded && 'rotate-90')}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  )
}
