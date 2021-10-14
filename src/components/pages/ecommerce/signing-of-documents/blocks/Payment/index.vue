<template lang="pug">
  .e-commerce-payment
    .e-commerce-payment__score
      h4.e-commerce-payment__score__title.mb--m {{ bill.contractType }} (Договор № {{ bill.contractNumber }})
      .e-commerce-payment__billing-account
        .e-commerce-payment__billing-account__head.pb--m
          .billing-account-number
            .caption Лицевой счёт
            .value.d--flex.align-items-center
              | {{ bill.billingAccount }}
              ErTooltip(right)
                template(v-slot:activator="{ on }")
                  div.ml-8(v-on="on")
                    ErtIcon(name="erth__info")
                div
                  div Способ доставки документов:
                  div {{ getDeliveryMethod }}
          .amount
            .balance
              .caption Баланс:
              .value(:class="{ 'error--text': availableFunds < numberAmount }") {{ balance | priceFormatted }} ₽
            .to-pay(v-if="availableFunds < numberAmount")
              .caption К оплате:
              .value {{ getAmountToPay | priceFormatted }} ₽
        .e-commerce-payment__billing-account__body.pt--m
          template(v-if="availableFunds >= numberAmount")
            .e-commerce-payment__billing-account__body-success
              ErtIcon(name="erth__check")
              span Оплачено
          template(v-else)
            .description.mb--s
              | Оплатите онлайн и вы сможете завершить заказ сразу после оплаты. При оплате по счету для завершения заказа необходимо дождаться уведомления о зачислении средств.
            .actions
              .action
                ErButton.px-20(@click="openNewWindow()" :disabled="!isAllSignedDocument") Оплатить онлайн
              .action
                ErButton.px-20(
                  flat
                  :disabled="!isAllSignedDocument || isOpenViewer"
                  @click="onDownloadDocumentHandler(bill.document)"
                ) {{ isOpenViewer ? 'Загрузка' : 'Оплатить по счёту' }}
    ErtDialog(
      v-model="isOpenPaymentDialog"
      maxWidth="784"
      contentClass="e-commerce-payment__payment-dialog-content"
      :persistent="isPaymentRequest"
    )
      .e-commerce-payment__payment-dialog.pt--l.px--m.pb--xl
        h3.e-commerce-payment__payment-dialog-title.mb--m Оплата картой
        .e-commerce-payment__payment-dialog-description.mb--xl
          .icon.mr--xs
            ErtIcon(name="erth__info")
          .text
            | В целях вашей безопасности мы храним только ссылку на данные карты. Данные карты хранит банк.
        .e-commerce-payment__payment-dialog-iframe.mb--xl
          iframe(:src="getIframeSrc", ref="payment_frame")
        .e-commerce-payment__payment-dialog-actions
          .action.mb-8.mb-md-0.mr-md-24(v-if="!isPaymentSuccess")
            ErButton(@click="onPaymentHandler" :disabled="isPaymentRequest") Пополнить счёт
          .action.mb-8.mb-md-0.mr-md-24
            ErButton(flat @click="() => { isOpenPaymentDialog = false }" :disabled="isPaymentRequest") Закрыть
          .terms-of-use
            | Нажимая на кнопку, вы принимаете&nbsp;
            a(href="#") условия оплаты и безопасности
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
