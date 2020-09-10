import Vue from 'vue'
import Component from 'vue-class-component'

const props = {
  large: Boolean,
  small: Boolean,
  xLarge: Boolean,
  xSmall: Boolean
}

@Component({ props })
export default class ErtSizeableMixin extends Vue {
  // Props
  readonly large!: boolean
  readonly small!: boolean
  readonly xLarge!: boolean
  readonly xSmall!: boolean

  // Computed
  get medium (): boolean {
    return Boolean(
      !this.xSmall &&
      !this.small &&
      !this.large &&
      !this.xLarge
    )
  }
  get sizeableClasses (): object {
    return {
      'ert-size--x-small': this.xSmall,
      'ert-size--small': this.small,
      'ert-size--default': this.medium,
      'ert-size--large': this.large,
      'ert-size--x-large': this.xLarge
    }
  }
}
