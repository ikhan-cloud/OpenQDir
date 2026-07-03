import { readDir, stat, copyFile, mkdir, rename } from '@tauri-apps/plugin-fs'
import type { FileTransferService } from '@/types'

async function copyRecursive(source: string, destination: string): Promise<void> {
  const info = await stat(source)
  if (info.isDirectory) {
    await mkdir(destination, { recursive: true })
    const entries = await readDir(source)
    for (const entry of entries) {
      const srcPath = source.endsWith('/') ? source + entry.name : source + '/' + entry.name
      const dstPath = destination.endsWith('/') ? destination + entry.name : destination + '/' + entry.name
      await copyRecursive(srcPath, dstPath)
    }
  } else {
    await copyFile(source, destination)
  }
}

export class TauriFileTransferService implements FileTransferService {
  async copy(source: string, destination: string): Promise<void> {
    await copyRecursive(source, destination)
  }

  async move(source: string, destination: string): Promise<void> {
    await rename(source, destination)
  }
}
