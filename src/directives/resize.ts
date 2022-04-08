import { VNodeDirective } from 'vue/types/vnode'
import { VNode } from 'vue'

interface ResizeVNodeDirective extends VNodeDirective {
  value?: () => void
  options?: boolean | AddEventListenerOptions
}

const inserted = (el: HTMLElement, binding: ResizeVNodeDirective, vnode: VNode) => {
  const callback = binding.value!
  const options = binding.options || { passive: true }

  window.addEventListener('resize', callback, options)

  el._onResize = Object(el._onResize)
  el._onResize![vnode.context!._uid] = {
    callback,
    options
  };
  (!binding.modifiers || !binding.modifiers.quiet) && callback()
}

const unbind = (el: HTMLElement, binding: ResizeVNodeDirective, vnode: VNode) => {
  if (!el._onResize?.[vnode.context!._uid]) return
  const { callback, options } = el._onResize[vnode.context!._uid]!
  window.removeEventListener('resize', callback, options)
  delete el._onResize[vnode.context!._uid]
}

export const Resize = {
  inserted,
  unbind
}

export default Resize
