import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { mapState } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { BREAKPOINT_LG, BREAKPOINT_MD, BREAKPOINT_XL } from '@/constants/breakpoint'

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

  screenWidth!: number

  internalValue: boolean = this.value

  @Watch('internalValue')
  onInternalValueChange (val: boolean) {
    this.$emit('input', val)
  }

  @Watch('value')
  onValueChange (val: boolean) {
    this.internalValue = val
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
      case 'question':
        return 'question'
      case 'success':
        return 'circle_ok'
      case 'error':
        return 'cancel'
    }
  }

  closeDialog () {
    this.internalValue = false
  }

  confirmDialog () {
    this.$emit('confirm')
  }
}
