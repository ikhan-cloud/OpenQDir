import { cn } from '@/lib/utils'

interface NewTabButtonProps {
  onClick: () => void
}

export function NewTabButton({ onClick }: NewTabButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex size-5 items-center justify-center rounded text-xs',
        'text-muted-foreground hover:bg-accent hover:text-foreground',
      )}
      onClick={onClick}
      aria-label="New tab"
    >
      +
    </button>
  )
}
