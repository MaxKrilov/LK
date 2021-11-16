<template lang="pug">
  .ert-auth-voucher-component
    ErRow.ert-auth-voucher-component__head
      ErFlex.login(xs5)
        | Администратор
      ErFlex.updated-at(xs5)
        | Создан/изменён
      ErFlex.actions(xs2)
    .ert-auth-voucher-component__body.mb-16
      template(v-for="manager in getListManager")
        ErtAuthVoucherItem(
          v-if="!manager.removed_at"
          :cityId="cityId"
          :key="manager.manager_id"
          :manager="manager"
          :vlan="vlan"
          @delete="onDeleteManagerHandler"
          @restore="onRestoreManagerHandler"
          @update="onUpdateManagerHandler"
        )
    .ert-auth-voucher-component__footer
      ErtAuthVoucherAddForm(
        :cityId="cityId"
        :vlan="vlan"
        @add="onAddManagerHandler"
      )
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
