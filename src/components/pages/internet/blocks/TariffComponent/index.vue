<template lang="pug">
  .tariff-component
    .change-speed-component.d--flex.flex-column.flex-lg-row.align-items-lg-center.justify-content-lg-center(:class="{ visible: isBlur }")
      include ./blocks/change_speed_component
    .content(:class="{ blur: isBlur }")
      .tariff-component__tariff-name
        .activation-date
          | Тариф активен с:&nbsp;
          span {{ computedActualStartDate }}
        .name
          | {{ computedOriginalName }}
      .tariff-component__speed
        .chart
        .title
          | Скорость соединения
        .button
          button(@click="openFormChangingSpeed")
            | Изменить
      .tariff-component__limit
        .chart
        .title
          | Порог доступного трафика
        .button
          button
            | Изменить
      .tariff-component__turbo-activation
        er-button(pre-icon="speedup")
          | Турбо-режим
      .tariff-component__price
        .caption
          | Абонентская плата
        .price
          span {{ computedCurrentPrice | price }}
          | &nbsp;{{ computedCurrencyCode }}/месяц
      .tariff-component__turbo-price
        .caption
          | Турбо-режим
        .price
          span 225,55
          | &nbsp;₽/месяц
      .tariff-component__settings
        er-icon(name="settings")
        button
          | Настройки соединения
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
