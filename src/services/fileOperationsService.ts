import type { FileOperationsService } from '@/types'

import { mockData, createEntry } from './fileSystemService'

function getParentDir(path: string): string {
  const i = path.lastIndexOf('/')
  return i > 0 ? path.slice(0, i) : '/'
}

function updateParentDir(oldPath: string, newPath: string): void {
  const parent = getParentDir(oldPath)
  const oldName = oldPath.split('/').pop() ?? ''
  const newName = newPath.split('/').pop() ?? ''
  const parentEntries = mockData[parent]
  if (!parentEntries) return
  const idx = parentEntries.findIndex((e) => e.name === oldName)
  if (idx !== -1) {
    parentEntries[idx] = {
      ...parentEntries[idx],
      name: newName,
      path: newPath,
    }
  }
}

export class MockFileOperationsService implements FileOperationsService {
  async rename(oldPath: string, newPath: string): Promise<void> {
    if (mockData[oldPath]) {
      mockData[newPath] = mockData[oldPath].map((e) => ({
        ...e,
        path: e.path.replace(oldPath, newPath),
      }))
      delete mockData[oldPath]
    }
    updateParentDir(oldPath, newPath)
  }

  async delete(path: string): Promise<void> {
    const parent = getParentDir(path)
    const name = path.split('/').pop() ?? ''
    const parentEntries = mockData[parent]
    if (parentEntries) {
      mockData[parent] = parentEntries.filter((e) => e.name !== name)
    }
    delete mockData[path]
  }

  async createFolder(path: string): Promise<void> {
    const parent = getParentDir(path)
    const name = path.split('/').pop() ?? ''
    const parentEntries = mockData[parent]
    if (parentEntries) {
      parentEntries.push(createEntry(name, path, 'directory'))
    } else {
      mockData[parent] = [createEntry(name, path, 'directory')]
    }
    mockData[path] = []
  }
}
