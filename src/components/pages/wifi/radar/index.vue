<template lang="pug">
  .wifi-radar-page
    template(v-if="isLoaded")
      template(v-if="isRadarEnabled")
        go-to-radar
      template(v-else)
        radar-promo
    template(v-else)
      pu-skeleton(width="300px")
</template>

<script>
import GoToRadar from './go-to-radar.vue'
import RadarPromo from './promo/index.vue'
import { GET_LIST_ADDRESS_BY_SERVICES } from '@/store/actions/user'

export default {
  name: 'RadarIndexPage',
  components: {
    GoToRadar,
    RadarPromo
  },
  data: () => ({
    products: [],
    isLoaded: false
  }),
  computed: {
    isRadarEnabled () {
      return this.products.filter(el => {
        return el.offer.name.match(/radar|радар|wi-fi/ig)
      }).length > 0
    }
  },
  async mounted () {
    this.products = await this.$store.dispatch(`user/${GET_LIST_ADDRESS_BY_SERVICES}`, {
      api: this.$api,
      productType: 'Wi-Fi'
    })
      .then(data => {
        this.isLoaded = true
        return data
      })
  }
}
</script>
