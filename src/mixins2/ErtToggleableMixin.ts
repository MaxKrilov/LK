import Vue, { VueConstructor } from 'vue'

/* eslint-disable-next-line no-use-before-define */
export type Toggleable<T extends string = 'value'> = VueConstructor<Vue & { isActive: boolean } & Record<T, any>>

// eslint-disable-next-line import/export
export function factory<T extends string = 'value'> (prop?: T, event?: string): Toggleable<T>
// eslint-disable-next-line import/export
export function factory (prop = 'value', event = 'input') {
  return Vue.extend({
    name: 'toggleable',

    model: { prop, event },

    props: {
      [prop]: { required: false }
    },

    data () {
      return {
        isActive: !!this[prop]
      }
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

/* eslint-disable-next-line no-redeclare */
const Toggleable = factory()

export default Toggleable
