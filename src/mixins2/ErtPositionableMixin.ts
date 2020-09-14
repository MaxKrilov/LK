import Vue from 'vue'
import { OptionsVue, VueConstructor } from 'vue/types/vue'
import { filterObjectOnKeys } from '@/functions/helper'

const availableProps = {
  absolute: Boolean,
  bottom: Boolean,
  fixed: Boolean,
  left: Boolean,
  right: Boolean,
  top: Boolean
}
type props = Record<keyof typeof availableProps, boolean>

export type Positionable<S extends keyof props> = VueConstructor<Vue & { [P in S]: boolean }, { [P in S]: BooleanConstructor }>

export function factory <S extends keyof props> (selected?: S[]): Positionable<S>
export function factory (selected: undefined): OptionsVue<Vue, {}, {}, {}, props, typeof availableProps>
export function factory (selected: any[] = []): any {
  return Vue.extend({
    name: 'positionable',
    props: selected.length ? filterObjectOnKeys(availableProps, selected) : availableProps
  })
}

export default factory()
