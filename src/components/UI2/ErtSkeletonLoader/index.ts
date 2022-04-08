import './style.scss'

import ErtMeasurableMixin from '@/mixins2/ErtMeasurableMixin'

import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { CreateElement, VNode } from 'vue'

import { getSlot } from '@/functions/helper2'

export interface HTMLSkeletonLoaderElement extends HTMLElement {
  _initialStyle?: {
    display: string | null
    transition: string
  }
}

@Component
class ErtSkeletonLoader extends ErtMeasurableMixin {
  /// Props
  @Prop({ type: Boolean })
  readonly boilerplate!: boolean

  @Prop({ type: Boolean })
  readonly loading!: boolean

  @Prop({ type: String })
  readonly transition!: string

  @Prop({ type: String })
  readonly type!: string

  @Prop({ type: Object, default: () => ({}) })
  readonly types!: Record<string, string>

  /// Computed
  get attrs (): object {
    if (!this.isLoading) return this.$attrs

    return !this.boilerplate
      ? {
        'aria-busy': true,
        'aria-live': 'polite',
        'role': 'alert',
        ...this.$attrs
      }
      : {}
  }

  get classes (): object {
    return {
      'ert-skeleton-loader--boilerplate': this.boilerplate,
      'ert-skeleton-loader--is-loading': this.isLoading
    }
  }

  get isLoading (): boolean {
    return !('default' in this.$scopedSlots) || this.loading
  }

  get rootTypes (): Record<string, string> {
    return {
      actions: 'button@2',
      article: 'heading, paragraph',
      avatar: 'avatar',
      button: 'button',
      card: 'image, card-heading',
      'card-avatar': 'image, list-item-avatar',
      'card-heading': 'heading',
      chip: 'chip',
      'date-picker': 'list-item, card-heading, divider, date-picker-options, date-picker-days, actions',
      'date-picker-options': 'text, avatar@2',
      'date-picker-days': 'avatar@28',
      heading: 'heading',
      image: 'image',
      'list-item': 'text',
      'list-item-avatar': 'avatar, text',
      'list-item-two-line': 'sentences',
      'list-item-avatar-two-line': 'avatar, sentences',
      'list-item-three-line': 'paragraph',
      'list-item-avatar-three-line': 'avatar, paragraph',
      paragraph: 'text@3',
      sentences: 'text@2',
      table: 'table-heading, table-thead, table-tbody, table-tfoot',
      'table-heading': 'heading, text',
      'table-thead': 'heading@6',
      'table-tbody': 'table-row-divider@6',
      'table-row-divider': 'table-row, divider',
      'table-row': 'table-cell@6',
      'table-cell': 'text',
      'table-tfoot': 'text@2, avatar@2',
      text: 'text',
      ...this.types
    }
  }

  /// Methods
  genBone (text: string, children: VNode[]) {
    return this.$createElement('div', {
      staticClass: `ert-skeleton-loader__${text} ert-skeleton-loader__bone`
    }, children)
  }

  genBones (bone: string): VNode[] {
    const [type, length] = bone.split('@') as [string, number]
    const generator = () => this.genStructure(type)

    return Array.from({ length }).map(generator)
  }

  genStructure (type?: string): any {
    let children = []
    type = type || this.type || ''
    const bone = this.rootTypes[type] || ''

    if (type === bone) {} else if (type.indexOf(',') > -1) return this.mapBones(type)
    else if (type.indexOf('@') > -1) return this.genBones(type)
    else if (bone.indexOf(',') > -1) children = this.mapBones(bone)
    else if (bone.indexOf('@') > -1) children = this.genBones(bone)
    else if (bone) children.push(this.genStructure(bone))

    return [this.genBone(type, children)]
  }

  genSkeleton () {
    const children = []

    if (!this.isLoading) {
      children.push(getSlot(this))
    } else {
      children.push(this.genStructure())
    }

    if (!this.transition) return children

    return this.$createElement('transition', {
      props: { name: this.transition },
      on: {
        afterEnter: this.resetStyles,
        beforeEnter: this.onBeforeEnter,
        beforeLeave: this.onBeforeLeave,
        leaveCancelled: this.resetStyles
      }
    }, children)
  }

  mapBones (bones: string) {
    return bones
      .replace(/\s/g, '')
      .split(',')
      .map(this.genStructure)
  }

  onBeforeEnter (el: HTMLSkeletonLoaderElement) {
    this.resetStyles(el)

    if (!this.isLoading) return

    el._initialStyle = {
      display: el.style.display,
      transition: el.style.transition
    }

    el.style.setProperty('transition', 'none', 'important')
  }

  onBeforeLeave (el: HTMLSkeletonLoaderElement) {
    el.style.setProperty('display', 'none', 'important')
  }

  resetStyles (el: HTMLSkeletonLoaderElement) {
    if (!el._initialStyle) return

    el.style.display = el._initialStyle.display || ''
    el.style.transition = el._initialStyle.transition

    delete el._initialStyle
  }

  render (h: CreateElement): VNode {
    return h('div', {
      staticClass: 'ert-skeleton-loader',
      attrs: this.attrs,
      on: this.$listeners,
      class: this.classes,
      style: this.isLoading
        ? this.measurableStyles
        : undefined
    }, [this.genSkeleton()])
  }
}

export { ErtSkeletonLoader }
export default ErtSkeletonLoader
