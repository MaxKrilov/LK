import { Vue, Component } from 'vue-property-decorator'
import { promisedStoreValue } from '@/functions/store_utils'
import { ILocationOfferInfo } from '@/tbapi'

@Component({
  name: 'VCTemplate'
})
export default class VideocontrolProductPage extends Vue {
  waitBillingAccount () {
    return promisedStoreValue(this.$store, 'user', 'activeBillingAccount')
  }

  created () {
    this.waitBillingAccount()
      .then(() => {
        this.$store.dispatch('videocontrol/pullPoints', { api: this.$api })
          .then(data => {
            const parentIds = data.map((el: ILocationOfferInfo) => el.bpi)

            if (parentIds.length) {
              this.$store.dispatch(
                'videocontrol/pullDomainRegistry',
                { api: this.$api, parentIds }
              )
            } else {
              this.$store.commit('videocontrol/SET_DOMAINS_IS_LOADED', true)
            }
          })
      })
  }

  beforeDestroy () {
    this.$store.dispatch('videocontrol/cleanupPoints')
  }
}
