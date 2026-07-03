import { useCallback, useRef } from 'react'

import { Pane } from '../components/Pane'
import { PaneContainer } from '../components/PaneContainer'
import { Splitter } from '../components/Splitter'
import { useWorkspaceStore, type PaneState } from '../store'
import { useSplitter } from '../useSplitter'

const GRID_ROW_KEY = '_gridRowHeight'

export function GridLayout({ panes }: { panes: PaneState[] }) {
  const paneSizes = useWorkspaceStore((s) => s.paneSizes)
  const minPaneSize = useWorkspaceStore((s) => s.minPaneSize)
  const setPaneSizes = useWorkspaceStore((s) => s.setPaneSizes)

  const [pane1, pane2, pane3, pane4] = panes
  const topLeftWidth = paneSizes[pane1?.id ?? ''] ?? 400
  const bottomLeftWidth = paneSizes[pane3?.id ?? ''] ?? 400
  const topRowHeight = paneSizes[GRID_ROW_KEY] ?? 300
  const containerRef = useRef<HTMLDivElement>(null)

  const setPaneSize = useCallback(
    (id: string, size: number) => {
      setPaneSizes({ ...paneSizes, [id]: size })
    },
    [paneSizes, setPaneSizes],
  )

  const col1Sizes = [topLeftWidth]
  const col1MinSizes = [minPaneSize]
  const col1OnChange = useCallback(
    (sizes: number[]) => {
      if (pane1) setPaneSize(pane1.id, sizes[0])
    },
    [pane1, setPaneSize],
  )
  const { onSplitterMouseDown: onCol1MouseDown, isDragging: isCol1Dragging } = useSplitter({
    containerRef,
    sizes: col1Sizes,
    minSizes: col1MinSizes,
    onChange: col1OnChange,
  })

  const col2Sizes = [bottomLeftWidth]
  const col2MinSizes = [minPaneSize]
  const col2OnChange = useCallback(
    (sizes: number[]) => {
      if (pane3) setPaneSize(pane3.id, sizes[0])
    },
    [pane3, setPaneSize],
  )
  const { onSplitterMouseDown: onCol2MouseDown, isDragging: isCol2Dragging } = useSplitter({
    containerRef,
    sizes: col2Sizes,
    minSizes: col2MinSizes,
    onChange: col2OnChange,
  })

  const rowOnChange = useCallback(
    (sizes: number[]) => {
      setPaneSizes({ ...paneSizes, [GRID_ROW_KEY]: sizes[0] })
    },
    [paneSizes, setPaneSizes],
  )
  const { onSplitterMouseDown: onRowMouseDown, isDragging: isRowDragging } = useSplitter({
    containerRef,
    sizes: [topRowHeight],
    minSizes: [100],
    onChange: rowOnChange,
    axis: 'y',
  })

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-background" ref={containerRef}>
      <div
        className="flex flex-row overflow-hidden"
        style={{ height: topRowHeight, flex: '0 0 auto', minHeight: 100 }}
      >
        {pane1 && (
          <div
            className="flex min-w-0 flex-col"
            style={{ width: topLeftWidth, flex: '0 0 auto', minWidth: minPaneSize }}
          >
            <Pane id={pane1.id}>
              <PaneContainer paneId={pane1.id} />
            </Pane>
          </div>
        )}
        {pane1 && pane2 && (
          <Splitter
            onMouseDown={(e) => onCol1MouseDown(e, 0)}
            isDragging={isCol1Dragging}
            orientation="horizontal"
          />
        )}
        {pane2 && (
          <div className="flex min-w-0 flex-1 flex-col">
            <Pane id={pane2.id}>
              <PaneContainer paneId={pane2.id} />
            </Pane>
          </div>
        )}
      </div>
      <Splitter
        onMouseDown={(e) => onRowMouseDown(e, 0)}
        isDragging={isRowDragging}
        orientation="vertical"
      />
      <div
        className="flex flex-row overflow-hidden"
        style={{ flex: '1 1 0', minHeight: 0 }}
      >
        {pane3 && (
          <div
            className="flex min-w-0 flex-col"
            style={{ width: bottomLeftWidth, flex: '0 0 auto', minWidth: minPaneSize }}
          >
            <Pane id={pane3.id}>
              <PaneContainer paneId={pane3.id} />
            </Pane>
          </div>
        )}
        {pane3 && pane4 && (
          <Splitter
            onMouseDown={(e) => onCol2MouseDown(e, 0)}
            isDragging={isCol2Dragging}
            orientation="horizontal"
          />
        )}
        {pane4 && (
          <div className="flex min-w-0 flex-1 flex-col">
            <Pane id={pane4.id}>
              <PaneContainer paneId={pane4.id} />
            </Pane>
          </div>
        )}
      </div>
    </main>
  )
}
