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
            .caption.mb-24 On-line обращение
            er-button(flat pre-icon="chat" @click="openChat()")
              | Начать чат
        .b-contact-info--desktop__column.pl-32
          .icon.mb-24
            er-icon(name="map")
          .title.mb-16
            | Адреса
          .b-contact-info__addresses
            +addresses
    er-slide-up-down.mt-40(:active="toDirectorSlideUpDown")
      .b-contact-info__slide-up-down.pa-32
        .b-contact-info__slide-up-down__head.d--flex.justify-content-between.align-items-center.mb-40
          .title Написать директору Дом.ru Бизнес
          .required
            | &nbsp;- Поле обязательно к заполнению
        +toDirectorForm('director_form_desktop')
    er-dialog(
      v-model="toDirectorModal"
      fullscreen
      transition="dialog-bottom-transition"
    )
      .b-contact-info__director-modal
        .b-contact-info__director-modal__head.d--flex.flex-wrap.align-items-center.pa-16
          .title.mb-4 Написать директору Дом.ru Бизнес
          button.mb-4(@click="closeToDirectorModal")
            er-icon(name="close")
          .required
            | &nbsp;- Поле обязательно к заполнению
        .b-contact-info__director-modal__body.py-32.px-16
          +toDirectorForm('director_form_mobile')
    er-activation-modal(
      type="success"
      v-model="resultDialogSuccess"
      :title="`Ваша заявка № ${ticketName} сформирована и отправлена`"
      :is-show-action-button="false"
      cancel-button-text="Спасибо"
    )
      template(slot="description")
        | Спасибо за обращение! С Вами свяжется Ваш персональный менджер.
    er-activation-modal(
      type="error"
      v-model="resultDialogError"
      title="При запросе возникла ошибка"
      :is-show-action-button="false"
      cancel-button-text="Спасибо"
    )
      template(slot="description")
        | Попробуйте повторить попытку позже или обратитесь к Вашему персональному менджеру
</template>

<script src="./script.js"></script>
<style src="./_style.scss" lang="scss"></style>
