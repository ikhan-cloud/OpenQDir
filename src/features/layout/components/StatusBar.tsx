import { useActivePaneNav, useActivePaneExplorer } from '@/features/workspace/hooks'
import { useWorkspaceStore } from '@/features/workspace/store'

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function StatusBar() {
  const { currentPath } = useActivePaneNav()
  const { entries, selectedItems } = useActivePaneExplorer()
  const activePaneId = useWorkspaceStore((s) => s.activePaneId)
  const panes = useWorkspaceStore((s) => s.panes)
  const layout = useWorkspaceStore((s) => s.layout)

  const totalFiles = entries.filter((e: { type: string }) => e.type === 'file').length
  const totalFolders = entries.filter((e: { type: string }) => e.type === 'directory').length
  const selectedSize = entries
    .filter((e: { path: string }) => selectedItems.includes(e.path))
    .reduce((sum: number, e: { size: number }) => sum + e.size, 0)

  const selectedLabel = selectedItems.length > 0
    ? `${selectedItems.length} selected (${formatSize(selectedSize)})`
    : null

  const paneIndex = panes.findIndex((p) => p.id === activePaneId)
  const paneLabel = paneIndex >= 0 ? `Pane ${paneIndex + 1}/${panes.length}` : ''

  return (
    <footer className="flex h-6 items-center gap-2 border-t border-border bg-statusbar px-3 text-xs text-statusbar-foreground">
      <span className="hidden max-w-[300px] truncate md:inline" title={currentPath}>
        {currentPath || 'No folder open'}
      </span>
      <span className="hidden text-muted-foreground md:inline">|</span>
      <span>{totalFolders} folders, {totalFiles} files</span>
      {selectedLabel && (
        <>
          <span className="text-muted-foreground">|</span>
          <span>{selectedLabel}</span>
        </>
      )}
      <div className="flex-1" />
      {paneLabel && (
        <>
          <span className="hidden sm:inline">{paneLabel}</span>
          <span className="text-muted-foreground">|</span>
        </>
      )}
      <span className="capitalize">{layout}</span>
    </footer>
  )
}
