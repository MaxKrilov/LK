/*
  Директива добавляет БЭМ-модификатор

  Параметр может быть Object или Array - как во встроенном :class=""

  Пример Array:
    <span
      class="button"
      v-class-mod="['big', 'red', 'mobile]">
    </span>

  Результат:
    <span class="button button--big button--red button--mobile"></span>

  Пример с Object:
    <div
      class="my-button"
      v-class-mod="{'active': isActive }">
      Кнопка
    </div>

  Результат:
    При isActive === true превратится в:
    <div class="my-button my-button--active">
      Кнопка
    </div>

    При isActive === false превратится в:
    <div class="my-button">
      Кнопка
    </div>

  ПРИМЕЧАНИЕ:
    Название класса Блока - это первый класс элемента
*/

function blockAddMod (blockName, modName) {
  // соединяет Блок и Модификатор
  return `${blockName}--${modName}`
}

const updateClassList = (el, bind) => {
  const block = el.classList[0]
  const classList = bind.value

  if (Array.isArray(classList)) {
    classList.forEach(mod => {
      el.classList.add(blockAddMod(block, mod))
    })
  } else {
    Object.keys(classList).forEach(mod => {
      if (classList[mod]) {
        el.classList.add(blockAddMod(block, mod))
      } else {
        el.classList.remove(blockAddMod(block, mod))
      }
    })
  }
}

export default {
  inserted: updateClassList,
  update: updateClassList
}
