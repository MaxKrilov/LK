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
    maxWidth: null,
    disabled_l: true,
    disabled_r: true,
    valDisable_l: 'none',
    valDisable_r: 'none',
    errText: '',
    persistent: true,
    visButt: ''
  }),
  created () {
    if (this.sumPay !== 'promisePay') {
      this.disabled_l = false
      this.disabled_r = false
      this.valDisable_r = 'auto'
      this.$store.dispatch('payments/isLoadingClean')
      this.persistent = false
      this.visButt = ''
    } else {
      this.visButt = '__visButt'
      if (this.$store.state.payments.isDebt) this.disabled_l = false
    }
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
    ...mapGetters([SCREEN_WIDTH]),
    ...mapState({
      numCard: state => state.payments.numCard,
      isLoading: state => state.payments.isLoading,
      isLoadingButt: state => state.payments.isLoadingButt
    }),
    internalVisible: {
      get () { return this.vis },
      set (val) { this.$emit('input', val) }
    }
  },
  watch: {
    isHint () {
      this.hint = Boolean(this.isHint)
    },
    SCREEN_WIDTH () {
      this.changeWidth()
    },
    isLoadingButt () {
      if (!this.isLoadingButt) this.$emit('closeConfirm')
    },
    isLoading () {
      if (this.hasErr) {
        this.disabled_l = false
        this.disabled_r = true
        this.valDisable_r = 'none'
        this.visButt = '__visButt'
      } else {
        this.disabled_l = false
        this.disabled_r = false
        this.valDisable_r = 'auto'
        this.visButt = ''
      }
      this.errText = 'По счету есть дебиторская задолженность.Не забудьте пополнить счет'
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
