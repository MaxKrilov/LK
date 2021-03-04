<template lang="pug">
  .payment-history-page
    er-page-header.main-content.main-content--top-menu-fix.main-content--h-padding.main-content--top-padding(
      linkText="Назад"
      title="История платежей"
      backlink="/lk/payments"
    )

    //- Фильтр
    ErFilterContainer(
      :active="isVisibleFilter"
      :icon-click="() => { isVisibleFilter = true }"
    )
      // Выбранные для фильтрации данные
      div(slot="selected-filters" @click="() => { isVisibleFilter = true }")
        span.er-filter-container__active-filter.mr-16 {{ formatFilterPeriod }}
        span.er-filter-container__active-filter {{ payType.text }}
      .payment-history-page__filter-wrap
        .payment-history-page__filter-wrap__list.main-content.main-content--h-padding
          ErContainer.full.container--no-padding
            ErRow(align-items-center)
              ErFlex.xs12.sm8.md5.lg4.r-offset-sm4.r-offset-md0
                ErDatePicker(
                  v-model="datePickerModel"
                  :disabledDate="disabledDateCallback"
                )
                //-ErtMenu(
                //-  ref="picker-menu"
                //-  v-model="modelDatePicker"
                //-  :close-on-content-click="false"
                //-  :return-value.sync="datePickerModel"
                //-  transition="scale-transition"
                //-  offset-y
                //-  min-width="auto"
                //-  contentClass="payment-history-page__date-picker"
                //-)
                //-  template(v-slot:activator="{ on, attrs }")
                //-    ErtTextField(
                //-      :value="formatFilterPeriod"
                //-      label="Период"
                //-      readonly
                //-      v-bind="attrs"
                //-      v-on="on"
                //-    )
                //-  ErtDatePicker(
                //-    v-model="datePickerModel"
                //-    no-title
                //-    scrollable
                //-    range
                //-    :max="maxDatePicker"
                //-    :min="minDatePicker"
                //-  )
                //-  .payment-history-page__date-picker__footer
                //-    er-button.mr-8(@click="onSaveDatePicker") OK
                //-    er-button.ml-8(flat @click="modelDatePicker = false") Отмена
              ErFlex.xs12.sm8.md5.lg3.r-offset-sm6.r-offset-md0
                ErtSelect(
                  label="Тип"
                  v-model="payType"
                  :items="listPayType"
                  returnObject
                  item-value="id"
                  item-text="text"
                )
              ErFlex.md1.lg3.d--flex.align-items-center
                ErFilterClose(@click="isVisibleFilter = false")
    //- Список
    .payment-history-page__list.main-content.main-content--h-padding
      template(v-if="loadingPaymentHistoryBill")
        PaymentHistoryItem.mb-4(loading :data="{}" type="replenishment")
        PaymentHistoryItem(loading :data="{}" type="write_off")
      template(v-else-if="listHistoryBill.length === 0")
        .payment-history-page__list--not-found За выбранный период не найдено платежей или начислений
      template(v-else)
        template(v-for="(historyBillGroupByMonth) in listHistoryBill")
          .payment-history-page__month-year
            span.month {{ getMonthByTimestamp(historyBillGroupByMonth[0].timestamp) }}&nbsp;
            span.year '{{ getYearByTimestamp(historyBillGroupByMonth[0].timestamp) }}
          template(
            v-if="historyBillGroupByMonth.filter(historyItem => payType.id === 'all' ? true : (payType.id === historyItem.type)).length === 0"
          )
            .payment-history-page__list--not-found За данный месяц не найдено {{ payType.id === 'replenishment' ? 'пополнений' : 'списаний' }}
          template(v-else)
            PaymentHistoryItem.mb-4(
              v-for="(historyItem, index) in historyBillGroupByMonth"
              v-if="payType.id === 'all' ? true : (payType.id === historyItem.type)"
              :key="`${index}_${historyItem.timestamp}`"
              :data="historyItem"
              :type="historyItem.type"
          )
</template>

<script lang="ts" src="./script.ts"></script>

<style lang="scss" src="./style.scss"></style>
