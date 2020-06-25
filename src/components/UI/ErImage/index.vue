<template lang="pug">
  img.er-image(
    :src="source"
    :alt="alt"
  )
</template>

<script>
export default {
  props: {
    src: {
      type: String
    },
    alt: {
      type: String
    }
  },
  computed: {
    source () {
      return require(`@/assets/images${this.src}`)
    }
  }
}
</script>
