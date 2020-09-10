import Vue from 'vue'
import Component from 'vue-class-component'

const props = {
  openDelay: {
    type: [Number, String],
    default: 0
  },
  closeDelay: {
    type: [Number, String],
    default: 0
  }
}

@Component({ props })
export default class ErtDelaybleMixin extends Vue {
  // Options
  isActive!: boolean

  // Props
  readonly openDelay!: number | string
  readonly closeDelay!: number | string

  // Data
  openTimeout: number | undefined = undefined
  closeTimeout: number | undefined = undefined

  // Methods
  clearDelay (): void {
    clearTimeout(this.openTimeout)
    clearTimeout(this.closeTimeout)
  }

  runDelay (type: 'open' | 'close', cb?: () => void): void {
    this.clearDelay()

    const delay = parseInt((this as any)[`${type}Delay`], 10)

    ;(this as any)[`${type}Timeout`] = setTimeout(cb || (() => {
      this.isActive = { open: true, close: false }[type]
    }), delay)
  }
}
