<template lang="pug">
  .ert-balance-component
    template(v-if="isLoadingBalanceInfo")
      .ert-balance-component__loading.ert-balance-component__loading--mobile
        ErtSkeletonLoader(type="text")
      .ert-balance-component__loading.ert-balance-component__loading--desktop
        ErtSkeletonLoader(type="list-item-avatar")
    template(v-else)
      .ert-balance-component__icon(:class="{ 'is-auto-pay': isEnabledAutoPay }")
        ErtIcon(name="wallet")
      .ert-balance-component__info
        ErtMenu(
          v-model="isOpenMenu"
          offsetY
          maxWidth="303"
          transition="slide-y-transition"
          :nudgeLeft="nudgeLeft"
          ref="menu"
        )
          template(v-slot:activator="{ on, attrs }")
            button.link--dashed.caption1(v-bind="attrs" v-on="on" ref="button-activator")
              | {{ balance | priceFormatted }}&nbsp;&nbsp;₽
          .ert-balance-component__menu
            .ert-balance-component__menu-top.px-32.pt-32.pb-24
              .caption2.mb-4
                | Ваш баланс&nbsp;
                span.color--green-base(v-if="isEnabledAutoPay") (Автоплатёж)
              .h3.mb-24
                | {{ balance | priceFormatted }}
                span.caption2 &nbsp;₽
              div.mb-8
                router-link.link.body-font(to="/lk/payments/card-payment") Оплатить картой
              div
                router-link.link.body-font(to="/lk/payments/promise-payments") Активировать обещанный платёж
            .ert-balance-component__menu-bottom.pt-24.px-32.pb-32
              router-link(to="/lk/payments")
                ErtIcon.mr-8(name="rouble")
                span Баланс
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
