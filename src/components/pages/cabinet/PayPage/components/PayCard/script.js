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
    topBg: [],
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
    // leftNext: '',
    changeWidth () {
      this.direct = this[SCREEN_WIDTH] >= 640 ? 'column' : 'row'
      if (this[SCREEN_WIDTH] < 480) {
        this.leftMove = [10, 0, 0, 0]
        this.topBg = [66, 0, 0, 0]
      } else {
        this.leftMove = [0, -128, -128, -128]
        this.topBg = [0, -10, -10, -10]
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
      if(this.index < 3) {
        if(this[SCREEN_WIDTH] >= 640) {
          const top = this.topMove === 0 ? 233 : 273
          this.topMove -= top
        }else{
          if(this[SCREEN_WIDTH] >= 480) {
            const ll1 = 582 - (this[SCREEN_WIDTH] - 480) * 0.38
            const right = this.index === 0 ? ll1 : 605
            this.rightMove -= right
          } else {
            const ll1 = 394 - (this[SCREEN_WIDTH] - 320) * 0.38
            const right = this.index === 0 ? ll1 : 406
            this.rightMove -= right
          }
        }

        if(this[SCREEN_WIDTH] >= 480) {
          this.leftMove[this.index] -= 128
          this.leftMove[this.index + 1] += 128
          this.topBg[this.index] -= 10
          this.topBg[this.index + 1] += 10
        } else {
          this.leftMove[this.index] -= 10
          this.leftMove[this.index + 1] += 10
          this.topBg[this.index] -= 66
          this.topBg[this.index + 1] += 66
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
          this.leftMove[this.index - 1] += 10
          this.leftMove[this.index] -= 10
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
