import { createContext } from 'react'

import type { FileSystemService } from '@/types'

export interface FileSystemContextValue {
  fs: FileSystemService
  setFs: (service: FileSystemService) => void
}

export const FileSystemContext = createContext<FileSystemContextValue | null>(null)
