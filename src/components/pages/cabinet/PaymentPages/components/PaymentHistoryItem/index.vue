<template lang="pug">
  .payment-history-item(:class="[ type ]")
    .info
      .title {{ title }}
      .description {{ description }}
    a.fiscal(v-if="fiscal" :href="fiscal" target="_blank" rel="noopener")
      ErtIcon(name="score")
      span Квитанция
    .amount
      | {{ type === 'replenishment'? '+' : amount < 0 ? '+' : '-' }}{{ abs(amount) | priceFormatted }}
      span &nbsp; ₽
    //.wrapper
    //  .left-side
    //    template(v-if="!loading")
    //      .date-month {{ dateMonth }}
    //      .year {{ year }}
    //    template(v-else)
    //      PuSkeleton.loading
    //    .icon
    //      ErtIcon(name="rouble")
    //  .right-side
    //    .info
    //      template(v-if="!loading")
    //        .title.mb-4 {{ title }}
    //      template(v-else)
    //        PuSkeleton.loading
    //      template(v-if="!loading")
    //        div(:class="{red_description: hasErrorAutoPayment, description: !hasErrorAutoPayment}")
    //          | {{ description }}
    //          template(v-if="chargePeriod")
    //            br
    //            | {{ chargePeriod }}
    //      template(v-else)
    //        PuSkeleton.loading
    //      .fiscal(v-if="fiscal")
    //        a.link--solid--black-yellow(:href="fiscal" target="_blank" rel="noopener") Получить чек
    //    template(v-if="!loading")
    //      .amount
    //        | {{ type === 'replenishment'? '+' : amount < 0 ? '+' : '-' }}{{ abs(amount) | priceFormatted }}
    //        span &nbsp; ₽
    //    template(v-else)
    //      PuSkeleton.loading
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
