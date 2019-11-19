import ErDocumentCorner from '../ErDocumentCorner'

export default {
  props: {
    ripple: { type: Boolean },
    rippleActive: { type: Boolean },
    color: {
      type: String,
      default: 'gray',
      validator: value => ['yellow', 'blue', 'green', 'gray', 'red', 'white'].includes(value)
    }
  },
  components: {
    ErDocumentCorner
  },
  data () {
    return {
      className: 'er-document'
    }
  },
  computed: {
    getColorClass () {
      if (this.color) {
        return `${this.className}--${this.color}`
      }
      return ''
    }
  }
}
