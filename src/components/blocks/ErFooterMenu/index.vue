<template lang="pug">
.er-footer-menu
  .er-footer-menu__title
    | {{ title }}
    .er-footer-menu__expander(@click="onClickExpander")
      er-icon(
        v-show="!isExpanded"
        name="corner_down"
        width="16px"
        height="16px"
      )
      er-icon(
        v-show="isExpanded"
        name="corner_up"
        width="16px"
        height="16px"
      )
  .er-footer-menu__list
    er-slide-up-down(
      class="expander"
      :active="isExpanded"
    )
      a.er-footer-menu__item(
        v-for="item in items"
        :href="item.url"
      )
        | {{ item.title }}
</template>

<script>
import ErSlideUpDown from '@/components/UI/ErSlideUpDown'
export default {
  props: {
    title: { type: String },
    items: { type: Array }
  },
  components: {
    ErSlideUpDown
  },
  data () {
    return {
      isExpanded: false
    }
  },
  methods: {
    onClickExpander () {
      this.$set(this, 'isExpanded', !this.isExpanded)
    }
  }
}
</script>

<style lang="scss" src="./style.scss"></style>
