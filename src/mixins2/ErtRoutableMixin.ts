import Vue, { VNodeData } from 'vue'
import Component from 'vue-class-component'
import Ripple, { RippleOptions } from '@/directives/ripple'
import { getObjectValueByPath } from '@/functions/helper2'

const directives = { Ripple }

const props = {
  activeClass: String,
  append: Boolean,
  disabled: Boolean,
  exact: {
    type: Boolean,
    default: undefined
  },
  exactActiveClass: String,
  link: Boolean,
  href: [String, Object],
  to: [String, Object],
  replace: Boolean,
  ripple: {
    type: [Boolean, Object],
    default: null
  },
  tag: String,
  target: String
}

const watch = {
  $route: 'onRouteChange'
}

@Component({ directives, props, watch })
export default class ErtRoutableMixin extends Vue {
  // Props
  readonly activeClass!: string
  readonly append!: boolean
  readonly disabled!: boolean
  readonly exact!: boolean | undefined
  readonly exactActiveClass!: string
  readonly link!: boolean
  readonly href!: string | Record<string, any>
  readonly to!: string | Record<string, any>
  readonly replace!: boolean
  readonly ripple!: boolean | Record<string, any>
  readonly tag!: string
  readonly target!: string

  // Data
  isActive: boolean = false
  proxyClass: string = ''

  // Computed
  get classes (): object {
    const classes: Record<string, boolean> = {}

    if (this.to) return classes

    if (this.activeClass) classes[this.activeClass] = this.isActive
    if (this.proxyClass) classes[this.proxyClass] = this.isActive

    return classes
  }
  get computedRipple (): RippleOptions | boolean {
    return this.ripple ? this.ripple : (!this.disabled && this.isClickable)
  }
  get isClickable (): boolean {
    if (this.disabled) return false

    return Boolean(
      this.isLink ||
      this.$listeners.click ||
      this.$listeners['!click'] ||
      this.$attrs.tabindex
    )
  }
  get isLink (): boolean {
    return Boolean(
      this.to ||
      this.href ||
      this.link
    )
  }
  get styles (): object {
    return {}
  }

  // Methods
  click (e: MouseEvent): void {
    this.$emit('click', e)
  }
  generateRouteLink () {
    let exact = this.exact
    let tag

    const data: VNodeData = {
      attrs: {
        tabindex: 'tabindex' in this.$attrs ? this.$attrs.tabindex : undefined
      },
      class: this.classes,
      style: this.styles,
      props: {},
      directives: [{
        name: 'ripple',
        value: this.computedRipple
      }],
      [this.to ? 'nativeOn' : 'on']: {
        ...this.$listeners,
        click: this.click
      },
      ref: 'link'
    }

    if (typeof this.exact === 'undefined') {
      exact = this.to === '/' ||
        (typeof this.to === 'object' && this.to.path === '/')
    }

    if (this.to) {
      let activeClass = this.activeClass
      let exactActiveClass = this.exactActiveClass || activeClass

      if (this.proxyClass) {
        activeClass = `${activeClass} ${this.proxyClass}`.trim()
        exactActiveClass = `${exactActiveClass} ${this.proxyClass}`.trim()
      }

      tag = 'router-link'
      Object.assign(data.props, {
        to: this.to,
        exact,
        activeClass,
        exactActiveClass,
        append: this.append,
        replace: this.replace
      })
    } else {
      tag = (this.href && 'a') || this.tag || 'div'

      if (tag === 'a' && this.href) data.attrs!.href = this.href
    }

    if (this.target) data.attrs!.target = this.target

    return { tag, data }
  }
  onRouteChange () {
    if (!this.to || !this.$refs.link || !this.$route) return
    const activeClass = `${this.activeClass} ${this.proxyClass || ''}`.trim()

    const path = `_vnode.data.class.${activeClass}`

    this.$nextTick(() => {
      if (getObjectValueByPath(this.$refs.link, path)) {
        this.toggle()
      }
    })
  }
  toggle () {}
}
