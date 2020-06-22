<template lang="pug">
  .er-price
    span.er-price__sum
      slot {{ sum }}
    span.er-price__units
      template(v-if="isRouble")
        span.er-price__currency.rub
      template(v-else)
        span.er-price__currency {{ currency }}

      span.er-price__month {{ period }}
</template>

<script>
/*
  Выводит цену со стандартными стилями
  по-умолчанию вывод в рублях с символом ₽ в месяц

  Параметры:
    sum - сумма
    currency - валюта, если пусто или начинается с "ру*", то заменяется на символ рубля
    period - период, по-умолчанию "месяц"

  Пример:
    er-price 100500

  Результат:
    100500 ₽/месяц

  Пример с валютой:
    er-price(currency="$") 123

  Результат:
    123 $/месяц

  Пример суммы через параметр:
    er-price(
      sum="222"
      currency="€"
    )

  Результат:
    222 €/месяц

  Полный пример:

    er-price(
      currency="£"
      period="полумесяц"
    ) 2048

  Результат:
    2048 £/полумесяц
*/

export default {
  props: {
    sum: Number,
    currency: {
      type: String, // символ валюты или короткое название
      default: ''
    },
    period: {
      type: String,
      default: 'месяц'
    }
  },
  computed: {
    isRouble () {
      return this.currency.startsWith('ру')
    }
  }
}
</script>

<style lang="scss" src="./style.scss"></style>
