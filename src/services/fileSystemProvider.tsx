import { useState, type ReactNode } from 'react'

import type { FileSystemService } from '@/types'

import { MockFileSystemService } from './fileSystemService'
import type { FileSystemContextValue } from './fileSystemContext'
import { FileSystemContext } from './fileSystemContext'

interface FileSystemProviderProps {
  children: ReactNode
  initialFs?: FileSystemService
}

export function FileSystemProvider({ children, initialFs }: FileSystemProviderProps) {
  const [fs, setFs] = useState<FileSystemService>(initialFs ?? new MockFileSystemService())

  const value: FileSystemContextValue = { fs, setFs }

  return (
    <FileSystemContext.Provider value={value}>
      {children}
    </FileSystemContext.Provider>
  )
}
