import { BREAKPOINT_SM, BREAKPOINT_MD, BREAKPOINT_LG } from '@/constants/breakpoint'
import { getScreenWidth } from '@/functions/helper'

export default {
  data: () => ({
    isXS: false,
    isSM: false,
    isMD: false,
    isLG: false
  }),
  created () {
    this.handleResize()
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleResize)
    })
  },
  destroy () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize () {
      if (getScreenWidth() < BREAKPOINT_SM) {
        this.isXS = true
        this.isSM = false
        this.isMD = false
        this.isLG = false
      } else if (getScreenWidth() < BREAKPOINT_MD) {
        this.isXS = false
        this.isSM = true
        this.isMD = false
        this.isLG = false
      } else if (getScreenWidth() < BREAKPOINT_LG) {
        this.isXS = false
        this.isSM = false
        this.isMD = true
        this.isLG = false
      } else if (getScreenWidth() >= BREAKPOINT_LG) {
        this.isXS = false
        this.isSM = false
        this.isMD = false
        this.isLG = true
      }
    }
  }
}
