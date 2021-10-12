<template lang="pug">
  .filter-item-rule.filter-item__rule
    template(v-if="isLoading")
      pu-skeleton(width="120px")

    template(v-else)
      .filter-label Правило фильтра
      .filter-value(v-class-mod="{success: isAllowType, danger: !isAllowType}")
        | {{ label }}

</template>

<script>
import { FILTER_ALLOW_TYPE } from '@/constants/wifi-filter'

export default {
  name: 'filter-item-rule',
  props: {
    isLoading: {
      type: Boolean
    },
    label: {
      type: String
    },
    typeId: {
      type: String
    }
  },
  computed: {
    isAllowType () {
      return +this.$props.typeId === +FILTER_ALLOW_TYPE
    }
  }
}
</script>

<style scoped>

</style>
