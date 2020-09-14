import './style.scss'

import Component, { mixins } from 'vue-class-component'
import { VNode, VNodeDirective, VNodeData, CreateElement } from 'vue'

import ErtActivatableMixin from '@/mixins2/ErtActivatableMixin'
import ErtDelayableMixin from '@/mixins2/ErtDelaybleMixin'
import ErtDependentMixin from '@/mixins2/ErtDependentMixin'
import ErtDetachableMixin from '@/mixins2/ErtDetachableMixin'
import ErtMenuableMixin from '@/mixins2/ErtMenuableMixin'
import ErtReturnableMixin from '@/mixins2/ErtReturnableMixin'
import ErtRoundableMixin from '@/mixins2/ErtRoundableMixin'
import ErtToggleableMixin from '@/mixins2/ErtToggleableMixin'

import ClickOutside from '@/directives2/click-outside'
import Resize from '@/directives/resize'

import { convertToUnit } from '@/functions/helper2'
import { keyCode as keyCodes } from '@/functions/keyCode'

const baseMixins = mixins<
  InstanceType<typeof ErtDependentMixin> &
  InstanceType<typeof ErtDelayableMixin> &
  InstanceType<typeof ErtDetachableMixin> &
  InstanceType<typeof ErtMenuableMixin> &
  InstanceType<typeof ErtReturnableMixin> &
  InstanceType<typeof ErtRoundableMixin> &
  InstanceType<typeof ErtToggleableMixin>
  >(
    ErtDependentMixin,
    ErtDelayableMixin,
    ErtDetachableMixin,
    ErtMenuableMixin,
    ErtReturnableMixin,
    ErtRoundableMixin,
    ErtToggleableMixin
  )

const directives = { ClickOutside, Resize }

const props = {
  auto: Boolean,
  closeOnClick: {
    type: Boolean,
    default: true
  },
  closeOnContentClick: {
    type: Boolean,
    default: true
  },
  disabled: Boolean,
  disableKeys: Boolean,
  maxHeight: {
    type: [Number, String],
    default: 'auto'
  },
  offsetX: Boolean,
  offsetY: Boolean,
  openOnClick: {
    type: Boolean,
    default: true
  },
  openOnHover: Boolean,
  origin: {
    type: String,
    default: 'top left'
  },
  transition: {
    type: [Boolean, String],
    default: 'menu-transition'
  }
}

@Component<InstanceType<typeof ErtMenu>>({
  provide (): object {
    return { isInMenu: true }
  },
  directives,
  props,
  watch: {
    isActive (val) {
      if (!val) this.listIndex = -1
    },
    isContentActive (val) {
      this.hasJustFocused = val
    },
    listIndex (next, prev) {
      if (next in this.tiles) {
        const tile = this.tiles[next]
        tile.classList.add('ert-list-item--highlighted')
        this.$refs.content.scrollTop = tile.offsetTop - tile.clientHeight
      }

      prev in this.tiles &&
      this.tiles[prev].classList.remove('ert-list-item--highlighted')
    }
  }
})
class ErtMenu extends baseMixins {
  // Props
  readonly auto!: boolean
  readonly closeOnClick!: boolean
  readonly closeOnContentClick!: boolean
  readonly disabled!: boolean
  readonly disableKeys!: boolean
  readonly maxHeight!: number | string
  readonly offsetX!: boolean
  readonly offsetY!: boolean
  readonly openOnClick!: boolean
  readonly openOnHover!: boolean
  readonly origin!: string
  readonly transition!: boolean | string

  // Data
  calculatedTopAuto: number = 0
  defaultOffset: number = 8
  hasJustFocused: boolean = false
  listIndex: number = -1
  resizeTimeout: number = 0
  selectedIndex: null | number = null
  tiles: HTMLElement[] = []

