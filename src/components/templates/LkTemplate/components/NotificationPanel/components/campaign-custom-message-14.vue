<template lang="pug">
  div.campaign-custom-message-14.notification-item__text
    p Уважаемый Клиент! Изменены банковские реквизиты для оплаты счетов за услуги связи АО&nbsp;«ЭР-Телеком&nbsp;Холдинг».

    p Мы перешли на новую современную банковскую технологию учета поступающих платежей. Теперь Ваши платежи будут зачисляться на <strong>Ваш лицевой счет</strong> быстрее.

    p Расчеты за оказанные услуги связи необходимо осуществлять по каждому договору по реквизитам указанным в счетах, необходимо <strong>указывать и номер Лицевого Счета</strong>.

    p Ваш номер Лицевого счета <strong>{{ cleanParams['param_1'] }}</strong> по ДОГОВОРУ №&nbsp;<strong>{{ cleanParams['param_2'] }}</strong> от {{ cleanParams['param_3'] }}
      br
      | Ваш Виртуальный расчетный счет <strong>{{ cleanParams['param_4'] }}</strong>
      br
      | В примере по <a class="link" :href="link" target="_blank">ссылке</a>
      | вы увидите, где в счетах отображается эта информация.

    p Если у Вас несколько договоров с АО&nbsp;«ЭР-Телеком&nbsp;Холдинг»: обратите внимание
      |, что <strong>номер расчетного счета</strong> для оплаты услуг является <strong>персональным для каждого договора</strong>. при оплате услуг связи по договору указывайте <strong>только</strong> реквизиты, указанные в счете на оплату по данному договору.

    p Порядок исполнения договоров, ранее заключенных с АО&nbsp;«ЭР-Телеком Холдинг», не меняется. Не требуется перезаключения договоров или подписания дополнительных соглашений при изменением банковских реквизитов.
      | Оригинал этого уведомления будет отправлен Вам с пакетом отчетных документов за текущий месяц.
      | Хорошего дня.

    p Команда АО «ЭР-Телеком&nbsp;Холдинг»
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

p + p {
  margin-top: $padding-x2;
}
</style>
