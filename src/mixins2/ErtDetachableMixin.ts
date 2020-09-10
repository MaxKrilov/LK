import ErtBootable from './ErtBootableMixin'

import { getObjectValueByPath } from '@/functions/helper2'

import Component, { mixins } from 'vue-class-component'
import { VNode } from 'vue/types'

function validateAttachTarget (val: any) {
  const type = typeof val

  if (['boolean', 'string'].includes(type)) return true

  return val.nodeType === Node.ELEMENT_NODE
}

const props = {
  attach: {
    default: false,
    validator: validateAttachTarget
  },
  contentClass: {
    type: String,
    default: ''
  }
}

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof ErtDetachableMixin>>({
  props,
  watch: {
    attach () {
      this.hasDetached = false
      this.initDetach()
    },
    hasContent () {
      this.$nextTick(this.initDetach)
    }
  }
})
export default class ErtDetachableMixin extends mixins(ErtBootable) {
  // Options
  $el!: HTMLElement
  $refs!: {
    content: HTMLElement
  }

  // Props
  readonly attach!: boolean | string | Element
  readonly contentClass!: string

  // Data
  activatorNode: null | VNode | VNode[] = null
  hasDetached: boolean = false

  // Hooks
  beforeMount () {
    this.$nextTick(() => {
      if (this.activatorNode) {
        const activator = Array.isArray(this.activatorNode) ? this.activatorNode : [this.activatorNode]

        activator.forEach(node => {
          if (!node.elm) return
          if (!this.$el.parentNode) return

          const target = this.$el === this.$el.parentNode.firstChild
            ? this.$el
            : this.$el.nextSibling

          this.$el.parentNode.insertBefore(node.elm, target)
        })
      }
    })
  }

  mounted () {
    this.hasContent && this.initDetach()
  }

  deactivated () {
    this.isActive = false
  }

  beforeDestroy () {
    // IE11 Fix
    try {
      if (
        this.$refs.content &&
        this.$refs.content.parentNode
      ) {
        this.$refs.content.parentNode.removeChild(this.$refs.content)
      }

      if (this.activatorNode) {
        const activator = Array.isArray(this.activatorNode) ? this.activatorNode : [this.activatorNode]
        activator.forEach(node => {
          node.elm &&
          node.elm.parentNode &&
          node.elm.parentNode.removeChild(node.elm)
        })
      }
    } catch (e) { console.log(e) }
  }

  // Methods
  getScopeIdAttrs () {
    const scopeId = getObjectValueByPath(this.$vnode, 'context.$options._scopeId')

    return scopeId && {
      [scopeId]: ''
    }
  }

  initDetach () {
    // @ts-ignore
    if (this._isDestroyed ||
      !this.$refs.content ||
      this.hasDetached ||
      this.attach === '' ||
      this.attach === true ||
      this.attach === 'attach'
    ) return

    let target
    if (this.attach === false) {
      target = document.querySelector('[data-app]')
    } else if (typeof this.attach === 'string') {
      target = document.querySelector(this.attach)
    } else {
      target = this.attach
    }

    if (!target) {
      console.warn(`Unable to locate target ${this.attach || '[data-app]'}`, this)
      return
    }

    target.appendChild(this.$refs.content)

    this.hasDetached = true
  }
}
