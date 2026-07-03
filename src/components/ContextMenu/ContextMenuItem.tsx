import { useCallback, type ReactNode } from 'react'

import { commandRegistry } from '@/services/commandRegistry'
import { cn } from '@/lib/utils'

export interface ContextMenuItemDef {
  id: string
  label: string
  shortcut?: string
  disabled?: boolean
  icon?: ReactNode
  separator?: false
}

export interface ContextMenuSeparatorDef {
  separator: true
  id?: string
}

export type ContextMenuDef = ContextMenuItemDef | ContextMenuSeparatorDef

interface ContextMenuItemProps {
  item: ContextMenuItemDef
  onClose: () => void
}

export function ContextMenuItem({ item, onClose }: ContextMenuItemProps) {
  const handleClick = useCallback(() => {
    if (item.disabled) return
    onClose()
    commandRegistry.execute(item.id)
  }, [item.id, item.disabled, onClose])

  return (
    <button
      onClick={handleClick}
      disabled={item.disabled}
      className={cn(
        'flex w-full items-center gap-3 px-3 py-1.5 text-left text-sm transition-colors',
        item.disabled
          ? 'cursor-not-allowed text-muted-foreground/50'
          : 'text-foreground hover:bg-accent hover:text-accent-foreground',
      )}
      role="menuitem"
    >
      {item.icon && (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
          {item.icon}
        </span>
      )}
      <span className="flex-1 truncate">{item.label}</span>
      {item.shortcut && (
        <span className="ml-4 text-xs text-muted-foreground">{item.shortcut}</span>
      )}
    </button>
  )
}
