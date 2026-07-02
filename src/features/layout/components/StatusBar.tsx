import { useThemeStore } from '@/features/theme'

export function StatusBar() {
  const theme = useThemeStore((s) => s.theme)

  return (
    <footer className="flex h-6 items-center gap-2 border-t border-border bg-statusbar px-3 text-xs text-statusbar-foreground">
      <span className="font-medium">OpenQDir</span>
      <span className="text-muted-foreground">|</span>
      <span>v0.1.0</span>
      <span className="text-muted-foreground">|</span>
      <span>{theme === 'dark' ? 'Dark' : 'Light'} theme</span>
      <div className="flex-1" />
      <span className="hidden sm:inline">UTF-8</span>
      <span className="hidden sm:inline text-muted-foreground">|</span>
      <span className="hidden sm:inline">Spaces: 2</span>
      <span className="text-muted-foreground">|</span>
      <span>Ln 1, Col 1</span>
      <span className="text-muted-foreground">|</span>
      <span className="text-muted-foreground">Ready</span>
    </footer>
  )
}
