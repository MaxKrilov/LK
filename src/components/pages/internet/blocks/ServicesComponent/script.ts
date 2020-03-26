import { Vue, Component } from 'vue-property-decorator'
import { ICustomerProduct } from '@/tbapi'
import { SERVICE_ADDITIONAL_IP, SERVICE_CONTENT_FILTER, SERVICE_DDOS_PROTECT } from '@/constants/internet'

@Component({
  props: {
    customerProduct: {
      type: Object,
      default: () => ({})
    }
  }
})
export default class ServicesComponent extends Vue {
  // Props
  readonly customerProduct!: null | ICustomerProduct
  // Computed
  get listService () {
    // Эти две услуги по-умолчанию всегда включены
    const result = [
      { icon: 'stat', name: 'Статистика', isOn: true },
      { icon: 'reload', name: 'Обратные зоны', isOn: true }
    ]
    const additionalServices = [SERVICE_CONTENT_FILTER, SERVICE_DDOS_PROTECT, SERVICE_ADDITIONAL_IP]
    if (this.customerProduct === null) return result
    this.customerProduct.slo.forEach(slo => {
      if (additionalServices.includes(slo.childProductOffering.code)) {
        result.push({
          ...this.getIconNNameByService(slo.childProductOffering.code)!,
          isOn: slo.activated
        })
      }
    })
    return result
  }

  getIconNNameByService (service: string) {
    switch (service) {
      case SERVICE_DDOS_PROTECT:
        return { icon: 'deffence_ddos', name: 'Защита от DDoS-атак' }
      case SERVICE_CONTENT_FILTER:
        return { icon: 'filter', name: 'Контент-фильтрация' }
      case SERVICE_ADDITIONAL_IP:
        return { icon: 'add_ip', name: 'Дополнитель. IP адреса' }
      default:
        return undefined
    }
  }

  list = []
}
