import Vue from 'vue'
import { VNodeData } from 'vue/types/vnode'
import { isCssColor } from '@/utils/colorUtils'

import Component from 'vue-class-component'

@Component({
  props: {
    color: String
  }
})
export default class ErtColorableMixin extends Vue {
  // Props
  readonly color!: string

  // Methods
  setBackgroundColor (color?: string | false, data: VNodeData = {}): VNodeData {
    if (typeof data.style === 'string') {
      console.error('style must be an object', this)
      return data
    }
    if (typeof data.class === 'string') {
      console.error('class must be an object', this)
      return data
    }
    if (isCssColor(color)) {
      data.style = {
        ...data.style as object,
        'background-color': `${color}`,
        'border-color': `${color}`
      }
    } else if (color) {
      data.class = {
        ...data.class,
        [color]: true
      }
    }

    return data
  }

  setTextColor (color?: string | false, data: VNodeData = {}): VNodeData {
    if (typeof data.style === 'string') {
      console.error('style must be an object', this)
      return data
    }
    if (typeof data.class === 'string') {
      console.error('class must be an object', this)
      return data
    }
    if (isCssColor(color)) {
      data.style = {
        ...data.style as object,
        color: `${color}`,
        'caret-color': `${color}`
      }
    } else if (color) {
      const [colorName, colorModifier] = color.toString().trim().split(' ', 2) as (string | undefined)[]
      data.class = {
        ...data.class,
        [colorName + '--text']: true
      }
      if (colorModifier) {
        data.class['text--' + colorModifier] = true
      }
    }
    return data
  }
}
