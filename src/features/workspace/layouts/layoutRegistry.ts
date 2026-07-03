import type { ComponentType } from 'react'

import { DualHorizontalLayout } from './DualHorizontalLayout'
import { DualVerticalLayout } from './DualVerticalLayout'
import { GridLayout } from './GridLayout'
import { SinglePaneLayout } from './SinglePaneLayout'
import type { PaneState } from '../store'

export type LayoutRenderer = ComponentType<{ panes: PaneState[] }>

const registry = new Map<string, LayoutRenderer>()

function register(mode: string, renderer: LayoutRenderer) {
  registry.set(mode, renderer)
}

function get(mode: string): LayoutRenderer | undefined {
  return registry.get(mode)
}

register('single', SinglePaneLayout)
register('horizontal', DualHorizontalLayout)
register('vertical', DualVerticalLayout)
register('grid', GridLayout)

export { register, get }
