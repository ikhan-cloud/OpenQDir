import { cn } from '@/lib/utils'

interface TabProps {
  id: string
  title: string
  isActive: boolean
  onClose: (id: string) => void
  onClick: (id: string) => void
}

export function Tab({ id, title, isActive, onClose, onClick }: TabProps) {
  return (
    <div
      data-tab-id={id}
      role="tab"
      aria-selected={isActive}
      className={cn(
        'group relative flex cursor-default items-center gap-1.5 border-r border-border px-3 py-1.5 text-xs select-none',
        isActive
          ? 'bg-background text-foreground'
          : 'bg-muted/30 text-muted-foreground hover:bg-accent/40',
      )}
      onClick={() => onClick(id)}
    >
      <span className="truncate max-w-40">{title}</span>
      <button
        type="button"
        className={cn(
          'ml-0.5 inline-flex size-3.5 items-center justify-center rounded-sm text-[10px]',
          'text-muted-foreground/50 hover:bg-accent hover:text-foreground',
          'opacity-0 group-hover:opacity-100',
          isActive && 'opacity-100',
        )}
        onClick={(e) => {
          e.stopPropagation()
          onClose(id)
        }}
        aria-label="Close tab"
      >
        ×
      </button>
    </div>
  )
}
