import { Pane } from '../components/Pane'
import { PaneContainer } from '../components/PaneContainer'
import type { PaneState } from '../store'

export function SinglePaneLayout({ panes }: { panes: PaneState[] }) {
  return (
    <main className="flex flex-1 flex-col overflow-auto bg-background">
      {panes.map((pane) => (
        <Pane key={pane.id} id={pane.id}>
          <PaneContainer paneId={pane.id} />
        </Pane>
      ))}
    </main>
  )
}
