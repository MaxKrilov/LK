import { mapState } from 'vuex'

export default {
  name: 'confirm',
  props: [
    'vis',
    'title',
    'description',
    'subText',
    'hasErr',
    'err',
    'sumPay',
    'buttLeftText',
    'buttRightText',
    'isHint'
  ],
  data: () => ({
    pre: 'confirm',
    hint: '',
    styleTitle: ''
  }),
  created () {
    this.hint = Boolean(this.isHint)
    if (this.sumPay !== undefined) {
      this.sumPayInteger = this.sumPay.substr(0, this.sumPay.indexOf(','))
      this.sumPayDecimal = this.sumPay.slice(-2)
    } else {
      this.sumPayInteger = ''
      this.sumPayDecimal = ''
    }
  },
  computed: {
    ...mapState({
      numCard: state => state.payments.numCard
    }),
    internalVisible: {
      get () { return this.vis },
      set (val) { this.$emit('input', val) }
    },
  },
  watch: {
    isHint () {
      this.hint = Boolean(this.isHint)
    },
  },
  mounted () {
    this.styleTitle = this.buttLeftText === 'Отменить' ? '' : '__one-row'
  },
  methods: {
    buttLeft () {
      this.$emit('buttLeft')
    },
    buttRight () {
      this.$emit('buttRight')
    },
    closeConfirm () {
      this.$emit('closeConfirm')
    }
  }
}
