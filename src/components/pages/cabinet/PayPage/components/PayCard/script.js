export default {
  name: 'pay-card',
  data: () => ({
    pre: 'pay-card',
    selected: true,
    index: 0,
    topMove: 0,
    leftMove: [0, -128, -128, -128],
    topBg: [0, -10, -10, -10],
    visButtTop: [false, false, false],
    visButtBott: [true, false, false],
    moveInd: 0,
    cvc: ''
  }),
  methods: {
    moveUp () {
      if(this.index < 3) {
        const top = this.topMove === 0 ? 233 : 273
        this.topMove -= top
        this.leftMove[this.index] -= 128
        this.leftMove[this.index + 1] += 128
        this.topBg[this.index] -= 10
        this.topBg[this.index + 1] += 10
        for(let i=0; i < this.visButtTop.length; i++) {
          this.visButtTop[i] = false;
          this.visButtBott[i] = false;
        }
        this.visButtTop[this.index] = true
        this.visButtBott[this.index + 1] = true
        this.moveInd += 16

        this.index ++
      }
    },
    moveDown () {
      if(this.index > 0) {
        const top = this.topMove === -233 ? 233 : 273
        this.topMove += top
        this.leftMove[this.index - 1] += 128
        this.leftMove[this.index] -= 128
        this.topBg[this.index - 1] += 10
        this.topBg[this.index] -= 10
        for(let i=0; i < this.visButtTop.length; i++) {
          this.visButtTop[i] = false;
          this.visButtBott[i] = false;
        }
        this.visButtTop[this.index - 2] = true
        this.visButtBott[this.index - 1] = true
        this.moveInd -= 16
        this.index --
      }
    }
  }
}
