import BreakpointMixin from '@/mixins/BreakpointMixin'
import { PATTERN_EMAIL } from '../../../../../../constants/regexp'

const SHOW_BUTTONS_DURATION = 150

export default {
  props: {
    active: { type: Boolean },
    emails: { type: Array },
    count: { type: Number },
    loadingSending: Boolean
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
    },
    selectedEmail (val) {
      if (!val.match(PATTERN_EMAIL)) {
        this.selectedEmail = ''
      }
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
      return !this.isMaxBreakpoint('md') || !this.active || this.showButtons
    }
  },
  methods: {
    toggleButtons () {
      this.hideButtonsFirstTime = false
      this.showButtons = !this.showButtons
    },
    sendOnEmail () {
      this.$emit('send', this.selectedEmail)
    }
  }
}
