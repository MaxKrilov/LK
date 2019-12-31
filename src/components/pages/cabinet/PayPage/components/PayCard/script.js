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
    delta: 0,
    op1: 0,
    unit: '',
    aa: [],
    changeWidth () {
      this.direct = this[SCREEN_WIDTH] >= 640 ? 'column' : 'row'
      if (this[SCREEN_WIDTH] >= 640) {
        this.op = [1, 1, 1]
        this.delta = 0
        this.unit = 'px'
        this.leftMove1 = [0, 0, 0, 0]
        this.leftMove = [0, -128, -128, -128]
        this.topBg = [0, 0, 0, 0]
        this.topBg1 = [0, 0, 0, 0]
      } else {
        if (this[SCREEN_WIDTH] < 480) {
          this.op = [1, 1, 1]
          this.leftMove = [10, 0, 0, 0]
          this.leftMove1 = [0, 0, 0, 0] // main
          this.topBg = [66, 0, 0, 0]
          this.delta = 75
          this.unit = 'px'
        } else {
          const rbutt1 = this[SCREEN_WIDTH] * 0.76 - 480
          const rbutt2 = rbutt1 * 3.2
          this.op = [0, 0, 0]
          // this.delta = 1.5 + (this[SCREEN_WIDTH]-480)*0.066
          this.delta = this[SCREEN_WIDTH] * 0.066 - 30.18
          this.unit = '%'

          this.leftMove = [rbutt1, -426, -566, -670] // bg
          this.leftMove1 = [0, 128, 128, 0] // main
          this.elab = [0, -170, -30, 0, -200, 0, 10, -320]
          this.topBg = [0, 0, 0, 0]
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
            const ll1 = 582 - (this[SCREEN_WIDTH] - 480) * 0.38
            // const right = this.index === 0 ? ll1 : 605
            const dd = this[SCREEN_WIDTH] * 0.0307 - (this[SCREEN_WIDTH] - 480) * 0.030
            console.log(dd)
            const right = this.index === 0 ? dd : dd + 2 // 9.4
            this.rightMove -= right

            // основная
            this.leftMove0 -= 120
            this.leftMove1[this.index] -= (236 + this.elab[this.index])
            if (this.index === 0) {
              this.leftMove1[this.index + 1] -= (236 + this.elab[this.index]) // 106 236
            } else {
              this.leftMove1[this.index + 1] -= (206 + this.elab[this.index + 4])
            }
            if (this.index <= 1) {
              if (this.index === 1) this.op[1] = 1
              this.leftMove1[this.index + 2] -= (180 + this.elab[this.index])
            } else {
              this.op[2] = 1
              this.leftMove1[2] -= (180 + this.elab[this.index + 5])
            }
            this.leftMove1[this.index + 3] -= (180 + this.elab[this.index])
            this.op[0] = 1

            // bg
            this.leftMove[this.index + 1] += 252 // 252
            this.leftMove[this.index] -= 236
            this.topBg[this.index] -= 10
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
        // this.leftNext = (this.index > 0) ? '__next' : ''
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
          /*
            const ll1 = 582 - (this[SCREEN_WIDTH] - 480)*0.38
            const right = this.index === 1 ? ll1 : 605
            this.rightMove += right
          */
            this.index--
            const ll1 = 582 - (this[SCREEN_WIDTH] - 480) * 0.38
            // const right = this.index === 0 ? ll1 : 605
            const dd = this[SCREEN_WIDTH] * 0.0307 - (this[SCREEN_WIDTH] - 480) * 0.030
            const right = this.index === 0 ? dd : dd + 2
            this.rightMove += right

            // основная
            this.leftMove0 += 40
            this.leftMove1[this.index] += (236 + this.elab[this.index])
            if (this.index === 0) {
              this.op = [0, 0, 0]
              this.leftMove1[this.index + 1] += (236 + this.elab[this.index]) // 106 236
            } else {
              this.leftMove1[this.index + 1] += (206 + this.elab[this.index + 4])
            }
            if (this.index <= 1) {
              if (this.index === 1) this.op = [1, 0, 0]
              this.leftMove1[this.index + 2] += (180 + this.elab[this.index])
            } else {
              this.op = [0, 1, 0]
              this.leftMove1[2] += (180 + this.elab[this.index + 5])
            }
            this.leftMove1[this.index + 3] += (180 + this.elab[this.index])

            // bg
            this.leftMove[this.index + 1] -= 252
            this.leftMove[this.index] += 236
            this.topBg[this.index] += 10
            this.index++
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
        // this.leftNext = (this.index > 0) ? '__next' : ''
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
