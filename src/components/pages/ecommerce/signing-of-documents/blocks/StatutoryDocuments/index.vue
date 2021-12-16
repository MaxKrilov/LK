<template lang="pug">
  .e-commerce-statutory-documents
    h3.e-commerce-statutory-documents__title Загрузите документы
    .e-commerce-statutory-documents__subtitle.mb--xl
      div Набор документов для индивидуального предпринимателя:
      ul.mb--s
        li Скан-копия «Свидетельства о государственной регистрации ФЛ в качестве ИП (ОГРНИП)»
        li Скан-копия ИНН физ. лица
        li Скан-копия Паспорта (страница с фото и регистрацией).
      div Набор документов для юридического лица:
      ul
        li Скан-копия «Свидетельства о постановке на учет в налоговом органе по месту нахождения на территории РФ (ОГРНЮЛ)»
        li Устав (1, 2, 3 и последняя страница)
    .e-commerce-statutory-documents__list
      template(
        v-for="document in getListStatutoryDocument"
      )
        DocumentName.mb--m(
          :documentName="modelOpenViewer[document.id] ? 'Скачиваем' : document.fileName"
          :hasRemove="false"
          @click="onDownloadDocumentHandler(document, document.id)"
        )
      DocumentName.mb--m(
        v-for="(file, idx) in listInternalFile"
        :key="idx"
        :documentName="file.name"
        :hasRemove="!isLoaded"
        @remove="() => { removeFile(idx) }"
        @click="() => { !isLoaded && downloadFileOnDevice(file) }"
      )
    .e-commerce-statutory-documents__file-upload.mb-16
      FileUpload(
        :isLoaded="isLoadSuccess"
        labelText="Перетащите документ в эту область или выберите на компьютере"
        @input="(file) => { listInternalFile.push(file) }"
      )
    .e-commerce-statutory-documents__actions(v-if="listInternalFile.length > 0")
      ErButton.mb-16(:loading="isLoading" :disabled="isLoaded || !listInternalFile.length" @click="uploadDocuments") Сохранить
      .caption2 Возможно загрузить несколько файлов.
      .caption2 Размер каждого из загруженных файлов не должен превышать 10Мб.
      .caption2 После сохранения документов их удаление станет невозможным!

    .e-commerce-statutory-documents__success.caption2.success--text(v-if="isLoadSuccess") Документы успешно сохранены
    .e-commerce-statutory-documents__success.caption2.error--text(v-else-if="isLoadError") Произошла ошибка при сохранении документов
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
