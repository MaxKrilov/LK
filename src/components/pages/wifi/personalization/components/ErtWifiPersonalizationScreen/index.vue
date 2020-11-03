<template lang="pug">
  .ert-wifi-personalization-screen(
    :class="classes"
    :style="getScreenStyles"
  )
    .d--flex.align-items-center.justify-content-between.px-24.py-24
      .ert-wifi-personalization-screen__logo.ert-wifi-personalization-screen__logo--visible(v-if="logo")
        img(:src="getLogoUrl")
        button(@click="$emit('open:logo')")
          ErtIcon(name="settings")
      .ert-wifi-personalization-screen__logo(v-else)
        button(@click="$emit('open:logo')")
          ErtIcon.mr-8(name="add_round")
          span Добавить логотип
      .ert-wifi-personalization-screen__help.d--flex.align-items-center
        span.mr-24 {{ i18nPersonalization.help[language] }}
        img(:src="flagSrc")
    .ert-wifi-personalization-screen__background-settings(:style="getStyleBackgroundSetting")
      .ert-wifi-personalization-screen__background-settings__banner(v-if="banner")
        img(:src="banner")
      button(@click="$emit('open:background')")
        ErtIcon.mr-8(name="settings")
        span Настроить фон
    .ert-wifi-personalization-screen__button-settings
      template(v-for="(button, type) in buttons")
        .ert-wifi-personalization-screen__button-item(
          :disabled="['abonent', 'premium'].includes(type) && button.auth === 0"
          :class="type"
          :style="type !== 'premium' ? buttonStyles : null"
        )
          .content
            | {{ button.title }}
      .button
        button(@click="$emit('open:buttons')")
          ErtIcon(name="settings")
    .ert-wifi-personalization-screen__offer-settings.mb-24
      button(@click="$emit('open:offer')")
        ErtIcon.mr-8(name="settings")
      span {{ i18nPersonalization.offer[language] }}
</template>

<script lang="ts" src="./script.ts"></script>

<style lang="scss" src="./style.scss"></style>
