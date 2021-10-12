<template lang="pug">
  .filter-item-actions.filter-item__actions
    router-link(
      :to="`/lk/wifi/content-filter/edit/${id}`"
      title="Редактировать фильтр"
    ).filter-config-button
      er-icon(name="settings")

    er-delete-button(
      label=""
      @click="onDelete"
    )
</template>

<script>
export default {
  name: 'filter-item-actions',
  props: ['id'],
  methods: {
    onDelete () {
      this.$emit('delete')
    }
  }
}
</script>

<style scoped>

</style>
