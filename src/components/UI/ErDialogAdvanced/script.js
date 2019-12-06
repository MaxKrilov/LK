import ClickOutsideMixin from '@/mixins/ClickOutsideMixin'

export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'ok'
    }
  },
  mixins: [ClickOutsideMixin],
  computed: {
    el () {
      return this.$refs.content
    }
  },
  methods: {
    onClose () {
      this.$emit('close')
    },
    getIconClass () {
      return `er-icon--${this.icon}`
    }
  }
}
