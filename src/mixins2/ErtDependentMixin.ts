import Vue from 'vue'
import Component from 'vue-class-component'

import ErtOverlay from '@/components/UI2/ErtOverlay'

interface DependentInstance extends Vue {
  isActive?: boolean
  isDependent?: boolean
}

function searchChildren (children: Vue[]): DependentInstance[] {
  const results = []
  for (let index = 0; index < children.length; index++) {
    const child = children[index] as DependentInstance
    if (child.isActive && child.isDependent) {
      results.push(child)
    } else {
      results.push(...searchChildren(child.$children))
    }
  }

  return results
}

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof ErtDependentMixin>>({
  watch: {
    isActive (val) {
      if (val) return

      const openDependents = this.getOpenDependents()
      for (let index = 0; index < openDependents.length; index++) {
        openDependents[index].isActive = false
      }
    }
  }
})
export default class ErtDependentMixin extends Vue {
  // Options
  $el!: HTMLElement
  $refs!: {
    content: HTMLElement
  }
  overlay!: InstanceType<typeof ErtOverlay>

  // Data
  closeDependents: boolean = true
  isActive: boolean = false
  isDependent: boolean = true

  // Methods
  getOpenDependents (): any[] {
    if (this.closeDependents) return searchChildren(this.$children)

    return []
  }

  getOpenDependentElements (): HTMLElement[] {
    const result = []
    const openDependents = this.getOpenDependents()

    for (let index = 0; index < openDependents.length; index++) {
      result.push(...openDependents[index].getClickableDependentElements())
    }

    return result
  }

  getClickableDependentElements (): HTMLElement[] {
    const result = [this.$el]
    if (this.$refs.content) result.push(this.$refs.content)
    if (this.overlay) result.push(this.overlay.$el as HTMLElement)
    result.push(...this.getOpenDependentElements())

    return result
  }
}
