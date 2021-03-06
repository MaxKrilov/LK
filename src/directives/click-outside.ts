import { VNodeDirective } from 'vue/types/vnode'

interface ClickOutsideBindingArgs {
  closeConditional?: (e: Event) => boolean
  include?: () => HTMLElement[]
}

interface ClickOutsideDirective extends VNodeDirective {
  value?: (e: Event) => void
  args?: ClickOutsideBindingArgs
}

const closeConditional = () => false

const directive = (e: PointerEvent, el: HTMLElement, binding: ClickOutsideDirective) => {
  binding.args = binding.args || {}
  const isActive = (binding.args.closeConditional || closeConditional)
  if (!e || isActive(e) === false) return
  if (('isTrusted' in e && !e.isTrusted) || ('pointerType' in e && !e.pointerType)) return
  const elements = (binding.args.include || (() => []))()
  elements.push(el)
  !elements.some(el => el.contains(e.target as Node)) && setTimeout(() => {
    isActive(e) && binding.value && binding.value(e)
  }, 0)
}

export const ClickOutside = {
  inserted (el: HTMLElement, binding: ClickOutsideDirective) {
    const onClick = (e: Event) => directive(e as PointerEvent, el, binding)
    const app = document.querySelector('[data-app]')!
    app.addEventListener('click', onClick, true)
    el._clickOutside = onClick
  },
  unbind (el: HTMLElement) {
    if (!el._clickOutside) return
    const app = document.querySelector('[data-app]')!
    app && app.removeEventListener('click', el._clickOutside, true)
    delete el._clickOutside
  }
}

export default ClickOutside
