import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    shadow: String
  }
})
export default class ErtShadowMixin extends Vue {
  // Props
  shadow!: string

  // Computed
  get computedShadow () {
    return this.shadow
  }

  get shadowClasses () {
    const shadow = this.computedShadow
    if (shadow == null) return {}
    return { [`shadow--${shadow}`]: true }
  }
}
