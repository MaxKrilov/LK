<template lang="pug">
  .digital-signing-document
    er-dialog(
      v-model="isShowListCertificateDialog"
      :max-width="getMaxWidthDialog"
      :persistent="isSigningDocument"
    )
      .digital-signing-document__dialog
        .content
          .icon
            er-icon(name="doc_edit")
          .close
            button(@click="() => { !isSigningDocument && ( internalValue = false ) }")
              er-icon(name="close")
          .title
            | Подписать документ
          .description
            | Для подписания документа ЭЦП выберите сертификат
          .list
            er-form(ref="certificate_form")
              er-select(
                :items="listCertificate"
                v-model="selectedCertificate"
                :rules="[ v => !!v || 'Выберите сертификат' ]"
              )
          .actions.mt-auto.d--flex.flex-column-reverse.flex-sm-row
            .action.pr-sm-8
              er-button(flat @click="() => { !isSigningDocument && ( internalValue = false ) }") Отменить
            .action.mb-8.mb-sm-0.pl-sm-8
              er-button(@click="signDocument" :loading="isSigningDocument") Подписать
    er-activation-modal(
      type="success",
      title="Документ успешно подписан"
      :is-show-action-button="false"
      cancel-button-text="Спасибо",
      v-model="isSuccess"
    )
      template(slot="description")
        | Вы можете скачать документ<br>
        a.d--inline-block.link--solid--black-yellow(:href="linkDownload" :download="fileName") Скачать
        .error-block(v-if="errorText")
          | При отправке заказа в работу произошла ошибка
            code(v-html="errorText")
    er-activation-modal(
      type="error",
      title="Возникла ошибка при подписании документа"
      :is-show-action-button="false"
      cancel-button-text="Закрыть",
      v-model="isError"
    )
      template(slot="description")
        .error-block
          code(v-html="errorText")
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./_style.scss"></style>
