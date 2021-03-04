import './style.scss'

import Vue from 'vue'
import Component from 'vue-class-component'

import { getSlot } from '@/functions/helper2'

@Component({
  props: {
    value: {
      type: Array,
      default: () => []
    }
  }
})
class ErtMessages extends Vue {
  // Props
  readonly value!: string[]

  // Methods
  genMessage (message: string, key: number) {
    return this.$createElement('div', {
      staticClass: 'ert-messages__message',
      key
    }, getSlot(this, 'default', { message, key }) || [message])
  }

  genChildren () {
    return this.$createElement('transition-group', {
      staticClass: 'ert-messages__wrapper',
      attrs: {
        name: 'message-transition',
        tag: 'div'
      }
    }, this.value.map(this.genMessage))
  }

  // Hooks
  render () {
    return this.$createElement('div', {
      staticClass: 'ert-messages'
    }, [this.genChildren()])
  }
}

export { ErtMessages }
export default ErtMessages
