import Vue from 'vue'
import Component from 'vue-class-component'

import { getZIndex } from '@/functions/helper2'

@Component
export default class ErtStackableMixin extends Vue {
  // Options
  $refs!: {
    content: Element
  }

  // Data
  stackElement: Element | null = null
  stackExclude: Element[] | null = null
  stackMinZIndex: number = 0
  isActive: boolean = false

  // Computed
  get activeZIndex (): number {
    if (typeof window === 'undefined') return 0

    const content = this.stackElement || this.$refs.content

    const index = !this.isActive
      ? getZIndex(content)
      : this.getMaxZIndex(this.stackExclude || [content]) + 2

    if (index == null) return index

    // @ts-ignore
    return parseInt(index)
  }

  // Methods
  getMaxZIndex (exclude: Element[] = []) {
    const base = this.$el
    const zis = [this.stackMinZIndex, getZIndex(base)]
    const activeElements = [
      ...document.getElementsByClassName('ert-menu__content--active'),
      ...document.getElementsByClassName('ert-dialog__content--active')
    ]

    for (let index = 0; index < activeElements.length; index++) {
      if (!exclude.includes(activeElements[index])) {
        zis.push(getZIndex(activeElements[index]))
      }
    }

    return Math.max(...zis)
  }
}
