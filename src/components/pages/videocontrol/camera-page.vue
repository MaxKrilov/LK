<template lang="pug">
  component(:is="cameraPage" :id="$props.id")
</template>

<script>
import ForpostCamera from './camera-config/index'
import EnfortaCamera from './EnfortaCamera/index'
import ProductNotFound from './product-not-found'

const PRODUCT_COMPONENT = {
  forpost: ForpostCamera,
  enforta: EnfortaCamera
}

export default {
  name: 'CameraPage',
  props: ['type', 'id'],
  components: {
    ForpostCamera,
    EnfortaCamera,
    ProductNotFound
  },
  computed: {
    cameraPage () {
      return PRODUCT_COMPONENT?.[this.$props.type] || 'ProductNotFound'
    }
  }
}
</script>
