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
    isOnContentFilter: Boolean,
    isOnServiceAuth: Boolean,
    isOnPersonalisation: Boolean,
    bpi: String
  }
})
export default class ServicesComponent extends Vue {
  // Props
  readonly customerProduct!: null | ICustomerProduct
  readonly isLoadingCustomerProduct!: boolean
  readonly isOnAnalitic!: boolean
  readonly isOnContentFilter!: boolean
  readonly isOnServiceAuth!: boolean
  readonly isOnPersonalisation!: boolean
  readonly bpi!: string

  // Computed
  get listService () {
    return [
      {
        icon: 'stat',
        name: 'Аналитика',
        isOn: this.isOnAnalitic,
        onClick: () => {
          this.$router.push({
            name: 'analytics-visitors',
            params: { bpi: this.bpi }
          })
        }
      },
      // {
      //   icon: 'filter',
      //   name: 'Контент-фильтрация',
      //   isOn: this.isOnContentFilter,
      //   onClick: () => {
      //     this.$router.push({
      //       name: 'wifi-content-filter',
      //       params: { bpi: this.bpi }
      //     })
      //   }
      // },
      {
        icon: 'settings',
        name: 'Сервисы авторизации',
        isOn: this.isOnServiceAuth,
        onClick: () => {
          this.$router.push({
            name: 'wifi-services-auth',
            params: { bpi: this.bpi }
          })
        }
      },
      {
        icon: 'page_constructor',
        name: 'Конструктор страницы авторизации',
        isOn: this.isOnPersonalisation,
        onClick: () => {
          this.$router.push({
            name: 'wifi-personalization',
            params: { bpi: this.bpi }
          })
        }
      }
    ]
  }

  get lengthIsOn () {
    const length = this.listService.filter(item => item.isOn).length
    return `${length} ${getNoun(length, 'сервис', 'сервиса', 'сервисов')}`
  }

  list = []
}
