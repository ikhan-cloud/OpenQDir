import { createContext } from 'react'

import type { FileOperationsService, FileSystemService, FileTransferService } from '@/types'

export interface FileSystemContextValue {
  fs: FileSystemService
  setFs: (service: FileSystemService) => void
  fileOps: FileOperationsService
  setFileOps: (service: FileOperationsService) => void
  fileTransfer: FileTransferService
  setFileTransfer: (service: FileTransferService) => void
}

export const FileSystemContext = createContext<FileSystemContextValue | null>(null)
