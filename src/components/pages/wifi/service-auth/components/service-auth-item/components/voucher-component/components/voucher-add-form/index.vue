<template lang="pug">
  .ert-auth-voucher-add-form
    ErSlideUpDown(:active="isOpenForm")
      ErtForm(ref="add-user-form")
        ErRow.mb-16
          ErFlex.mb-16.mb-md-0(xs12 md6)
            ErtTextField(
              v-model="mFullName"
              label="Полное имя"
              :rules="getRulesFullName"
            )
              template(v-slot:prepend)
                ErHint
                  | Создайте учетные записи для входа в интерфейс управления ваучерами
          ErFlex(xs12 md6)
            ErtTextField(
              v-model="mPassword"
              :appendIcon="getPasswordIcon"
              appendOuterIcon="reload"
              label="Пароль"
              :rules="getRulesPassword"
              :type="typePassword"
              @click:append="onChangeTypePassword"
              @click:append-outer="onGeneratePassword"
            )
        ErRow
          ErFlex.mb-16.mb-md-0(xs12 md6)
            ErButton(
              :loading="isAddRequest"
              @click="onCreateManager"
            ) Сохранить
          ErFlex(xs12 md6)
            ErButton(
              :disabled="isAddRequest"
              flat
              @click="onCloseForm"
            ) Отмена
    ErSlideUpDown(:active="!isOpenForm")
      .ert-auth-voucher-add-form__add-user
        ErButton(
          flat
          @click="onOpenForm"
        )
          | Добавить администратора
    ErActivationModal(
      type="success"
      v-model="isAddSuccess"
      title="Вы создали администратора"
      actionButtonText="Распечатать"
      isShowActionButton
      :persistent="true"
      cancelButtonText="Закрыть"
      @close="() => { isAddSuccess = false; onCloseForm() }"
      @confirm="onPrintHandler"
    )
      template(v-slot:description)
        div(ref="info-block")
          .caption1.mb-16 Не забудьте сохранить данные об администраторе! Мы не храним пароли!
          .d--flex.align-items-center(:style="{ marginBottom: '16px' }")
            .caption2.mr-8 Адрес портала
            a.body-font.d--block(
              href="https://wifi.domru.ru/gui/voucher/login"
              target="_blank"
              rel="noopener"
            ) https://wifi.domru.ru/gui/voucher/login
          .d--flex.align-items-center(:style="{ marginBottom: '16px' }")
            .caption2.mr-8 Полное имя:
            .body-font {{ mFullName }}
          .d--flex.align-items-center(:style="{ marginBottom: '16px' }")
            .caption2.mr-8 Логин:
            .body-font {{ getManagerLogin }}
          .d--flex.align-items-center(:style="{ marginBottom: '16px' }")
            .caption2.mr-8 Пароль:
            .body-font {{ mPassword }}
    ErActivationModal(
      type="error"
      v-model="isAddError"
      title="При добавлении нового администратора произошла ошибка!"
      :isShowActionButton="false"
      :persistent="true"
      cancelButtonText="Закрыть"
      @close="() => { isAddError = false }"
    )
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
