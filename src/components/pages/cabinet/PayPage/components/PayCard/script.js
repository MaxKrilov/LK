import { mapGetters } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'

export default {
  name: 'pay-card',
  data: () => ({
    pre: 'pay-card',
    selected: true,
    selected1: true,
    index: 0,
    topMove: 0,
    rightMove: 0,
    leftMove: [],
    leftMove0: 0,
    leftMove1: [],
    topBg: [],
    topBg1: [],
    visButtTop: [false, false, false],
    visButtBott: [true, false, false],
    moveInd: 0,
    cvc: '',
    visCardDel: false,
    openСonfirmDel: false,
    direct: 'row',
    visButtLeft: false,
    visButtRight: true,
    rightNext: '',
    op: [],
    delta1: 0,
    delta: [],
    op1: 0,
    unit: '',
    aa: [],
    changeWidth () {
      this.direct = this[SCREEN_WIDTH] >= 640 ? 'column' : 'row'
      if (this[SCREEN_WIDTH] >= 640) {
        this.op = [1, 1, 1]
        this.delta = [0, 0, 0, 0]
        this.unit = 'px'
        // this.leftMove1 = [0, 0, 0, 0]
        this.leftMove = [0, -428, -228, -228]
        this.topBg = [0, 0, 0, 0]
        this.topBg1 = [0, 0, 0, 0]
      } else {
        if (this[SCREEN_WIDTH] < 480) {
          this.op = [1, 1, 1]
          this.leftMove = [10, 0, 0, 0]
          this.leftMove1 = [0, 0, 0, 0] // main
          this.topBg = [66, 0, 0, 0]
          this.delta = [0, 0, 0, 0]
          this.unit = 'px'
        } else {
          const rbutt1 = this[SCREEN_WIDTH] * 0.76 - 264
          this.op = [0, 0, 0]
          this.delta1 = this[SCREEN_WIDTH] -(24 + 256 + 65)
          this.delta = [this.delta1, 0, 0, 0]
          this.leftMove = [rbutt1, 0, 0, 0] // bg
          this.topBg = [0, -9, -9, -9]
          this.topBg1 = [0, 0, 0, 0]
        }
      }
    }
  }),
  created () {
    this.$parent.$on('update', this.cardDel)
  },
  mounted () {
    this.changeWidth()
  },
  watch: {
    SCREEN_WIDTH () {
      this.changeWidth()
    }
  },
  computed: {
    ...mapGetters([SCREEN_WIDTH])
  },
  methods: {
    moveUp () {
      if (this.index < 3) {
        if (this[SCREEN_WIDTH] >= 640) {
          const top = this.topMove === 0 ? 233 : 273
          this.topMove -= top

          this.leftMove[this.index] -= 128
          this.leftMove[this.index + 1] += 128
          this.topBg[this.index] -= 10
          this.topBg[this.index + 1] += 10

          this.op1 = 1
        } else {
          if (this[SCREEN_WIDTH] >= 480) {
            const ll1 = 256 - (this[SCREEN_WIDTH]*0.15 - 72)
            const ll2 = 280 + (this[SCREEN_WIDTH] - 480)*0.1
            const right = this.index === 0 ? ll1 : ll2
            this.rightMove -= right
            this.delta1 = this[SCREEN_WIDTH]*0.6 - 137
            this.delta[this.index] = this[SCREEN_WIDTH]*0.1 - 24 //40
            this.delta[this.index + 1] = this.delta1

            // bg
            const bg1 = 128 + (this[SCREEN_WIDTH] - 480)*0.49
            this.leftMove[this.index + 1] += bg1 //128 //216
            this.leftMove[this.index] -= 236
            this.topBg[this.index] -= 16
            this.topBg[this.index + 1] += 16

          } else {
            const ll1 = 398 - (this[SCREEN_WIDTH] - 320) * 0.38
            const right = this.index === 0 ? ll1 : 406
            this.rightMove -= right

            this.leftMove[this.index] -= 8
            this.leftMove[this.index + 1] += 8
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
        this.visCardDel = false
        this.rightNext = (this.index > 0) ? '__next' : ''
        this.visButtLeft = (this.index > 0)
        this.visButtRight = (this.index < 3)
      }
    },
    moveDown () {
      if (this.index > 0) {
        if (this[SCREEN_WIDTH] >= 640) {
          const top = this.topMove === -233 ? 233 : 273
          this.topMove += top
          this.leftMove[this.index - 1] += 128
          this.leftMove[this.index] -= 128
          this.topBg[this.index - 1] += 10
          this.topBg[this.index] -= 10
        } else {
          if (this[SCREEN_WIDTH] >= 480) {
            const ll1 = 256 - (this[SCREEN_WIDTH]*0.15 - 72)
            const ll2 = 280 + (this[SCREEN_WIDTH] - 480)*0.1
            const right = this.index === 1 ? ll1 : ll2
            this.rightMove += right
            this.delta1 = this[SCREEN_WIDTH]*0.6 - 137
            if (this.index === 1) this.delta1 = this[SCREEN_WIDTH] -(24 + 256 + 65)
            this.delta[this.index - 1] = this.delta1
            this.delta[this.index] = 0

            // bg
            let bg1 = 128 + (this[SCREEN_WIDTH] - 480)*0.49
            if (this.index === 1) bg1 = this[SCREEN_WIDTH] * 0.76 - 264
            this.leftMove[this.index-1] = bg1 //128 //216
            this.leftMove[this.index] = 0 //236
            this.topBg[this.index - 1] += 16
            this.topBg[this.index] -= 16
          } else {
            const ll1 = 398 - (this[SCREEN_WIDTH] - 320) * 0.38
            const right = this.index === 1 ? ll1 : 406
            this.rightMove += right

            this.leftMove[this.index - 1] += 8
            this.leftMove[this.index] -= 8
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
        this.visCardDel = false
        this.rightNext = (this.index > 0) ? '__next' : ''
        this.visButtLeft = (this.index > 0)
        this.visButtRight = (this.index < 3)
      }
    },
    delConfirm () {
      this.$emit('openDelConfirm')
      this.openСonfirmDel = true
    },
    cardDel () {
      this.visCardDel = true
    }
  }
}
