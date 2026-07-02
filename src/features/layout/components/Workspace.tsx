import type { ReactNode } from 'react'

interface WorkspaceProps {
  children?: ReactNode
}

export function Workspace({ children }: WorkspaceProps) {
  return (
    <main className="flex flex-1 flex-col overflow-auto bg-background">
      {children ?? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <svg
              className="h-16 w-16 text-muted-foreground/30"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-foreground">Welcome to OpenQDir</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Open a folder to browse and manage your files.
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
