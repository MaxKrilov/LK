<template lang="pug">
  .e-commerce-signing-of-documents
    template(v-if="isLoading")
      .e-commerce-signing-of-documents__loading
        .icon
          ErtProgressCircular.mr-16(indeterminate width="4" size="48")
        .title
          | Загружаем данные
    template(v-else-if="isError")
      .e-commerce-signing-of-documents__error
        .icon
          ErtIcon.mr-16(name="close")
        .title
          | Произошла ошибка! Повторите попытку позже
    template(v-else)
      ErContainer.full.container--no-padding
        //- Подписант (-ы)
        template(v-if="!isCharter && !(isEverythingPaid && isVerifying)")
          ErRow
            ErFlex(xs12 md9)
              template(v-for="contractSignee in listContractSignee")
                Signatory.mb--xl(:contractSignee="contractSignee")
        //- Показываем форму загрузку уставных документов только в том случае
        //- если нет договоров в статусах "Активный", "Истёк", "Расторгнут"
        template(v-if="!isActiveClient")
          ErRow
            ErFlex(xs12 md9)
              StatutoryDocuments.mb--4xl()
        template(v-if="signatureType === 'Ручная'")
          ErRow.pos--relative
            ErFlex(xs12 md9)
              SigningWithScans.mb--4xl(
                :documents="listContractDocument"
                @signed="(e) => isAllSignedDocument = e === 1"
                @verifying="(e) => isVerifying = e === 1"
              )
            ErFlex(xs12 md3)
              .e-commerce-signing-of-documents__hint
                h4 Как подписать и загрузить подписанный документ?
                ol
                  li(v-for="(hint, idx) in listHintWithScans" :key="idx")
                    span.text {{ hint }}
        template(v-else)
          ErRow.pos--relative
            ErFlex(xs12 md9)
              DigitalSigning.mb--4xl(
                :documents="listContractDocument"
                @signed="(e) => isAllSignedDocument = e === 1"
              )
            ErFlex(xs12 md3)
              .e-commerce-signing-of-documents__hint
                h4 Как осуществить подписание Электронно Цифровой Подписью?
                ol
                  li(v-for="(hint, idx) in listHintDigital" :key="idx")
                    span.text {{ hint }}
        template(v-if="!isLoading && !(isEverythingPaid && isVerifying)")
          h3.e-commerce-payment__title.mb--xl Оплата
          ErRow
            ErFlex(xs12 md9)
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
