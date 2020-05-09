<template lang="pug">
  .tp-hint
    h3.tp-hint__title Типы телефонных номеров

    .tp-hint__list
      .tp-item(v-for="item in data")
        .tp-item__head
          | {{ item.description }}

        .tp-item__table.tp-table
          .col.col-country Код страны

          .col.col-code
            template(v-if="item.isMobile")
              | Код оператора
            template(v-else)
              | Код города

          .col.col-number Номер абонента

          .col.col-country-val {{ item.countryCode }}
          .col.col-code-val {{ item.code }}
          .col.col-number-val {{ item.number }}
</template>

<script>
export default {
  data () {
    return {
      data: [
        {
          description: 'Стационарный. В россии наряду с кодом:\n +7 используется код 8',
          countryCode: '+7',
          isMobile: false,
          code: '342',
          number: '0000 000'
        },
        {
          description: 'Мобильный. Все коды сотовых операторов в России начинаются с девятки',
          countryCode: '+7',
          isMobile: true,
          code: '922',
          number: '0000 000'
        },
        {
          description: 'Международный. Код страны состоит из 1-4 цифр',
          countryCode: '+38',
          isMobile: false,
          code: '556',
          number: '0000 000'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.tp-hint {
  &__title {
    @extend %h3;
  }
}

.col {
  white-space: nowrap;
  &-code-val,
  &-country-val,
  &-number-val {
    margin-top: $padding-x1;
    @extend %h3;
  }

  &-code,
  &-country,
  &-number {
    @extend %caption2;
  }

  &-country {
    grid-area: country;
  }
  &-code {
    grid-area: code;
  }
  &-number {
    grid-area: number;
  }
}

.tp-item {
  margin-top: $padding-x6;

  &__head {
    @extend %body;
  }
}

.tp-table {
  margin-top: $padding-x2;
  grid-gap: $padding-x2;
  display: grid;
  width: 70%;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: "country code number";

  &__row--head {
    .col {
      @extend %caption2;
    }
  }
  &__row--body {
    .col {
      @extend %h3;
    }
  }
}
</style>
