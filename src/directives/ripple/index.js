import './_style.scss';
import { keyCode as keyCodes } from '@/functions/keyCode';
import { isLocalhost } from '@/functions/helper';
const transform = (el, value) => {
    el.style.transform = value;
    el.style.webkitTransform = value;
};
const opacity = (el, value) => {
    el.style.opacity = value.toString();
};
const isTouchEvent = (e) => e.constructor.name === 'TouchEvent';
const isKeyboardEvent = (e) => e.constructor.name === 'KeyboardEvent';
const calculate = (e, el, value = {}) => {
    let localX = 0;
    let localY = 0;
    if (!isKeyboardEvent(e)) {
        const offset = el.getBoundingClientRect();
        const target = isTouchEvent(e) ? e.touches[e.touches.length - 1] : e;
        localX = target.clientX - offset.left;
        localY = target.clientY - offset.top;
    }
    let radius = 0;
    let scale = 0.3;
    if (el._ripple && el._ripple.circle) {
        scale = 0.15;
        radius = el.clientWidth / 2;
        radius = value.center
            ? radius
            : Math.sqrt((localX - radius) ** 2 + (localY - radius) ** 2) / 4;
    }
    else {
        radius = Math.sqrt(el.clientWidth ** 2 + el.clientHeight ** 2) / 2;
    }
    const centerX = `${(el.clientWidth - (radius * 2)) / 2}px`;
    const centerY = `${(el.clientHeight - (radius * 2)) / 2}px`;
    const x = value.center ? centerX : `${localX - radius}px`;
    const y = value.center ? centerY : `${localY - radius}px`;
    return { radius, scale, x, y, centerX, centerY };
};
const ripples = {
    show(e, el, value = {}) {
        if (!el._ripple || !el._ripple.enabled) {
            return;
        }
        const container = document.createElement('span');
        const animation = document.createElement('span');
        container.appendChild(animation);
        container.className = 'er-ripple__container';
        if (value.class) {
            container.className += ` ${value.class}`;
        }
        const { radius, scale, x, y, centerX, centerY } = calculate(e, el, value);
        const size = `${radius * 2}px`;
        animation.className = 'er-ripple__animation';
        animation.style.width = size;
        animation.style.height = size;
        el.appendChild(container);
        const computed = window.getComputedStyle(el);
        if (computed && computed.position === 'static') {
            el.style.position = 'relative';
            el.dataset.previousPosition = 'static';
        }
        animation.classList.add('er-ripple__animation--enter');
        animation.classList.add('er-ripple__animation--visible');
        transform(animation, `translate(${x}, ${y}) scale3d(${scale},${scale},${scale})`);
        opacity(animation, 0);
        animation.dataset.activated = String(performance.now());
        setTimeout(() => {
            animation.classList.remove('er-ripple__animation--enter');
            animation.classList.add('er-ripple__animation--in');
            transform(animation, `translate(${centerX}, ${centerY}) scale3d(1,1,1)`);
            opacity(animation, 0.25);
        }, 0);
    },
    hide(el) {
        if (!el || !el._ripple || !el._ripple.enabled)
            return;
        const ripples = el.getElementsByClassName('er-ripple__animation');
        if (ripples.length === 0)
            return;
        const animation = ripples[ripples.length - 1];
        if (animation.dataset.isHiding)
            return;
        else
            animation.dataset.isHiding = 'true';
        const diff = performance.now() - Number(animation.dataset.activated);
        const delay = Math.max(250 - diff, 0);
        setTimeout(() => {
            animation.classList.remove('er-ripple__animation--in');
            animation.classList.add('er-ripple__animation--out');
            opacity(animation, 0);
            setTimeout(() => {
                const ripples = el.getElementsByClassName('er-ripple__animation');
                if (ripples.length === 1 && el.dataset.previousPosition) {
                    el.style.position = el.dataset.previousPosition;
                    delete el.dataset.previousPosition;
                }
                animation.parentNode && el.removeChild(animation.parentNode);
            }, 300);
        }, delay);
    }
};
const isRippleEnabled = (value) => typeof value === 'undefined' || !!value;
const rippleShow = (e) => {
    const value = {};
    const element = e.currentTarget;
    if (!element || !element._ripple || element._ripple.touched)
        return;
    if (isTouchEvent(e)) {
        element._ripple.touched = true;
        element._ripple.isTouch = true;
    }
    else {
        if (element._ripple.isTouch)
            return;
    }
    value.center = element._ripple.centered || isKeyboardEvent(e);
    if (element._ripple.class) {
        value.class = element._ripple.class;
    }
    ripples.show(e, element, value);
};
const rippleHide = (e) => {
    const element = e.currentTarget;
    if (!element)
        return;
    setTimeout(() => {
        if (element._ripple) {
            element._ripple.touched = false;
        }
    });
    ripples.hide(element);
};
let keyboardRipple = false;
const keyboardRippleShow = (e) => {
    if (!keyboardRipple && (e.keyCode === keyCodes.DOM_VK_ENTER || e.keyCode === keyCodes.DOM_VK_SPACE)) {
        keyboardRipple = true;
        rippleShow(e);
    }
};
const keyboardRippleHide = (e) => {
    keyboardRipple = false;
    rippleHide(e);
};
const updateRipple = (el, binding, wasEnabled) => {
    const enabled = isRippleEnabled(binding.value);
    if (!enabled) {
        ripples.hide(el);
    }
    el._ripple = el._ripple || {};
    el._ripple.enabled = enabled;
    const value = binding.value || {};
    if (value.center) {
        el._ripple.centered = true;
    }
    if (value.class) {
        el._ripple.class = binding.value.class;
    }
    if (value.circle) {
        el._ripple.circle = value.circle;
    }
    if (enabled && !wasEnabled) {
        el.addEventListener('touchstart', rippleShow, { passive: true });
        el.addEventListener('touchend', rippleHide, { passive: true });
        el.addEventListener('touchcancel', rippleHide);
        el.addEventListener('mousedown', rippleShow);
        el.addEventListener('mouseup', rippleHide);
        el.addEventListener('mouseleave', rippleHide);
        el.addEventListener('keydown', keyboardRippleShow);
        el.addEventListener('keyup', keyboardRippleHide);
        el.addEventListener('dragstart', rippleHide, { passive: true });
    }
    else if (!enabled && wasEnabled) {
        removeListeners(el);
    }
};
const removeListeners = (el) => {
    el.removeEventListener('mousedown', rippleShow);
    el.removeEventListener('touchstart', rippleShow);
    el.removeEventListener('touchend', rippleHide);
    el.removeEventListener('touchcancel', rippleHide);
    el.removeEventListener('mouseup', rippleHide);
    el.removeEventListener('mouseleave', rippleHide);
    el.removeEventListener('keydown', keyboardRippleShow);
    el.removeEventListener('keyup', keyboardRippleHide);
    el.removeEventListener('dragstart', rippleHide);
};
const directive = (el, binding, node) => {
    updateRipple(el, binding, false);
    if (isLocalhost()) {
        node.context && node.context.$nextTick(() => {
            const computed = window.getComputedStyle(el);
            if (computed && computed.display === 'inline') {
                console.warn('v-ripple can only be used on block-level elements');
            }
        });
    }
};
const unbind = (el) => {
    delete el._ripple;
    removeListeners(el);
};
const update = (el, binding) => {
    if (binding.value === binding.oldValue)
        return;
    const wasEnabled = isRippleEnabled(binding.oldValue);
    updateRipple(el, binding, wasEnabled);
};
export const Ripple = {
    bind: directive,
    unbind,
    update
};
export default Ripple;
//# sourceMappingURL=index.js.map