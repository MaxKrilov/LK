<template lang="pug">
  ul.value
    li.item
      er-icon(name="ok")
      | Изображение высокого качества
    li
      er-icon(name="ok")
      | Легальные публичные трансляции каналов
    li
      er-icon(name="ok")
      | Интерфейс просмотра ТВ программы передач
    li
      er-icon(name="ok")
      | Универсальный пульт управления ТВ + приставка
    li
      er-icon(name="ok")
      | Выбор языка вещания
</template>

<style lang="scss" scoped>
.value {
  @extend %body;
  margin-top: $padding-x2;
}

ul.value {
  $icon-w: $padding-x4;
  $icon-margin: $padding-x2;
  $padding-left: $icon-w + $icon-margin;
  padding-left: $padding-left;

  li {
    @extend %body;
    list-style: none;
    position: relative;

    & + li {
      margin-top: $padding-x1;
    }

    .er-icon {
      color: map_get($green, 'base');
      position: absolute;
      left: -$padding-left;

      &> svg {
        width: $icon-w;
        height: $icon-w;
      }
    }
  }
}
</style>
