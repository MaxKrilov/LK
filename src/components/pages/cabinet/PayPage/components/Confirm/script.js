import { mapState } from 'vuex'

export default {
  name: 'confirm',
  props: [
    'vis',
    'title',
    'subText',
    'hasErr',
    'err',
    'sumPay',
    'buttLeft',
    'buttText'
  ],
  data: () => ({
    pre: 'confirm'
  }),
  created () {
    if (this.sumPay !== undefined) {
      this.sumPayInteger = this.sumPay.substr(0, this.sumPay.indexOf(','))
      this.sumPayDecimal = this.sumPay.slice(-2)
    }
  },
  computed: {
    ...mapState({
      numCard: state => state.payments.numCard
    }),
    internalVisible: {
      get () { return this.vis },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {
    buttAct () {
      this.$emit('buttLeft')
    },
    closeConfirm () {
      this.$emit('closeConfirm')
    }
  }
}
