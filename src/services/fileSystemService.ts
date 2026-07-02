import type { FileEntry, FileSystemService } from '@/types'

function createEntry(name: string, path: string, type: FileEntry['type']): FileEntry {
  return {
    name,
    path,
    type,
    size: type === 'directory' ? 0 : 1024,
    modifiedAt: new Date().toISOString(),
    isReadable: true,
    isWritable: true,
  }
}

const mockRoot: FileEntry[] = [
  createEntry('home', '/home', 'directory'),
  createEntry('etc', '/etc', 'directory'),
  createEntry('usr', '/usr', 'directory'),
  createEntry('tmp', '/tmp', 'directory'),
  createEntry('var', '/var', 'directory'),
]

const mockHome: FileEntry[] = [
  createEntry('documents', '/home/documents', 'directory'),
  createEntry('downloads', '/home/downloads', 'directory'),
  createEntry('projects', '/home/projects', 'directory'),
  createEntry('README.md', '/home/README.md', 'file'),
  createEntry('.bashrc', '/home/.bashrc', 'file'),
]

const mockProjects: FileEntry[] = [
  createEntry('openqdir', '/home/projects/openqdir', 'directory'),
  createEntry('notes.txt', '/home/projects/notes.txt', 'file'),
]

const mockDocuments: FileEntry[] = [
  createEntry('work', '/home/documents/work', 'directory'),
  createEntry('report.pdf', '/home/documents/report.pdf', 'file'),
]

const mockData: Record<string, FileEntry[]> = {
  '/': mockRoot,
  '/home': mockHome,
  '/home/documents': mockDocuments,
  '/home/downloads': [],
  '/home/projects': mockProjects,
}

export class MockFileSystemService implements FileSystemService {
  async readDir(path: string): Promise<FileEntry[]> {
    const entries = mockData[path]
    if (!entries) return []
    return entries
  }

  async getInfo(path: string): Promise<FileEntry | null> {
    for (const entries of Object.values(mockData)) {
      const found = entries.find((e) => e.path === path)
      if (found) return found
    }
    return null
  }

  async exists(path: string): Promise<boolean> {
    const info = await this.getInfo(path)
    return info !== null
  }

  async isDirectory(path: string): Promise<boolean> {
    const info = await this.getInfo(path)
    return info?.type === 'directory'
  }

  async isFile(path: string): Promise<boolean> {
    const info = await this.getInfo(path)
    return info?.type === 'file'
  }
}


