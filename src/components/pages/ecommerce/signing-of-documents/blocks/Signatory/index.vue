<template lang="pug">
  .e-commerce-signatory
    h3.e-commerce-signatory__title Подписант
    p.e-commerce-signatory__subtitle Пожалуйста, загрузите доверенность подписанта.
    .e-commerce-signatory__signatory-name.info-block
      .e-commerce-signatory__signatory-name__caption.caption ФИО
      .e-commerce-signatory__signatory-name__value.value {{ computedSigneeName }}
    .e-commerce-signatory__downloaded-documents.mb--s
      h4.mb--s Загруженные документы
      template(v-if="isDownloadingDocuments")
        .e-commerce-signatory__downloaded-documents--downloading
          ErtProgressCircular(indeterminate width="4" size="24")
          span Загружаем документы
      template(v-else-if="listDocument.length === 0")
        .e-commerce-signatory__downloaded-documents--empty
          | Нет загруженных документов
      template(v-else)
        ErtDocumentItemComponent(
          v-for="(document, idx) in listDocument"
          :key="idx"
          :document="document"
        )
    template(v-if="computedHasFile")
      .e-commerce-signatory__document.info-block
        .e-commerce-signatory__document__caption.caption Документ
        .e-commerce-signatory__document__value.value
          template(v-if="internalFile")
            DocumentName(
              :documentName="computedFileName"
              :hasRemove="!isLoaded"
              @remove="() => { internalFile = null }"
              )
    template(v-else)
      FileUpload(
        labelText="Перетащите скан доверенности в эту область или выберите на компьютере"
        @input="(file) => { internalFile = file }"
      )
    .e-commerce-signatory__actions(v-if="internalFile")
      ErButton.mb-16(:loading="isLoading" :disabled="isLoaded" @click="uploadDocument") Сохранить
      .caption2 После сохранения документа его удаление станет невозможным!
    .e-commerce-signatory__success.caption2.success--text(v-if="isLoadSuccess") Документ успешно сохранён
    .e-commerce-signatory__success.caption2.error--text(v-if="isLoadError") Произошла ошибка при сохранении документа
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
