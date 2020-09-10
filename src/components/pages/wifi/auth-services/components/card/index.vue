<template lang="pug">
  .wifi-auth-service__card
    .wifi-auth-service__card__content
      .wifi-auth-service__card__input
        ErtSwitch(
          :input-value="[STATUS_IS_CONNECT, STATUS_IS_DISCONNECTING].includes(activeState)"
          :loading="[STATUS_IS_CONNECTING, STATUS_IS_DISCONNECTING].includes(activeState)"
          :disabled="[STATUS_IS_CONNECTING, STATUS_IS_DISCONNECTING].includes(activeState)"
          @change="changeToggle"
          ref="switch"
        )
      .wifi-auth-service__card__title
        | {{ title }}
      er-slide-up-down(
        :active="[STATUS_IS_DISCONNECT, STATUS_IS_CONNECTING].includes(activeState) || listAuthServiceWOForm"
      )
        .wifi-auth-service__card__description
          | {{ description }}
      er-slide-up-down(
        :active="[STATUS_IS_CONNECT, STATUS_IS_DISCONNECTING].includes(activeState) && listAuthServiceWithForm"
      )
        .wifi-auth-service__card__settings
          er-form(ref="form")
            template(v-if="code === WIFIREDIR")
              er-text-field(
                label="Адрес сайта"
                v-model="vModelList.wifiRedirSite"
                :rules="vModelRuleList.wifiRedirSite"
              )
                template(slot="prepend-outer")
                  er-hint {{ description }}
            template(v-if="code === WIFINAME")
              er-text-field(
                label="Название сети"
                v-model="vModelList.wifiName"
                :rules="vModelRuleList.wifiName"
              )
                template(slot="prepend-outer")
                  er-hint {{ description }}
            template(v-if="code === WIFIACCCHANGE")
              er-text-field.mb-32(
                label="PIN код заведения"
                :type="vModelTypeList.wifiAccChangePIN"
                v-model="vModelList.wifiAccChangePIN"
                :appendInnerIcon="vModelTypeList.wifiAccChangePIN === 'password' ? 'eye_close' : 'eye_open'"
                @click:append-inner="() => { vModelTypeList.wifiAccChangePIN = vModelTypeList.wifiAccChangePIN === 'password' ? 'text' : 'password' }"
                appendOuterIcon="reload"
                @click:append-outer="() => { onGeneratePassword('acc-change') }"
                :rules="vModelRuleList.wifiAccChangePIN"
              )
              er-text-field(
                label="Интервал авторизации (часов)"
                v-model="vModelList.wifiAccChangeInterval"
                :rules="vModelRuleList.wifiAccChangeInterval"
              )
            template(v-if="code === WIFIHSCLONET")
              er-text-field.mb-32(
                label="Название закрытой сети"
                v-model="vModelList.wifiHSClosNetName"
                :rules="vModelRuleList.wifiHSClosNetName"
              )
              er-text-field(
                label="Пароль"
                :type="vModelTypeList.wifiHSCloseNetPassword"
                v-model="vModelList.wifiHSCloseNetPassword"
                :appendInnerIcon="vModelTypeList.wifiHSCloseNetPassword === 'password' ? 'eye_close' : 'eye_open'"
                @click:append-inner="() => { vModelTypeList.wifiHSCloseNetPassword = vModelTypeList.wifiHSCloseNetPassword === 'password' ? 'text' : 'password' }"
                appendOuterIcon="reload"
                @click:append-outer="() => { onGeneratePassword('close-net') }"
                :rules="vModelRuleList.wifiHSCloseNetPassword"
              )
        .wifi-auth-service__card__actions
          .wifi-auth-service__card__action
            er-button(color="blue" :loading="isConnectingModal" @click="onConnectClick")
              | {{ buttonText }}
      .wifi-auth-service__card__price
        span {{ price | priceFormatted }}&nbsp;
        | ₽/мес
    ErPlugProduct(
      v-model="isConnectingModal"
      :orderData="orderData"
      isSendOrder
      :isUpdate="isConnect"
    )
    ErDisconnectProduct(
      v-model="isDisconnectingModal"
      :deleteOrderData="disconnectOrderData"
      isSendOrder
      @changeStatusConnection="cancelRequest"
    )
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
