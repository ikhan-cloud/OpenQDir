import { cn } from '@/lib/utils'

interface LoadingOverlayProps {
  show?: boolean
  message?: string
}

export function LoadingOverlay({ show = false, message }: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-200',
        show ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!show}
    >
      <div className="flex flex-col items-center gap-3">
        <svg
          className="h-8 w-8 animate-spin text-primary"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
          />
        </svg>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  )
}
