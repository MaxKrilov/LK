import { Vue, Component } from 'vue-property-decorator'
import { ICustomerProduct } from '@/tbapi'
import { SERVICE_ADDITIONAL_IP, SERVICE_CONTENT_FILTER, SERVICE_DDOS_PROTECT } from '@/constants/internet'
import { getNoun } from '@/functions/helper'

@Component({
  props: {
    customerProduct: {
      type: Object,
      default: () => ({})
    },
    isLoadingCustomerProduct: Boolean
  }
})
export default class ServicesComponent extends Vue {
  // Props
  readonly customerProduct!: null | ICustomerProduct
  readonly isLoadingCustomerProduct!: boolean
  // Computed
  get listService () {
    const result = [
      { icon: 'stat', name: 'Статистика', isOn: true, link: '/lk/internet/statistic' },
      { icon: 'reload', name: 'Обратные зоны', isOn: true, link: '/lk/internet/reverce-zones' }
    ]
    const additionalServices = [SERVICE_CONTENT_FILTER, SERVICE_DDOS_PROTECT, SERVICE_ADDITIONAL_IP]
    if (this.customerProduct === null) {
      result.push(
        { icon: 'filter', name: 'Контент-фильтрация', isOn: false, link: '/lk/internet/content-filter' },
        { icon: 'deffence_ddos', name: 'Защита от DDoS-атак', isOn: false, link: '/lk/internet/' },
        { icon: 'add_ip', name: 'Дополнитель. IP адреса', isOn: false, link: '/lk/ip' }
      )
      return result
    }
    this.customerProduct.slo.forEach(slo => {
      if (additionalServices.includes(slo.code)) {
        result.push({
          ...this.getIconNNameByService(slo.code)!,
          isOn: slo.activated
        })
      }
    })
    return result
  }

  get lengthIsOn () {
    const length = this.listService.filter(item => item.isOn).length
    return `${length} ${getNoun(length, 'сервис', 'сервиса', 'сервисов')}`
  }

  getIconNNameByService (service: string) {
    switch (service) {
      case SERVICE_DDOS_PROTECT:
        return { icon: 'deffence_ddos', name: 'Защита от DDoS-атак', link: '/lk/internet/ddos' }
      case SERVICE_CONTENT_FILTER:
        return { icon: 'filter', name: 'Контент-фильтрация', link: '/lk/internet/content-filter' }
      case SERVICE_ADDITIONAL_IP:
        return { icon: 'add_ip', name: 'Дополнитель. IP адреса', link: '/lk/ip' }
      default:
        return undefined
    }
  }

  list = []
}
