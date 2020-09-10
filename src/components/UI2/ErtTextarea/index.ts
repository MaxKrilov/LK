import './style.scss'

import ErtTextField from '@/components/UI2/ErtTextField'

import Component, { mixins } from 'vue-class-component'

const props = {
  autoGrow: Boolean,
  noResize: Boolean,
  rowHeight: {
    type: [Number, String],
    default: 24,
    validator: (v: any) => !isNaN(parseFloat(v))
  },
  rows: {
    type: [Number, String],
    default: 5,
    validator: (v: any) => !isNaN(parseInt(v, 10))
  }
}

@Component<InstanceType<typeof ErtTextarea>>({
  props,
  watch: {
    lazyValue () {
      this.autoGrow && this.$nextTick(this.calculateInputHeight)
    },
    rowHeight () {
      this.autoGrow && this.$nextTick(this.calculateInputHeight)
    }
  }
})
class ErtTextarea extends mixins(ErtTextField) {
  // Options
  $refs!: typeof ErtTextField.options.$refs & {
    input: HTMLTextAreaElement
  }

  // Props
  readonly autoGrow!: boolean
  readonly noResize!: boolean
  readonly rowHeight!: number | string
  readonly rows!: number | string

  // Computed
  get classes (): object {
    return {
      'ert-textarea': true,
      'ert-textarea--auto-grow': this.autoGrow,
      'ert-textarea--no-resize': this.noResizeHandle,
      ...ErtTextField.options.computed.classes.get.call(this)
    }
  }
  get noResizeHandle (): boolean {
    return this.noResize || this.autoGrow
  }

  // Hooks
  mounted () {
    setTimeout(() => {
      this.autoGrow && this.calculateInputHeight()
    }, 0)
  }

  // Methods
  calculateInputHeight () {
    const input = this.$refs.input
    if (!input) return

    input.style.height = '0'
    const height = input.scrollHeight
    const minHeight = parseInt(this.rows, 10) * parseFloat(this.rowHeight)
    input.style.height = Math.max(minHeight, height) + 'px'
  }
  genInput () {
    const input = ErtTextField.options.methods.genInput.call(this)

    input.tag = 'textarea'
    delete input.data!.attrs!.type
    input.data!.attrs!.rows = this.rows

    return input
  }
  onInput (e: Event) {
    ErtTextField.options.methods.onInput.call(this, e)
    this.autoGrow && this.calculateInputHeight()
  }
  onKeyDown (e: KeyboardEvent) {
    if (this.isFocused && e.keyCode === 13) {
      e.stopPropagation()
    }

    this.$emit('keydown', e)
  }
}

export { ErtTextarea }
export default ErtTextarea
