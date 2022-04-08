<template lang="pug">
  component.er-change-billing-account(
    :is="computedComponent"
    v-model="internalValue"
    v-bind="$attrs"
  )
    template(v-slot:activator="{ on, attrs }")
      slot(name="activator" v-bind="{ on, attrs }")
    .er-change-billing-account__content
      .er-change-billing-account__head.d--flex.justify-content-between.pb-16
        .h3 Выберите лицевой счёт
      .er-change-billing-account__body
        template(
          v-for="(accounts, contract, index) in getBillingAccountsGroupByContract"
        )
          .border(v-if="index !== 0")
          .caption.mb-4
            | Договор №
          .agreement
            | {{ contract }}
            .personal-account__flex.mb-16.mt-8(
              v-for="(account) in accounts"
              :key="account.billingAccountId"
              :class="{ 'active': getActiveBillingAccount === account.billingAccountId }"
              @click="onChangeBillingAccount(account)"
            )
              er-toggle.personal-account__radio(
                type="radio"
                view="radio"
                v-model="activeStatus"
                :value="getActiveBillingAccount === account.billingAccountId"
              )
              .personal-account
                .caption.mt-8.ml-24(:class="{ green_description : account.accountStatus.name === 'Активный' }")
                  | {{ account.accountStatus.name === 'Активный' ? 'Счёт активен' : 'Счёт закрыт'}}
                .value.ml-24.mt-4.accountNumberOpacity(:class="{activeAccountOpacity : account.accountStatus.name === 'Активный', closeAccountOpacity : account.accountStatus.name === 'Закрытый'}")
                  | {{ account.accountNumber }}
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
