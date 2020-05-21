const closeConditional = () => false;
const directive = (e, el, binding) => {
    binding.args = binding.args || {};
    const isActive = (binding.args.closeConditional || closeConditional);
    if (!e || isActive(e) === false)
        return;
    if (('isTrusted' in e && !e.isTrusted) || ('pointerType' in e && !e.pointerType))
        return;
    const elements = (binding.args.include || (() => []))();
    elements.push(el);
    !elements.some(el => el.contains(e.target)) && setTimeout(() => {
        isActive(e) && binding.value && binding.value(e);
    }, 0);
};
export const ClickOutside = {
    inserted(el, binding) {
        const onClick = (e) => directive(e, el, binding);
        const app = document.querySelector('[data-app]');
        app.addEventListener('click', onClick, true);
        el._clickOutside = onClick;
    },
    unbind(el) {
        if (!el._clickOutside)
            return;
        const app = document.querySelector('[data-app]');
        app && app.removeEventListener('click', el._clickOutside, true);
        delete el._clickOutside;
    }
};
export default ClickOutside;
//# sourceMappingURL=click-outside.js.map