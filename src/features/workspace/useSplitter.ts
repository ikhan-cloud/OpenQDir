import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseSplitterOptions {
  containerRef?: React.RefObject<HTMLElement | null>
  sizes: number[]
  minSizes: number[]
  onChange: (sizes: number[]) => void
  axis?: 'x' | 'y'
}

export interface UseSplitterReturn {
  onSplitterMouseDown: (e: React.MouseEvent, splitterIndex: number) => void
  isDragging: boolean
}

export function useSplitter({
  sizes,
  minSizes,
  onChange,
  axis = 'x',
}: UseSplitterOptions): UseSplitterReturn {
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef<{
    startX: number
    startY: number
    startSizes: number[]
    splitterIndex: number
  } | null>(null)

  const sizesRef = useRef(sizes)
  sizesRef.current = sizes

  const minSizesRef = useRef(minSizes)
  minSizesRef.current = minSizes

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const handleMouseDown = useCallback((e: React.MouseEvent, splitterIndex: number) => {
    e.preventDefault()
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      startSizes: [...sizesRef.current],
      splitterIndex,
    }
    setIsDragging(true)
  }, [])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const state = dragState.current
      if (!state) return

      const { startX, startY, startSizes, splitterIndex } = state
      const delta = axis === 'y' ? e.clientY - startY : e.clientX - startX
      const newSizes = [...startSizes]
      const minSize = minSizesRef.current[splitterIndex] ?? 200
      newSizes[splitterIndex] = Math.max(minSize, startSizes[splitterIndex] + delta)

      onChangeRef.current(newSizes)
    }

    const handleMouseUp = () => {
      dragState.current = null
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, axis])

  return { onSplitterMouseDown: handleMouseDown, isDragging }
}
