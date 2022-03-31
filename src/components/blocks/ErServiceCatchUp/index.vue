<template lang="pug">
  .ert-service-manage-view
    .ert-service-manage-view__title Управляй просмотром
    .ert-service-manage-view__discription
      | Ставьте фильм или матч на паузу, если нужно отлучиться. Перематывайте <br>
      | рекламу. Смотрите в архиве передач за 7 дней то, что пропустили на ТВ.
    .ert-service-manage-view__input
      - let attr = { hideDetails: "hideDetails", ':loading': "isCheckStatusLoadingSwitch", ':disabled': "isDisabledSwitch",':value': "isOnSwitch", '@change': "onChange" }
      ErTooltip(bottom)
        template(v-slot:activator="{ on }")
          div(v-on="on")
            ErtSwitch(
              v-if="isStatusSwitcherAfterSendingOrder || isSuccessStatusSwitcherAfterSendingOrder"
              :value="isOnSwitch"
            )&attributes(attr)
            ErtSwitch(
              v-else
              :value="isOnSwitch"
            )&attributes(attr)
        div {{ statusTextSwitcher }}
    .ert-service-manage-view__price {{ price }}&nbsp;
      span
        | ₽/мес
</template>

<script lang="ts" src="./script.ts"></script>

<style lang="scss" src="./style.scss"></style>
