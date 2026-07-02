import { create } from 'zustand'

export interface SettingsState {
  sidebarCollapsed: boolean
  sidebarWidth: number
  fontSize: number
  toggleSidebar: () => void
  setSidebarWidth: (width: number) => void
  setFontSize: (size: number) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  sidebarCollapsed: false,
  sidebarWidth: 260,
  fontSize: 14,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
  setFontSize: (size: number) => set({ fontSize: size }),
}))
