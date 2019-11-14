import './_style.scss'

import { convertToUnit } from '../../../functions/helper'

export default {
  name: 'er-picker',
  props: {
    fullWidth: Boolean,
    landscape: Boolean,
    noTitle: Boolean,
    transition: {
      type: String,
      default: 'fade-transition'
    },
    width: {
      type: [Number, String],
      default: 290
    }
  },
  methods: {
    genTitle (h) {
      return (
        <div class={[
          'er-picker__title',
          {
            'er-picker__title--landscape': this.landscape
          }
        ]}>
          {this.$slots.title}
        </div>
      )
    },
    genBodyTransition (h) {
      return h('transition', {
        props: {
          name: this.transition
        }
      }, this.$slots.default)
    },
    genBody (h) {
      return (
        <div
          class={[
            'er-picker__body',
            {
              'er-picker__body--no-title': this.noTitle
            }
          ]}
          style={this.fullWidth ? undefined : {
            width: convertToUnit(this.width)
          }}
        >
          {this.genBodyTransition(h)}
        </div>
      )
    },
    genActions (h) {
      return (
        <div
          class={[
            'er-picker__actions',
            {
              'er-picker__actions--no-title': this.noTitle
            }
          ]}
        >
          {this.$slots.actions}
        </div>
      )
    }
  },
  render (h) {
    return (
      <div
        class={[
          'er-picker',
          {
            'er-picker--landscape': this.landscape,
            'er-picker--full-width': this.fullWidth
          }
        ]}
      >
        {this.$slots.title ? this.genTitle(h) : null}
        {this.genBody(h)}
        {this.$slots.actions ? this.genActions(h) : null}
      </div>
    )
  }
}
