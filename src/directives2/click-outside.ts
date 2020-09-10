import { VNodeDirective } from 'vue/types/vnode'

interface ClickOutsideBindingArgs {
  handler: (e: Event) => void
  closeConditional?: (e: Event) => boolean
  include?: () => HTMLElement[]
}

interface ClickOutsideDirective extends VNodeDirective {
  value?: ((e: Event) => void) | ClickOutsideBindingArgs
}

function defaultConditional () {
  return true
}

function directive (e: PointerEvent, el: HTMLElement, binding: ClickOutsideDirective): void {
  const handler = typeof binding.value === 'function' ? binding.value : binding.value!.handler

  const isActive = (typeof binding.value === 'object' && binding.value.closeConditional) || defaultConditional

  if (!e || isActive(e) === false) return

  if (('isTrusted' in e && !e.isTrusted) ||
    ('pointerType' in e && !e.pointerType)
  ) return

  const elements = ((typeof binding.value === 'object' && binding.value.include) || (() => []))()
  elements.push(el)

  !elements.some(el => el.contains(e.target as Node)) && setTimeout(() => {
    isActive(e) && handler && handler(e)
  }, 0)
}

export const ClickOutside = {
  inserted (el: HTMLElement, binding: ClickOutsideDirective) {
    const onClick = (e: Event) => directive(e as PointerEvent, el, binding)
    const app = document.querySelector('[data-app]') ||
      document.body // This is only for unit tests
    app.addEventListener('click', onClick, true)
    el._clickOutside = onClick
  },

  unbind (el: HTMLElement) {
    if (!el._clickOutside) return

    const app = document.querySelector('[data-app]') ||
      document.body // This is only for unit tests
    app && app.removeEventListener('click', el._clickOutside, true)
    delete el._clickOutside
  },
}

export default ClickOutside
