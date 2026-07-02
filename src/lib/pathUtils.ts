const DRIVE_LETTER = /^[a-zA-Z]:$/

function hasDriveLetter(path: string): boolean {
  return DRIVE_LETTER.test(path.slice(0, 2))
}

export function isAbsolute(path: string): boolean {
  if (path.startsWith('/')) return true
  if (hasDriveLetter(path)) return true
  return false
}

export function isRoot(path: string): boolean {
  const normalized = normalize(path)
  if (normalized === '/') return true
  if (hasDriveLetter(normalized) && normalized.length === 2) return true
  if (hasDriveLetter(normalized) && normalized === `${normalized.slice(0, 2)}/`) return true
  return false
}

export function normalize(path: string): string {
  if (!path) return '.'

  let normalized = path.replace(/\\/g, '/')

  const isAbsolutePath = normalized.startsWith('/')
  const driveLetter = hasDriveLetter(normalized) ? normalized.slice(0, 2) : ''
  if (driveLetter) {
    normalized = normalized.slice(2)
  }

  const segments = normalized.split('/').filter(Boolean)

  const resolved: string[] = []
  for (const segment of segments) {
    if (segment === '.') continue
    if (segment === '..') {
      if (resolved.length > 0 && resolved[resolved.length - 1] !== '..') {
        resolved.pop()
      } else if (!isAbsolutePath && !driveLetter) {
        resolved.push('..')
      }
      continue
    }
    resolved.push(segment)
  }

  let result = resolved.join('/')

  if (driveLetter) {
    result = `${driveLetter}/${result}`
  }
  if (isAbsolutePath) {
    result = `/${result}`
  }

  result = result.replace(/\/$/, '')
  if (path.startsWith('/') && result === '') return '/'
  if (driveLetter && result === `${driveLetter}/`) return result.slice(0, -1)

  return result || '.'
}

export function parent(path: string): string {
  const normalized = normalize(path)
  if (isRoot(normalized)) return normalized

  const driveLetter = hasDriveLetter(normalized) ? normalized.slice(0, 2) : ''
  let workingPath = normalized
  if (driveLetter) {
    workingPath = workingPath.slice(2)
  }

  const segments = workingPath.split('/').filter(Boolean)
  segments.pop()

  if (segments.length === 0) {
    if (driveLetter) return `${driveLetter}/`
    return '/'
  }

  const result = segments.join('/')
  if (driveLetter) return `${driveLetter}/${result}`
  return `/${result}`
}

export function join(...paths: string[]): string {
  const normalized = paths.map((p) => normalize(p))

  let base = ''
  for (const segment of normalized) {
    if (!segment || segment === '.') continue
    if (isAbsolute(segment) && !segment.startsWith('..')) {
      base = segment
    } else if (segment === '..') {
      const p = base ? parent(base) : ''
      base = p
    } else if (segment !== '.') {
      base = base ? `${base}/${segment}` : segment
    }
  }

  return normalize(base || '.')
}

export function split(path: string): string[] {
  const normalized = normalize(path)
  if (normalized === '.' || normalized === '/' || isRoot(normalized)) return []

  const driveLetter = hasDriveLetter(normalized) ? normalized.slice(0, 2) : ''
  let workingPath = normalized
  if (driveLetter) {
    workingPath = workingPath.slice(2)
  }

  return workingPath.split('/').filter(Boolean)
}

export function basename(path: string): string {
  const normalized = normalize(path)
  if (normalized === '/' || isRoot(normalized)) return ''
  const segments = split(normalized)
  return segments[segments.length - 1] ?? ''
}

export function dirname(path: string): string {
  return parent(path)
}
