const inserted = (el, binding) => {
    const callback = binding.value;
    const options = binding.options || { passive: true };
    window.addEventListener('resize', callback, options);
    el._onResize = {
        callback,
        options
    };
    (!binding.modifiers || !binding.modifiers.quiet) && callback();
};
const unbind = (el) => {
    if (!el._onResize)
        return;
    const { callback, options } = el._onResize;
    window.removeEventListener('resize', callback, options);
    delete el._onResize;
};
export const Resize = {
    inserted,
    unbind
};
export default Resize;
//# sourceMappingURL=resize.js.map