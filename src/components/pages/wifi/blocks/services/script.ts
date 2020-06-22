import { Vue, Component } from 'vue-property-decorator'
import { ICustomerProduct } from '@/tbapi'
import { getNoun } from '@/functions/helper'

@Component({
  props: {
    customerProduct: {
      type: Object,
      default: () => ({})
    },
    isLoadingCustomerProduct: Boolean,
    isOnAnalitic: Boolean,
    isOnContentFilter: Boolean
  }
})
export default class ServicesComponent extends Vue {
  // Props
  readonly customerProduct!: null | ICustomerProduct
  readonly isLoadingCustomerProduct!: boolean
  readonly isOnAnalitic!: boolean
  readonly isOnContentFilter!: boolean
  // Computed
  get listService () {
    return [
      { icon: 'stat', name: 'Аналитика', isOn: this.isOnAnalitic },
      { icon: 'filter', name: 'Контент-фильтрация', isOn: this.isOnContentFilter },
      { icon: 'settings', name: 'Сервисы авторизации', isOn: false }
    ]
  }

  get lengthIsOn () {
    const length = this.listService.filter(item => item.isOn).length
    return `${length} ${getNoun(length, 'сервис', 'сервиса', 'сервисов')}`
  }

  list = []
}
