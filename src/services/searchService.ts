export interface SearchService {
  match(name: string, query: string): boolean
}

function globToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&')
  const regexStr = escaped.replace(/\*/g, '.*').replace(/\?/g, '.')
  return new RegExp(`^${regexStr}$`, 'i')
}

export class FilenameSearchService implements SearchService {
  match(name: string, query: string): boolean {
    if (!query) return true
    return globToRegex(query).test(name)
  }
}

export const filenameSearchService = new FilenameSearchService()
