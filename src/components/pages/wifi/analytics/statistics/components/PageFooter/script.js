import PageNav from '../PageNav'
import ErDisconnectProduct from '@/components/blocks/ErDisconnectProduct/index'

export default {
  name: 'PageFooter',
  components: {
    'page-nav': PageNav,
    ErDisconnectProduct
  },
  data: () => ({
    pre: 'page-footer',
    isShowDisconnectProductPlugin: false
  }),
  props: {
    disconnectData: {
      type: Object,
      default: () => ({})
    }
  }
}
