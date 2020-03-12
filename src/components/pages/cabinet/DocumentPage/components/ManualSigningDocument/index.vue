<template lang="pug">
  .manual-signing-document
    er-dialog(
      v-model="internalValue"
      :max-width="484"
    )
      .manual-signing-document__modal
        .content
          .icon
            er-icon(name="doc_edit")
          .close
            button(@click="internalValue = false")
              er-icon(name="close")
          .title
            | Подписать документ
          .description
            | Вам нужно скачать документ, подписать его вручную и прикрепить сканированый документ с подписью
          .sub-description
            template(v-if="file")
              span.name {{ this.file.name }}
              button(@click="resetDocument")
                er-icon(name="close")
              span.size {{ fileSize }}
            template(v-else)
              | Размер файла не более 2Мб. Формат: pdf, doc, docx
          .footer.d--flex.flex-column.flex-sm-row.mt-auto
            .action.mb-8.mb-sm-0.mr-sm-8
              template(v-if="file")
                er-button(flat)
                  | Отмена
              template(v-else)
                er-button(color="blue" pre-icon="download" @click="() => { downloadFile() }")
                  | Скачать
            .action.ml-sm-8
              template(v-if="file")
                er-button(@click="sendingDocumentForVerification" :loading="inProgress")
                  | Сохранить
              template(v-else)
                input(type="file" @change="addDocument" accept=".doc, .docx, .pdf" ref="input_file")
                er-button(flat)
                  | Загрузить
    er-activation-modal(
      v-model="isSuccess"
      type="success"
      title="Документ отправлен на проверку"
      :is-show-cancel-button="false"
      action-button-text="Спасибо"
      @confirm="() => { isSuccess = false }"
    )
    er-activation-modal(
      v-model="isError"
      type="error"
      title="Произошла ошибка"
      action-button-text="Попробовать снова"
      @confirm="() => { tryAgain() }"
    )
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./_style.scss"></style>
