import { Component } from 'vue-property-decorator'
import ServiceItem from '../ServiceItem/index.vue'
import { GET_LIST_ADDRESS_BY_SERVICES } from '@/store/actions/user'
import { getIconNameByCode } from '@/functions/services'
import ServiceListMixin from '../ServiceListMixin'

const props = {
  list: Array
}

const components = {
  ServiceItem
}

@Component({ props, components })
export default class ServiceList extends ServiceListMixin {
  fetchData (code: any) {
    return this.$store.dispatch(
      `user/${GET_LIST_ADDRESS_BY_SERVICES}`,
      { api: this.$api, productType: code })
  }

  getIcon (code: string) {
    return getIconNameByCode(code)
  }
}
