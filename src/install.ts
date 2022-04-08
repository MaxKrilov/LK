import { VueConstructor } from 'vue'
import { ErtUseOptions } from '@/types'
import { config } from '@/config'

export function install (
  Vue: VueConstructor,
  args: ErtUseOptions = {}
) {
  if ((install as any).installed) return
  (install as any).installed = true

  const components = args.components || {}
  const directives = args.directives || {}
  const services = args.services || {}

  for (const name in directives) {
    if (directives.hasOwnProperty(name)) {
      Vue.directive(name, directives[name])
    }
  }

  Vue.prototype.$ert = {}

  for (const name in services) {
    Vue.set(Vue.prototype.$ert, name.toLowerCase(), new services[name](config))
    Vue.prototype.$ert[name.toLowerCase()].init()
  }

  (function registerComponents (components: any) {
    if (components) {
      for (const key in components) {
        if (components.hasOwnProperty(key)) {
          const component = components[key]
          if (component && !registerComponents(component.$_subcomponents)) {
            Vue.component(key, component as typeof Vue)
          }
        }
      }
      return true
    }
    return false
  })(components)
}
