import { useCallback, useRef } from 'react'

import { Pane } from '../components/Pane'
import { PaneContainer } from '../components/PaneContainer'
import { Splitter } from '../components/Splitter'
import { useWorkspaceStore, type PaneState } from '../store'
import { useSplitter } from '../useSplitter'

export function DualVerticalLayout({ panes }: { panes: PaneState[] }) {
  const paneSizes = useWorkspaceStore((s) => s.paneSizes)
  const minPaneSize = useWorkspaceStore((s) => s.minPaneSize)
  const setPaneSizes = useWorkspaceStore((s) => s.setPaneSizes)

  const topId = panes[0]?.id ?? 'main'
  const topHeight = paneSizes[topId] ?? 300
  const containerRef = useRef<HTMLDivElement>(null)

  const handleChange = useCallback(
    (newSizes: number[]) => {
      setPaneSizes({ ...paneSizes, [topId]: newSizes[0] })
    },
    [paneSizes, topId, setPaneSizes],
  )

  const { onSplitterMouseDown, isDragging } = useSplitter({
    containerRef,
    sizes: [topHeight],
    minSizes: [minPaneSize],
    onChange: handleChange,
    axis: 'y',
  })

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-background" ref={containerRef}>
      <div
        className="flex min-h-0 flex-col"
        style={{ height: topHeight, flex: '0 0 auto', minHeight: minPaneSize }}
      >
        <Pane id={topId}>
          <PaneContainer paneId={topId} />
        </Pane>
      </div>
      <Splitter
        onMouseDown={(e) => onSplitterMouseDown(e, 0)}
        isDragging={isDragging}
        orientation="vertical"
      />
      {panes.slice(1).map((pane) => (
        <div key={pane.id} className="flex min-h-0 flex-1 flex-col">
          <Pane id={pane.id}>
            <PaneContainer paneId={pane.id} />
          </Pane>
        </div>
      ))}
    </main>
  )
}
