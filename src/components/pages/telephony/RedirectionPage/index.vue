<template lang="pug">
  .ert-telephony-redirection
    er-page-header.main-content.main-content--top-menu-fix.main-content--h-padding.main-content--top-padding(
      linkText="Назад"
      title="Переадресация"
      backlink="/lk/telephony"
    )

    //- Список точек
    .ert-telephony-redirection__list-point.main-content.main-content--h-padding
      ErListPoint(
        v-model="activePoint"
        :list="listPoint"
        :isLoading="isLoadingListPoint"
      )

    template(v-if="isLoadingProducts")
      .ert-telephony-redirection__loading
        ErtProgressCircular(indeterminate width="2")
        .title Загружаем список переадресаций
    template(v-else-if="isLoadedProductsError")
      .ert-wifi-personalization-page__error
        .title При загрузке возникла ошибка! Повторите запрос позднее
    template(v-else-if="listRedirection.length === 0")
      .ert-wifi-personalization-page__empty
        .description.main-content.main-content--h-padding.mb-32
          | Номер для переадресации необходимо указывать после +7, с кодом города для стационарных телефонов. Например для телефона +7 912 345 67 89
          | указывать: <b>912 345 67 89</b>
        ErtRedirectionAddForm(
          :listPhone="listPhone"
          :listRedirection="listRedirection"
          :locationId="locationId"
          :marketId="marketId"
          @success="onSuccessHandler"
        )
    template(v-else)
      //- Список переадресаций
      .ert-telephony-redirection__list-redirection
        .ert-telephony-redirection__list-redirection__head.main-content.main-content--h-padding
          .from-to С телефона/На телефон
          .from С телефона
          .to На телефон
          .type По признаку
          .period Период
          .actions Действия
        .ert-telephony-redirection__list-redirection__body.mb-32.mb-md-40
          ErtRedirectionItemComponent(
            v-for="redirection in listRedirection"
            v-bind="redirection"
            :listPhone="listPhone"
            :listRedirection="listRedirection"
            :key="redirection.id"
            @success="onSuccessHandler"
          )

      //- Форма добавления переадресаций
      ErtRedirectionAddForm(
        :listPhone="listPhone"
        :listRedirection="listRedirection"
        :locationId="locationId"
        :marketId="marketId"
        @success="onSuccessHandler"
      )

    ErActivationModal(
      type="success"
      v-model="isRequestSuccess"
      title="Заказ успешно создан"
      :isShowActionButton="false"
      cancelButtonText="Спасибо"
      :persistent="true"
    )
      template(slot="description")
        | Заказ создан успешно. Выполнение заказа может занять некоторое время.&nbsp;
        | Актуальный статус можно узнать в&nbsp;
        router-link(to="/lk/orders") разделе Заказы.
</template>

<script lang="ts" src="./script.ts"></script>

<style lang="scss" src="./style.scss"></style>
