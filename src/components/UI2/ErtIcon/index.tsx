import './style.scss'

import Component, { mixins } from 'vue-class-component'

import ErBindAttrs from '@/mixins2/ErBindAttrs'

import { IIconModule, IIconShadow } from '@/types'
import { keys } from '@/functions/helper2'

const props = {
  name: {
    type: String
  },
  shadow: {
    type: Object,
    default: () => ({})
  },
  left: Boolean,
  right: Boolean,
  small: Boolean
}

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof ErtIcon>>({
  props,
  watch: {
    name (val: string) {
      this.icon = require(`@/assets/icons/${val}.svg`)
    }
  }
})
class ErtIcon extends mixins(ErBindAttrs) {
  // Props
  readonly name!: string
  readonly shadow!: IIconShadow
  readonly left!: boolean
  readonly right!: boolean
  readonly small!: boolean

  icon: IIconModule | null = null

  get CSSClass () {
    return `ert-icon ert-icon--${this.name}`
  }

  get computedShadow () {
    if (
      keys(this.shadow).length === 0 ||
      !this.shadow.hasOwnProperty('color') ||
      !this.shadow.hasOwnProperty('offset') ||
      !this.shadow.hasOwnProperty('radius') ||
      !this.shadow.offset.hasOwnProperty('x') ||
      !this.shadow.offset.hasOwnProperty('y')
    ) {
      return null
    }
    return `drop-shadow(${this.shadow.offset.x} ${this.shadow.offset.y} ${this.shadow.radius} ${this.shadow.color})`
  }

  mounted () {
    this.icon = require(`@/assets/icons/${this.name}.svg`)
  }

  render () {
    if (!this.icon) return null
    return this.$createElement('i', {
      staticClass: this.CSSClass,
      class: {
        'ert-icon--left': this.left,
        'ert-icon--right': this.right,
        'ert-icon--small': this.small
      },
      attrs: { ...this.attrs$ },
      on: { ...this.listeners$ }
    }, [
      this.$createElement('svg', {
        attrs: {
          viewBox: this.icon.default.viewBox,
          style: this.computedShadow && `filter: ${this.computedShadow}`
        },
        key: this.name
      }, [
        this.$createElement('use', {
          attrs: {
            'xlink:href': this.icon.default.url,
            'xmlns:xlink': 'http://www.w3.org/1999/xlink'
          }
        })
      ])
    ])
  }
}

export { ErtIcon }
export default ErtIcon
