<template lang="pug">
  .main-content.main-content--h-padding.main-content--top-padding
    pu-skeleton(width="300px")
</template>

<script>
import { mapGetters } from 'vuex'
import { PRODUCT_TYPES } from '@/constants/videocontrol'

const isForpostProduct = ({ code }) => code === PRODUCT_TYPES.forpost
const isEnfortaProduct = ({ code }) => code === PRODUCT_TYPES.enforta

export default {
  name: 'VCGuessProduct',
  computed: {
    ...mapGetters({
      listProductByService: 'user/getListProductByService'
    })
  },
  watch: {
    listProductByService (value) {
      this.redirectToProductIndex(value)
    }
  },
  methods: {
    redirectToProductIndex (productList) {
      if (productList.find(isForpostProduct)) {
        this.$router.push({ name: 'vc-index', params: { type: 'forpost' } })
      } else if (productList.find(isEnfortaProduct)) {
        this.$router.push({ name: 'vc-index', params: { type: 'enforta' } })
      }
    }
  },
  mounted () {
    this.redirectToProductIndex(this.listProductByService)
  }
}
</script>

<style scoped></style>
