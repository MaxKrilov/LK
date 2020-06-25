export default {
  props: {
    value: [String, Number],
    min: {
      type: Number,
      default: 0
    },
    max: Number,
    id: String
  },
  data () {
    return {
      focus: false
    }
  },
  methods: {
    onInputFocus (event) {
      this.focus = true
      return this.$emit('focus', event)
    },
    onInputBlur (event) {
      this.focus = false
      return this.$emit('blur', event)
    },
    onChange (event) {
      this.$emit('input', event.target.value)
    },
    onPlus () {
      const value = parseInt(this.value)

      this.$emit('input', value >= this.max ? this.max : value + 1)
    },
    onMinus () {
      const value = parseInt(this.value)
      this.$emit('input', value <= this.min ? this.max : value - 1)
    }
  }
}
