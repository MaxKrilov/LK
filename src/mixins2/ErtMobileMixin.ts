import Vue from 'vue'
import Component from 'vue-class-component'

import { BreakpointName } from '@/types/breakpoint'

@Component<InstanceType<typeof ErtMobileMixin>>({
  props: {
    mobileBreakpoint: {
      type: [Number, String],
      default () {
        return this.$ert && ('breakpoint' in this.$ert)
          ? this.$ert.breakpoint.mobileBreakpoint
          : undefined
      },
      validator: (v: any) => (
        !isNaN(Number(v)) ||
          ['xs', 'sm', 'md', 'lg', 'xl'].includes(String(v))
      )
    }
  }
})
export default class ErtMobileMixin extends Vue {
  /// Props
  readonly mobileBreakpoint!: number | BreakpointName

  /// Computed
  get isMobile (): boolean {
    const {
      mobile,
      width,
      name,
      mobileBreakpoint
    } = this.$ert.breakpoint

    console.log(mobile,
      width,
      name,
      mobileBreakpoint)

    if (mobileBreakpoint === this.mobileBreakpoint) return mobile

    const mobileWidth = parseInt(this.mobileBreakpoint, 10)
    const isNumber = !isNaN(mobileWidth)

    return isNumber
      ? width < mobileWidth
      : name === this.mobileBreakpoint
  }
}
