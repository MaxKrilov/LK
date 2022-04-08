import { ErtBaseSlideGroup } from '@/components/UI2/ErtSlideGroup/ErtSlideGroup'

import ErtTab from './ErtTab'

import Component from 'vue-class-component'

import { Route } from 'vue-router'
import { CreateElement, VNode } from 'vue'

type ErtTabInstance = InstanceType<typeof ErtTab>

@Component<InstanceType<typeof ErtTabsBar>>({
  provide () {
    return {
      tabsBar: this
    }
  },
  watch: {
    items: 'callSlider',
    internalValue: 'callSlider',
    $route: 'onRouteChange'
  }
})
export default class ErtTabsBar extends ErtBaseSlideGroup {
  /// Computed
  get classes () {
    return {
      ...ErtBaseSlideGroup.options.computed.classes.get.call(this),
      'ert-tabs-bar': true,
      'ert-tabs-bar--is-mobile': this.isMobile,
      'ert-tabs-bar--show-arrows': this.showArrows
    }
  }

  /// Methods
  callSlider () {
    this.$emit('call:slider')
  }

  genContent () {
    const render = ErtBaseSlideGroup.options.methods.genContent.call(this)

    render.data = render.data || {}
    render.data.staticClass += ' ert-tabs-bar__content'

    return render
  }

  onRouteChange (val: Route, oldVal: Route) {
    if (this.mandatory) return

    const items = this.items as unknown as ErtTabInstance[]
    const newPath = val.path
    const oldPath = oldVal.path

    let hasNew = false
    let hasOld = false

    for (const item of items) {
      if (item.to === oldPath) hasOld = true
      else if (item.to === newPath) hasNew = true

      if (hasNew && hasOld) break
    }

    if (!hasNew && hasOld) this.internalValue = undefined
  }

  /// Hooks
  render (h: CreateElement): VNode {
    const render = ErtBaseSlideGroup.options.render.call(this, h)

    render.data!.attrs = {
      role: 'tablist'
    }

    return render
  }
}
