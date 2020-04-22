import { VNodeDirective } from 'vue/types/vnode'

interface ResizeVNodeDirective extends VNodeDirective {
  value?: () => void
  options?: boolean | AddEventListenerOptions
}

const inserted = (el: HTMLElement, binding: ResizeVNodeDirective) => {
  const callback = binding.value!
  const options = binding.options || { passive: true }
  window.addEventListener('resize', callback, options)
  el._onResize = {
    callback,
    options
  };
  (!binding.modifiers || !binding.modifiers.quiet) && callback()
}

const unbind = (el: HTMLElement) => {
  if (!el._onResize) return
  const { callback, options } = el._onResize
  window.removeEventListener('resize', callback, options)
  delete el._onResize
}

export const Resize = {
  inserted,
  unbind
}

export default Resize
