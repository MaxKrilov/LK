import { Component } from 'vue-property-decorator'
import WifiFilterListPage from './components/filter-list/index.vue'
import WifiFilterPromo from './components/promo/index.vue'
import WifiFilterPlug from './components/plug-filter/index.vue'
import WifiEditFilter from './components/edit-filter/index.vue'
import WifiContentFilterPageMixin from '@/components/pages/wifi/content-filter/WifiContentFilterPageMixin'

const components = {
  WifiFilterListPage,
  WifiFilterPromo,
  WifiFilterPlug,
  WifiEditFilter
}

@Component({ components })
export default class WifiContentFilterPage extends WifiContentFilterPageMixin {
  stateList = [
    'loading',
    'ready',
    'promo',
    'plug'
  ]

  onCancelPlug () {
    this.setState(this.lastState)
  }

  onGoToPlug () {
    this.setState('plug')
  }
}
