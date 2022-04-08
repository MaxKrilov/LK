import './style.scss'

import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'

import { Prop } from 'vue-property-decorator'

import ErtIcon from '@/components/UI2/ErtIcon'
import ErtProgressCircular from '@/components/UI2/ErtProgressCircular'

const AVAILABLE_COLORS = ['blue', 'green', 'gray', 'red']
const AVAILABLE_TYPES = ['button', 'reset', 'submit']

@Component({})
export default class ErButton extends Vue {
  /// Props
  @Prop({ type: String, default: 'red', validator: (v: string) => AVAILABLE_COLORS.includes(v) })
  readonly color!: string

  @Prop({ type: Boolean })
  readonly disabled!: boolean

  @Prop({ type: Boolean })
  readonly flat!: boolean

  @Prop({ type: Boolean })
  readonly loading!: boolean

  @Prop({ type: String, default: 'button' })
  readonly tag!: string

  @Prop({ type: [String, Location] })
  readonly to!: string | InstanceType<typeof Location>

  @Prop({ type: String })
  readonly preIcon!: string

  @Prop({ type: String })
  readonly appendIcon!: string

  @Prop({ type: String, default: 'button', validator: (v: string) => AVAILABLE_TYPES.includes(v) })
  readonly type!: string

  @Prop({ type: Boolean })
  readonly smallIcon!: boolean

  /// Computed
  get classes (): object {
    return {
      [`er-button--${this.color}`]: true,
      'er-button--disabled': this._disabled,
      'er-button--flat': this.flat,
      'er-button--loading': this.loading
    }
  }

  get _tag () {
    return this.to
      ? 'router-link'
      : this.tag
  }

  get _disabled () {
    return this.disabled || this.loading
  }

  /// Methods
  genIcon (name: string, type: string) {
    return this.$createElement('div', {
      staticClass: 'er-button__icon',
      class: `er-button__icon--${type}`
    }, [
      this.$createElement(ErtIcon, { props: { name, small: this.smallIcon } })
    ])
  }

  onClickHandler (e: MouseEvent) {
    this.$emit('click', e)
  }

  /// Hooks
  render (h: CreateElement) {
    return h(this._tag, {
      staticClass: 'er-button',
      class: this.classes,
      attrs: {
        disabled: this._disabled,
        type: this.type,
        ...this.$attrs
      },
      props: {
        to: this.to
      },
      directives: [{
        name: 'ripple',
        value: { class: 'color--shades-white' }
      }],
      on: { click: this.onClickHandler }
    }, [
      h('span', {
        staticClass: 'er-button__content'
      }, [
        this.preIcon && this.genIcon(this.preIcon, 'prev'),
        h('span', {
          staticClass: 'er-button__slot-content'
        }, [
          this.$slots.default
        ]),
        this.appendIcon && this.genIcon(this.appendIcon, 'append')
      ]),
      this.loading && h('div', {
        staticClass: 'er-button__loading'
      }, [
        h(ErtProgressCircular, {
          props: {
            indeterminate: true,
            width: 2
          }
        })
      ])
    ])
  }
}
