import { cn } from '@/lib/utils'

interface CommandPaletteProps {
  open: boolean
}

export function CommandPalette({ open }: CommandPaletteProps) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 z-50 flex items-start justify-center pt-[15vh]',
        !open && 'hidden',
      )}
    >
      <div className="pointer-events-auto w-full max-w-lg rounded-lg border border-border bg-background shadow-2xl">
        <div className="flex items-center border-b border-border px-4 py-3">
          <svg
            className="mr-2 h-4 w-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <span className="text-sm text-muted-foreground">Type a command...</span>
        </div>
        <div className="p-2 text-center text-xs text-muted-foreground">
          No results found
        </div>
      </div>
    </div>
  )
}
