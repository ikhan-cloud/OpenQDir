import type { FileEntry, FileTransferService } from '@/types'

import { mockData } from './fileSystemService'

function getParentDir(path: string): string {
  const i = path.lastIndexOf('/')
  return i > 0 ? path.slice(0, i) : '/'
}

function copyMockEntry(
  source: string,
  dest: string,
  srcParent: string,
  visited: Set<string>,
): void {
  if (visited.has(source)) return
  visited.add(source)

  const srcParentEntries = mockData[srcParent]
  if (!srcParentEntries) return

  const entry = srcParentEntries.find((e) => e.path === source)
  if (!entry) return

  const destParent = getParentDir(dest)
  const destName = dest.split('/').filter(Boolean).pop() ?? ''

  if (!mockData[destParent]) {
    mockData[destParent] = []
  }

  const newEntry: FileEntry = {
    ...entry,
    name: destName,
    path: dest,
  }
  mockData[destParent] = mockData[destParent].filter((e) => e.path !== dest)
  mockData[destParent].push(newEntry)

  if (entry.type === 'directory') {
    const children = mockData[source] ?? []
    mockData[dest] = children.map((child) => ({
      ...child,
      path: child.path.replace(source, dest),
    }))
    for (const child of children) {
      const childNewPath = child.path.replace(source, dest)
      if (child.type === 'directory') {
        copyMockEntry(child.path, childNewPath, source, visited)
      }
    }
  }
}

export class MockFileTransferService implements FileTransferService {
  async copy(source: string, destination: string): Promise<void> {
    const srcParent = getParentDir(source)
    copyMockEntry(source, destination, srcParent, new Set())
  }

  async move(source: string, destination: string): Promise<void> {
    await this.copy(source, destination)

    const srcParent = getParentDir(source)
    const srcName = source.split('/').filter(Boolean).pop() ?? ''
    const entries = mockData[srcParent]
    if (entries) {
      mockData[srcParent] = entries.filter((e) => e.name !== srcName)
    }
    if (mockData[source] !== undefined) {
      const delKeys: string[] = []
      for (const key of Object.keys(mockData)) {
        if (key === source || key.startsWith(source + '/')) {
          delKeys.push(key)
        }
      }
      for (const key of delKeys) {
        delete mockData[key]
      }
    }
  }
}
