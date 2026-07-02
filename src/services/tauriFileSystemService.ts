import type { FileEntry, FileSystemService } from '@/types'

export class TauriFileSystemService implements FileSystemService {
  async readDir(_path: string): Promise<FileEntry[]> {
    throw new Error('Tauri filesystem not yet implemented')
  }

  async getInfo(_path: string): Promise<FileEntry | null> {
    throw new Error('Tauri filesystem not yet implemented')
  }

  async exists(_path: string): Promise<boolean> {
    throw new Error('Tauri filesystem not yet implemented')
  }

  async isDirectory(_path: string): Promise<boolean> {
    throw new Error('Tauri filesystem not yet implemented')
  }

  async isFile(_path: string): Promise<boolean> {
    throw new Error('Tauri filesystem not yet implemented')
  }
}
