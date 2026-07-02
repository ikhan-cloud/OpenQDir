import { useCallback } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'
import { AppShell } from '@/features/layout'
import { useCommandPalette } from '@/features/layout'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

function Home() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <h2 className="text-2xl font-semibold text-foreground">Welcome to OpenQDir</h2>
      <p className="text-sm text-muted-foreground">A modern file explorer for developers.</p>
    </div>
  )
}

export default function App() {
  const togglePalette = useCommandPalette((s) => s.toggle)

  const handleCtrlP = useCallback(() => {
    togglePalette()
    console.log('Command palette toggled')
  }, [togglePalette])

  const handleCtrlShiftP = useCallback(() => {
    console.log('Ctrl+Shift+P pressed')
  }, [])

  const handleCtrlComma = useCallback(() => {
    console.log('Ctrl+, pressed — Settings')
  }, [])

  const handleF5 = useCallback(() => {
    console.log('F5 pressed — Refresh')
  }, [])

  useKeyboardShortcuts([
    { key: 'p', ctrl: true, handler: handleCtrlP },
    { key: 'p', ctrl: true, shift: true, handler: handleCtrlShiftP },
    { key: ',', ctrl: true, handler: handleCtrlComma },
    { key: 'F5', handler: handleF5 },
  ])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
