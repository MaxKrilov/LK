<template lang="pug">
  .main-content--padding-top.main-content--padding.main-content
    h2.loading-dots Редирект на портал ОАТС
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { head } from 'lodash'

export default {
  name: 'GoToOATSPortal',
  methods: {
    ...mapActions('oats', [
      'fetchPortalLink',
      'pullPoints',
      'pullDomains'
    ]),
    ...mapActions('profile', [
      'pullOATSDomains'
    ]),
    async fetchData () {
      let bpi = this.$route.query.bpi
      let cityId = this.$route.query.cityId

      if (typeof bpi !== 'string' || typeof cityId !== 'string') {
        if (this.domainList.length === 0) {
          await this.pullPoints()
          await this.pullDomains(this.pointBpiList)
        }

        // bpi = head(this.domainList || [])?.id || ''
        cityId = head(this.domainList || [])?.cityId || ''
      }

      if (bpi) {
        const account = await this.pullOATSDomains({ id: bpi, cityId })
        const { loginLink } = await this.fetchPortalLink({ cityId, account })

        if (loginLink) {
          window.location.href = loginLink
        }
      } else {
        const { loginLink } = await this.fetchPortalLink({ cityId })

        if (loginLink) {
          window.location.href = loginLink
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      domainList: 'oats/domainList',
      pointBpiList: 'oats/pointBpiList',
      activeBillingAccount: 'payments/getActiveBillingAccount'
    })
  },
  watch: {
    activeBillingAccount (val) {
      if (val) {
        this.fetchData()
      }
    }
  },
  mounted () {
    if (this.activeBillingAccount) {
      this.fetchData()
    }
  }
}
</script>

<style lang="scss">
.loading-dots {
  @extend %wait-dots-animation;
}
</style>
