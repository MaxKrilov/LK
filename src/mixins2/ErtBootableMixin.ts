import Vue, { VNode } from 'vue'
import Component from 'vue-class-component'

const props = {
  eager: Boolean
}

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof ErtBootableMixin>>({
  props,
  watch: {
    isActive () {
      this.isBooted = true
    }
  }
})
export default class ErtBootableMixin extends Vue {
  // Options
  isActive!: boolean

  // Props
  readonly eager!: boolean

  // Data
  isBooted: boolean = false

  // Computed
  get hasContent (): boolean | undefined {
    return this.isBooted || this.eager || this.isActive
  }

  // Methods
  showLazyContent (content?: () => VNode[]): VNode[] {
    return (this.hasContent && content) ? content() : [this.$createElement()]
  }
}