  // Computed
  get activeTile (): HTMLElement | undefined {
    return this.tiles[this.listIndex]
  }
  get calculatedLeft (): string {
    const menuWidth = Math.max(this.dimensions.content.width, parseFloat(this.calculatedMinWidth))

    if (!this.auto) return this.calcLeft(menuWidth) || '0'

    return convertToUnit(this.calcXOverflow(this.calcLeftAuto(), menuWidth)) || '0'
  }
  get calculatedMaxHeight (): string {
    const height = this.auto
      ? '200px'
      : convertToUnit(this.maxHeight)

    return height || '0'
  }
  get calculatedMaxWidth (): string {
    return convertToUnit(this.maxWidth) || '0'
  }
  get calculatedMinWidth (): string {
    if (this.minWidth) {
      return convertToUnit(this.minWidth) || '0'
    }

    const minWidth = Math.min(
      this.dimensions.activator.width +
      Number(this.nudgeWidth) +
      (this.auto ? 16 : 0),
      Math.max(this.pageWidth - 24, 0)
    )

    const calculatedMaxWidth = isNaN(parseInt(this.calculatedMaxWidth))
      ? minWidth
      : parseInt(this.calculatedMaxWidth)

    return convertToUnit(Math.min(
      calculatedMaxWidth,
      minWidth
    )) || '0'
  }
  get calculatedTop (): string {
    const top = !this.auto
      ? this.calcTop()
      : convertToUnit(this.calcYOverflow(this.calculatedTopAuto))

    return top || '0'
  }
  get hasClickableTiles (): boolean {
    return Boolean(this.tiles.find(tile => tile.tabIndex > -1))
  }
  get styles (): object {
    return {
      maxHeight: this.calculatedMaxHeight,
      minWidth: this.calculatedMinWidth,
      maxWidth: this.calculatedMaxWidth,
      top: this.calculatedTop,
      left: this.calculatedLeft,
      transformOrigin: this.origin,
      zIndex: this.zIndex || this.activeZIndex
    }
  }

