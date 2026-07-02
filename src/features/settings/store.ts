import { create } from 'zustand'

import { settingsService } from '@/services'

export interface SettingsState {
  sidebarCollapsed: boolean
  sidebarWidth: number
  fontSize: number
  workspaceView: string
  showFolderTree: boolean
  toggleSidebar: () => void
  setSidebarWidth: (width: number) => void
  setFontSize: (size: number) => void
  setWorkspaceView: (view: string) => void
  setShowFolderTree: (show: boolean) => void
  toggleFolderTree: () => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  sidebarCollapsed: settingsService.get('sidebarCollapsed', false),
  sidebarWidth: settingsService.get('sidebarWidth', 260),
  fontSize: settingsService.get('fontSize', 14),
  workspaceView: settingsService.get('workspaceView', 'welcome'),
  showFolderTree: settingsService.get('showFolderTree', true),
  toggleSidebar: () =>
    set((state) => {
      const next = !state.sidebarCollapsed
      settingsService.set('sidebarCollapsed', next)
      return { sidebarCollapsed: next }
    }),
  setSidebarWidth: (width: number) => {
    settingsService.set('sidebarWidth', width)
    set({ sidebarWidth: width })
  },
  setFontSize: (size: number) => {
    settingsService.set('fontSize', size)
    set({ fontSize: size })
  },
  setWorkspaceView: (view: string) => {
    settingsService.set('workspaceView', view)
    set({ workspaceView: view })
  },
  setShowFolderTree: (show: boolean) => {
    settingsService.set('showFolderTree', show)
    set({ showFolderTree: show })
  },
  toggleFolderTree: () =>
    set((state) => {
      const next = !state.showFolderTree
      settingsService.set('showFolderTree', next)
      return { showFolderTree: next }
    }),
}))
