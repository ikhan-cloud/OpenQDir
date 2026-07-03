import { useState, useEffect, type ReactNode } from 'react'

import type { FileOperationsService, FileSystemService, FileTransferService } from '@/types'

import { MockFileSystemService } from './fileSystemService'
import { TauriFileSystemService } from './tauriFileSystemService'
import { MockFileOperationsService } from './fileOperationsService'
import { TauriFileOperationsService } from './tauriFileOperationsService'
import { MockFileTransferService } from './fileTransferService'
import { TauriFileTransferService } from './tauriFileTransferService'
import type { FileSystemContextValue } from './fileSystemContext'
import { FileSystemContext } from './fileSystemContext'

interface FileSystemProviderProps {
  children: ReactNode
  initialFs?: FileSystemService
}

function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window
}

export function FileSystemProvider({ children, initialFs }: FileSystemProviderProps) {
  const [fs, setFs] = useState<FileSystemService>(() => {
    if (initialFs) return initialFs
    if (isTauri()) return new TauriFileSystemService()
    return new MockFileSystemService()
  })

  const [fileOps, setFileOps] = useState<FileOperationsService>(() => {
    if (isTauri()) return new TauriFileOperationsService()
    return new MockFileOperationsService()
  })

  const [fileTransfer, setFileTransfer] = useState<FileTransferService>(() => {
    if (isTauri()) return new TauriFileTransferService()
    return new MockFileTransferService()
  })

  useEffect(() => {
    if (initialFs) {
      setFs(initialFs)
      return
    }
    if (isTauri()) {
      setFs(new TauriFileSystemService())
      setFileOps(new TauriFileOperationsService())
      setFileTransfer(new TauriFileTransferService())
    }
  }, [initialFs])

  const value: FileSystemContextValue = { fs, setFs, fileOps, setFileOps, fileTransfer, setFileTransfer }

  return (
    <FileSystemContext.Provider value={value}>
      {children}
    </FileSystemContext.Provider>
  )
}
