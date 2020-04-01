export default {
  props: {
    startDown: Boolean,
    text: String
  },
  data () {
    return {
      active: false
    }
  },
  methods: {
    onClick () {
      this.active = !this.active
      this.$emit('click', this.active)
    }
  }
}
