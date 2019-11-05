import ClickOutsideMixin from '@/mixins/ClickOutsideMixin'

export default {
  name: 'er-right-modal',
  props: {
    active: Boolean,
    overlay: { // mean show overlay
      type: Boolean,
      default: true
    }
  },
  mixins: [ClickOutsideMixin],
  computed: {
    el () {
      return this.$refs.content
    }
  },
  mounted () {
    this.onTransitionEnd()
  },
  methods: {
    onOpen () {
      this.$emit('open')
      this.bindClickOutside()
    },
    onClose () {
      this.$emit('close')
      this.unbindClickOutside()
    },
    onTransitionEnd () {
      if (this.active) {
        this.onOpen()
      } else {
        this.onClose()
      }
    }
  }
}
