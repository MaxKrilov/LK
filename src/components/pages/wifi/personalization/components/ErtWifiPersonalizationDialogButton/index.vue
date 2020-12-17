<template lang="pug">
  .ert-wifi-personalization-dialog-button
    ErtDialog(
      v-model="internalValue"
      :maxWidth="dialogMaxWidth"
      persistent
    )
      .ert-wifi-personalization-dialog-button__content
        .ert-wifi-personalization-dialog-button__head
          .title
            | Настройка кнопок
          .close
            button(@click="onCloseDialog")
              ErtIcon(name="close" small)
        .ert-wifi-personalization-dialog-button__body
          .ert-wifi-personalization-dialog-button__buttons-text
            .ert-wifi-personalization-dialog-button__buttons-text-item.pr-md-12
              ErtTextField(hideDetails appendIcon="edit" label="Я гость" v-model="lazyButtons.guest.title")
                template(v-slot:prepend)
                  ErtCheckbox(hideDetails disabled :value="true")
            .ert-wifi-personalization-dialog-button__buttons-text-item.pl-md-12
              ErtTextField(hideDetails appendIcon="edit" label="Я клиент Дом.ru" v-model="lazyButtons.abonent.title")
                template(v-slot:prepend)
                  ErtCheckbox(hideDetails v-model="lazyButtons.abonent.auth")
            .ert-wifi-personalization-dialog-button__buttons-text-item.pr-md-12
              ErtTextField(hideDetails appendIcon="edit" label="Вход по ваучеру" v-model="lazyButtons.voucher.title")
                template(v-slot:prepend)
                  ErtCheckbox(hideDetails disabled :value="true")
            .ert-wifi-personalization-dialog-button__buttons-text-item.pl-md-12
              ErtTextField(hideDetails appendIcon="edit" label="Премиум-доступ" v-model="lazyButtons.premium.title")
                template(v-slot:prepend)
                  ErtCheckbox(hideDetails v-model="lazyButtons.premium.auth")
          .ert-wifi-personalization-dialog-button__styles.mb-8
            button.ert-wifi-personalization-dialog-button__toggle-button(
              :class="{ open: isVisibleEditStyles }"
              @click="onToggleVisibleEditStyles"
            )
              .title
                | Форма/цвет кнопок
              .icon
                ErtIcon(name="corner_down" small)
            ErSlideUpDown(:active="isVisibleEditStyles")
              .ert-wifi-personalization-dialog-button__edit-styles.d--flex.flex-column.flex-md-row.flex-wrap
                div
                  .title Форма:
                  .row.mb-24
                    .item.mr-24
                      ErtCheckbox(
                        hideDetails
                        :value="lazyButtonStyle.borderRadius === '3px'"
                        @change="(e) => lazyButtonStyle.borderRadius = e ? '3px' : '0px'"
                      )
                        template(v-slot:label)
                          .rectangle.rounding
                    .item
                      ErtCheckbox(
                        hideDetails
                        :value="lazyButtonStyle.borderRadius === '0px'"
                        @change="(e) => lazyButtonStyle.borderRadius = e ? '0px' : '3px'"
                      )
                        template(v-slot:label)
                          .rectangle.wo-rounding
                div
                  .title Объём
                  .row.mb-24
                    .item
                      ErtCheckbox(
                        hideDetails
                        :value="lazyButtonStyle.boxShadow !== 'none'"
                        @change="setBoxShadow"
                      )
                        template(v-slot:label)
                          .rectangle.volume
                div
                  .title.mb-16 Заливка:
                  .row.mb-24
                    .button(:style="lazyButtonStyle")
                      | Кнопка
                  .row.mb-24
                    .item.hex.mr-24
                      ErtTextField(label="hex" hideDetails readonly :value="parsedBackgroundColor.hex" @click="onOpenColorPicker")
                    .item.rgb
                      ErtTextField(label="R" hideDetails readonly :value="parsedBackgroundColor.rgba.r" @click="onOpenColorPicker")
                      ErtTextField(label="G" hideDetails readonly :value="parsedBackgroundColor.rgba.g" @click="onOpenColorPicker")
                      ErtTextField(label="B" hideDetails readonly :value="parsedBackgroundColor.rgba.b" @click="onOpenColorPicker")
                div
                  .title Цвет текста:
                  .row
                    .item.mr-24
                      ErtCheckbox(
                        hideDetails
                        label="Чёрный"
                        :value="['black', 'rgb(0, 0, 0)', '#000', '#000000'].includes((this.lazyButtonStyle.color || '').toLowerCase())"
                        @change="(e) => this.lazyButtonStyle.color = e ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'"
                      )
                    .item
                      ErtCheckbox(
                        hideDetails
                        label="Белый"
                        :value="['white', 'rgb(255, 255, 255)', '#fff', '#fff'].includes((this.lazyButtonStyle.color || '').toLowerCase())"
                        @change="(e) => this.lazyButtonStyle.color = e ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)'"
                      )
          //- todo Вернуть после включения продукта на стороне BSS
          //- .ert-wifi-personalization-dialog-button__guest-auth(v-if="isActiveSocialNetwork")
          .ert-wifi-personalization-dialog-button__guest-auth(v-if="false")
            button.ert-wifi-personalization-dialog-button__toggle-button(
              :class="{ open: isVisibleGuestAuth }"
              @click="onToggleVisibleGuestAuth"
            )
              .title
                | Типы авторизаций &laquo;Я Гость&raquo;
              .icon
                ErtIcon(name="corner_down" small)
            ErSlideUpDown(:active="isVisibleGuestAuth")
              .ert-wifi-personalization-dialog-button__edit-guest-auth
                .ert-wifi-personalization-dialog-button__guest-auth-item.mb-8(
                  v-for="guestAuth in guestAuthList"
                  :key="guestAuth.name"
                  :class="guestAuth.name"
                )
                  ErtCheckbox(
                    hideDetails
                    :value="lazySocialNetworks[guestAuth.field]"
                    @change="e => { lazySocialNetworks[guestAuth.field] = e ? 1 : 0 }"
                  )
                    template(v-slot:label)
                      .title
                        | {{ guestAuth.title }}
                      .icon
                        template(v-if="guestAuth.iconType === 'icon'")
                          ErtIcon(:name="guestAuth.iconName")
                        template(v-else-if="guestAuth.iconType === 'img'")
                          img(:src="guestAuth.src")
          .ert-wifi-personalization-dialog-button__actions.pb-24.px-16.d--flex.flex-column.flex-sm-row
            .ert-wifi-personalization-dialog-button__action.mb-8.mb-sm-0.mr-sm-16
              ErButton(@click="onSave") Сохранить
            .ert-wifi-personalization-dialog-button__action
              ErButton(flat @click="onCancel") Отменить
    ErtDialog(
      v-model="isShowColorPicker"
      maxWidth="300"
    )
      .ert-wifi-personalization-dialog-button__color__dialog-content
        ErtColorPicker(
          flat
          v-model="lazyButtonStyle.backgroundColor"
        )
</template>

<script lang="ts" src="./script.ts"></script>

<style lang="scss" src="./style.scss"></style>
