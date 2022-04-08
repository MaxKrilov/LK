<template lang="pug">
  .ert-profile-component
    template(v-if="isLoadingClientInfo")
      .ert-profile-component__loading
        ErtSkeletonLoader(type="avatar")
    template(v-else)
      ErtMenu(
        v-model="isOpenMenu"
        offsetY
        maxWidth="298"
        transition="slide-y-transition"
      )
        template(v-slot:activator="{ on, attrs }")
          .ert-profile-component__button
            button(v-on="on" v-bind="attrs")
              ErtIcon(name="profile")
        .ert-profile-component__menu
          .ert-profile-component__menu-top.pt-32.px-32.pb-24
            .caption2.mb-4 Вы авторизованы
            .h4.mb-4 {{ legalName }}
            .mb-24
              button.link.body-font(@click="() => { isOpenOrganisationPopup = true }")
                | Выбрать другую организацию
            div
              button.link.body-font(@click="onSignOutHandler") Выйти
          .ert-profile-component__menu-bottom.pt-24.px-32.pb-32
            router-link(to="/lk/profile")
              ErtIcon.mr-8(name="profile")
              span Профиль
      ChangeOrganisationPopup(
        :active="isOpenOrganisationPopup"
        @close="() => { isOpenOrganisationPopup = false }"
      )
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
