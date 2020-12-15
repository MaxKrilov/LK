import Vue from 'vue'
import Component from 'vue-class-component'

import { convertToUnit } from '@/functions/helper2'

export type NumberOrNumberString = string | number | undefined

@Component<InstanceType<typeof ErtMeasurableMixin>>({
  props: {
    height: [Number, String],
    maxHeight: [Number, String],
    maxWidth: [Number, String],
    minHeight: [Number, String],
    minWidth: [Number, String],
    width: [Number, String]
  }
})
export default class ErtMeasurableMixin extends Vue {
  // Props
  readonly height!: NumberOrNumberString
  readonly maxHeight!: NumberOrNumberString
  readonly maxWidth!: NumberOrNumberString
  readonly minHeight!: NumberOrNumberString
  readonly minWidth!: NumberOrNumberString
  readonly width!: NumberOrNumberString

  // Computed
  get measurableStyles (): object {
    const styles: Record<string, string> = {}

    const height = convertToUnit(this.height)
    const minHeight = convertToUnit(this.minHeight)
    const minWidth = convertToUnit(this.minWidth)
    const maxHeight = convertToUnit(this.maxHeight)
    const maxWidth = convertToUnit(this.maxWidth)
    const width = convertToUnit(this.width)

    if (height) styles.height = height
    if (minHeight) styles.minHeight = minHeight
    if (minWidth) styles.minWidth = minWidth
    if (maxHeight) styles.maxHeight = maxHeight
    if (maxWidth) styles.maxWidth = maxWidth
    if (width) styles.width = width

    return styles
  }
}
