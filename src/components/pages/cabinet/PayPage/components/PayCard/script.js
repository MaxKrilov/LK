import { mapGetters } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import SaveCard from '../SaveCard/index.vue'


export default {
  name: 'pay-card',
  components: {
    SaveCard
  },
  props: ['empty'],
  data: () => ({
    pre: 'pay-card',
    empt: false,
    cvc: ['', '', ''],
    cvc1: ['', '', ''],
    index: 0,
    cards: [
      {
        id: 0,
        name: 'mir',
        butttopimg: require('@/assets/images/paycard/new-butt-1200.png'),
        cardimg: require('@/assets/images/paycard/mir-1200.png'),
        cardbgimg: require('@/assets/images/paycard/mir-bg-1200.png'),
        buttbottimg: require('@/assets/images/paycard/visa-butt-1200.png'),
      },
      {
        id: 1,
        name: 'visa',
        butttopimg: require('@/assets/images/paycard/mir-butt-1200.png'),
        cardimg: require('@/assets/images/paycard/visa-1200.png'),
        cardbgimg: require('@/assets/images/paycard/visa-bg-1200.png'),
        buttbottimg: require('@/assets/images/paycard/mc-butt-1200.png'),
      },
      {
        id: 2,
        name: 'mc',
        butttopimg: require('@/assets/images/paycard/visa-butt-1200.png'),
        cardimg: require('@/assets/images/paycard/mc-1200.png'),
        cardbgimg: require('@/assets/images/paycard/mc-bg-1200.png'),
        buttbottimg: require('@/assets/images/paycard/mc-butt-1200.png'),
      },
    ],
    // butttopimg: require('@/assets/images/paycard/new-butt-1200.png'),
    numbutttop: '2365',
    numbuttbott: '9876',
    // cardimg: require('@/assets/images/paycard/mir-1200.png'),
    buttbottimg: require('@/assets/images/paycard/visa-butt-1200.png'),
    // cardbgimg: require('@/assets/images/paycard/mir-bg-1200.png'),
    num1: '5402',
    num2: '33',
    num3: '2365',
    selected: true,
    selected1: true,
    topMove: 0,
    rightMove: 0,
    leftMove: [],
    topBg: [],
    visButtTop: [false, false, false],
    visButtBott: [true, false, false],
    moveInd: 0,
    visCardDel: false,
    textDataCard: `Данные карты вы заполняете 
    на следующем шаге. 
    В целях вашей безопасности 
    мы не храним все данные карты.
    Данные карты хранит банк, 
    мы храним только ссылку на данные карты. 
    Если вы запомните карту, в следующий раз 
    можно будет ввести только CVC`,
    openConfirmDel: false,
    direct: 'row',
    visButtLeft: false,
    visButtRight: true,
    rightNext: '',
    delta: [],
    op1: 0,
    bgDeleteLeft: 0,
    bgDeleteWidth: 0,
    deleteLeft: 0,
    changeWidth () {
      this.direct = this[SCREEN_WIDTH] >= 640 ? 'column' : 'row'
      if (this[SCREEN_WIDTH] >= 640) {
        this.delta = [0, 0, 0, 0]
        this.leftMove = [0, -128, -128, -128]
        this.topBg = [0, 0, 0, 0]
        this.op1 = 1
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
        this.leftMove = [rbutt1, 10, 10, 10] // bg
        this.topBg = [this[SCREEN_WIDTH] < 480 ? 66 : 0, -9, -9, -9]
      }
    }
  }),
  created () {
    this.$parent.$on('update', this.cardDel)
    this.$parent.$on('update1', this.updateSelectL)
    this.$parent.$on('update2', this.updateSelectR)
  },
  mounted () {
    this.changeWidth()
  },
  watch: {
    SCREEN_WIDTH () {
      this.changeWidth()
    },
/*
    empt () {
      this.empt[this.index - 1] = (this.cvc[this.index - 1].length === 3)
      alert(1)
      return
    }
*/
  },
  computed: {
    ...mapGetters([SCREEN_WIDTH]),
  },
  methods: {
    move (direct) {
      if (direct === 'Up') {
        // Up
        if (this.index < 3) {
          if (this[SCREEN_WIDTH] >= 640) {
            this.topMove -= this.topMove === 0 ? 233 : 273
            this.leftMove[this.index] -= 128
            this.leftMove[this.index + 1] += 128
            this.topBg[this.index] -= 10
            this.topBg[this.index + 1] += 10
            this.op1 = 1
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
          for (let i = 0; i < this.visButtTop.length; i++) {
            this.visButtTop[i] = false
            this.visButtBott[i] = false
          }
          this.visButtTop[this.index] = true
          this.visButtBott[this.index + 1] = true
          this.moveInd += 16
          this.index++
          // this.$store.dispatch('payments/changeCurrentNumCard', {num: this.index})
          // this.visCardDel = false
          // this.rightNext = (this.index > 0) ? '__next' : ''
          // this.visButtLeft = (this.index > 0)
          // this.visButtRight = (this.index < 3)
        }
      } else {
        // Down
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
          for (let i = 0; i < this.visButtTop.length; i++) {
            this.visButtTop[i] = false
            this.visButtBott[i] = false
          }
          this.visButtTop[this.index - 2] = true
          this.visButtBott[this.index - 1] = true
          this.moveInd -= 16
          this.index--
          // this.$store.dispatch('payments/changeCurrentNumCard', { num: this.index })
          // this.visCardDel = false
          // this.rightNext = (this.index > 0) ? '__next' : ''
          // this.visButtLeft = (this.index > 0)
          // this.visButtRight = (this.index < 3)
        }
      }
      this.$store.dispatch('payments/changeCurrentNumCard', { num: this.index })
      this.visCardDel = false
      this.rightNext = (this.index > 0) ? '__next' : ''
      this.visButtLeft = (this.index > 0)
      this.visButtRight = (this.index < 3)

      this.cvc = ['', '', '']
      this.$store.dispatch('payments/clearCVC')
      this.$emit('clearEmpty')

      // this.cvc = this.$store.getters['payments/getCVC']

      this.empty = true
      // alert(this.empty)
    },
/*
    moveDown () {
      if (this.index > 0) {
        this.empt = true
        this.cvc = ['', '', '']
        this.$store.dispatch('payments/changeCVC', { cvc: this.cvc[this.index - 1] })

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
        for (let i = 0; i < this.visButtTop.length; i++) {
          this.visButtTop[i] = false
          this.visButtBott[i] = false
        }
        this.visButtTop[this.index - 2] = true
        this.visButtBott[this.index - 1] = true
        this.moveInd -= 16
        this.index--

        this.$store.dispatch('payments/changeCurrentNumCard', { num: this.index })
        this.visCardDel = false
        this.rightNext = (this.index > 0) ? '__next' : ''
        this.visButtLeft = (this.index > 0)
        this.visButtRight = (this.index < 3)
      }
    },
*/
    delConfirm () {
      this.$emit('openDelConfirm')
      this.openConfirmDel = true
    },
    cardDel () {
      this.visCardDel = true
    },
    openRemcard () {
      this.$emit('openRemcard')
    },
    updateSelectL () {
      this.selected1 = false
    },
    updateSelectR () {
      this.selected1 = true
    },
    changeCVC () {
      // console.log(this.cvc[this.index - 1],' i->',this.index)
      // alert(this.cvc[this.index - 1].length === 3)
      // alert(this.empt[0])
      // console.log(this.cvc[this.index - 1],' i->',this.index)
      // console.log('empt->',this.empt[this.index - 1],this.empt)

      this.cvc[this.index - 1] = this.cvc[this.index - 1].replace(/\s+/g, '')
      this.empty = this.cvc[this.index - 1].length === 3
      this.$store.dispatch('payments/changeCVC', { cvc: this.cvc[this.index - 1] })
      // this.cvc1 = this.$store.getters['payments/getCVC']
    },
  }
}
