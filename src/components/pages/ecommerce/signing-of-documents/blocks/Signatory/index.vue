<template lang="pug">
  .e-commerce-signatory
    h3.e-commerce-signatory__title Загрузите приказ/доверенность подписанта
    .e-commerce-signatory__signatory-name.info-block
      .e-commerce-signatory__signatory-name__caption.caption ФИО подписанта
      .e-commerce-signatory__signatory-name__value.value {{ computedSigneeName }}
    .e-commerce-signatory__downloaded-documents.mb--s
      template(v-if="isDownloadingDocuments")
        .e-commerce-signatory__downloaded-documents--downloading
          ErtProgressCircular(indeterminate width="4" size="24")
          span Загружаем документы
      template(v-else-if="listDocument.length === 0")
        .e-commerce-signatory__downloaded-documents--empty
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
          @click="() => { !isLoaded && downloadFileOnDevice(file) }"
        )
    FileUpload.mb--m(
      :isLoaded="isLoadSuccess"
      labelText="Перетащите скан доверенности в эту область или выберите на компьютере"
      @input="(file) => { listInternalFile.push(file) }"
    )
    .e-commerce-signatory__actions(v-if="listInternalFile.length > 0")
      ErButton.mb-16(:loading="isLoading" :disabled="isLoaded || listInternalFile.length === 0" @click="uploadDocuments") Сохранить
      .caption2 Возможно загрузить несколько файлов.
      .caption2 Размер каждого из загруженных файлов не должен превышать 10Мб.
      .caption2 После сохранения документов их удаление станет невозможным!

    .e-commerce-signatory__success.caption2.success--text(v-if="isLoadSuccess") Документ успешно сохранён
    .e-commerce-signatory__success.caption2.error--text(v-else-if="isLoadError") Произошла ошибка при сохранении документа
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
