<template lang="pug">
  .ert-manager-component
    template(v-if="isLoadingManagerInfo")
      ErtSkeletonLoader(type="text")
    template(v-else)
      ErtMenu(
        v-model="isOpenMenu"
        offsetY
        maxWidth="272"
        transition="slide-y-transition"
      )
        template(v-slot:activator="{ on, attrs }")
          button.caption1.ert-manager-component__manager-name(v-on="on" v-bind="attrs") Ваш менеджер: {{ getManagerPhoneCut }}
        .ert-manager-component__menu
          .ert-manager-component__menu-top.pt-32.px-32.pb-24
            .caption2.mb-4 Ваш персональный менеджер
            .h4.mb-8 {{ getManagerName }}
            .caption2.mb-4 Телефон
            .body-font.mb-8 {{ getManagerPhone }}
            .caption2.mb-4 Эл. почта
            .body-font {{ getManagerEmail }}
          .ert-manager-component__menu-bottom.pt-24.px-32.pb-32
            router-link(to="/lk/support")
              ErtIcon.mr-8(name="service")
              span Поддержка
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
