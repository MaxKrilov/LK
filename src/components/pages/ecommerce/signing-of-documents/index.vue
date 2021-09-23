<template lang="pug">
  .e-commerce-signing-of-documents
    template(v-if="isLoading")
      .e-commerce-signing-of-documents__loading
        .icon
          ErtProgressCircular.mr-16(indeterminate width="4" size="48")
        .title
          | Загружаем данные
    template(v-if="isError")
      .e-commerce-signing-of-documents__error
        .icon
          ErtIcon.mr-16(name="close")
        .title
          | Произошла ошибка! Повторите попытку позже
    template(v-else)
      //- Подписант (-ы)
      template(v-if="!isCharter")
        template(
          v-for="contractSignee in listContractSignee"
        )
          Signatory.mb--xl(
            :contractSignee="contractSignee"
          )
      //- Показываем форму загрузку уставных документов только в том случае
      //- если нет договоров в статусах "Активный", "Истёк", "Расторгнут"
      template(v-if="!isActiveClient && !isCharter")
        StatutoryDocuments.mb--4xl()
      template(v-if="signatureType === 'Ручная'")
        SigningWithScans.mb--4xl(
          :documents="listContractDocument"
          @signed="(e) => isAllSignedDocument = e === 1"
          @verifying="(e) => isVerifying = e === 1"
        )
      template(v-else)
        DigitalSigning.mb--4xl(
          :documents="listContractDocument"
          @signed="(e) => isAllSignedDocument = e === 1"
        )
      h3.e-commerce-payment__title.mb--xl Оплата
      Payment(
        v-for="(bill, idx) in listBills"
        :key="idx"
        :bill="bill"
        :isAllSignedDocument="isAllSignedDocument || isVerifying"
        @payment="onPaymentHandler(bill.billingAccount)"
      )
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
