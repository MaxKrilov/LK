import { factory as GroupableFactory } from '@/mixins2/ErtGroupableMixin'
import ErtRoutableMixin from '@/mixins2/ErtRoutableMixin'

import { keyCode as keyCodes } from '@/functions/keyCode'

import Component, { mixins } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { VNode } from 'vue/types'

import ErtTabsBar from './ErtTabsBar'
import { CreateElement } from 'vue'

const baseMixins = mixins(
  ErtRoutableMixin,
  GroupableFactory('tabsBar')
)

type ErtTabBarInstance = InstanceType<typeof ErtTabsBar>

@Component<InstanceType<typeof ErtTab>>({})
export default class ErtTab extends baseMixins {
  /// Options
  $el!: HTMLElement
  tabsBar!: ErtTabBarInstance

  /// Props
  @Prop({ type: [Boolean, Object], default: true })
  readonly ripple!: boolean | any

  /// Data
  proxyClass: string = 'ert-tab--active'

  /// Computed
  get classes (): object {
    return {
      'ert-tab': true,
      ...ErtRoutableMixin.options.computed.classes.get.call(this),
      'ert-tab--disabled': this.disabled,
      ...this.groupClasses
    }
  }

  get value (): any {
    let to = this.to || this.href

    if (to == null) return to

    if (this.$router &&
      this.to === Object(this.to)
    ) {
      const resolve = this.$router.resolve(
        this.to,
        this.$route,
        this.append
      )

      to = resolve.href
    }

    return to.replace('#', '')
  }

  /// Methods
  click (e: KeyboardEvent | MouseEvent): void {
    if (this.disabled) {
      e.preventDefault()
      return
    }

    if (this.href &&
      this.href.indexOf('#') > -1
    ) e.preventDefault()

    if (e.detail) this.$el.blur()

    this.$emit('click', e)

    this.to || this.toggle()
  }

  toggle () {
    if (!this.isActive || (!this.tabsBar.mandatory && !this.to)) {
      this.$emit('change')
    }
  }

  /// Hooks
  render (h: CreateElement): VNode {
    const { tag, data } = this.generateRouteLink()

    data.attrs = {
      ...data.attrs,
      'aria-selected': String(this.isActive),
      role: 'tab',
      tabindex: this.disabled ? -1 : 0
    }
    data.on = {
      ...data.on,
      keydown: (e: KeyboardEvent) => {
        if (e.keyCode === keyCodes.DOM_VK_ENTER) this.click(e)

        this.$emit('keydown', e)
      }
    }

    return h(tag, data, this.$slots.default)
  }
}
