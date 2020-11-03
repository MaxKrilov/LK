import { createJavascriptTransition, createSimpleTransition } from '@/functions/transitions/createTransition'
import ExpandTransitionGenerator from './expand-transition'

export const ErtFabTransition = createSimpleTransition('fab-transition', 'center center', 'out-in')
export const ErtFadeTransition = createSimpleTransition('fade-transition')
export const ErtSlideXTransition = createSimpleTransition('slide-x-transition')
export const ErtScaleTransition = createSimpleTransition('scale-transition')

export const ErtExpandTransition = createJavascriptTransition('expand-transition', ExpandTransitionGenerator())
export const ErtExpandXTransition = createJavascriptTransition('expand-x-transition', ExpandTransitionGenerator('', true))
