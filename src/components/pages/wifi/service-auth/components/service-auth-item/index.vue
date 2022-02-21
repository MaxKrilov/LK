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
        a.ert-wifi-service-auth-item__portal(
          v-if="code === 'WIFIAVTVOUCH' && [getStatuses.STATUS_ACTIVE, getStatuses.STATUS_DISCONNECTION_IN_PROGRESS].includes(lazyStatus)"
          href="https://wifi.domru.ru/gui/voucher/login"
          target="_blank"
          rel="noopener"
        )
          ErtIcon(name="doc")
          .title Перейти на портал
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
        //- er-slide-up-down(:active="lazyStatus === getStatuses.STATUS_DISCONNECTED || lazyStatus === getStatuses.STATUS_ACTIVATION_IN_PROGRESS")
        er-slide-up-down(:active="lazyStatus !== getStatuses.STATUS_ACTIVE && lazyStatus !== getStatuses.INTERNAL_STATUS_CONNECTING")
          .ert-wifi-service-auth-item__description
            | {{ description }}
        //- er-slide-up-down(:active="lazyStatus !== getStatuses.STATUS_DISCONNECTED && lazyStatus !== getStatuses.STATUS_ACTIVATION_IN_PROGRESS")
        er-slide-up-down(:active="lazyStatus === getStatuses.STATUS_ACTIVE || lazyStatus === getStatuses.INTERNAL_STATUS_CONNECTING")
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
                  template(v-slot:append-outer)
                    er-hint Название сети должно состоять из латинских букв, цифр, символов «-» «_» и не должно быть длинее 20 символов
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
                ErtAuthVoucherComponent(
                  :bpi="bpi"
                  :status="lazyStatus"
                  :loginPrefix="vModelList.wifiVoucherPrefix"
                  @change="onClick"
                  @change:login-prefix="(e) => { vModelList.wifiVoucherPrefix = e }"
                )
          .wifi-auth-service__card__actions
            .wifi-auth-service__card__action(
              v-if="!(code === 'WIFIAVTVOUCH' && [getStatuses.STATUS_ACTIVE, getStatuses.STATUS_DISCONNECTION_IN_PROGRESS].includes(lazyStatus))"
            )
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
