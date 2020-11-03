<template lang="pug">
  .ert-wifi-personalization-dialog-background
    ErtDialog(
      v-model="internalValue"
      :transition="computedTransition"
      :maxWidth="computedMaxWidth"
      scrollable
    )
      .ert-wifi-personalization-dialog-background__content
        .ert-wifi-personalization-dialog-background__head
          .ert-wifi-personalization-dialog-background__title
            | Настройка фона
          .ert-wifi-personalization-dialog-background__close
            button(@click="onCloseDialog")
              ErtIcon(name="close" small)
        .ert-wifi-personalization-dialog-background__body
          //- Background Color
          .ert-wifi-personalization-dialog-background__background-color
            .ert-wifi-personalization-dialog-background__background-color__title
              | Заливка фона
            .ert-wifi-personalization-dialog-background__background-color__row
              .ert-wifi-personalization-dialog-background__background-color__picker
                div(
                  :style="{ backgroundColor: backgroundColor.hex }"
                  @click="onOpenColorPicker"
                )
              .ert-wifi-personalization-dialog-background__background-color__hex
                ErtTextField(
                  label="HEX"
                  v-model="backgroundColor.hex"
                  readonly
                  hideDetails
                  @click="onOpenColorPicker"
                )
              .ert-wifi-personalization-dialog-background__background-color__rgba.d--flex
                ErtTextField(
                  label="R"
                  readonly
                  v-model="backgroundColor.rgba.r"
                  hideDetails
                  @click="onOpenColorPicker"
                )
                ErtTextField(
                  label="G"
                  readonly
                  v-model="backgroundColor.rgba.g"
                  hideDetails
                  @click="onOpenColorPicker"
                )
                ErtTextField(
                  label="B"
                  readonly
                  v-model="backgroundColor.rgba.b"
                  hideDetails
                  @click="onOpenColorPicker"
                )
          //- Background Image
          .ert-wifi-personalization-dialog-background__background-image.isset(v-if="issetServerBackgroundImage || backgroundImageFile")
            .ert-wifi-personalization-dialog-background__background-image__file-row
              .icon
                ErtIcon(name="image")
              .title
                span
                  | {{ ( backgroundImageFile && backgroundImageFile.name ) || (issetServerBackgroundImage && lazyBackgroundImage) | fileNameFormatted }}
              .remove
                button(@click="removeBackgroundImage")
                  ErtIcon(name="close" small)
          .ert-wifi-personalization-dialog-background__background-image(v-else)
            .ert-wifi-personalization-dialog-background__background-image__file-input
              input(
                type="file"
                id="wifi-personalization-background-image"
                @change="onLoadBackgroundImage"
                ref="file-background-image"
              )
              label(for="wifi-personalization-background-image")
                | Загрузить изображение фона
              .error--text.caption2(v-if="errorLoadedBackgroundImage")
                | {{ errorLoadedBackgroundImage }}
            .ert-wifi-personalization-dialog-background__background-image__description
              | Размер не более 1920х1080 px и не менее 1024х300 px. Формат: *.JPG или *.PNG, *.SVG. Размер файла не должен превышать 300 Кб. Название файла не должно содержать пробелы и русские буквы.
          .ert-wifi-personalization-dialog-background__background-image__is-fullscreen
            ErtCheckbox(
              v-model="lazyIsFullscreen"
              label="Полноэкранный режим"
            )
          //- Color text
          .ert-wifi-personalization-dialog-background__color-text
            .ert-wifi-personalization-dialog-background__color-text__title
              | Цвет текста
            .ert-wifi-personalization-dialog-background__color-text__row
              .ert-wifi-personalization-dialog-background__color-text__item
                ErtCheckbox(label="Чёрный" v-model="colorText" value="black")
              .ert-wifi-personalization-dialog-background__color-text__item
                ErtCheckbox(label="Белый" v-model="colorText" value="white")
          //- Preview
          .ert-wifi-personalization-dialog-background__preview(
            :style="previewStyles"
          )
            .ert-wifi-personalization-dialog-background__preview__head
              //- Инлайновые стили необходимы, так как значение должно быть в пикселях, а не в rem и em
              .ert-wifi-personalization-dialog-background__preview__logo(:style="{ 'line-height': '32px' }")
                | Логотип
              .ert-wifi-personalization-dialog-background__preview__help
                span
                span
            .ert-wifi-personalization-dialog-background__preview__banner-content
              .ert-wifi-personalization-dialog-background__preview__banner-preview(
                v-if="issetServerBanner || bannerFile"
                :style="getBannerPreviewStyles"
              )
                img(:src="bannerBase64 || lazyBanner")
                .ert-wifi-personalization-dialog-background__preview__banner-file
                  .title
                    span {{ (bannerFile && bannerFile.name) || (issetServerBanner && lazyBanner) | fileNameFormatted }}
                  .remove
                    button(@click="removeBanner")
                      ErtIcon(name="close" small)
              .ert-wifi-personalization-dialog-background__preview__banner(:class="{ 'hidden': issetServerBanner || bannerFile }")
                input(
                  type="file"
                  id="wifi-personalization-banner"
                  ref="file-banner"
                  @change="onLoadBanner"
                )
                label(for="wifi-personalization-banner")
                  | Загрузить баннер
                .error--text.caption2(v-if="errorLoadedBanner")
                  | {{ errorLoadedBanner }}
                .description
                  | Размер не более 1920х1080 px и не менее 1024х300 px. Формат: *.JPG или *.PNG, *.SVG. Размер файла не должен превышать 300 КБ. Название файла не должно содержать пробелы и русские буквы
            .ert-wifi-personalization-dialog-background__preview__buttons
              .ert-wifi-personalization-dialog-background__preview__button
              .ert-wifi-personalization-dialog-background__preview__button
              .ert-wifi-personalization-dialog-background__preview__button
              .ert-wifi-personalization-dialog-background__preview__button
            .ert-wifi-personalization-dialog-background__preview__offer
              img(:src="require('@/components/pages/wifi/personalization/images/offer.svg')")
          //- Actions
          .ert-wifi-personalization-dialog-background__actions.d--flex.flex-column.flex-sm-row
            .ert-wifi-personalization-dialog-background__action.mb-8.mb-sm-0.mr-sm-16
              ErButton(@click="save") Сохранить
            .ert-wifi-personalization-dialog-background__action
              ErButton(flat @click="cancel") Отменить
    ErtDialog(
      v-model="isShowColorPicker"
      maxWidth="300"
    )
      .ert-wifi-personalization-dialog-background__background-color__dialog-content
        ErtColorPicker(
          flat
          v-model="backgroundColorHex"
        )
</template>

<script lang="ts" src="./script.ts"></script>

<style lang="scss" src="./style.scss"></style>
