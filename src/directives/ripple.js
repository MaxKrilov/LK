import {
  getLastElement, addClass, removeClass, setStyle, getStyle, setDataAttr, isEmpty,
  getDataAttr, lengthVar, removeDataAttr, isUndefined, addEvents, removeEvents
} from '../functions/helper'

function transform (el, value) {
  el.style.transform = value
  el.style.webkitTransform = value
}

function opacity (el, value) {
  el.style.opacity = value
}

function isTouchEvent (e) {
  return e.constructor.name === 'TouchEvent'
}

function calculate (e, el, value) {
  const offset = el.getBoundingClientRect()
  const target = isTouchEvent(e) ? getLastElement(e.touches) : e
  const localX = target.clientX - offset.left
  const localY = target.clientY - offset.top
  let radius = 0
  let scale = 0.3
  if (el._ripple && el._ripple.circle) {
    scale = 0.15
    radius = el.clientWidth / 2
    radius = value.center ? radius : radius + Math.sqrt((localX - radius) ** 2 + (localY - radius) ** 2) / 4
  } else {
    radius = Math.sqrt(el.clientWidth ** 2 + el.clientHeight ** 2) / 2
  }
  const centerX = `${(el.clientWidth - (radius * 2)) / 2}px`
  const centerY = `${(el.clientHeight - (radius * 2)) / 2}px`
  const x = value.center ? centerX : `${localX - radius}px`
  const y = value.center ? centerY : `${localY - radius}px`
  return { radius, scale, x, y, centerX, centerY }
}

const ripple = {
  show (e, el, value) {
    if (!el || !el._ripple || !el._ripple.enabled) {
      return false
    }
    const container = document.createElement('span')
    const animation = document.createElement('span')
    container.appendChild(animation)
    addClass(container, 'er-ripple__container')
    if (value.class) {
      addClass(container, value.class)
    }
    const { radius, scale, x, y, centerX, centerY } = calculate(e, el, value)
    const size = `${radius * 2}px`
    addClass(animation, 'er-ripple__animation')
    setStyle(animation, 'width', size)
    setStyle(animation, 'height', size)
    el.appendChild(container)
    const computed = getStyle(el)
    if (computed && computed.position === 'static') {
      setStyle(el, 'position', 'relative')
      setDataAttr(el, 'previousPosition', 'static')
    }
    addClass(animation, 'er-ripple__animation--enter')
    addClass(animation, 'er-ripple__animation--visible')
    transform(animation, `translate(${x}, ${y}) scale3d(${scale}, ${scale}, ${scale})`)
    opacity(animation, 0)
    setDataAttr(animation, 'activated', String(performance.now()))
    setTimeout(() => {
      removeClass(animation, 'er-ripple__animation--enter')
      addClass(animation, 'er-ripple__animation--in')
      transform(animation, `translate(${centerX}, ${centerY}) scale3d(1, 1, 1)`)
      opacity(animation, 0.25)
    }, 0)
  },
  hide (el) {
    if (!el || !el._ripple || !el._ripple.enabled) {
      return false
    }
    const ripples = el.querySelectorAll('.er-ripple__animation')
    if (isEmpty(ripples)) {
      return false
    }
    const animation = getLastElement(ripples)
    if (getDataAttr(animation, 'isHiding')) {
      return false
    }
    setDataAttr(animation, 'isHiding', 'true')
    const diff = performance.now() - Number(getDataAttr(animation, 'activated'))
    const delay = Math.max(250 - diff, 0)
    setTimeout(() => {
      removeClass(animation, 'er-ripple__animation--in')
      addClass(animation, 'er-ripple__animation--out')
      opacity(animation, 0)
      setTimeout(() => {
        const ripples = el.querySelectorAll('.er-ripple__animation')
        if (lengthVar(ripples) === 1 && getDataAttr(el, 'previousPosition')) {
          setStyle(el, 'position', getDataAttr(el, 'previousPosition'))
          removeDataAttr(el, 'previousPosition')
        }
        animation.parentNode && el.removeChild(animation.parentNode)
      }, 300)
    }, delay)
  }
}

function isRippleEnabled (value) {
  return isUndefined(value) || !!value
}

function rippleShow (e) {
  const value = {}
  const element = e.currentTarget
  if (!element || !element._ripple || element._ripple.touched) {
    return false
  }
  if (isTouchEvent(e)) {
    element._ripple.touched = true
  }
  value.center = element._ripple.centered
  if (element._ripple.class) {
    value.class = element._ripple.class
  }
  ripple.show(e, element, value)
}

function rippleHide (e) {
  const element = e.currentTarget
  if (!element) {
    return false
  }
  setTimeout(() => {
    if (element._ripple) {
      element._ripple.touched = false
    }
  })
  ripple.hide(element)
}

function updateRipple (el, binding, wasEnabled) {
  const enabled = isRippleEnabled(binding.value)
  if (!enabled) {
    ripple.hide(el)
  }
  el._ripple = el._ripple || {}
  el._ripple.enabled = enabled
  const value = binding.value || {}
  if (value.center) {
    el._ripple.centered = true
  }
  if (value.class) {
    el._ripple.class = binding.value.class
  }
  if (value.circle) {
    el._ripple.circle = value.circle
  }
  if (enabled && !wasEnabled) {
    addListeners(el)
  } else if (!enabled && wasEnabled) {
    removeListeners(el)
  }
}

function addListeners (el) {
  addEvents(el, [
    { type: 'touchstart', function: rippleShow, options: { passive: true } },
    { type: 'touchend', function: rippleHide, options: { passive: true } },
    { type: 'touchcancel', function: rippleHide },
    { type: 'mousedown', function: rippleShow },
    { type: 'mouseup', function: rippleHide },
    { type: 'mouseleave', function: rippleHide },
    { type: 'dragstart', function: rippleHide, options: { passive: true } }
  ])
}

function removeListeners (el) {
  removeEvents(el, [
    { type: 'touchstart', function: rippleShow },
    { type: 'touchend', function: rippleHide },
    { type: 'touchcancel', function: rippleHide },
    { type: 'mousedown', function: rippleShow },
    { type: 'mouseup', function: rippleHide },
    { type: 'mouseleave', function: rippleHide },
    { type: 'dragstart', function: rippleHide }
  ])
}

function directive (el, binding, node) {
  updateRipple(el, binding, false)
  node.context && node.context.$nextTick(() => {
    const display = getStyle(el, 'display')
    if (display === 'inline') {
      console.warn('v-ripple can only be used on block-level elements')
    }
  })
}

function unbind (el) {
  delete el._ripple
  removeListeners(el)
}

function update (el, binding) {
  if (binding.value === binding.oldValue) {
    return false
  }
  const wasEnabled = isRippleEnabled(binding.oldValue)
  updateRipple(el, binding, wasEnabled)
}

export default {
  bind: directive,
  unbind,
  update
}
