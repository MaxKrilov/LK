<template lang="pug">
  .statistic-internet-page
    .statistic-internet-page__filter.d--flex.flex-column.flex-sm-row.mb-40.main-content.main-content--h-padding
      .login.mb-32.mb-sm-0.mr-sm-16
        er-select(
          :items="listLogin"
          v-model="currentLogin"
          placeholder="Логин/IP-адрес"
        )
      .period
        er-date-picker(
          v-model="period"
          placeholder="Период"
        )
    .statistic-internet-page__info.main-content.main-content--h-padding.mb-22
      .statistic-internet-page__tariff.mb-8
        .caption.mb-4 Тарифный план
        .value Безлимитный Безлимитище 512-800
      .statistic-internet-page__traffic.d--flex
        .internet.mr-32
          .caption.mb-4 Интернет-трафик (ИТ)
          .value
            span 000.0
            | КБ.
        .multimedia
          .caption.mb-4 Мультимедиа (ММ)
          .value
            span 000.0
            | КБ.
    .statistic-internet-page__table
      .statistic-internet-page__head.main-content.main-content--h-padding.py-8
        .filter--ip
          input(placeholder="IP адрес")
        .filter--start
          er-table-filter(title="Начало сессии")
        .filter--end
          er-table-filter(title="Конец сессии")
        .filter--period
          er-table-filter(title="Период сессии")
        .filter--time-session
          er-table-filter(title="Время сессии")
        .filter--volume
          er-table-filter(title="Объём")
        .filter--type
          er-table-filter(title="Тип")
      .statistic-internet-page__body
        internet-statistic-component(
          ip="10.95.217.183"
          :start="new Date(2018, 3, 2, 12, 12)"
          :end="new Date(2019, 2, 2, 12, 13)"
          :bytes="123456789"
          type="ИТ"
        )
</template>
<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
