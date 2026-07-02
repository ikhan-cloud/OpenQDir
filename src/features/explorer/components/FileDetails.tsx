import type { FileEntry } from '@/types'
import { FileIcon } from './FileIcon'

function formatSize(bytes: number): string {
  if (bytes === 0) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getFileTypeLabel(entry: FileEntry): string {
  if (entry.type === 'directory') return 'Folder'
  if (entry.type === 'symlink') return 'Symlink'
  const i = entry.name.lastIndexOf('.')
  if (i === -1 || i === 0) return 'File'
  const ext = entry.name.slice(i + 1).toUpperCase()
  return `${ext} file`
}

interface FileDetailsProps {
  entry: FileEntry | null
}

export function FileDetails({ entry }: FileDetailsProps) {
  if (!entry) {
    return (
      <div className="flex h-12 items-center border-t border-border px-3 text-xs text-muted-foreground">
        No file selected
      </div>
    )
  }

  return (
    <div className="border-t border-border bg-background px-3 py-2">
      <div className="flex items-center gap-2">
        <FileIcon type={entry.type} name={entry.name} />
        <span className="text-sm font-medium text-foreground">{entry.name}</span>
      </div>
      <div className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
        <span>Type</span>
        <span className="text-foreground">{getFileTypeLabel(entry)}</span>
        <span>Size</span>
        <span className="text-foreground">{entry.type === 'directory' ? '-' : formatSize(entry.size)}</span>
        <span>Modified</span>
        <span className="text-foreground">{formatDate(entry.modifiedAt)}</span>
        <span>Path</span>
        <span className="truncate text-foreground">{entry.path}</span>
        <span>Readable</span>
        <span className="text-foreground">{entry.isReadable ? 'Yes' : 'No'}</span>
        <span>Writable</span>
        <span className="text-foreground">{entry.isWritable ? 'Yes' : 'No'}</span>
      </div>
    </div>
  )
}
