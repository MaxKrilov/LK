<template lang="pug">
  .base-characteristic-list
    .label Битрейт
    .value до 2 Мбит/с
    .label Включено в услугу
    ul.points.value
      li.item
        er-icon(name="ok")
        | Запись в архив по детектору (3 дня хранения)
      li
        er-icon(name="ok")
        | Выгрузка видеопотока камеры на веб-сайт
      li
        er-icon(name="ok")
        | Доступ с мобильных устройств
      li
        er-icon(name="ok")
        | Разрешение видеопотока HD&nbsp;(1280x720)
</template>

<style lang="scss">
.label {
  @extend %caption2;
  margin-top: $padding-x2;
  margin-bottom: $padding-x1;
}

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
