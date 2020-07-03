import ErOverlayableMixin from '@/mixins/ErOverlayableMixin'
import { addClass } from '@/functions/helper'

interface Component {
  genOverlay(this: Component): void
  overlay: HTMLElement
}

export default {
  ...ErOverlayableMixin,
  name: 'wifi-analytics-user-dialog',
  methods: {
    ...ErOverlayableMixin.methods,
    genOverlay: function () {
      ErOverlayableMixin.methods.genOverlay.call(this)
      addClass(this.overlay, 'user-dialog__overlay')
    }
  } as Partial<Component>
}
