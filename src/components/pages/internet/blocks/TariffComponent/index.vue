<template lang="pug">
  .tariff-component
    .content
      .tariff-component__tariff-name
        .activation-date
          | Тариф активен с:&nbsp;
          span 08.08.2018
        .name
          | Базовый лимит
      .tariff-component__speed
        .chart
        .title
          | Скорость соединения
        .button
          button
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
          span 27 500
          | &nbsp;₽/месяц
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
