import { Vue, Component } from 'vue-property-decorator'
import './_style.scss'

@Component({
  props: {
    active: Boolean,
    icon: Boolean,
    iconType: {
      type: String,
      default: '3'
    }
  }
})
export default class ErPreloader extends Vue {
  render (h) {
    return h('div', {
      staticClass: 'er-preloader'
    }, [
      this.$slots.default,
      this.active && h('div', {
        staticClass: 'er-preloader__preloader'
      }, [
        this.icon && h('div', {
          staticClass: 'icon'
        }, [
          h('img', {
            attrs: {
              src: require(`@/assets/images/preloaders/${this.iconType}.svg`)
            }
          })
        ])
      ])
    ])
  }
}
