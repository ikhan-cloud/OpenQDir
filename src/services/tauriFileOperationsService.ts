import { rename, remove, mkdir } from '@tauri-apps/plugin-fs'
import type { FileOperationsService } from '@/types'

export class TauriFileOperationsService implements FileOperationsService {
  async rename(oldPath: string, newPath: string): Promise<void> {
    await rename(oldPath, newPath)
  }

  async delete(path: string): Promise<void> {
    await remove(path, { recursive: true })
  }

  async createFolder(path: string): Promise<void> {
    await mkdir(path, { recursive: true })
  }
}
