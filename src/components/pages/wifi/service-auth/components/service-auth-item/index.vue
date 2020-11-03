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
      template(v-else-if="isServiceAuthWithParameters")
        er-slide-up-down(:active="lazyStatus === getStatuses.STATUS_DISCONNECTED || lazyStatus === getStatuses.STATUS_ACTIVATION_IN_PROGRESS")
          .ert-wifi-service-auth-item__description
            | {{ description }}
        er-slide-up-down(
          :active="lazyStatus !== getStatuses.STATUS_DISCONNECTED && lazyStatus !== getStatuses.STATUS_ACTIVATION_IN_PROGRESS"
        )
          .ert-wifi-service-auth-item__settings
            ErtForm(ref="form")
              template(v-if="code === 'WIFIREDIR'")
                ErtTextField(
                  label="Адрес сайта"
                  v-model="vModelList.wifiRedirSite"
                  :rules="vModelRuleList.wifiRedirSite"
                )
                  template(slot="prepend")
                    er-hint {{ description }}
              template(v-if="code === 'WIFINAME'")
                ErtTextField(
                  label="Название сети"
                  v-model="vModelList.wifiName"
                  :rules="vModelRuleList.wifiName"
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
                  :rules="vModelRuleList.wifiAccChangePIN"
                )
                ErtTextField(
                  label="Интервал авторизации (часов)"
                  v-model="vModelList.wifiAccChangeInterval"
                  :rules="vModelRuleList.wifiAccChangeInterval"
                )
              template(v-if="code === 'WIFIHSCLONET'")
                ErtTextField(
                  label="Название закрытой сети"
                  v-model="vModelList.wifiHSClosNetName"
                  :rules="vModelRuleList.wifiHSClosNetName"
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