  // Methods
  activate () {
    this.updateDimensions()
    requestAnimationFrame(() => {
      this.startTransition().then(() => {
        if (this.$refs.content) {
          this.calculatedTopAuto = this.calcTopAuto()
          this.auto && (this.$refs.content.scrollTop = this.calcScrollPosition())
        }
      })
    })
  }
  calcScrollPosition () {
    const $el = this.$refs.content
    const activeTile = $el.querySelector('.ert-list-item--active') as HTMLElement
    const maxScrollTop = $el.scrollHeight - $el.offsetHeight

    return activeTile
      ? Math.min(maxScrollTop, Math.max(0, activeTile.offsetTop - $el.offsetHeight / 2 + activeTile.offsetHeight / 2))
      : $el.scrollTop
  }
  calcLeftAuto () {
    return parseInt(this.dimensions.activator.left - this.defaultOffset * 2)
  }
  calcTopAuto () {
    const $el = this.$refs.content
    const activeTile = $el.querySelector('.ert-list-item--active') as HTMLElement | null

    if (!activeTile) {
      this.selectedIndex = null
    }

    if (this.offsetY || !activeTile) {
      return this.computedTop
    }

    this.selectedIndex = Array.from(this.tiles).indexOf(activeTile)

    const tileDistanceFromMenuTop = activeTile.offsetTop - this.calcScrollPosition()
    const firstTileOffsetTop = ($el.querySelector('.ert-list-item') as HTMLElement).offsetTop

    return this.computedTop - tileDistanceFromMenuTop - firstTileOffsetTop - 1
  }
  changeListIndex (e: KeyboardEvent) {
    this.getTiles()

    if (!this.isActive || !this.hasClickableTiles) {
      return
    } else if (e.keyCode === keyCodes.DOM_VK_TAB) {
      this.isActive = false
      return
    } else if (e.keyCode === keyCodes.DOM_VK_DOWN) {
      this.nextTile()
    } else if (e.keyCode === keyCodes.DOM_VK_UP) {
      this.prevTile()
    } else if (e.keyCode === keyCodes.DOM_VK_ENTER && this.listIndex !== -1) {
      this.tiles[this.listIndex].click()
    } else { return }
    e.preventDefault()
  }
  closeConditional (e: Event) {
    const target = e.target as HTMLElement

    return this.isActive &&
      !this._isDestroyed &&
      this.closeOnClick &&
      !this.$refs.content.contains(target)
  }
  genActivatorAttributes () {
    const attributes = ErtActivatableMixin.options.methods.genActivatorAttributes.call(this)

    if (this.activeTile && this.activeTile.id) {
      return {
        ...attributes,
        'aria-activedescendant': this.activeTile.id
      }
    }

    return attributes
  }
  genActivatorListeners () {
    const listeners = ErtMenuableMixin.options.methods.genActivatorListeners.call(this)

    if (!this.disableKeys) {
      listeners.keydown = this.onKeyDown
    }

    return listeners
  }
  genTransition (): VNode {
    const content = this.genContent()

    if (!this.transition) return content

    return this.$createElement('transition', {
      props: {
        name: this.transition
      }
    }, [content])
  }
  genDirectives (): VNodeDirective[] {
    const directives: VNodeDirective[] = [{
      name: 'show',
      value: this.isContentActive
    }]

    if (!this.openOnHover && this.closeOnClick) {
      directives.push({
        name: 'click-outside',
        value: {
          handler: () => { this.isActive = false },
          closeConditional: this.closeConditional,
          include: () => [this.$el, ...this.getOpenDependentElements()]
        }
      })
    }

    return directives
  }
  genContent (): VNode {
    const options = {
      attrs: {
        ...this.getScopeIdAttrs(),
        role: 'role' in this.$attrs ? this.$attrs.role : 'menu'
      },
      staticClass: 'ert-menu__content',
      class: {
        ...this.roundedClasses,
        'ert-menu__content--auto': this.auto,
        'ert-menu__content--fixed': this.activatorFixed,
        menuable__content__active: this.isActive,
        [this.contentClass.trim()]: true
      },
      style: this.styles,
      directives: this.genDirectives(),
      ref: 'content',
      on: {
        click: (e: Event) => {
          const target = e.target as HTMLElement

          if (target.getAttribute('disabled')) return
          if (this.closeOnContentClick) this.isActive = false
        },
        keydown: this.onKeyDown
      }
    } as VNodeData

    if (this.$listeners.scroll) {
      options.on = options.on || {}
      options.on.scroll = this.$listeners.scroll
    }

    if (!this.disabled && this.openOnHover) {
      options.on = options.on || {}
      options.on.mouseenter = this.mouseEnterHandler
    }

    if (this.openOnHover) {
      options.on = options.on || {}
      options.on.mouseleave = this.mouseLeaveHandler
    }

    return this.$createElement('div', options, this.getContentSlot())
  }
  getTiles () {
    if (!this.$refs.content) return

    this.tiles = Array.from(this.$refs.content.querySelectorAll('.ert-list-item'))
  }
  mouseEnterHandler () {
    this.runDelay('open', () => {
      if (this.hasJustFocused) return

      this.hasJustFocused = true
      this.isActive = true
    })
  }
  mouseLeaveHandler (e: MouseEvent) {
    this.runDelay('close', () => {
      if (this.$refs.content.contains(e.relatedTarget as HTMLElement)) return

      requestAnimationFrame(() => {
        this.isActive = false
        this.callDeactivate()
      })
    })
  }
  nextTile () {
    const tile = this.tiles[this.listIndex + 1]

    if (!tile) {
      if (!this.tiles.length) return

      this.listIndex = -1
      this.nextTile()

      return
    }

    this.listIndex++
    if (tile.tabIndex === -1) this.nextTile()
  }
  prevTile () {
    const tile = this.tiles[this.listIndex - 1]

    if (!tile) {
      if (!this.tiles.length) return

      this.listIndex = this.tiles.length
      this.prevTile()

      return
    }

    this.listIndex--
    if (tile.tabIndex === -1) this.prevTile()
  }
  onKeyDown (e: KeyboardEvent) {
    if (e.keyCode === keyCodes.DOM_VK_ESCAPE) {
      setTimeout(() => { this.isActive = false })
      const activator = this.getActivator()
      this.$nextTick(() => activator && activator.focus())
    } else if (
      !this.isActive &&
      [keyCodes.DOM_VK_UP, keyCodes.DOM_VK_DOWN].includes(e.keyCode)
    ) {
      this.isActive = true
    }

    // Allow for isActive watcher to generate tile list
    this.$nextTick(() => this.changeListIndex(e))
  }
  onResize () {
    if (!this.isActive) return

    // eslint-disable-next-line no-unused-expressions
    this.$refs.content.offsetWidth
    this.updateDimensions()

    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = window.setTimeout(this.updateDimensions, 100)
  }

  // Hooks
  mounted () {
    this.isActive && this.callActivate()
  }
  render (h: CreateElement): VNode {
    const data = {
      staticClass: 'ert-menu',
      class: {
        'ert-menu--attached':
          this.attach === '' ||
          this.attach === true ||
          this.attach === 'attach'
      },
      directives: [{
        arg: '500',
        name: 'resize',
        value: this.onResize
      }]
    }

    return h('div', data, [
      !this.activator && this.genActivator(),
      this.showLazyContent(() => [
        this.genTransition()
      ])
    ])
  }
}

export { ErtMenu }
export default ErtMenu
