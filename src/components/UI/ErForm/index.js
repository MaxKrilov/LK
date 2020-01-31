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
      const found = this.inputs.find(i => i._uid === input._uid)
      if (!found) return
      this.inputs = this.inputs.filter(i => i._uid !== found._uid)
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
