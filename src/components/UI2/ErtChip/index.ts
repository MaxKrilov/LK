import './style.scss'

import { CreateElement, VNode } from 'vue'
import Component, { mixins } from 'vue-class-component'

import { ErtExpandXTransition } from '@/functions/transitions'
import ErtIcon from '../ErtIcon'

import { factory as GroupableFactory } from '@/mixins2/ErtGroupableMixin'
import { factory as Toggleablefactory } from '@/mixins2/ErtToggleableMixin'
import ErtRoutableMixin from '@/mixins2/ErtRoutableMixin'
import ErtSizeableMixin from '@/mixins2/ErtSizeableMixin'

const baseMixins = mixins(
  ErtSizeableMixin,
  ErtRoutableMixin,
  GroupableFactory('chipGroup'),
  Toggleablefactory('inputValue')
)

const props = {
  active: {
    type: Boolean,
    default: true
  },
  close: Boolean,
  closeIcon: {
    type: String,
    default: 'close'
  },
  disabled: Boolean,
  draggable: Boolean,
  filter: Boolean,
  filterIcon: {
    type: String,
    default: 'ok'
  },
  label: Boolean,
  link: Boolean,
  outlined: Boolean,
  pill: Boolean,
  tag: {
    type: String,
    default: 'span'
  },
  value: {
    required: false
  }
}

@Component<InstanceType<typeof ErtChip>>({
  props: {
    ...props,
    activeClass: {
      type: String,
      default (): string | undefined {
        if (!this.chipGroup) return ''

        return (this.chipGroup as any).activeClass
      }
    }
  }
})
class ErtChip extends baseMixins {
  // Props
  readonly active!: boolean
  readonly activeClass!: string
  readonly close!: boolean
  readonly closeIcon!: string
  readonly disabled!: boolean
  readonly draggable!: boolean
  readonly filter!: boolean
  readonly filterIcon!: string
  readonly label!: boolean
  readonly link!: boolean
  readonly outlined!: boolean
  readonly pill!: boolean
  readonly tag!: string
  readonly value!: any

  // Data
  proxyClass: string = 'ert-chip--active'

  // Computed
  get classes (): object {
    return {
      'ert-chip': true,
      ...ErtRoutableMixin.options.computed.classes.get.call(this),
      'ert-chip--clickable': this.isClickable,
      'ert-chip--disabled': this.disabled,
      'ert-chip--draggable': this.draggable,
      'ert-chip--label': this.label,
      'ert-chip--link': this.isLink,
      'ert-chip--outlined': this.outlined,
      'ert-chip--pill': this.pill,
      'ert-chip--removable': this.hasClose,
      ...this.sizeableClasses,
      ...this.groupClasses
    }
  }
  get hasClose (): boolean {
    return Boolean(this.close)
  }
  get isClickable (): boolean {
    return Boolean(
      ErtRoutableMixin.options.computed.isClickable.get.call(this) ||
      this.chipGroup
    )
  }

  // Methods
  click (e: MouseEvent): void {
    this.$emit('click', e)

    this.chipGroup && this.toggle()
  }
  genFilter (): VNode {
    const children = []

    if (this.isActive) {
      children.push(
        this.$createElement(ErtIcon, {
          staticClass: 'ert-chip__filter',
          props: { name: this.filterIcon, left: true }
        })
      )
    }

    return this.$createElement(ErtExpandXTransition, children)
  }
  genClose (): VNode {
    return this.$createElement(ErtIcon, {
      staticClass: 'ert-chip__close',
      props: {
        name: this.closeIcon,
        right: true
      },
      on: {
        click: (e: Event) => {
          e.stopPropagation()
          e.preventDefault()

          this.$emit('click:close')
          this.$emit('update:active', false)
        }
      }
    })
  }
  genContent (): VNode {
    return this.$createElement('span', {
      staticClass: 'ert-chip__content'
    }, [
      this.filter && this.genFilter(),
      this.$slots.default,
      this.hasClose && this.genClose()
    ])
  }

  render (h: CreateElement): VNode {
    const children = [this.genContent()]
    let { tag, data } = this.generateRouteLink()

    data.attrs = {
      ...data.attrs,
      draggable: this.draggable ? 'true' : undefined,
      tabindex: this.chipGroup && !this.disabled ? 0 : data.attrs!.tabindex
    }
    data.directives!.push({
      name: 'show',
      value: this.active
    })

    return h(tag, data, children)
  }
}

export { ErtChip }
export default ErtChip
