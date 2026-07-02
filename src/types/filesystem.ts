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

export interface DriveInfo {
  name: string
  path: string
  label: string
  type: 'local' | 'removable' | 'network' | 'ram' | 'optical' | 'virtual'
  totalSpace: number
  freeSpace: number
  isReady: boolean
}

export interface DriveManager {
  listDrives(): Promise<DriveInfo[]>
}
