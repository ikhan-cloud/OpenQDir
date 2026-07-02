import { commandRegistry } from '@/services'
import { useNavigationStore } from '../store'

export function NavigationButtons() {
  const canGoBack = useNavigationStore((s) => s.canGoBack)
  const canGoForward = useNavigationStore((s) => s.canGoForward)

  function handleBack() {
    commandRegistry.execute('view.back')
  }

  function handleForward() {
    commandRegistry.execute('view.forward')
  }

  function handleUp() {
    commandRegistry.execute('view.up')
  }

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={handleBack}
        disabled={!canGoBack}
        className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-30"
        aria-label="Go back"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </button>

      <button
        onClick={handleForward}
        disabled={!canGoForward}
        className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-30"
        aria-label="Go forward"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </button>

      <button
        onClick={handleUp}
        className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label="Go up"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
        </svg>
      </button>
    </div>
  )
}
