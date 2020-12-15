import Vue from 'vue'
import Component from 'vue-class-component'
import { ErtIcon } from '@/components/UI2'

import './style.scss'

const props = {
  value: {
    type: Boolean,
    default: false
  },
  timeout: {
    type: Number,
    default: 5000
  },
  infinity: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'top-right'
  },
  type: {
    type: String,
    default: 'info',
    validator: (v: string) => ['success', 'warning', 'info', 'error'].includes(v)
  }
}

const watch = {
  active () {
    (this as any).setTimer()
  }
}

@Component({ props, watch })
class ErtSnackbar extends Vue {
  // Props
  readonly value!: boolean
  readonly timeout!: number
  readonly infinity!: boolean
  readonly position!: string
  readonly type!: string

  // Data
  timer: null | number = null

  // Computed
  get classes (): object {
    return {
      'ert-snackbar': true,
      [`ert-snackbar--${this.position}`]: true,
      [`ert-snackbar--${this.type}`]: true
    }
  }

  get getIcon () {
    switch (this.type) {
      case 'info':
        return 'info'
      case 'success':
        return 'circle_ok'
      case 'warning':
        return 'info'
      case 'error':
        return 'cancel'
    }
  }

  // Methods
  setTimer () {
    if (this.timer) clearTimeout(this.timer)

    if (this.infinity) return

    this.timer = setTimeout(() => {
      this.$emit('input', false)
    }, this.timeout)
  }

  // Hooks
  render () {
    return this.$createElement('transition', {
      props: {
        name: 'snackbar'
      }
    }, this.value
      ? [
        this.$createElement('div', {
          class: this.classes
        }, [
          this.$createElement('div', {
            staticClass: 'ert-snackbar__wrap'
          }, [
            this.$createElement('div', {
              staticClass: 'ert-snackbar__body'
            }, [
              this.$createElement('div', {
                staticClass: 'ert-snackbar__icon mr-16'
              }, [
                this.$createElement(ErtIcon, {
                  props: {
                    name: this.getIcon
                  }
                })
              ]),
              this.$slots.default
            ])
          ])
        ])
      ]
      : []
    )
  }
}

export default ErtSnackbar
export { ErtSnackbar }
