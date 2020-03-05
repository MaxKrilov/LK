<template lang="pug">
  .reverce-zones-page
    .reverce-zones-page__hint
    .reverce-zones-page__list
      .reverce-zones-page__list__head.main-content.main-content--h-padding
        .ip-n-reverce-zone
          span.title IP адрес и обратная зона
          span.icon
            er-icon(name="funnel")
        .ip
          span.title IP адрес
          span.icon
            er-icon(name="funnel")
        .reverce-zone
          span.title Обратная зона
      .reverce-zones-page__list__body
        reverce-zone-item-component(
          v-for="(item, index) in listReverceZone"
          :key="item.reverceZone"
          v-bind="item"
          @delete="() => { deleteReverceZone(item.reverceZone) }"
        )
    .reverce-zones-page__add.main-content.main-content--h-padding
      er-slide-up-down(:active="isOpenAdding")
        er-form(ref="form")
          er-row.mb-md-40
            er-flex.mb-32.mb-md-0(xs12 md5)
              .reverce-zones-page__add-ip-select
                er-select(
                  :items="ipList"
                  v-model="model.ip"
                  placeholder="IP-адрес"
                )
            er-flex(xs12 md7)
              .reverce-zones-page__add-domain.mb-32.mb-md-0
                er-text-field(
                  v-model="model.domain",
                  label="Домен"
                )
          .reverce-zones-page__actions.d--flex.flex-column.flex-sm-row
            .reverce-zones-page__action.mr-sm-16.mb-8.mb-sm-0
              er-button
                | Добавить
            .reverce-zones-page__action
              er-button(flat @click="() => { isOpenAdding = false }")
                | Отмена
      er-slide-up-down(:active="!isOpenAdding")
        .reverce-zones-page__add-button
          er-button(color="blue" @click="() => { isOpenAdding = true }")
            | Добавить обратную зону
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
