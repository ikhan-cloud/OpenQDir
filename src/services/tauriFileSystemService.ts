import { readDir, stat, exists } from '@tauri-apps/plugin-fs'
import type { FileEntry, FileSystemService, FileType } from '@/types'

export class TauriFileSystemService implements FileSystemService {
  async readDir(path: string): Promise<FileEntry[]> {
    try {
      const entries = await readDir(path)
      const result: FileEntry[] = []

      for (const entry of entries) {
        const fullPath = path.endsWith('/') ? path + entry.name : path + '/' + entry.name
        const type: FileType = entry.isFile ? 'file' : entry.isDirectory ? 'directory' : entry.isSymlink ? 'symlink' : 'unknown'

        let size = 0
        let modifiedAt = ''
        let readonly = false

        try {
          const info = await stat(fullPath)
          size = info.size
          modifiedAt = info.mtime ? info.mtime.toISOString() : ''
          readonly = info.readonly
        } catch {
          // stat may fail (permission denied, broken symlink) — use defaults
        }

        result.push({
          name: entry.name,
          path: fullPath,
          type,
          size,
          modifiedAt,
          isReadable: true,
          isWritable: !readonly,
        })
      }

      return result
    } catch {
      return []
    }
  }

  async getInfo(path: string): Promise<FileEntry | null> {
    try {
      const info = await stat(path)
      const name = path.split('/').filter(Boolean).pop() ?? ''
      const type: FileType = info.isFile ? 'file' : info.isDirectory ? 'directory' : info.isSymlink ? 'symlink' : 'unknown'
      return {
        name,
        path,
        type,
        size: info.size,
        modifiedAt: info.mtime ? info.mtime.toISOString() : '',
        isReadable: true,
        isWritable: !info.readonly,
      }
    } catch {
      return null
    }
  }

  async exists(path: string): Promise<boolean> {
    try {
      return await exists(path)
    } catch {
      return false
    }
  }

  async isDirectory(path: string): Promise<boolean> {
    try {
      const info = await stat(path)
      return info.isDirectory
    } catch {
      return false
    }
  }

  async isFile(path: string): Promise<boolean> {
    try {
      const info = await stat(path)
      return info.isFile
    } catch {
      return false
    }
  }
}
