import ErBootableMixin from './ErBootableMixin'
import { eachArray } from '../functions/helper'

function validateAttachTarget (val) {
  const type = typeof val
  if (~['boolean', 'string'].indexOf(type)) {
    return true
  }
  return val.nodeType === Node.ELEMENT_NODE
}

export default {
  name: 'detachable',
  mixins: [ ErBootableMixin ],
  data: () => ({
    hasDetached: false
  }),
  props: {
    attach: {
      type: null,
      default: false,
      validator: validateAttachTarget
    },
    contentClass: {
      default: ''
    }
  },
  watch: {
    attach () {
      this.hasDetached = false
      this.initDetach()
    },
    hasContent: 'initDetach'
  },
  methods: {
    getScopeIdAttrs () {
      const scopeId = this.$vnode && this.$vnode.context.$options._scopeId
      return scopeId && {
        [scopeId]: ''
      }
    },
    initDetach () {
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
      target.insertBefore(this.$refs.content, target.firstChild)
      this.hasDetached = true
    }
  },
  beforeMount () {
    this.$nextTick(() => {
      if (this.activatorNode) {
        const activator = Array.isArray(this.activatorNode) ? this.activatorNode : [this.activatorNode]
        eachArray(activator, node => {
          node.elm && this.$el.parentNode.insertBefore(node.elm, this.$el)
        })
      }
    })
  },
  mounted () {
    !this.lazy && this.initDetach()
  },
  deactivated () {
    this.isActive = false
  },
  beforeDestroy () {
    try {
      if (this.$refs.content) {
        this.$refs.content.parentNode.removeChild(this.$refs.content)
      }
      if (this.activatorNode) {
        const activator = Array.isArray(this.activatorNode) ? this.activatorNode : [this.activatorNode]
        eachArray(activator, node => {
          node.elm && node.elm.parentNode.removeChild(node.elm)
        })
      }
    } catch (e) {
      console.log(e)
    }
  }
}
