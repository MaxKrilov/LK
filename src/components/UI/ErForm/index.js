import { provide as RegistrableProvide } from '../../../mixins/ErRegistrable'

export default {
  name: 'er-form',
  mixins: [ RegistrableProvide('form') ],
  data: () => ({
    pre: 'er-form',
    inputs: []
  }),
  methods: {
    register (input) {
      this.inputs.push(input)
    },
    unregister (input) {
    },
    validate () {
      const errors = this.inputs.filter(input => !input.validate()).length
      return !errors
    }
  },
  render (h) {
    return h('form', {
      staticClass: `${this.pre}`,
      attrs: this.$attrs,
      on: {
        submit: e => this.$emit('submit', e)
      }
    }, [ this.$slots.default ])
  }
}
