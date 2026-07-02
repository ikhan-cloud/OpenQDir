import type { DriveInfo, DriveManager } from '@/types'

const mockDrives: DriveInfo[] = [
  { name: 'Local Disk', path: 'C:/', label: 'C:', type: 'local', totalSpace: 512_000_000_000, freeSpace: 128_000_000_000, isReady: true },
  { name: 'Data', path: 'D:/', label: 'D:', type: 'local', totalSpace: 1_000_000_000_000, freeSpace: 450_000_000_000, isReady: true },
  { name: 'DVD Drive', path: 'E:/', label: 'E:', type: 'optical', totalSpace: 0, freeSpace: 0, isReady: false },
]

export class MockDriveManager implements DriveManager {
  async listDrives(): Promise<DriveInfo[]> {
    return mockDrives
  }
}

export const driveManager: DriveManager = new MockDriveManager()
