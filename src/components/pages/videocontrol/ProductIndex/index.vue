<template lang="pug">
  component(:is="productIndexComponent")
</template>

<script>
import { mapState } from 'vuex'
import ForpostIndex from '../ForpostIndex/index.vue'
import EnfortaIndex from '../EnfortaIndex/index.vue'
import ProductNotFound from '../product-not-found.vue'

const PRODUCT_COMPONENT = {
  forpost: 'ForpostIndex',
  enforta: 'EnfortaIndex'
}

const isLegalProductName = productName => Object.keys(PRODUCT_COMPONENT).includes(productName)

export default {
  name: 'VCProductIndex',
  components: {
    ForpostIndex,
    EnfortaIndex,
    ProductNotFound
  },
  computed: {
    ...mapState({
      productType: state => state.videocontrol.productType
    }),
    productIndexComponent () {
      return isLegalProductName(this.productType)
        ? PRODUCT_COMPONENT[this.productType]
        : 'ProductNotFound'
    }
  }
}
</script>

<style scoped></style>
