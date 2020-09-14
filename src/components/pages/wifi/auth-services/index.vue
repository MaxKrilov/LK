<template lang="pug">
  .wifi-auth-service.main-content.main-content--top-menu-fix.main-content--h-padding.main-content--top-padding
    er-page-header(
      linkText="Назад на главную"
      title="Сервисы авторизации"
      backlink="/lk"
    )
    .wifi-auth-service__points
      ListPointComponent(
        :list="computedListPoint"
        v-model="activePoint"
        :isLoading="isLoadingListPoint"
      )
    .wifi-auth-service__list
      WifiAuthServicesCard.mb-4(
        v-for="authService in computedListAuthService"
        :key="authService.code"
        :title="authService.title"
        :description="authService.description"
        :price="authService.price"
        :isConnect="authService.isConnect"
        :code="authService.code"
        :activePoint="activePoint"
        :productId="authService.productId"
        :chars="authService.chars"
        :vlanInfo="vlanInfo"
      )
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
