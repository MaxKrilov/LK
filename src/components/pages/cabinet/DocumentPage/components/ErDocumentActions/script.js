import BreakpointMixin from '@/mixins/BreakpointMixin'

const SHOW_BUTTONS_DURATION = 150

export default {
  props: {
    active: { type: Boolean },
    emails: { type: Array },
    count: { type: Number }
  },
  mixins: [BreakpointMixin],
  data () {
    return {
      selectedEmail: this.$props.emails[0] || '',
      showButtons: false,
      hideButtonsFirstTime: false
    }
  },
  watch: {
    active (newVal, oldVal) {
      this.hideButtonsFirstTime = this.isMaxBreakpoint('md') && newVal
    }
  },
  computed: {
    showButtonsDuration () {
      if (this.hideButtonsFirstTime) {
        return 0
      }
      return SHOW_BUTTONS_DURATION
    },
    isShowButtons () {
      if (this.isMaxBreakpoint('md')) {
        if (!this.active) {
          return true
        } else if (this.active && this.showButtons) {
          return true
        }
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    toggleButtons () {
      this.hideButtonsFirstTime = false
      this.showButtons = !this.showButtons
    }
  }
}
