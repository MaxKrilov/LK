import Vue from 'vue'
import Component from 'vue-class-component'

import { Prop } from 'vue-property-decorator'

const MAX_DIALOG_WIDTH = 449

const LIST_DIALOG_TYPE = ['warning', 'question', 'success', 'error']

@Component<InstanceType<typeof ErtActivationModal>>({
})
export default class ErtActivationModal extends Vue {
  /// Props
  @Prop({ type: String, default: 'Отмена' })
  readonly cancelButtonText!: string

  @Prop({ type: String })
  readonly confirmButtonText!: string

  @Prop({ type: Boolean })
  readonly isLoadingConfirmButton!: boolean

  @Prop({ type: Boolean })
  readonly isShowCancelButton!: boolean

  @Prop({ type: Boolean, default: true })
  readonly isShowMessageBlock!: boolean

  @Prop({ type: Boolean, default: true })
  readonly isShowMessageBlockIcon!: boolean

  @Prop({ type: [String, Number] })
  readonly maxWidth!: string | number

  @Prop({ type: String })
  readonly title!: string

  @Prop({ type: String, default: 'success', validator: (val: string) => LIST_DIALOG_TYPE.includes(val) })
  readonly type!: string

  @Prop({ required: false })
  readonly value!: any

  /// Proxy
  get internalValue () {
    return this.value
  }

  set internalValue (val) {
    this.$emit('input', val)
  }

  /// Computed
  get computedMaxWidth () {
    if (this.maxWidth) return this.maxWidth

    return MAX_DIALOG_WIDTH
  }

  get computedIcon () {
    switch (this.type) {
      case 'warning':
        return 'warning'
      case 'question':
        return 'question'
      case 'success':
        return 'ok_round'
      case 'error':
        return 'cancel'
      default:
        return 'ok_round'
    }
  }

  /// Methods
  onCloseHandler () {
    this.internalValue = false
    this.$emit('close')
  }

  onClickConfirmHandler () {
    this.$emit('confirm')
  }

  onCancelHandler () {
    this.onCloseHandler()
    this.$emit('cancel')
  }
}
