import type { FileType } from '@/types'

interface FileIconProps {
  type: FileType
  name: string
}

function getExtension(name: string): string {
  const i = name.lastIndexOf('.')
  if (i === -1 || i === 0) return ''
  return name.slice(i + 1).toLowerCase()
}

type IconVariant = 'folder' | 'code' | 'document' | 'image' | 'config' | 'archive' | 'file'

function getIconVariant(type: FileType, name: string): IconVariant {
  if (type === 'directory') return 'folder'
  if (type === 'symlink') return 'file'

  const ext = getExtension(name)
  if (['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'].includes(ext)) return 'code'
  if (['json', 'xml', 'yaml', 'yml', 'toml', 'ini', 'cfg'].includes(ext)) return 'config'
  if (['md', 'txt', 'rtf', 'log'].includes(ext)) return 'document'
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'].includes(ext)) return 'image'
  if (['zip', 'tar', 'gz', 'rar', '7z'].includes(ext)) return 'archive'
  return 'file'
}

const iconPaths: Record<IconVariant, string> = {
  folder:
    'M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z',
  document:
    'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z',
  code: 'M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5',
  image:
    'M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 0 1 3.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z',
  config:
    'M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75',
  archive:
    'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  file: 'M8.25 3.75H19.5a.75.75 0 0 1 .75.75v15a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1-.75-.75V6.75l4.5-3Z',
}

const iconColors: Record<IconVariant, string> = {
  folder: 'text-blue-500',
  document: 'text-sky-500',
  code: 'text-green-500',
  image: 'text-purple-500',
  config: 'text-amber-500',
  archive: 'text-rose-500',
  file: 'text-muted-foreground',
}

export function FileIcon({ type, name }: FileIconProps) {
  const variant = getIconVariant(type, name)

  return (
    <svg
      className={`h-5 w-5 shrink-0 ${iconColors[variant]}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[variant]} />
    </svg>
  )
}
