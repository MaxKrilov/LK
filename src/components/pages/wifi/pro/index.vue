<template lang="pug">
  .ert-wifi-pro-page.main-content.main-content--top-menu-fix.main-content--h-padding.main-content--top-padding
    er-page-header(
      linkText="Назад на главную"
      title="WiFi PRO"
      backlink="/lk"
    )
    .ert-wifi-pro-page__content
      ErtWifiProItem(
        v-for="(content, domain) in listDomain"
        :key="domain"
        :domain="domain"
        :content="content"
        @success="onSuccessModal"
        @error="onErrorModal"
      )

    ErActivationModal(
      type="success"
      v-model="isSuccessModal"
      title="Заказ успешно создан"
      :isShowCancelButton="false"
      actionButtonText="Спасибо"
      :persistent="true"
      @confirm="() => { isSuccessModal = false }"
    )
      template(slot="description")
        | Заказ создан успешно. Выполнение заказа может занять некоторое время.&nbsp;
        | Актуальный статус можно узнать в&nbsp;
        router-link(to="/lk/orders") разделе Заказы.

    ErActivationModal(
      type="error"
      v-model="isErrorModal"
      title="Возникла ошибка"
      :isShowActionButton="false"
      :persistent="true"
      cancelButtonText="Закрыть"
      @close="() => { isErrorModal = false }"
    )
      template(slot="description")
        div Уважаемый Клиент, в данный момент операция не доступна, обратитесь к персональному менеджеру
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
