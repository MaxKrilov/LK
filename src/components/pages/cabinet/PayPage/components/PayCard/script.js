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
    // leftMove: [0, -128, -128, -128],
    leftMove: [],
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
    op: 0,
    opp: 0,
    opp1: 0,
    delta: 0,
    op1: 0,
    aa: [],
    // leftNext: '',
    changeWidth () {
      this.direct = this[SCREEN_WIDTH] >= 640 ? 'column' : 'row'
      if (this[SCREEN_WIDTH] >= 640) {
        this.op = 1
        this.opp = 1
        this.opp1 = 1
        this.delta = 0
        this.leftMove1 = [0, 0, 0, 0]
        this.leftMove = [0, -128, -128, -128]
        this.topBg = [0, 0, 0, 0]
      }else {
        const rbutt1 = this[SCREEN_WIDTH]*0.76 - 480
        const rbutt2 = rbutt1*3.2
        if (this[SCREEN_WIDTH] < 480) {
          this.leftMove = [10, 0, 0, 0]
          this.topBg = [66, 0, 0, 0]
          this.delta = 0
        } else {
          this.op = 0
          // this.delta = 1.5 + (this[SCREEN_WIDTH]-480)*0.066
          this.delta = this[SCREEN_WIDTH]*0.066 - 30.18
          this.leftMove = [rbutt1, -426, -566, -670] //bg
          this.leftMove1 = [0, 128, 128, 0]        //main
          this.aa = [0, -170, -30, 0, -200, 0, 10, -320]
          this.topBg = [0, 0, 0, 0]
          this.topBg1 = [0, 0, 0, 0]
        }
      }
    }
  }),
  created: function() {
    this.$parent.$on('update', this.cardDel);
  },
  mounted () {
    this.changeWidth()
  },
  watch: {
    SCREEN_WIDTH () {
      this.changeWidth()
    },
  },
  computed: {
    ...mapGetters([SCREEN_WIDTH]),
  },
  methods: {
    moveUp () {
      // console.log('01',this.leftMove1, this.index)
      if(this.index < 3) {
        if(this[SCREEN_WIDTH] >= 640) {
          const top = this.topMove === 0 ? 233 : 273
          this.topMove -= top

          this.leftMove[this.index] -= 128
          this.leftMove[this.index + 1] += 128
          this.topBg[this.index] -= 10
          this.topBg[this.index + 1] += 10

          this.op1 = 1
/*
          this.leftMove[this.index] -= 10
          this.leftMove[this.index + 1] += 10
          this.topBg[this.index] -= 66
          this.topBg[this.index + 1] += 66
*/
        }else{
          if(this[SCREEN_WIDTH] >= 480) {
            const ll1 = 582 - (this[SCREEN_WIDTH] - 480) * 0.38
            // console.log('delta',this.delta)
            // const right = this.index === 0 ? ll1 : 605
            const dd = this[SCREEN_WIDTH]*0.0307 - (this[SCREEN_WIDTH]-480)*0.030
            // console.log(dd)
            const right = this.index === 0 ? dd : dd+2
            this.rightMove -= right

            // основная
            this.leftMove1[this.index] -= (236 + this.aa[this.index])
            if (this.index === 0) {
              this.leftMove1[this.index + 1] -= (236 + this.aa[this.index]) //106 // 236
            }else{
              console.log('1',this.index, 'aa=',this.aa, this.aa[this.index+4])
              this.leftMove1[this.index + 1] -= (206 + this.aa[this.index+4])
            }
            if (this.index <= 1) {
              if (this.index === 1) this.opp = 1
              this.leftMove1[this.index + 2] -= (180 + this.aa[this.index])
            }else{
              this.opp1 = 1
              console.log('2',String(this.leftMove1[this.index + 1]),this.index, 'aa=',this.aa, this.aa[this.index+5])
              this.leftMove1[2] -= (180 + this.aa[this.index+5])
            }

            this.leftMove1[this.index + 3] -= (180 + this.aa[this.index])
            // console.log(this.index, 'aa=',this.aa, this.aa[this.index])
            // console.log('00',this.leftMove, this.index)
            this.op = 1
              // bg
            this.leftMove[this.index + 1] += 252
            this.leftMove[this.index] -= 236
            this.topBg[this.index] -= 10
            // console.log('00',this.leftMove, this.index)

            // this.topBg1[this.index] += 10
            // this.topBg1[this.index + 1] -= 10
            // console.log('01',this.leftMove1, this.index)
          } else {
            const ll1 = 394 - (this[SCREEN_WIDTH] - 320) * 0.38
            const right = this.index === 0 ? ll1 : 406
            this.rightMove -= right

            this.leftMove[this.index] -= 8
            this.leftMove[this.index + 1] += 8
            this.topBg[this.index] -= 66
            this.topBg[this.index + 1] += 66
          }
        }


        if(this[SCREEN_WIDTH] >= 480) {

        } else {
        }

        for(let i=0; i < this.visButtTop.length; i++) {
          this.visButtTop[i] = false;
          this.visButtBott[i] = false;
        }
        this.visButtTop[this.index] = true
        this.visButtBott[this.index + 1] = true
        this.moveInd += 16
        this.index ++
        this.visCardDel = false
        this.rightNext = (this.index > 0) ? '__next' : ''
        // this.leftNext = (this.index > 0) ? '__next' : ''
        this.visButtLeft = (this.index > 0) ? true : false
        this.visButtRight = (this.index < 3) ? true : false
      }
    },
    moveDown () {
      if(this.index > 0) {
        if(this[SCREEN_WIDTH] >= 640) {
          const top = this.topMove === -233 ? 233 : 273
          this.topMove += top
        } else {
          if(this[SCREEN_WIDTH] >= 480) {
            const ll1 = 582 - (this[SCREEN_WIDTH] - 480)*0.38
            const right = this.index === 1 ? ll1 : 605
            this.rightMove += right
          } else {
            const ll1 = 394 - (this[SCREEN_WIDTH] - 320) * 0.38
            const right = this.index === 1 ? ll1 : 406
            this.rightMove += right
          }

        }
        if(this[SCREEN_WIDTH] >= 480) {
          this.leftMove[this.index - 1] += 128
          this.leftMove[this.index] -= 128
          this.topBg[this.index - 1] += 10
          this.topBg[this.index] -= 10
        } else {
          this.leftMove[this.index - 1] += 8
          this.leftMove[this.index] -= 8
          this.topBg[this.index - 1] += 66
          this.topBg[this.index] -= 66

          // this.leftMove[this.index] -= 10
          // this.leftMove[this.index + 1] += 10
          // this.topBg[this.index] -= 66
          // this.topBg[this.index + 1] += 66
        }

        for(let i=0; i < this.visButtTop.length; i++) {
          this.visButtTop[i] = false;
          this.visButtBott[i] = false;
        }
        this.visButtTop[this.index - 2] = true
        this.visButtBott[this.index - 1] = true
        this.moveInd -= 16
        this.index --
        this.visCardDel = false
        this.rightNext = (this.index > 0) ? '__next' : ''
        // this.leftNext = (this.index > 0) ? '__next' : ''
        this.visButtLeft = (this.index > 0) ? true : false
        this.visButtRight = (this.index < 3) ? true : false
      }
    },
    delConfirm () {
      this.$emit('openDelConfirm')
      this.openСonfirmDel = true
    },
    cardDel () {
      this.visCardDel = true
    },
  }
}
