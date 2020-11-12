<template lang="pug">
  div.campaign-custom-message-14.notification-item__text
    p Уважаемый Клиент!
      |  Изменены банковские реквизиты для оплаты счетов за услуги связи АО&nbsp;«ЭР-Телеком Холдинг»
      |  по договору {{ cleanParams['param_2'] }} от {{ cleanParams['param_3'] }}.

    p Мы перешли на новую банковскую технологию учета поступающих платежей.
      |  Теперь платежи будут зачисляться на <strong>Ваш лицевой счет</strong> быстрее.

    p <strong>В назначении платежа необходимо указывать индивидуальный расчетный счет и номер
      |  Лицевого Счета, присвоенные Договору {{ cleanParams['param_2'] }} от {{ cleanParams['param_3'] }}:</strong>

    ul
      li <strong>Номер Лицевого счета {{ cleanParams['param_1'] }}</strong>
      li <strong>Номер индивидуального расчетного счета {{ cleanParams['param_4'] }}</strong>

    p В примере по <a class="link" :href="link" target="_blank">ссылке</a> вы увидите,
      |  где в счетах отображается эта информация.

    p Если у Вас несколько договоров с АО&nbsp;«ЭР-Телеком Холдинг», обратите внимание,
      |  что номер расчетного счета для оплаты услуг является <strong>персональным</strong> для каждого договора.
      |  При оплате услуг связи указывайте только те реквизиты, которые прописаны в счете на оплату по конкретному договору.

    p Порядок исполнения договоров, заключенных с АО&nbsp;«ЭР-Телеком Холдинг» ранее, не меняется.
      |  При изменении банковских реквизитов не требуется перезаключения договора или подписания
      |  дополнительного соглашения.

    p Хорошего дня, команда АО&nbsp;«ЭР-Телеком&nbsp;Холдинг»
</template>

<script>
export default {
  name: 'campaign-custom-message-14',
  props: ['params'],
  computed: {
    link () {
      return this.$props.params?.['file'] || '#'
    },
    cleanParams () {
      return Object.keys(this.$props.params)
        .filter(el => el.startsWith('param_'))
        .reduce((result, el) => {
          const paramValue = this.$props.params[el] || `%${el}%`
          return { ...result, [el]: paramValue }
        }, {})
    }
  }
}
</script>

<style scoped lang="scss">
p {
  @extend %body-font;
  @include color-black(0.8);
}

p + p,
p + ul,
ul + p {
  margin-top: $padding-x2;
}

ul {
  margin-left: $padding-x4;
}

</style>
