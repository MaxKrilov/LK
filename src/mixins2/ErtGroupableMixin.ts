// Mixins
import { Registrable, inject as RegistrableInject } from './ErRegistrableMixin'

// Utilities
import { ExtractVue } from '@/utils/mixins2'
import { VueConstructor } from 'vue'
import { PropValidator } from 'vue/types/options'

/* eslint-disable-next-line no-use-before-define */
export type Groupable<T extends string, C extends VueConstructor | null = null> = VueConstructor<ExtractVue<Registrable<T, C>> & {
  activeClass: string
  isActive: boolean
  disabled: boolean
  groupClasses: object
  toggle (): void
}>

export function factory<T extends string, C extends VueConstructor | null = null> (
  namespace: T,
  child?: string,
  parent?: string
): Groupable<T, C> {
  return RegistrableInject<T, C>(namespace, child, parent).extend({
    name: 'groupable',

    props: {
      activeClass: {
        type: String,
        default (): string | undefined {
          if (!this[namespace]) return undefined

          return this[namespace].activeClass
        }
      } as any as PropValidator<string>,
      disabled: Boolean
    },

    data () {
      return {
        isActive: false
      }
    },

    computed: {
      groupClasses (): object {
        if (!this.activeClass) return {}

        return {
          [this.activeClass]: this.isActive
        }
      }
    },

    created () {
      this[namespace] && (this[namespace] as any).register(this)
    },

    beforeDestroy () {
      this[namespace] && (this[namespace] as any).unregister(this)
    },

    methods: {
      toggle () {
        this.$emit('change')
      }
    }
  })
}

/* eslint-disable-next-line no-redeclare */
const Groupable = factory('itemGroup')

export default Groupable
