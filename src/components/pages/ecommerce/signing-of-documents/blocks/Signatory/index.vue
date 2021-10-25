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
    .e-commerce-signatory__document.info-block
      .e-commerce-signatory__document__value.value
        DocumentName(
          v-for="(file, idx) in listInternalFile"
          :key="idx"
          :documentName="file.name"
          :hasRemove="!isLoaded"
          @remove="() => { removeFile(idx) }"
        )
    FileUpload.mb--m(
      labelText="Перетащите скан доверенности в эту область или выберите на компьютере"
      @input="(file) => { listInternalFile.push(file) }"
    )
    .e-commerce-signatory__actions
      ErButton.mb-16(:loading="isLoading" :disabled="isLoaded || listInternalFile.length === 0" @click="uploadDocument") Сохранить
      .caption2 После сохранения документа (-ов) его удаление станет невозможным! Вы можете загрузить несколько документов. Размер одного документа не должен превышать 2Мб
    .e-commerce-signatory__success.caption2.success--text(v-if="isLoadSuccess") Документ успешно сохранён
    .e-commerce-signatory__success.caption2.error--text(v-else-if="isLoadError") Произошла ошибка при сохранении документа
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
