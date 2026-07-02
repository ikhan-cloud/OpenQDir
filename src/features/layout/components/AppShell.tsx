import type { ReactNode } from 'react'

import { FolderTree } from '@/features/tree'
import { AddressBar } from '@/features/navigation'
import { useSettingsStore } from '@/features/settings'
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
  const showFolderTree = useSettingsStore((s) => s.showFolderTree)

  return (
    <div className="flex h-screen w-screen flex-col bg-background text-foreground">
      <TitleBar />
      <Toolbar />
      <AddressBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {showFolderTree && <FolderTree />}
        <Workspace>{children}</Workspace>
      </div>
      <StatusBar />
      <CommandPalette open={commandPaletteOpen} />
    </div>
  )
}
