<template lang="pug">
  .ert-auth-voucher-item.mb-8
    template(v-if="isOpenEditForm")
      ErtForm(ref="update-form")
        ErRow(align-items-center)
          ErFlex.mb-16(xs12 md6)
            ErtTextField(
              v-model="lazyMFullName"
              label="Полное имя"
              :rules="getRulesFullName"
            )
          ErFlex.mb-16(xs12 md6)
            template(v-if="isResetPassword")
              ErtTextField(
                v-model="lazyMPassword"
                :appendIcon="getPasswordIcon"
                appendOuterIcon="reload"
                label="Пароль"
                :rules="getRulesPassword"
                :type="typePassword"
                @click:append="onChangeTypePassword"
                @click:append-outer="onGeneratePassword"
              )
            template(v-else)
              button.ert-auth-voucher-item__reset-password-button(
                type="button"
                @click="onOpenPasswordForEdit"
              )
                ErtIcon.mr-8(name="reload")
                span Сбросить пароль
          ErFlex.mb-16(xs12 md6)
            ErButton(
              :loading="isUpdateRequest"
              @click="onUpdateHandler"
            ) Сохранить
          ErFlex.mb-16(xs12 md6)
            ErButton(
              :disabled="isUpdateRequest"
              flat
              @click="onCloseEditForm"
            ) Отмена
    template(v-else)
      ErRow
        ErFlex.ert-auth-voucher-item__login(xs5)
          | {{ manager.full_name }}
        ErFlex.ert-auth-voucher-item__updated-at(xs5)
          | {{ manager.updated_at | dateTimeFormatted }}
        ErFlex.ert-auth-voucher-item__actions(xs2)
          template(v-if="manager.removed_at == null")
            er-tooltip(bottom)
              template(v-slot:activator="{ on }")
                button(type="button" @click="onOpenEditForm")
                  span(v-on="on")
                    ErtIcon(name="edit" small)
              span Изменить
            template(v-if="isDeleteRequest")
              ErtProgressCircular(size="16" indeterminate)
            template(v-else)
              er-tooltip(bottom)
                template(v-slot:activator="{ on }")
                  button(type="button" @click="onDeleteHandler")
                    span(v-on="on")
                      ErtIcon(name="del" small)
                span Удалить
          template(v-else)
            template(v-if="isRestoreRequest")
              ErtProgressCircular(size="16" indeterminate)
            template(v-else)
              er-tooltip(bottom)
                template(v-slot:activator="{ on }")
                  button(type="button" @click="onRestoreHandler")
                    span(v-on="on")
                      ErtIcon(name="unlock" small)
                span Восстановить

    //- Логическое удаление пользователя
    ErActivationModal(
      type="success"
      v-model="isDeleteSuccess"
      title="Администратор удалён"
      :isShowActionButton="false"
      :persistent="true"
      cancelButtonText="Закрыть"
      @close="() => { isDeleteSuccess = false }"
    )

    ErActivationModal(
      type="error"
      v-model="isDeleteError"
      title="При удалении администратора произошла ошибка!"
      :isShowActionButton="false"
      :persistent="true"
      cancelButtonText="Закрыть"
      @close="() => { isDeleteError = false }"
    )

    //- Восстановление пользователя
    ErActivationModal(
      type="success"
      v-model="isRestoreSuccess"
      title="Администратор успешно восстановлен"
      :isShowActionButton="false"
      :persistent="true"
      cancelButtonText="Закрыть"
      @close="() => { isRestoreSuccess = false }"
    )

    ErActivationModal(
      type="error"
      v-model="isRestoreError"
      title="При восстановлении администратора произошла ошибка!"
      :isShowActionButton="false"
      :persistent="true"
      cancelButtonText="Закрыть"
      @close="() => { isRestoreError = false }"
    )

    //- Обновление пользователя
    ErActivationModal(
      type="success"
      v-model="isUpdateSuccess"
      actionButtonText="Распечатать"
      title="Администратор успешно обновлён"
      isShowActionButton
      :persistent="true"
      cancelButtonText="Закрыть"
      @close="onSuccessClose"
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
            .body-font {{ lazyMFullName }}
          .d--flex.align-items-center(:style="{ marginBottom: '16px' }")
            .caption2.mr-8 Логин:
            .body-font {{ getManagerLogin }}
          .d--flex.align-items-center(v-if="isResetPassword")
            .caption2.mr-8 Пароль:
            .body-font {{ lazyMPassword }}

    ErActivationModal(
      type="error"
      v-model="isUpdateError"
      title="При обновлении администратора произошла ошибка!"
      :isShowActionButton="false"
      :persistent="true"
      cancelButtonText="Закрыть"
      @close="() => { isUpdateError = false }"
    )
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
