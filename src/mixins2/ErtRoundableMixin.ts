import Vue from 'vue'
import Component from 'vue-class-component'

const props = {
  rounded: [Boolean, String],
  tile: Boolean
}

@Component({ props })
export default class ErtRoundableMixin extends Vue {
  // Props
  readonly rounded!: boolean | string
  readonly tile!: boolean

  // Computed
  get roundedClasses (): Record<string, boolean> {
    const composite = []
    const rounded = typeof this.rounded === 'string'
      ? String(this.rounded)
      : this.rounded

    if (this.tile) {
      composite.push('rounded-0')
    } else if (typeof rounded === 'string') {
      const values = rounded.split(' ')

      for (const value of values) {
        composite.push(`rounded-${value}`)
      }
    } else if (rounded) {
      composite.push('rounded')
    }

    return composite.length > 0 ? {
      [composite.join(' ')]: true
    } : {}
  }
}
