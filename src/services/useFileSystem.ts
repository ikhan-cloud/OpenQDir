import { useContext } from 'react'

import type { FileSystemService } from '@/types'

import { FileSystemContext } from './fileSystemContext'

export function useFileSystem(): FileSystemService {
  const ctx = useContext(FileSystemContext)
  if (!ctx) {
    throw new Error('useFileSystem must be used within a FileSystemProvider')
  }
  return ctx.fs
}

export function useFileSystemProvider() {
  const ctx = useContext(FileSystemContext)
  if (!ctx) {
    throw new Error('useFileSystemProvider must be used within a FileSystemProvider')
  }
  return ctx
}
