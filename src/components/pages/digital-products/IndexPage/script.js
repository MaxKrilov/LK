import 'iframe-resizer'
import { eachObject, getAllUrlParams, isCombat } from '../../../../functions/helper'
import { mapState } from 'vuex'

const getLink = () => isCombat()
  ? 'https://self-service.dom.ru/'
  : 'https://service-portal-dmp-stg.nonprod.cloud-bss.loc/'

export default {
  name: 'digital-products-index-page',
  data: () => ({
    pre: 'digital-products-index-page',
    link: `${getLink()}products?`
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
        getParams.customerId = vm.dmpId
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
