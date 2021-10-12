<template lang="pug">
  .ert-wifi-service-auth-item
    .ert-wifi-service-auth-item__content
      .ert-wifi-service-auth-item__input(v-if="isInProgress")
        ErTooltip(bottom)
          template(v-slot:activator="{ on }")
            div(v-on="on")
              ErtSwitch(
                hideDetails
                :value="isOnSwitch"
                disabled
              )
          span {{ getStatusText }}
      .ert-wifi-service-auth-item__input(v-else)
        ErtSwitch(
          hideDetails
          :value="isOnSwitch"
          :loading="isLoadingSwitch"
          :disabled="isDisabledSwitch"
          @change="onChange"
        )
      .ert-wifi-service-auth-item__title
        | {{ saName }}
      template(v-if="isServiceAuthWOParameters")
        .ert-wifi-service-auth-item__description
          | {{ description }}
      //-  В случае, если подключена авторизация ч/з социальные сети - показываем возможность подключать/отключать отдельные соц. сети
      template(v-if="lazyStatus === getStatuses.STATUS_ACTIVE && code === 'WIFIAUTCNHS'")
        .ert-wifi-service-auth-item__guest-auth
          .ert-wifi-service-auth-item__guest-auth-item.mb-8(
            v-for="guestAuth in guestAuthList"
            :key="guestAuth.name"
            :class="guestAuth.name"
          )
            ErtSwitch(
              :hideDetails="socialNetworks[guestAuth.field].errorMessage === ''"
              :messages="socialNetworks[guestAuth.field].errorMessage"
              :value="socialNetworks[guestAuth.field].isConnect"
              :loading="socialNetworks[guestAuth.field].isLoading"
              :disabled="socialNetworks[guestAuth.field].isLoading"
              :error="socialNetworks[guestAuth.field].errorMessage !== ''"
              @change="(e) => { onChangeSocialNetwork(e, guestAuth.field, guestAuth.name) }"
              :ref="`social-network-${guestAuth.name}`"
            )
              template(v-slot:label)
                .icon.mr-16
                  template(v-if="guestAuth.iconType === 'icon'")
                    ErtIcon(:name="guestAuth.iconName")
                  template(v-else-if="guestAuth.iconType === 'img'")
                    img(:src="guestAuth.src")
                .title
                  | {{ guestAuth.title }}
      template(v-else-if="isServiceAuthWithParameters")
        er-slide-up-down(:active="lazyStatus === getStatuses.STATUS_DISCONNECTED || lazyStatus === getStatuses.STATUS_ACTIVATION_IN_PROGRESS")
          .ert-wifi-service-auth-item__description
            | {{ description }}
        er-slide-up-down(:active="lazyStatus !== getStatuses.STATUS_DISCONNECTED && lazyStatus !== getStatuses.STATUS_ACTIVATION_IN_PROGRESS")
          .ert-wifi-service-auth-item__settings
            .ert-wifi-service-auth-item__required-fields.mb-16
              span
              | &nbsp-&nbsp; Поле обязательно к заполнению
            ErtForm(ref="form")
              template(v-if="code === 'WIFIREDIR'")
                ErtTextField(
                  label="Адрес сайта"
                  v-model="vModelList.wifiRedirSite"
                  :rules="vModelRuleList.wifiRedirSite"
                  isShowRequiredLabel
                )
                  template(slot="prepend")
                    er-hint {{ description }}
              template(v-if="code === 'WIFINAME'")
                ErtTextField(
                  label="Название сети"
                  v-model="vModelList.wifiName"
                  :rules="vModelRuleList.wifiName"
                  isShowRequiredLabel
                )
                  template(slot="prepend")
                    er-hint {{ description }}
              template(v-if="code === 'WIFIACCCHANGE'")
                ErtTextField(
                  label="PIN код заведения"
                  :type="vModelTypeList.wifiAccChangePIN"
                  v-model="vModelList.wifiAccChangePIN"
                  :appendIcon="vModelTypeList.wifiAccChangePIN === 'password' ? 'eye_close' : 'eye_open'"
                  @click:append="() => { vModelTypeList.wifiAccChangePIN = vModelTypeList.wifiAccChangePIN === 'password' ? 'text' : 'password' }"
                  appendOuterIcon="reload"
                  @click:append-outer="() => { onGeneratePassword('acc-change') }"
                  :rules="vModelList.wifiAccChangeInterval !== '' ? [] : vModelRuleList.wifiAccChangePIN"
                )
                ErtTextField(
                  label="Интервал авторизации (часов)"
                  v-model="vModelList.wifiAccChangeInterval"
                  :rules="vModelList.wifiAccChangePIN !== '' ? [] : vModelRuleList.wifiAccChangeInterval"
                )
              template(v-if="code === 'WIFIHSCLONET'")
                ErtTextField(
                  label="Название закрытой сети"
                  v-model="vModelList.wifiHSClosNetName"
                  :rules="vModelRuleList.wifiHSClosNetName"
                  isShowRequiredLabel
                )
                ErtTextField(
                  label="Пароль"
                  :type="vModelTypeList.wifiHSCloseNetPassword"
                  v-model="vModelList.wifiHSCloseNetPassword"
                  :appendIcon="vModelTypeList.wifiHSCloseNetPassword === 'password' ? 'eye_close' : 'eye_open'"
                  @click:append="() => { vModelTypeList.wifiHSCloseNetPassword = vModelTypeList.wifiHSCloseNetPassword === 'password' ? 'text' : 'password' }"
                  appendOuterIcon="reload"
                  @click:append-outer="() => { onGeneratePassword('close-net') }"
                  :rules="vModelRuleList.wifiHSCloseNetPassword"
                  isShowRequiredLabel
                  placeholder="Пароль не хранится в системе"
                )

              template(v-if="code === 'WIFIAVTVOUCH'")
                er-row
                  er-flex(xs12 md6)
                    ErtTextField(
                      label="Префикс логина"
                      v-model="vModelList.wifiVoucherPrefix"
                      :rules="vModelRuleList.wifiVoucherPrefix"
                      isShowRequiredLabel
                    )
                .ert-wifi-service-auth-item__list-manager-voucher.mb-20(v-if="lazyStatus === getStatuses.STATUS_ACTIVE || lazyStatus === getStatuses.STATUS_DISCONNECTION_IN_PROGRESS")
                  .head
                    .login
                      | Пользователь
                    .updated
                      | Создан/изменён
                    .actions
                  .body
                    .body-row.mb-12.align-items-center(
                      v-for="manager in voucherManagerInfo ? voucherManagerInfo.managers : []"
                      :key="manager.manager_id"
                    )
                      template(v-if="isUpdatingVoucherManager && manager.manager_id === managerIdAction")
                        .login.mr-8
                          ErtTextField(
                            label="Полное имя"
                            v-model="vModelList.wifiVoucherManagerName"
                            :rules="vModelRuleList.wifiVoucherManagerName"
                            isShowRequiredLabel
                          )
                        .password.ml-8
                          ErtTextField(
                            label="Пароль"
                            v-model="vModelList.wifiVoucherManagerPassword"
                            :type="vModelTypeList.wifiVoucherManagerPassword"
                            :appendIcon="vModelTypeList.wifiVoucherManagerPassword === 'password' ? 'eye_close' : 'eye_open'"
                            appendOuterIcon="reload"
                            @click:append="() => { vModelTypeList.wifiVoucherManagerPassword = vModelTypeList.wifiVoucherManagerPassword === 'password' ? 'text' : 'password' }"
                            @click:append-outer="() => { onGeneratePassword('close-net') }"
                            :rules="vModelRuleList.wifiVoucherManagerPassword"
                            isShowRequiredLabel
                          )
                        .actions.ml-8
                          template(v-if="isUpdatingVoucherManagerRequest")
                            ErtProgressCircular(size="16" indeterminate)
                          template(v-else)
                            er-tooltip(bottom)
                              template(v-slot:activator="{ on }")
                                button(@click="onManagerUpdate")
                                  span(v-on="on")
                                    ErtIcon(name="circle_ok" small)
                              span Сохранить
                          er-tooltip(bottom)
                            template(v-slot:activator="{ on }")
                              button(@click.prevent="onCloseUpdateForm")
                                span(v-on="on")
                                  ErtIcon(name="close" small)
                            span Отмена
                      template(v-else)
                        .login {{ manager.full_name }}
                        .updated {{ manager.updated_at | dateTimeFormatted }}
                        .actions
                          template(v-if="manager.removed_at == null")
                            er-tooltip(bottom)
                              template(v-slot:activator="{ on }")
                                button(type="button" @click.prevent="onOpenUpdateForm(manager.manager_id)")
                                  span(v-on="on")
                                    ErtIcon(name="edit" small)
                              span Изменить
                            template(v-if="isRemovingVoucherManagerRequest && manager.manager_id === managerIdAction")
                              ErtProgressCircular(size="16" indeterminate)
                            template(v-else)
                              er-tooltip(bottom)
                                template(v-slot:activator="{ on }")
                                  button(type="button" @click.prevent="() => { onRemoveManager(manager.manager_id) }")
                                    span(v-on="on")
                                      ErtIcon(name="lock" small)
                                span Логическое удаление
                          template(v-else)
                            template(v-if="isRestoringVoucherManagerRequest && manager.manager_id === managerIdAction")
                              ErtProgressCircular(size="16" indeterminate)
                            template(v-else)
                              er-tooltip(bottom)
                                template(v-slot:activator="{ on }")
                                  button(@click.prevent="onManagerRestore(manager.manager_id)")
                                    span(v-on="on")
                                      ErtIcon(name="unlock" small)
                                span Восстановить

                    //- Форма добавления нового менеджера
                    er-slide-up-down(:active="isAddingVoucherManager && lazyStatus === getStatuses.STATUS_ACTIVE")
                      ErtForm.body-row.align-items-center(ref="manager-add")
                        .login.mr-8
                          ErtTextField(
                            label="Полное имя"
                            v-model="vModelList.wifiVoucherManagerName"
                            :rules="vModelRuleList.wifiVoucherManagerName"
                          )
                        .password.ml-8
                          ErtTextField(
                            label="Пароль"
                            v-model="vModelList.wifiVoucherManagerPassword"
                            :type="vModelTypeList.wifiVoucherManagerPassword"
                            :appendIcon="vModelTypeList.wifiVoucherManagerPassword === 'password' ? 'eye_close' : 'eye_open'"
                            @click:append="() => { vModelTypeList.wifiVoucherManagerPassword = vModelTypeList.wifiVoucherManagerPassword === 'password' ? 'text' : 'password' }"
                            :rules="vModelRuleList.wifiVoucherManagerPassword"
                          )
                        .actions.ml-8
                          template(v-if="!isAddingVoucherManagerRequest")
                            er-tooltip(bottom)
                              template(v-slot:activator="{ on }")
                                button(type="button" @click.prevent="onCreateManager")
                                  span(v-on="on")
                                    ErtIcon(name="circle_add" small)
                              span Сохранить
                          template(v-else)
                            ErtProgressCircular(size="16" indeterminate)
                          er-tooltip(bottom)
                            template(v-slot:activator="{ on }")
                              button(type="button" @click.prevent="() => { isAddingVoucherManager = false }")
                                span(v-on="on")
                                  ErtIcon(name="close" small)
                            span Отмена
                    er-slide-up-down(:active="!isAddingVoucherManager")
                      er-row
                        er-flex(xs12 md6)
                          ErButton(flat @click="() => { isAddingVoucherManager = true }") Добавить пользователя
                ErActivationModal(
                  type="error"
                  v-model="isErrorVoucherManager"
                  title="Возникла ошибка"
                  :isShowActionButton="false"
                  :persistent="true"
                  cancelButtonText="Закрыть"
                  @close="() => { isErrorVoucherManager = false }"
                )

                ErActivationModal(
                  type="success"
                  v-model="isSuccessVoucherManager"
                  title="Запрос выполнился успешно"
                  :isShowActionButton="false"
                  :persistent="true"
                  cancelButtonText="Закрыть"
                  @close="() => { isSuccessVoucherManager = false }"
                )
          .wifi-auth-service__card__actions
            .wifi-auth-service__card__action
              er-button(
                color="blue"
                :loading="loadingServiceWithParams"
                @click="onClick"
                :disabled="isInProgress"
              )
                | {{ getButtonText }}
      .ert-wifi-service-auth-item__price
        span {{ price | priceFormatted }}&nbsp;
        | ₽/мес
</template>

<script lang="ts" src="./script.ts"></script>

<style lang="scss" src="./style.scss"></style>
