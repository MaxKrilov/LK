<template lang="pug">
er-dialog-advanced(
  :active="active"
  icon="warning"
  @close="$emit('close')"
)
  template(v-slot:title) После загрузки нового списка старый будет удалён

  | Вы обязаны предоставить список пользователей во исполнение требований Правил оказания услуг связи по передаче данных, утвержденных постановлением Правительства РФ от 23.01.2006 №32, Правил оказания телематических услуг связи, утвержденные постановлением Правительства РФ от 10.09.2007 №575, а также
  a(href="#") п. 2 ст. 44 ФЗ от 07.07.2003 №126-ФЗ «О связи»

  div.text-color-black03.hint-text
    | размер файла не должен превышать 2&nbsp;Мб.
    br
    | Формат: xls

  template(v-slot:actions).justify-content-end
    a(href="#").link-success Загрузить список
</template>

<script>
export default {
  name: 'warning-userlist-dialog',
  props: {
    active: Boolean
  }
}
</script>
