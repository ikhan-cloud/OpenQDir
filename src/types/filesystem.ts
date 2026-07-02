export type FileType = 'file' | 'directory' | 'symlink' | 'unknown'

export interface FileEntry {
  name: string
  path: string
  type: FileType
  size: number
  modifiedAt: string
  isReadable: boolean
  isWritable: boolean
}

export interface FileSystemService {
  readDir(path: string): Promise<FileEntry[]>
  getInfo(path: string): Promise<FileEntry | null>
  exists(path: string): Promise<boolean>
  isDirectory(path: string): Promise<boolean>
  isFile(path: string): Promise<boolean>
}
