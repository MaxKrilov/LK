import './_style.scss'
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component({
  props: {
    value: null,
    minValue: Number,
    maxValue: Number,
    step: {
      type: Number,
      default: 1
    },
    isShowPrevIcon: {
      type: Boolean,
      default: true
    },
    isShowAppendIcon: {
      type: Boolean,
      default: true
    }
  }
})
export default class ErNumberField extends Vue {
  internalValue = this.value === Infinity ? '∞' : this.value === -Infinity ? '-∞' : this.value

  @Watch('value')
  onChangeValue (val) {
    this.internalValue = val === Infinity
      ? '∞'
      : val === -Infinity
        ? '-∞'
        : val
  }

  onClickPrev () {
    if (this.minValue !== undefined && this.value <= this.minValue) return
    const newVal = this.value - this.step
    this.$emit('input', newVal)
  }

  onClickNext () {
    if (this.maxValue !== undefined && this.value >= this.maxValue) return
    const newVal = this.value + this.step
    this.$emit('input', newVal)
  }

  get isShowPrevIconComputed () {
    return this.isShowPrevIcon && (this.minValue !== undefined ? this.value > this.minValue : this.value > Math.max())
  }

  get isShowNextIconComputed () {
    return this.isShowAppendIcon && (this.maxValue !== undefined ? this.value < this.maxValue : this.value < Math.min())
  }
}
