<template lang="pug">
  .payment-history-item(:class="[ type ]")
    .wrapper
      .left-side
        template(v-if="!loading")
          .date-month {{ dateMonth }}
          .year {{ year }}
        template(v-else)
          PuSkeleton.loading
        .icon
          ErtIcon(name="rouble")
      .right-side
        .info
          template(v-if="!loading")
            .title.mb-4 {{ title }}
          template(v-else)
            PuSkeleton.loading
          template(v-if="!loading")
            .description
              | {{ description }}
              template(v-if="chargePeriod")
                br
                | {{ chargePeriod }}
          template(v-else)
            PuSkeleton.loading
          .fiscal(v-if="fiscal")
            a.link--solid--black-yellow(:href="fiscal" target="_blank" rel="noopener") Получить чек
        template(v-if="!loading")
          .amount
            | {{ type === 'replenishment' ? '+' : amount < 0 ? '+' : '-' }}{{ abs(amount) | priceFormatted }}
            span &nbsp; ₽
        template(v-else)
          PuSkeleton.loading
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
