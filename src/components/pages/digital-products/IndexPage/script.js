import 'iframe-resizer'
import { eachObject, getAllUrlParams } from '../../../../functions/helper'
import { mapState } from 'vuex'

export default {
  name: 'digital-products-index-page',
  data: () => ({
    pre: 'digital-products-index-page',
    // link: 'https://service-portal-dmp-int2.nonprod.cloud-bss.loc/products?'
    link: 'https://service-portal-dmp-uat1.nonprod.cloud-bss.loc/products?'
  }),
  computed: {
    ...mapState({
      dmpId: state => state.auth.dmpId
    })
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      const getParams = getAllUrlParams()
      getParams.hiddenFooter = true
      getParams.hiddenHeader = true
      if (vm.dmpId) {
        getParams.customerId = this.dmpId
      }
      let getParamsStr = ''
      eachObject(getParams, (item, key) => {
        getParamsStr += `${key}=${item}&`
      })
      vm.link += getParamsStr
    })
  },
  mounted () {
    window.iFrameResize({
      checkOrigin: false,
      heightCalculationMethod: 'lowestElement',
      warningTimeout: 0
    }, '#myIframe')
  }
}
