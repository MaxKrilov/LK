<template lang="pug">
  .ert-navigation
    .ert-navigation__container
      .ert-navigation-top
        .ert-navigation-top__logo
          router-link(to="/")
            picture
              source(srcset="@/assets/images/logos/logo_desktop.svg" media="(min-width: 960px)")
              source(srcset="@/assets/images/logos/logo_mobile.svg")
              img(src="@/assets/images/logos/logo_desktop.svg")
        .ert-navigation-top__billing-account.mr-40(:class="{ 'is-open': isOpenBillingAccountChange }")
          template(v-if="isLoadingListBillingAccount")
            .ert-navigation-top__billing-account-loading
              ErtSkeletonLoader(type="text")
          template(v-else)
            ErChangeBillingAccount(
              v-model="isOpenBillingAccountChange"
              type="menu"
              offsetY
              transition="slide-y-transition"
            )
              template(v-slot:activator="{ on, attrs }")
                button.ert-navigation-top__billing-account-activator(v-bind="attrs" v-on="on")
                  ErtIcon(name="corner_down" small)
                  span.caption1.link--dashed {{ activeBillingAccount }}
        .ert-navigation-top__balance
          ErtBalanceComponent
        .ert-navigation-top__personal-manager
          ErtManagerComponent
        .ert-navigation-top__profile
          ErtProfileComponent
        .ert-navigation-top__notification.ml-24(
          :class="{ 'ert-navigation-top__notification--is-empty': !notificationCount }"
          :data-count="notificationCount"
          @click="onClickNotificationHandler"
        )
          button
            ErtIcon(name="bell")
      .ert-navigation-bottom
        ErtBottomNavigation
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
