<template lang="pug">
  include ./_mixin
  .b-contact-info.mt-48.mt-md-56
    .b-contact-info--mobile
      slide-up-down-with-title-component.mb-4(
        icon="manager"
        title="Персональный менеджер"
      )
        .b-contact-info__personal-manager
          +personalManager
      slide-up-down-with-title-component.mb-4(
        icon="phone"
        title="Контакты"
      )
        +contactsPhone
      slide-up-down-with-title-component(
        icon="map"
        title="Адреса"
      )
        +addresses
    .b-contact-info--desktop
      .b-contact-info--desktop__content.d--flex
        .b-contact-info--desktop__column.b-contact-info__personal-manager.pr-32
          .icon.mb-24
            er-icon(name="manager")
          .title.mb-16
            | Персональный менеджер
          +personalManager
        .b-contact-info--desktop__column.pl-32.d--flex.flex-column
          .icon.mb-24
            er-icon(name="phone")
          .title.mb-16
            | Контакты
          +contactsPhone
          .b-contact-info__chat
            .caption.mb-24.mt-16 On-line обращение
            er-button(flat pre-icon="chat" @click="openChat()")
              | Начать чат
        .b-contact-info--desktop__column.pl-32
          .icon.mb-24
            er-icon(name="map")
          .title.mb-16
            | Адреса
          .b-contact-info__addresses
            +addresses

    er-activation-modal(
      type="success"
      v-model="resultDialogSuccess"
      :title="`Ваша заявка № ${ticketName} сформирована и отправлена`"
      :is-show-action-button="false"
      cancel-button-text="Спасибо"
    )
      template(slot="description")
        | Спасибо за обращение! С Вами свяжется Ваш персональный менеджер.
    er-activation-modal(
      type="error"
      v-model="resultDialogError"
      title="При запросе возникла ошибка"
      :is-show-action-button="false"
      cancel-button-text="Спасибо"
    )
      template(slot="description")
        | Попробуйте повторить попытку позже или обратитесь к Вашему персональному менеджеру
</template>

<script src="./script.js"></script>
<style src="./_style.scss" lang="scss"></style>
