import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { mapState } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { BREAKPOINT_LG, BREAKPOINT_MD, BREAKPOINT_XL } from '@/constants/breakpoint'
import { OFFER_LINKS } from '@/constants/url'

@Component({
  computed: {
    ...mapState({
      screenWidth: (state: any) => state.variables[SCREEN_WIDTH]
    })
  }
})
export default class ErActivationModal extends Vue {
  @Prop(String) readonly type!: string
  @Prop(String) readonly title!: string
  @Prop({ type: Boolean, default: true }) readonly isShowCancelButton!: boolean
  @Prop({ type: String, default: 'Отмена' }) readonly cancelButtonText!: string
  @Prop({ type: Boolean, default: true }) readonly isShowActionButton!: boolean
  @Prop(String) readonly actionButtonText!: string | undefined
  @Prop({ type: Boolean }) readonly value!: boolean
  @Prop(Boolean) readonly isLoadingConfirm!: boolean
  @Prop({ type: Boolean, default: true }) readonly isNotThreeDays!: boolean
  @Prop(Boolean) readonly persistent!: boolean
  @Prop(Boolean) readonly disabledActionButton!: boolean
  @Prop({ type: String, default: '' }) readonly isOffer!: string
  @Prop(String) readonly contentClass!: string

  @Prop({ type: String })
  readonly analyticConfirmCategory!: string

  @Prop({ type: String })
  readonly analyticConfirmLabel!: string

  @Prop({ type: String })
  readonly analyticCancelCategory!: string

  @Prop({ type: String })
  readonly analyticCancelLabel!: string

  @Prop({ type: String })
  readonly analyticCloseCategory!: string

  @Prop({ type: String })
  readonly analyticCloseLabel!: string

  @Prop({ type: String })
  readonly analyticAcceptCategory!: string

  @Prop({ type: String })
  readonly analyticAcceptLabel!: string

  @Prop({ type: String })
  readonly analyticOfferCategory!: string

  @Prop({ type: String })
  readonly analyticOfferLabel!: string

  screenWidth!: number

  isAcceptOffer: boolean = false
  internalValue: boolean = this.value

  @Watch('internalValue')
  onInternalValueChange (val: boolean) {
    if (!val) {
      this.isAcceptOffer = false
    }
    this.$emit('input', val)
  }

  @Watch('value')
  onValueChange (val: boolean) {
    this.internalValue = val
  }

  get isDisabledActionButton () {
    return this.offerLink ? !this.isAcceptOffer : this.disabledActionButton
  }
  get offerLink () {
    return OFFER_LINKS?.[this.isOffer]
  }
  get getMaxWidth () {
    return this.screenWidth >= BREAKPOINT_XL
      ? 470
      : this.screenWidth >= BREAKPOINT_LG
        ? 436
        : this.screenWidth >= BREAKPOINT_MD
          ? 390
          : null
  }

  get getIconByType () {
    switch (this.type) {
      case 'info':
        return 'info'
      case 'question':
        return 'question'
      case 'success':
        return 'circle_ok'
      case 'error':
        return 'cancel'
    }
  }

  closeDialog () {
    this.isAcceptOffer = false
    this.$emit('close')
    this.internalValue = false
  }

  confirmDialog () {
    this.$emit('confirm')
  }
}
