import Vue from 'vue'
import Component from 'vue-class-component'
import { BREAKPOINT_SM, BREAKPOINT_MD, BREAKPOINT_LG, BREAKPOINT_XL } from '@/constants/breakpoint'
import { getScreenWidth } from '@/functions/helper'

@Component
export default class ErtResponsiveMixin extends Vue {
  // Data
  isXS: boolean = false
  isSM: boolean = false
  isMD: boolean = false
  isLG: boolean = false
  isXL: boolean = false

  // Hooks
  created () {
    this.handleResize()
  }

  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleResize)
    })
  }

  destroy () {
    window.removeEventListener('resize', this.handleResize)
  }

  // Methods
  handleResize () {
    if (getScreenWidth() < BREAKPOINT_SM) {
      this.isXS = true
      this.isSM = false
      this.isMD = false
      this.isLG = false
      this.isXL = false
    } else if (getScreenWidth() < BREAKPOINT_MD) {
      this.isXS = false
      this.isSM = true
      this.isMD = false
      this.isLG = false
      this.isXL = false
    } else if (getScreenWidth() < BREAKPOINT_LG) {
      this.isXS = false
      this.isSM = false
      this.isMD = true
      this.isLG = false
      this.isXL = false
    } else if (getScreenWidth() < BREAKPOINT_LG) {
      this.isXS = false
      this.isSM = false
      this.isMD = false
      this.isLG = true
      this.isXL = false
    } else if (getScreenWidth() < BREAKPOINT_XL) {
      this.isXS = false
      this.isSM = false
      this.isMD = false
      this.isLG = false
      this.isXL = true
    }
  }
}
