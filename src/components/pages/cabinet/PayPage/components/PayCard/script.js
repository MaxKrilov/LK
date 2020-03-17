import { mapGetters, mapState } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'

export default {
  name: 'pay-card',
  props: ['empty', 'visAutoPay'],
  data: () => ({
    pre: 'pay-card',
    numInd: null,
    heightInd: null,
    cvc: [],
    index: 0,
    hasAutoPay: true,
    topMove: 0,
    rightMove: 0,
    leftMove: [],
    topBg: [],
    isButtTop: [],
    isButtBott: [],
    moveInd: 0,
    textDataCard: `Данные карты вы заполняете 
    на следующем шаге. 
    В целях вашей безопасности 
    мы не храним все данные карты.
    Данные карты хранит банк, 
    мы храним только ссылку на данные карты. 
    Если вы запомните карту, в следующий раз 
    можно будет ввести только CVC`,
    openConfirmDel: false,
    isButtLeft: false,
    isButtRight: true,
    rightNext: '',
    delta: [],
    valOpacity: 0,
    bgDeleteLeft: 0,
    bgDeleteWidth: 0,
    deleteLeft: 0,
    buttbottimg0: '',
    numbuttbott0: ''
  }),
  created () {
    this.$parent.$on('updateCardDel', this.cardDel)
    this.$parent.$on('updateButtLeft', this.updateSelectLeft)
    this.$parent.$on('updateButtRight', this.updateSelectRight)
    if (this.activeBillingAccountId !== '') {
      this.$store.dispatch('payments/listCard', {
        api: this.$api,
        billingAccount: this.activeBillingAccountId
      })
    }
  },
  mounted () {
    this.changeWidth()
  },
  watch: {
    SCREEN_WIDTH () {
      this.changeWidth()
    },
    activeBillingAccountId () {
      if (this.activeBillingAccountId !== '') {
        this.$store.dispatch('payments/listCard', {
          api: this.$api,
          billingAccount: this.activeBillingAccountId
        })
      }
    },
    cards () {
      if (this.cards.length !== 0) {
        this.changeWidth()
        this.buttbottimg0 = require('@/assets/images/paycard/' + this.cards[0].name + '-butt-1200.png')
        this.numbuttbott0 = this.cards[0].maskedPan.slice(-4)
        let autopay
        for (let i = 0; i < this.cards.length; i++) {
          if (this.cards[i].autopay === 1) {
            autopay = i + 1
            const payload = {
              billingAccount: this.activeBillingAccountId,
              bindingId: this.cards[i].bindingId,
              activate: 1,
              load: autopay
            }
            this.$store.dispatch('payments/autoPay', { api: this.$api, payload: payload })
          }
        }
      }
    },
    delCard () {
      if (this.delCard) {
        this.$store.dispatch('payments/listCard', {
          api: this.$api,
          billingAccount: this.activeBillingAccountId
        })
        this.openConfirmDel = false
        setTimeout(() => {
          this.changeWidth()
          this.topMove = 0
          this.right = 0
          this.$store.dispatch('payments/hideDelCard')
        }, 3000)
      } else {
        this.index = 0
        this.openConfirmDel = true
      }
    }
  },
  computed: {
    ...mapGetters([SCREEN_WIDTH]),
    ...mapState({
      activeBillingAccountId: state => state.user.activeBillingAccount,
      cards: state => state.payments.listCard,
      delCard: state => state.payments.delCard,
      numCard: state => state.payments.numCard,
      errDelCard: state => state.payments.errDelCard,
      sel_save: state => state.payments.save
    })
  },
  methods: {
    scroll (e) {
      e.preventDefault()
      e.stopPropagation()
      if (e.deltaY > 0) {
        if (this.index < this.cards.length) this.move('Up')
      } else {
        if (this.index > 0) this.move('Down')
      }
    },
    arrFill (len, valOne, val) {
      let array = [len + 1]
      for (let i = 0; i < len + 1; i++) {
        array[i] = i === 0 ? valOne : val
      }
      return array
    },
    changeWidth () {
      const len = this.cards.length
      this.numInd = len
      this.heightInd = 65 + ((len - 1) * 16)
      this.isButtTop = this.arrFill(len - 1, false, false)
      this.isButtBott = this.arrFill(len - 1, true, false)
      this.cvc = this.arrFill(len - 1, '', '')
      if (this[SCREEN_WIDTH] >= 640) {
        this.delta = this.arrFill(len, 0, 0)
        this.leftMove = this.arrFill(len, 0, -128)
        this.topBg = this.arrFill(len, 0, 0)
        this.valOpacity = 1
      } else {
        let posBgOne, deltaOne, scrwidth
        if (this[SCREEN_WIDTH] < 480) {
          scrwidth = this[SCREEN_WIDTH] - 320
          this.bgDeleteLeft = 9 + scrwidth * 0.75
          this.bgDeleteWidth = 270 + scrwidth * 0.82
          this.deleteLeft = 14 + scrwidth * 0.088
          deltaOne = 24 + scrwidth * 0.8
          posBgOne = 8 + scrwidth * 0.74
        } else {
          scrwidth = this[SCREEN_WIDTH] - 480
          this.bgDeleteLeft = 128 + scrwidth * 0.48
          this.bgDeleteWidth = 400 + scrwidth * 0.56
          this.deleteLeft = 28 + scrwidth * 0.22
          deltaOne = 151 + scrwidth * 0.91
          posBgOne = 128 + scrwidth * 0.55
        }
        this.delta = this.arrFill(len, deltaOne, 0)
        this.leftMove = this.arrFill(len, posBgOne, 10)
        this.topBg = this.arrFill(len, this[SCREEN_WIDTH] < 480 ? 66 : 0, -9)
      }
    },
    move (direct) {
      const len = this.cards.length
      if (direct === 'Up') {
        if (this.index < len) {
          if (this[SCREEN_WIDTH] >= 640) {
            this.topMove -= this.topMove === 0 ? 233 : 273
            this.leftMove[this.index] -= 128
            this.leftMove[this.index + 1] += 128
            this.topBg[this.index] -= 10
            this.topBg[this.index + 1] += 10
            this.valOpacity = 1
          } else {
            let shiftOne, shiftNext, deltaOne, deltaNext, posBgNext, scrwidth
            if (this[SCREEN_WIDTH] < 480) {
              scrwidth = this[SCREEN_WIDTH] - 320
              shiftOne = 264 - scrwidth * 0.05
              shiftNext = 272 + scrwidth * 0.045
              deltaOne = 16 + scrwidth * 0.05
              deltaNext = 16 + scrwidth * 0.85
              posBgNext = 8 + scrwidth * 0.75
            } else {
              scrwidth = this[SCREEN_WIDTH] - 480
              shiftOne = 256 - (this[SCREEN_WIDTH] * 0.15 - 72)
              shiftNext = 280 + scrwidth * 0.075
              deltaOne = 24 + scrwidth * 0.1
              deltaNext = 151 + scrwidth * 0.52
              posBgNext = 128 + scrwidth * 0.41
            }
            this.rightMove -= this.index === 0 ? shiftOne : shiftNext
            this.delta[this.index] = deltaOne
            this.delta[this.index + 1] = deltaNext
            this.leftMove[this.index + 1] = posBgNext
            this.leftMove[this.index] = -10
            if (this[SCREEN_WIDTH] >= 480) {
              this.topBg[this.index] -= 16
              this.topBg[this.index + 1] += 16
            } else {
              this.topBg[this.index] -= 66
              this.topBg[this.index + 1] += 66
            }
          }
          this.isButtTop = this.arrFill(len - 1, false, false)
          this.isButtBott = this.arrFill(len - 1, false, false)
          this.isButtTop[this.index] = true
          if (this.index < len) this.isButtBott[this.index + 1] = true
          this.moveInd += 16
          this.index++
        }
      } else {
        if (this.index > 0) {
          if (this[SCREEN_WIDTH] >= 640) {
            this.topMove += this.topMove === -233 ? 233 : 273
            this.leftMove[this.index - 1] += 128
            this.leftMove[this.index] -= 128
            this.topBg[this.index - 1] += 10
            this.topBg[this.index] -= 10
          } else {
            let shiftOne, shiftNext, deltaOne, deltaNext, posBgNext, scrwidth, kscr
            if (this[SCREEN_WIDTH] < 480) {
              scrwidth = this[SCREEN_WIDTH] - 320
              shiftOne = 264 - scrwidth * 0.05
              shiftNext = 272 + scrwidth * 0.045
              deltaOne = 16 + scrwidth * 0.05
              deltaNext = 16 + scrwidth * 0.85
              posBgNext = 8 + scrwidth * 0.75
            } else {
              scrwidth = this[SCREEN_WIDTH] - 480
              shiftOne = 256 - (this[SCREEN_WIDTH] * 0.15 - 72)
              shiftNext = 280 + scrwidth * 0.075
              deltaOne = 24 + scrwidth * 0.1
              kscr = this.index === 1 ? [0.91, 0.55] : [0.52, 0.41]
              deltaNext = 151 + scrwidth * kscr[0]
              posBgNext = 128 + scrwidth * kscr[1]
            }
            this.rightMove += this.index === 1 ? shiftOne : shiftNext
            this.delta[this.index - 1] = deltaNext
            this.delta[this.index] = deltaOne
            this.leftMove[this.index - 1] = posBgNext
            this.leftMove[this.index] = 10
            if (this[SCREEN_WIDTH] >= 480) {
              this.topBg[this.index - 1] += 16
              this.topBg[this.index] -= 16
            } else {
              this.topBg[this.index - 1] += 66
              this.topBg[this.index] -= 66
            }
          }
          this.isButtTop = this.arrFill(len - 1, false, false)
          this.isButtBott = this.arrFill(len - 1, false, false)
          if (this.index > 1) this.isButtTop[this.index - 2] = true
          this.isButtBott[this.index - 1] = true
          this.moveInd -= 16
          this.index--
        }
      }
      this.$store.dispatch('payments/changeCurrentNumCard', { num: this.index })
      this.rightNext = (this.index > 0) ? '__next' : ''
      this.isButtLeft = (this.index > 0)
      this.isButtRight = (this.index < 3)
      this.cvc = this.arrFill(len - 1, '', '')
      this.$store.dispatch('payments/clearCVC')
      this.$emit('clearEmpty')
    },
    delConfirm () {
      this.$emit('openDelConfirm')
      this.openConfirmDel = true
    },
    cardDel () {
      const payload = {
        billingAccount: this.activeBillingAccountId,
        bindingId: this.cards[this.numCard - 1].bindingId
      }
      this.$store.dispatch('payments/delCard', { api: this.$api, payload: payload })
    },
    openRemcard () {
      this.$emit('openRemcard')
    },
    updateSelectLeft () {
      this.$store.dispatch('payments/changeSave', { save: 0 })
    },
    updateSelectRight () {
      this.$store.dispatch('payments/changeSave', { save: 1 })
    },
    save () {
      this.$store.dispatch('payments/changeSave', { save: !this.sel_save })
    },
    changeCVC () {
      this.cvc[this.index - 1] = this.cvc[this.index - 1].replace(/\s+/g, '')
      if (this.cvc[this.index - 1].length === 3) {
        this.$store.dispatch('payments/changeCVC', { cvc: this.cvc[this.index - 1] })
      }
    }
  }
}
