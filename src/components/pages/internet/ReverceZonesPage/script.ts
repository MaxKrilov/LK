import Vue from 'vue'
import Component from 'vue-class-component'
import { Route, RawLocation } from 'vue-router'

import ReverceZoneItemComponent from './blocks/ReverceZoneItemComponent'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

import { ICustomerProduct } from '@/tbapi'
import { getFirstElement } from '@/functions/helper'
import { SERVICE_ADDITIONAL_IP as SLO_CODE, CODE_IP4SUBNET } from '@/constants/internet'
import { logError } from '@/functions/logging'
import IPRange from '@/functions/IPRange'

const TLO_CHAR = 'IPv4 адрес в составе услуги'
const SLO_CHAR = 'IPv4 адрес'
const SLO_SUBNET_CHAR = 'IPv4 подсеть'

// Подключение punycode конвертера
const punycode = require('punycode/')
const requiredRuleDomain = (v: string) => !!v || 'Поле обязательно к заполению'

type ErMessagesField = {
  textAlign: string,
  color: string
}
interface IDomainFromModel {
  domain: string
}

interface IFieldCheckDomain {
  isFieldCheckDomain: any
}

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
    'model.domain': 'generateDomain',
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
  isFieldDomainTouched: boolean = false
  styleErMessage: ErMessagesField = {
    textAlign: 'right',
    color: '#E31E24'
  }
  rules: IFieldCheckDomain = {
    isFieldCheckDomain: (val: string) => !!val === this.generateDomain(val) || 'Недопустимый ввод'
  }
  model = {
    ip: '',
    domain: ''
  }
  // Переменные-прелоадеры
  isLoadingIP = false
  isLoadingReverceZone = false
  isLoadingAddReverceZone: boolean = false

  isErrorOfAddingReverceZone = false
  isFieldCheckDomain: boolean = false
  fieldDomainRule = {
    fieldDomain: [requiredRuleDomain, this.rules['isFieldCheckDomain']]
  }
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
  concatRegDomainStr (body: RegExp, end: RegExp): RegExp {
    const init = /(?!.*([\s.-])\1)/g
    const flags = (init.flags + body.flags + end.flags).split('').sort().join('').replace(/(.)(?=.*\1)/g, '')
    return new RegExp(init.source + body.source + end.source, flags)
  }
  generateDomain (val: string): boolean {
    this.isFieldCheckDomain = (val = this.defineModelDomainConverter(val)) && true
    let xChar: number = val.charCodeAt(0)
    let regDomainBody: RegExp, regDomainEnd: RegExp
    if (xChar > 96 && xChar < 123) {
      regDomainBody = /^(?:[a-z0-9][a-z0-9.\][(\-)]{0,61}[a-z0-9]\.)/
      regDomainEnd = /(com|org|ru|net)+$/m
      this.isFieldCheckDomain = this.concatRegDomainStr(regDomainBody, regDomainEnd).test(val)
    } else {
      regDomainBody = /^(?:[а-я0-9][а-я0-9.\][(\-)]{0,61}[а-я0-9]\.)/
      regDomainEnd = /(рф)+$/m
      this.isFieldCheckDomain = this.concatRegDomainStr(regDomainBody, regDomainEnd).test(val)
    }
    return this.isFieldCheckDomain
  }
  defineModelDomainConverter (val: string) {
    return val && punycode.toUnicode(val)
  }
  get receiveDomainFromModel (): string {
    const { model: { domain } } : { model: IDomainFromModel } = this
    return domain
  }

  get isFieldDomainValid () : boolean {
    return this.isFieldCheckDomain
  }
  get isFieldDomainError () : boolean {
    return !this.isFieldDomainValid && this.isFieldDomainTouched
  }
  get showFieldDomainDisplay () : string {
    let domain = this.receiveDomainFromModel
    return (domain === '') ? '' : this.isFieldDomainValid ? 'er-text-field--success' : 'er-text-field--error'
  }

  async addReverceZone () {
    if (!(this.$refs.form as any).validate()) return
    // todo: кодировка в пуникод при отправке:
    //   if (this.isFieldDomainValid && punycode.encode(this.receiveDomainFromModel))
    //       (this.model['domain'] as string) = punycode.encode(this.receiveDomainFromModel)

    this.isLoadingAddReverceZone = true
    try {
      await this.$store.dispatch('internet/addReverceZone', this.model)
      if (this.currentIP === this.model.ip) {
        this.listReverceZone.push(this.model['domain'])
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

    this.listIP.push(...filterSLO.map(filterSLOItem => getFirstElement(
      filterSLOItem.chars[SLO_CHAR].split('/')
    )))

    // Получаем IP адреса из подсеток
    this.listIP.push(...this.customerProduct.slo.filter(sloItem => {
      return sloItem.code === CODE_IP4SUBNET &&
        typeof sloItem.chars !== 'string' &&
        sloItem.chars.hasOwnProperty(SLO_SUBNET_CHAR)
    }).reduce((acc, item) => {
      acc.push(...IPRange.getIPRange(item.chars[SLO_SUBNET_CHAR]))
      return acc
    }, [] as string[]))

    return true
  }
}
