<template lang="pug">
  .ert-wifi-pro-item
    ErCardProducts(
      icon="wifi"
      :price="getPrice"
      @open="getPacketOffer"
    )
      | {{ domain }}
      template(v-slot:date-title) {{ '' }}
      template(v-slot:slider-content)
        .ert-wifi-pro-item__slider-content
          .ert-wifi-pro-item__sms-packets
            .ert-wifi-pro-item__sms-packets__select.mr-sm-16.mr-md-24.mr-xl-32
              ErtSelect(
                v-model="smsPacket"
                :items="listSMSPacket"
                label="Пакет SMS"
                item-text="name"
                item-value="code"
                :loading="loadingPacket"
                :disabled="loadingPacket"
                :errorMessages="errorMessage"
                returnObject
                ref="sms-select"
              )
            .ert-wifi-pro-item__sms-packets__button(:class="{ visible: isVisibleChangeButton }")
              ErButton(@click="openDialogQuestion")
                | Изменить
          .ert-wifi-pro-item__locations
            .ert-wifi-pro-item__locations__title.mb-24
              | Адреса подключений
            .ert-wifi-pro-item__locations__content
              .ert-wifi-pro-item__locations__content__row(
                v-for="service in content.services"
                :key="service.id"
              )
                .address.mb-8
                  | {{ service.fullAddress }}
                template(v-if="service.status.toLowerCase() === 'active'")
                  .tariff.mb-8
                    .caption.mb-4
                      | Тариф
                    .value.mt-0
                      | {{ service.offer.name }}
                  .price
                    span {{ service.purchasedPrices.recurrentTotal.value | priceFormatted }}
                    | &nbsp;₽/месяц
                template(v-if="['suspended', 'disconnected'].includes(service.status.toLowerCase())")
                  .stopped
                    ErtIcon(name="no_enter")
                    | Приостановлен
    //- Оставляем - в будущем должно делаться через заказы
    ErtDialog(
      persistent
      :maxWidth="470"
    )
      .ert-wifi-pro-item__dialog-content
        .ert-wifi-pro-item__dialog-content__icon
          ErtIcon(name="question")
        .ert-wifi-pro-item__dialog-content__content
          .ert-wifi-pro-item__dialog-content__title
            | Вы уверены, что хотите подключить «{{ smsPacket.name }}»
          .ert-wifi-pro-item__dialog-content__price
            | Стоимость:&nbsp;
            span {{ smsPacket.price }}&nbsp;
              span ₽/мес
          .ert-wifi-pro-item__dialog-content__offer
            ErtForm(ref="offer-form")
              ErtCheckbox(v-model="isOffer" :rules="offerCheckboxRules")
                template(slot="label")
                  .ert-wifi-pro-item__dialog-content__offer-label
                    | Я прочитал и принял&nbsp;
                    a(
                      :href="offerLink"
                      target="_blank"
                      @click.stop
                    ) условия оферты
          .ert-wifi-pro-item__dialog-content__warning
            ErtIcon(name="warning")
            | Текущий пакет SMS будет отключён
        .ert-wifi-pro-item__dialog-content__actions
          .ert-wifi-pro-item__dialog-content__action
            ErButton(flat @click="closeDialogQuestion" :disabled="isLoadingConnect") Отменить
          .ert-wifi-pro-item__dialog-content__action
            ErButton(@click="changeSMSPacket" :loading="isLoadingConnect") Подключить
    ErPlugProduct(
      v-model="dialogQuestion"
      isSendManagerRequest
      :requestData="changeData"
    )
</template>

<script lang="ts" src="./script.ts"></script>

<style lang="scss" src="./style.scss"></style>
