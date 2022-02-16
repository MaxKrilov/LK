<template lang="pug">
  .ert-auth-voucher-component
    ErRow(align-items-center)
      ErFlex(xs12 md6)
        ErtTextField(
          v-model="loginPrefix"
          label="Префикс логина"
          :loading="isLoadingData"
          :rules="prefixRules"
          isShowRequiredLabel
        )
          template(v-slot:prepend)
            ErHint
              | Логин ваучера состоит из префикса (одинаковый для всех гостей) и номера комнаты гостя (пример: hilton101). Префикс может содержать латинские буквы в нижнем регистре и/или цифры.
      ErFlex(
        v-if="[getStatuses.STATUS_ACTIVE, getStatuses.STATUS_DISCONNECTION_IN_PROGRESS].includes(status)"
        xs12
        md6
      )
        ErButton(
          color="blue"
          :loading="isChangingRequest"
          @click="onChangeHandler"
        )
          | Изменить
    template(v-if="isLoadingData")
      er-preloader.mt-16(:active="true" icon icon-type="2")
    template(v-else-if="isWasError")
      ErRow.caption1
        | Завершите настройку услуги «Авторизация по ваучерам» - введите префикс логина и нажмите кнопку «Изменить»
    template(v-else-if="[getStatuses.STATUS_ACTIVE, getStatuses.STATUS_DISCONNECTION_IN_PROGRESS].includes(status)")
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
    ErActivationModal(
      type="error"
      title="Произошла ошибка"
      v-model="isErrorChangeLoginPrefix"
      :isShowActionButton="false"
      cancel-button-text="Закрыть"
    )
      template(v-slot:description)
        .caption Повторите попытку позднее

    ErActivationModal(
      title="Сохранение выполнилось успешно"
      type="success"
      :isShowCancelButton="false"
      actionButtonText="Спасибо"
      @confirm="isSuccessChangeLoginPrefix = false"
      v-model="isSuccessChangeLoginPrefix"
    )
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
