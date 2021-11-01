<template lang="pug">
  div.campaign-custom-message-14.notification-item__text
    template()
      p Уважаемые Клиенты, в период с 15.11.2021г. по 18.11.2021г. для услуг – «Wi-Fi Hot-Spot», «Wi-Fi Hot-Spot Mono»,&nbsp;
        | «Wi-Fi Hot-Spot Облако» – изменен стандартный способ идентификации пользователя по номеру телефона, указываемого&nbsp;
        | пользователями в процессе регистрации/авторизации в публичных Wi-Fi-сетях. Подробности доступны по ссылке&nbsp;
        a(href="https://b2b.dom.ru/news/Wi-Fi") https://b2b.dom.ru/news/Wi-Fi
</template>

<script>
export default {
  name: 'campaign-custom-message-wifi',
  filters: {
    params3 (val) {
      return val[0] === '.'
        ? Number(val) * 100 + '%'
        : val
    }
  },
  computed: {
    // link () {
    //   return this.$props.params?.['file'] || '#'
    // },
    // cleanParams () {
    //   return Object.keys(this.$props.params)
    //     .filter(el => el.startsWith('param_'))
    //     .reduce((result, el) => {
    //       // const paramValue = this.$props.params[el] || `%${el}%`
    //       const paramValue = this.$props.params[el]
    //       return { ...result, [el]: paramValue }
    //     }, {})
    // },
    // getTaskId () {
    //   return this.$props.params && this.$props.params.task_id
    // },
    // getCommunicationType () {
    //   return this.$props.params && this.$props.params.communication_type
    // }
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
