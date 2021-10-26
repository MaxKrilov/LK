<template lang="pug">
  .e-commerce-statutory-documents
    h3.e-commerce-statutory-documents__title Загрузите уставные документы (Устав, ОГРН или Свидетельство о регистрации ИП)
    .e-commerce-statutory-documents__list
      template(
        v-for="document in getListStatutoryDocument"
      )
        ErDocumentViewer(
          v-model="modelOpenViewer[document.id]"
          :listDocument="[document]"
        )
          template(v-slot:activator="{ on }")
            DocumentName.mb--m(
              :documentName="document.fileName"
              :hasRemove="false"
              v-on="on"
            )
      DocumentName.mb--m(
        v-for="(file, idx) in listInternalFile"
        :key="idx"
        :documentName="file.name"
        :hasRemove="!isLoaded"
        @remove="() => { removeFile(idx) }"
      )
    .e-commerce-statutory-documents__file-upload.mb-16
      FileUpload(
        labelText="Перетащите документ в эту область или выберите на компьютере"
        @input="(file) => { listInternalFile.push(file) }"
      )
    .e-commerce-statutory-documents__actions
      ErButton.mb-16(:loading="isLoading" :disabled="isLoaded || !listInternalFile.length" @click="uploadDocuments") Сохранить
      .caption2 Возможно загрузить несколько файлов. Размер каждого из загруженных файлов не должен превышать 2Мб. После сохранения документов их удаление станет невозможным!
    .e-commerce-statutory-documents__success.caption2.success--text(v-if="isLoadSuccess") Документы успешно сохранены
    .e-commerce-statutory-documents__success.caption2.error--text(v-else-if="isLoadError") Произошла ошибка при сохранении документов
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
