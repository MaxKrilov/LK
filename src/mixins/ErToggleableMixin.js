import Vue from 'vue'

export function factory (prop = 'value', event = 'input') {
  return Vue.extend({
    name: 'toggleable',
    model: { prop, event },
    data () {
      return {
        isActive: !!this[prop]
      }
    },
    props: {
      [prop]: { required: false }
    },
    watch: {
      [prop] (val) {
        this.isActive = !!val
      },
      isActive (val) {
        !!val !== this[prop] && this.$emit(event, val)
      }
    }
  })
}

const ErToggleableMixin = factory()

export default ErToggleableMixin
