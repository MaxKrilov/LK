<template lang="pug">
  .ert-user-list-item.ert-document-item
    .ert-document-item__info
      .ert-document-item__number.mb-4
        | Список пользователей
      .ert-document-item__description(
        :class="{ 'error--text': !isUpdated, 'success--text': isUpdated }"
      )
        | {{ descriptionText }}
    .ert-document-item__actions.ml-auto
      button.ert-document-item__action(
        @click="() => { isShowDialogUploadFile = true }"
      )
        ErtIcon(name="reload")
        span Обновить
      a.ert-document-item__action(
        :href="templatePath"
      )
        ErtIcon(name="download" small)
        span Скачать шаблон

    ErtActivationModal(
      v-model="isShowDialogUploadFile"
      confirmButtonText="Обновить"
      :isLoadingConfirmButton="isUpdatingFileUserList"
      :isShowCancelButton="true"
      :isShowMessageBlockIcon="false"
      maxWidth="532"
      title="Загрузить список пользователей"
      @confirm="onConfirmHandler"
    )
      template(v-slot:message)
        .mb-32
          | Вы обязаны обновлять список пользователей каждый квартал во исполнение требований&nbsp;
          a.link--dashed.body-font.ert-user-list-item__dialog-link(href="http://base.garant.ru/12155536/" target="_blank" rel="noopener") Правил оказания услуг связи
          | . После загрузки нового списка старый будет удалён.
      template(v-slot:description)
        template(v-if="issetFile")
          .ert-user-list-item__file-load.mb-8
            button.icon(@click="onRemoveFile")
              ErtIcon(name="close" small)
            .title {{ fileName }}
        template(v-else)
          .ert-user-list-item__file-load.mb-8
            .icon.mr-8
              ErtIcon(name="small_husks" small)
            button.title(@click="onAddFileHandler") Прикрепить файл
        .caption2.text-color-black05
          | Допустимый формат файлов: .doc, .docx, .pdf, .csv, .xls, .xslx, .jpeg, .jpg, .gif, .png, .tiff, .bmp Размер не должен превышать 2 МБ.
        .caption2.error--text(v-if="errorFileText") {{ errorFileText }}

    ErtActivationModal(
      v-model="isUpdatedError"
      confirmButtonText="Закрыть"
      title="Произошла ошибка!"
      type="error"
      @confirm="() => { isUpdatedError = false }"
    )
      template(v-slot:message)
        | При обновлении списка пользователей произошла ошибка! Повторите попытку позже

    ErtActivationModal(
      v-model="isUpdatedSuccess"
      confirmButtonText="Закрыть"
      title="Обновление списка пользователей"
      type="success"
      @confirm="() => { isUpdatedSuccess = false }"
    )
      template(v-slot:message)
        | Обновление списка пользователей прошло успешно!
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
