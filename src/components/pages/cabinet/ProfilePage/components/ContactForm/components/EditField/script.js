import Responsive from '@/mixins/ResponsiveMixin'

export default {
  name: 'edit-field',
  data: () => ({
    pre: 'edit-field'
  }),
  mixins: [ Responsive ],
  props: {
    value: { type: String }
  },
  methods: {
    onRemove () {
      this.$emit('onRemove', this.value)
    },
    onPrefer () {
      this.$emit('onPrefer', this.value)
    }
  }
}
