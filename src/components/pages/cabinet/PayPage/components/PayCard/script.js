import { mapGetters, mapState } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'

export default {
  name: 'pay-card',
  props: ['empty', 'visAutoPay'],
  data: () => ({
    pre: 'pay-card',
    cvc: ['', '', ''],
    index: 0,
    hasAutoPay: true, // todo-er должен ли работать чекбокс?
    topMove: 0,
    rightMove: 0,
    leftMove: [],
    topBg: [],
    isButtTop: [false, false, false],
    isButtBott: [true, false, false],
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
      }
    },
    delCard () {
      this.$store.dispatch('payments/listCard', {
        api: this.$api,
        billingAccount: this.activeBillingAccountId
      })
      if (this.delCard) {
        this.openConfirmDel = false
        setTimeout(() => {
          window.location = window.location.href
          this.$store.dispatch('payments/hideDelCard')
        }, 3000)
      } else {
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
        this.move('Down')
      }
    },
    changeWidth () {
      if (this[SCREEN_WIDTH] >= 640) {
        this.delta = [0, 0, 0, 0]
        this.leftMove = [0, -128, -128, -128]
        this.topBg = [0, 0, 0, 0]
        this.valOpacity = 1
      } else {
        let rbutt1, delta1, scrwidth
        if (this[SCREEN_WIDTH] < 480) {
          scrwidth = this[SCREEN_WIDTH] - 320
          this.bgDeleteLeft = 9 + scrwidth * 0.75
          this.bgDeleteWidth = 270 + scrwidth * 0.82
          this.deleteLeft = 14 + scrwidth * 0.088
          delta1 = 24 + scrwidth * 0.8
          rbutt1 = 8 + scrwidth * 0.74
        } else {
          scrwidth = this[SCREEN_WIDTH] - 480
          this.bgDeleteLeft = 128 + scrwidth * 0.48
          this.bgDeleteWidth = 400 + scrwidth * 0.56
          this.deleteLeft = 28 + scrwidth * 0.22
          delta1 = 151 + scrwidth * 0.91
          rbutt1 = 128 + scrwidth * 0.55
        }
        this.delta = [delta1, 0, 0, 0]
        this.leftMove = [rbutt1, 10, 10, 10]
        this.topBg = [this[SCREEN_WIDTH] < 480 ? 66 : 0, -9, -9, -9]
      }
    },
    move (direct) {
      if (direct === 'Up') {
        if (this.index < this.cards.length) {
          if (this[SCREEN_WIDTH] >= 640) {
            this.topMove -= this.topMove === 0 ? 233 : 273
            this.leftMove[this.index] -= 128
            this.leftMove[this.index + 1] += 128
            this.topBg[this.index] -= 10
            this.topBg[this.index + 1] += 10
            this.valOpacity = 1
          } else {
            let ll1, ll2, delta0, delta1, bg1, scrwidth
            if (this[SCREEN_WIDTH] < 480) {
              scrwidth = this[SCREEN_WIDTH] - 320
              ll1 = 264 - scrwidth * 0.05
              ll2 = 272 + scrwidth * 0.045
              delta0 = 16 + scrwidth * 0.05
              delta1 = 16 + scrwidth * 0.85
              bg1 = 8 + scrwidth * 0.75
            } else {
              scrwidth = this[SCREEN_WIDTH] - 480
              ll1 = 256 - (this[SCREEN_WIDTH] * 0.15 - 72)
              ll2 = 280 + scrwidth * 0.075
              delta0 = 24 + scrwidth * 0.1
              delta1 = 151 + scrwidth * 0.52
              bg1 = 128 + scrwidth * 0.41
            }
            this.rightMove -= this.index === 0 ? ll1 : ll2
            this.delta[this.index] = delta0
            this.delta[this.index + 1] = delta1
            this.leftMove[this.index + 1] = bg1
            this.leftMove[this.index] = -10

            if (this[SCREEN_WIDTH] >= 480) {
              this.topBg[this.index] -= 16
              this.topBg[this.index + 1] += 16
            } else {
              this.topBg[this.index] -= 66
              this.topBg[this.index + 1] += 66
            }
          }
          for (let i = 0; i < this.isButtTop.length; i++) {
            this.isButtTop[i] = false
            this.isButtBott[i] = false
          }
          this.isButtTop[this.index] = true
          this.isButtBott[this.index + 1] = true
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
            let ll1, ll2, delta0, delta1, bg1, scrwidth, k0
            if (this[SCREEN_WIDTH] < 480) {
              scrwidth = this[SCREEN_WIDTH] - 320
              ll1 = 264 - scrwidth * 0.05
              ll2 = 272 + scrwidth * 0.045
              delta0 = 16 + scrwidth * 0.05
              delta1 = 16 + scrwidth * 0.85
              bg1 = 8 + scrwidth * 0.75
            } else {
              scrwidth = this[SCREEN_WIDTH] - 480
              ll1 = 256 - (this[SCREEN_WIDTH] * 0.15 - 72)
              ll2 = 280 + scrwidth * 0.075
              delta0 = 24 + scrwidth * 0.1
              k0 = this.index === 1 ? [0.91, 0.55] : [0.52, 0.41]
              delta1 = 151 + scrwidth * k0[0]
              bg1 = 128 + scrwidth * k0[1]
            }
            this.rightMove += this.index === 1 ? ll1 : ll2
            this.delta[this.index - 1] = delta1
            this.delta[this.index] = delta0
            this.leftMove[this.index - 1] = bg1
            this.leftMove[this.index] = 10

            if (this[SCREEN_WIDTH] >= 480) {
              this.topBg[this.index - 1] += 16
              this.topBg[this.index] -= 16
            } else {
              this.topBg[this.index - 1] += 66
              this.topBg[this.index] -= 66
            }
          }
          for (let i = 0; i < this.isButtTop.length; i++) {
            this.isButtTop[i] = false
            this.isButtBott[i] = false
          }
          this.isButtTop[this.index - 2] = true
          this.isButtBott[this.index - 1] = true
          this.moveInd -= 16
          this.index--
        }
      }
      this.$store.dispatch('payments/changeCurrentNumCard', { num: this.index })
      this.rightNext = (this.index > 0) ? '__next' : ''
      this.isButtLeft = (this.index > 0)
      this.isButtRight = (this.index < 3)

      this.cvc = ['', '', '']
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
