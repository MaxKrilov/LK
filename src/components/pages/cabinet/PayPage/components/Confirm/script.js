import { mapGetters, mapState } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'

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
    styleTitle: '',
    maxWidth: null
  }),
  created () {
    this.hint = Boolean(this.isHint)
    // if (this.sumPay !== undefined) {
    //   this.sumPayInteger = this.sumPay.substr(0, this.sumPay.indexOf(','))
    //   this.sumPayDecimal = this.sumPay.slice(-2)
    // } else {
    //   this.sumPayInteger = ''
    //   this.sumPayDecimal = ''
    // }
  },
  computed: {
    ...mapGetters([SCREEN_WIDTH]),
    ...mapState({
      numCard: state => state.payments.numCard
    }),
    internalVisible: {
      get () { return this.vis },
      set (val) { this.$emit('input', val) }
    },
    sumPayInteger () {
      return this.sumPay ? this.sumPay.substr(0, this.sumPay.indexOf(',')) : ''
    },
    sumPayDecimal () {
      return this.sumPay ? this.sumPay.slice(-2) : ''
    }
  },
  watch: {
    isHint () {
      this.hint = Boolean(this.isHint)
    },
    SCREEN_WIDTH () {
      this.changeWidth()
    }
  },
  mounted () {
    this.styleTitle = this.buttLeftText === 'Отменить' ? '' : '__one-row'
    this.changeWidth()
  },
  methods: {
    changeWidth () {
      this.maxWidth = (this[SCREEN_WIDTH] >= 1200) ? this.maxWidth = 544
        : (this[SCREEN_WIDTH] >= 640) ? this.maxWidth = 384
          : this.maxWidth = 448
    },
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
