import OfficeItem from '../OfficeItem/index.vue'
import { GET_LIST_SERVICE_BY_ADDRESS } from '@/store/actions/user'
import { Component } from 'vue-property-decorator'

import ServiceListMixin from '../ServiceListMixin'

const components = {
  OfficeItem
}

const props = {
  list: Array
}

@Component({ props, components })
export default class OfficeList extends ServiceListMixin {
  fetchData (code: any) {
    return this.$store.dispatch(
      `user/${GET_LIST_SERVICE_BY_ADDRESS}`,
      { api: this.$api, address: code })
  }
}
