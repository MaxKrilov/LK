<template lang="pug">
  .e-commerce-signatory
    h3.e-commerce-signatory__title Подписант
    p.e-commerce-signatory__subtitle Пожалуйста, загрузите доверенность подписанта.
    .e-commerce-signatory__signatory-name.info-block
      .e-commerce-signatory__signatory-name__caption.caption ФИО
      .e-commerce-signatory__signatory-name__value.value {{ computedSigneeName }}
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
            ErDocumentViewer(
              :listDocument="computedSignedDocument"
              v-model="isOpenViewer"
            )
              template(v-slot:activator="{ on }")
                DocumentName(
                  :documentName="computedFileName"
                  :hasRemove="false"
                  v-on="on"
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
