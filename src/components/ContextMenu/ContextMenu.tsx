import { useEffect, useRef, useCallback } from 'react'

import type { ContextMenuDef } from './ContextMenuItem'
import { ContextMenuItem } from './ContextMenuItem'
import { ContextMenuSeparator } from './ContextMenuSeparator'

interface ContextMenuProps {
  x: number
  y: number
  items: ContextMenuDef[]
  onClose: () => void
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose],
  )

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    },
    [onClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleKeyDown, handleClickOutside])

  return (
    <div
      ref={ref}
      className="fixed z-50 min-w-[180px] rounded-lg border border-border bg-popover py-1 shadow-lg"
      style={{ left: x, top: y }}
      role="menu"
    >
      {items.map((item, i) =>
        'separator' in item && item.separator ? (
          <ContextMenuSeparator key={item.id ?? `sep-${i}`} />
        ) : (
          <ContextMenuItem key={item.id} item={item} onClose={onClose} />
        ),
      )}
    </div>
  )
}
