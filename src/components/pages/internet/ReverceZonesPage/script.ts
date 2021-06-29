import Vue from 'vue'
import Component from 'vue-class-component'
import { Route, RawLocation } from 'vue-router'

import ReverceZoneItemComponent from './blocks/ReverceZoneItemComponent'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

import { ICustomerProduct } from '@/tbapi'
import { getFirstElement } from '@/functions/helper'
import { SERVICE_ADDITIONAL_IP as SLO_CODE } from '@/constants/internet'
import { logError } from '@/functions/logging'

const TLO_CHAR = 'IPv4 адрес в составе услуги'
const SLO_CHAR = 'IPv4 адрес'

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof ReverceZonePage>>({
  components: {
    ReverceZoneItemComponent,
    ErActivationModal
  },
  props: {
    customerProduct: {
      type: Object
    },
    isLoadingCustomerProduct: Boolean
  },
  watch: {
    isLoadingCustomerProduct (val) {
      this.isLoadingIP = val
      this.isLoadingReverceZone = val
    },
    customerProduct (val) {
      if (val && this.getListIP()) {
        this.currentIP = this.listIP[0]
        this.getListReverceZone()
          .then(response => {
            if (response) {
              this.isLoadingReverceZone = false
            }
          })
      }
    },
    currentIP () {
      this.isLoadingReverceZone = true
      this.getListReverceZone()
        .then(response => {
          if (response) {
            this.isLoadingReverceZone = false
          }
        })
    }
  },
  beforeRouteEnter (to: Route, from: Route, next: (to?: (RawLocation | false | ((vm: ReverceZonePage) => void))) => void): void {
    next(vm => {
      vm.isLoadingReverceZone = true

      if (vm.customerProduct && vm.getListIP()) {
        vm.currentIP = vm.listIP[0]
        vm.getListReverceZone()
          .then(response => {
            if (response) {
              vm.isLoadingReverceZone = false
            }
          })
      }
    })
  }
})
export default class ReverceZonePage extends Vue {
  // Props
  readonly customerProduct!: ICustomerProduct | null
  readonly isLoadingCustomerProduct!: boolean
  // Data
  listIP: string[] = []
  currentIP: string | null = null
  listReverceZone: string[] = []
  isOpenAdding = false
  model = {
    ip: '',
    domain: ''
  }
  // Переменные-прелоадеры
  isLoadingIP = false
  isLoadingReverceZone = false
  isLoadingAddReverceZone: boolean = false

  isErrorOfAddingReverceZone = false
  // Methods
  getListReverceZone () {
    return new Promise((resolve) => {
      if (!this.currentIP) resolve(true)
      this.$store.dispatch('internet/getListReverceZone', { ip: this.currentIP })
        .then(response => {
          this.listReverceZone = Array.isArray(response) ? response : [response]
        })
        .finally(() => {
          resolve(true)
        })
    })
  }

  deleteReverceZone (reverceZone: string) {
    this.listReverceZone = this.listReverceZone.filter(_reverceZone => _reverceZone !== reverceZone)
  }

  async addReverceZone () {
    if (!(this.$refs.form as any).validate()) return

    this.isLoadingAddReverceZone = true

    try {
      await this.$store.dispatch('internet/addReverceZone', this.model)

      if (this.currentIP === this.model.ip) {
        this.listReverceZone.push(this.model.domain)
      }
      this.isOpenAdding = false
      this.model.ip = ''
      this.model.domain = ''
    } catch (e) {
      logError(e)
      this.isErrorOfAddingReverceZone = true
    } finally {
      this.isLoadingAddReverceZone = false
    }
  }

  getListIP () {
    this.listIP = []

    if (!this.customerProduct) return false
    // Получаем IP адрес из TLO
    if (this.customerProduct.tlo.chars.hasOwnProperty(TLO_CHAR)) {
      this.listIP.push(
        getFirstElement(
          this.customerProduct.tlo.chars[TLO_CHAR].split('/')
        )
      )
    } else {
      return false
    }

    // Получаем IP адрес(-а) из SLO
    const filterSLO = this.customerProduct.slo.filter(sloItem =>
      sloItem.code === SLO_CODE && typeof sloItem.chars !== 'string' && sloItem.chars.hasOwnProperty(SLO_CHAR)
    )
    if (filterSLO.length === 0) return true

    this.listIP.push(...filterSLO.map(filterSLOItem => getFirstElement(
      filterSLOItem.chars[SLO_CHAR].split('/')
    )))

    return true
  }
}
