function blockAddMod(blockName, modName) {
    // соединяет Блок и Модификатор
    return `${blockName}--${modName}`;
}
const updateClassList = (el, bind) => {
    const block = el.classList[0];
    const classList = bind.value;
    if (Array.isArray(classList)) {
        classList.forEach(mod => {
            el.classList.add(blockAddMod(block, mod));
        });
    }
    else {
        Object.keys(classList).forEach(mod => {
            if (classList[mod]) {
                el.classList.add(blockAddMod(block, mod));
            }
            else {
                el.classList.remove(blockAddMod(block, mod));
            }
        });
    }
};
export default {
    inserted: updateClassList,
    update: updateClassList
};
//# sourceMappingURL=classMod.js.map