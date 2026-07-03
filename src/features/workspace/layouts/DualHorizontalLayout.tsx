import { useCallback, useRef } from 'react'

import { Pane } from '../components/Pane'
import { PaneContainer } from '../components/PaneContainer'
import { Splitter } from '../components/Splitter'
import { useWorkspaceStore, type PaneState } from '../store'
import { useSplitter } from '../useSplitter'

export function DualHorizontalLayout({ panes }: { panes: PaneState[] }) {
  const paneSizes = useWorkspaceStore((s) => s.paneSizes)
  const minPaneSize = useWorkspaceStore((s) => s.minPaneSize)
  const setPaneSizes = useWorkspaceStore((s) => s.setPaneSizes)

  const leftId = panes[0]?.id ?? 'main'
  const leftWidth = paneSizes[leftId] ?? 400
  const containerRef = useRef<HTMLDivElement>(null)

  const handleChange = useCallback(
    (newSizes: number[]) => {
      setPaneSizes({ ...paneSizes, [leftId]: newSizes[0] })
    },
    [paneSizes, leftId, setPaneSizes],
  )

  const { onSplitterMouseDown, isDragging } = useSplitter({
    containerRef,
    sizes: [leftWidth],
    minSizes: [minPaneSize],
    onChange: handleChange,
  })

  return (
    <main className="flex flex-1 overflow-hidden bg-background" ref={containerRef}>
      <div
        className="flex min-w-0 flex-col"
        style={{ width: leftWidth, flex: '0 0 auto', minWidth: minPaneSize }}
      >
        <Pane id={leftId}>
          <PaneContainer paneId={leftId} />
        </Pane>
      </div>
      <Splitter
        onMouseDown={(e) => onSplitterMouseDown(e, 0)}
        isDragging={isDragging}
        orientation="horizontal"
      />
      {panes.slice(1).map((pane) => (
        <div key={pane.id} className="flex min-w-0 flex-1 flex-col">
          <Pane id={pane.id}>
            <PaneContainer paneId={pane.id} />
          </Pane>
        </div>
      ))}
    </main>
  )
}
