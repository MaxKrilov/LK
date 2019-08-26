import ErDelayableMixin from './ErDelayableMixin'
import ErToggleableMixin from './ErToggleableMixin'
import { getSlot } from '../functions/helper'

export default {
  name: 'activatable',
  mixins: [ ErDelayableMixin, ErToggleableMixin ],
  data: () => ({
    activatorElement: null,
    activatorNode: []
  }),
  props: {
    activator: {
      type: [String, Object],
      default: null
    },
    disabled: Boolean,
    internalActivator: Boolean,
    openOnHover: Boolean
  },
  watch: {
    activator () {
      this.activatorElement = null
      this.getActivator()
    }
  },
  methods: {
    getValueProxy () {
      const self = this
      return {
        get value () {
          return self.isActive
        },
        set value (isActive) {
          self.isActive = isActive
        }
      }
    },
    genActivator () {
      const node = getSlot(this, 'activator', Object.assign(this.getValueProxy(), {
        on: this.genActivatorListeners(),
        attrs: this.genActivatorAttributes()
      })) || []
      this.activatorNode = node
      return node
    },
    getContentSlot () {
      return getSlot(this, 'default', this.getValueProxy(), true)
    },
    genActivatorAttributes () {
      return {
        role: 'button',
        'aria-haspopup': true,
        'aria-expanded': String(this.isActive)
      }
    },
    genActivatorListeners () {
      if (this.disabled) return {}
      const listeners = {}
      if (this.openOnHover) {
        listeners.mouseenter = e => {
          this.getActivator(e)
          this.runDelay('open')
        }
        listeners.mouseleave = e => {
          this.getActivator(e)
          this.runDelay('close')
        }
      } else {
        listeners.click = e => {
          const activator = this.getActivator(e)
          if (activator) activator.focus()
          this.isActive = !this.isActive
        }
      }
      return listeners
    },
    getActivator (e) {
      if (this.activatorElement) return this.activatorElement
      let activator = null
      if (this.activator) {
        const target = this.internalActivator ? this.$el : document
        activator = this._.isString(this.activator)
          ? target.querySelector(this.activator)
          : this.activator
      } else if (e) {
        activator = e.currentTarget || e.target
      } else if (!this._.isEmpty(this.activatorNode)) {
        activator = this._.head(this.activatorNode)?.elm
      }
      this.activatorElement = activator
      return this.activatorElement
    }
  }
}
