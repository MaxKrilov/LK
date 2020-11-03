<template lang="pug">
  .ert-wifi-personalization-dialog-logo
    ErtDialog(
      v-model="internalValue"
      maxWidth="592"
      persistent
    )
      .ert-wifi-personalization-dialog-logo__content
        .ert-wifi-personalization-dialog-logo__head.mb-16
          .ert-wifi-personalization-dialog-logo__title
            | Загрузить логотип
          .ert-wifi-personalization-dialog-logo__close
            button(@click="closeDialog")
              ErtIcon(name="close" small)
        .ert-wifi-personalization-dialog-logo__body.d--flex.flex-column.flex-sm-row.mb-md-40
          .ert-wifi-personalization-dialog-logo__upload-file.mb-16.mr-sm-8.mb-sm-0
            form.input-box(ref="upload-file-form" v-show="!logoBase64 && !issetServerImage")
              input(type="file" :id="computedId" @change="onChange" ref="file-input")
              label(:for="computedId") Загрузите логотип
              .drag-n-drop-text Или перетащите в данную область
              .error-text(v-if="errorText !== ''") {{ errorText }}
            .image-box(v-show="logoBase64 || issetServerImage")
              img(:src="logoBase64 || srcServerImage")
          .ml-sm-8
            .ert-wifi-personalization-dialog-logo__description.mb-16
              | Размер изображения не более 300х300 пкс. Формат изображения: *.JPG, *.PNG, *.GIF. Размер файла не должен превышать 300 Кб
            //- Подразумеваем, что у нас один файл
            .ert-wifi-personalization-dialog-logo__file-list.mb-40.mb-sm-32.mb-md-0(:class="{ 'visible': logo || issetServerImage }")
              .ert-wifi-personalization-dialog-logo__file-item
                .icon
                  ErtIcon(name="image")
                .title
                  | {{ ((logo && logo.name) || issetServerImage && lazyImage) | fileName }}
                .close
                  button(@click="removeFile")
                    ErtIcon(name="close")
        .ert-wifi-personalization-dialog-logo__actions.d--flex.flex-column.flex-sm-row
            .ert-wifi-personalization-dialog-logo__action-item.mb-8.mb-sm-0.mr-sm-8
              ErButton(:disabled="!isDoneAction" @click="save")
                | Сохранить
            .ert-wifi-personalization-dialog-logo__action-item.ml-sm-8
              ErButton(flat @click="cancel")
                | Отменить
</template>

<script lang="ts" src="./script.ts"></script>

<style lang="scss" src="./style.scss"></style>
