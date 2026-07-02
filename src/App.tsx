import { useCallback, useEffect, useMemo } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { ToastProvider, useToast } from '@/components/Toast'
import { AppShell, useCommandPalette, useLoadingStore } from '@/features/layout'
import { useThemeStore } from '@/features/theme'
import { useSettingsStore } from '@/features/settings'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { commandRegistry, globalShortcutManager } from '@/services'

function Home() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <h2 className="text-2xl font-semibold text-foreground">Welcome to OpenQDir</h2>
      <p className="text-sm text-muted-foreground">A modern file explorer for developers.</p>
    </div>
  )
}

function AppCommands() {
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const toggleSidebar = useSettingsStore((s) => s.toggleSidebar)
  const togglePalette = useCommandPalette((s) => s.toggle)
  const toast = useToast()

  useEffect(() => {
    commandRegistry.register({
      id: 'app.theme.toggle',
      name: 'Toggle Theme',
      description: 'Switch between light and dark mode',
      handler: () => {
        toggleTheme()
        toast.info('Theme toggled')
      },
    })

    commandRegistry.register({
      id: 'app.sidebar.toggle',
      name: 'Toggle Sidebar',
      description: 'Show or hide the sidebar',
      handler: () => {
        toggleSidebar()
      },
    })

    commandRegistry.register({
      id: 'app.palette.toggle',
      name: 'Toggle Command Palette',
      description: 'Open or close the command palette',
      handler: () => {
        togglePalette()
      },
    })

    commandRegistry.register({
      id: 'app.settings.open',
      name: 'Open Settings',
      description: 'Open the settings panel',
      handler: () => {
        console.log('Settings opened')
        toast.info('Settings', 'Settings panel placeholder')
      },
    })

    commandRegistry.register({
      id: 'app.reload',
      name: 'Reload',
      description: 'Reload the application',
      handler: () => {
        console.log('Reload triggered')
        toast.success('Reloaded', 'Application reloaded successfully')
      },
    })

    globalShortcutManager.register('Ctrl+P', 'app.palette.toggle')
    globalShortcutManager.register('Ctrl+Shift+P', 'app.settings.open')
    globalShortcutManager.register('Ctrl+,', 'app.settings.open')
    globalShortcutManager.register('F5', 'app.reload')
    globalShortcutManager.register('Ctrl+B', 'app.sidebar.toggle')

    return () => {
      commandRegistry.unregister('app.theme.toggle')
      commandRegistry.unregister('app.sidebar.toggle')
      commandRegistry.unregister('app.palette.toggle')
      commandRegistry.unregister('app.settings.open')
      commandRegistry.unregister('app.reload')
      globalShortcutManager.clear()
    }
  }, [toggleTheme, toggleSidebar, togglePalette, toast])

  const executeP = useCallback(() => globalShortcutManager.execute('Ctrl+P'), [])
  const executeShiftP = useCallback(() => globalShortcutManager.execute('Ctrl+Shift+P'), [])
  const executeComma = useCallback(() => globalShortcutManager.execute('Ctrl+,'), [])
  const executeF5 = useCallback(() => globalShortcutManager.execute('F5'), [])
  const executeB = useCallback(() => globalShortcutManager.execute('Ctrl+B'), [])

  const shortcuts = useMemo(
    () => [
      { key: 'p', ctrl: true, handler: executeP },
      { key: 'p', ctrl: true, shift: true, handler: executeShiftP },
      { key: ',', ctrl: true, handler: executeComma },
      { key: 'F5', handler: executeF5 },
      { key: 'b', ctrl: true, handler: executeB },
    ],
    [executeP, executeShiftP, executeComma, executeF5, executeB],
  )

  useKeyboardShortcuts(shortcuts)

  return null
}

export default function App() {
  const loading = useLoadingStore((s) => s.loading)
  const loadingMessage = useLoadingStore((s) => s.loadingMessage)

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AppShell>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </AppShell>
          <AppCommands />
          <LoadingOverlay show={loading} message={loadingMessage} />
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
