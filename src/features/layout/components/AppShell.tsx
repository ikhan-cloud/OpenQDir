import type { ReactNode } from 'react'

import { TitleBar } from './TitleBar'
import { Toolbar } from './Toolbar'
import { Sidebar } from './Sidebar'
import { Workspace } from './Workspace'
import { StatusBar } from './StatusBar'
import { CommandPalette } from './CommandPalette'
import { useCommandPalette } from '../store'

interface AppShellProps {
  children?: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const commandPaletteOpen = useCommandPalette((s) => s.open)

  return (
    <div className="flex h-screen w-screen flex-col bg-background text-foreground">
      <TitleBar />
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Workspace>{children}</Workspace>
      </div>
      <StatusBar />
      <CommandPalette open={commandPaletteOpen} />
    </div>
  )
}
