export interface NavigationState {
  currentPath: string
  history: string[]
  historyIndex: number
  canGoBack: boolean
  canGoForward: boolean
}

export interface NavigationActions {
  navigate: (path: string) => void
  goBack: () => void
  goForward: () => void
  goUp: () => void
  refresh: () => void
}
