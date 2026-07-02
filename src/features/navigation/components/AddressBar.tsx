import { NavigationButtons } from './NavigationButtons'
import { PathInput } from './PathInput'
import { RefreshButton } from './RefreshButton'

export function AddressBar() {
  return (
    <div className="flex h-9 items-center gap-1 border-b border-border bg-background px-2">
      <NavigationButtons />
      <PathInput />
      <RefreshButton />
    </div>
  )
}
