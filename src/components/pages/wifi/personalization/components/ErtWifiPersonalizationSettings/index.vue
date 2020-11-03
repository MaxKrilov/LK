<template lang="pug">
  .ert-wifi-personalization-settings
    .ert-wifi-personalization-settings__item.orientation
      ErtSelect(
        :items="listScreenOrientation"
        v-model="internalModelScreenOrientation"
        label="Ориентация"
        hideDetails
        returnObject
        :disabled="lessMD"
        :appendIcon="lessMD ? 'lock' : 'corner_down'"
      )
        template(v-slot:selection="data")
          ErtListItemIcon.mr-8
            img(:src="data.item.image")
          ErtListItemContent
            ErtListItemTitle {{ data.item.text }}
        template(v-slot:item="data")
          ErtListItemIcon.mr-8
            img(:src="data.item.image")
          ErtListItemContent
            ErtListItemTitle {{ data.item.text }}
    .ert-wifi-personalization-settings__item.language
      //- ErtSelect(
      //-  :items="listLanguage"
      //-  v-model="internalModelLanguage"
      //-  label="Язык"
      //-  hideDetails
      //-  returnObject
      //-)
        template(v-slot:selection="data")
          ErtListItemIcon.mr-8
            img(:src="data.item.image")
          ErtListItemContent
            ErtListItemTitle {{ data.item.text }}
        template(v-slot:item="data")
          ErtListItemIcon.mr-8
            img(:src="data.item.image")
          ErtListItemContent
            ErtListItemTitle {{ data.item.text }}
</template>

<script lang="ts" src="./script.ts"></script>

<style lang="scss">
.ert-wifi-personalization-settings {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  @include min-breakpoint('sm') {
    flex-direction: row;
    justify-content: space-between;
  }

  &__item {
    width: 100%;
    max-width: 280px;

    &.orientation >
    .ert-input >
    .ert-input__control >
    .ert-input__slot >
    .ert-select__slot >
    .ert-select__selections >
    input {
      flex: 0;
    }
  }
}
</style>
