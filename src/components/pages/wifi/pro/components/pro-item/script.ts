import Vue from 'vue'
import Component from 'vue-class-component'
import { IWifiPro } from '@/tbapi'

import { head } from 'lodash'
import { price as priceFormatted } from '@/functions/filters'
import { ICatalogOffer } from '@/tbapi/catalog_offer'
import ErtSelect from '@/components/UI2/ErtSelect'

import { OFFER_LINKS } from '@/constants/url'
import ErtForm from '@/components/UI2/ErtForm'

import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'

@Component<InstanceType<typeof ErtWifiProItem>>({
  components: {
    ErPlugProduct
  },
  filters: {
    priceFormatted
  },
  props: {
    domain: {
      type: String,
      default: ''
    },
    content: {
      type: Object,
      default: {}
    }
  }
})
export default class ErtWifiProItem extends Vue {
  // Options
  $refs!: Vue & {
    'sms-select': InstanceType<typeof ErtSelect>,
    'offer-form': InstanceType<typeof ErtForm>
  }

  // Props
  readonly domain!: string
  readonly content!: IWifiPro

  // Data
  smsPacket = {
    code: this.getCurrentPacketOffer.code,
    name: this.getCurrentPacketOffer.name,
    // @ts-ignore
    price: Number(head(this.getCurrentPacketOffer.prices)?.amount || 0),
    status: 'active'
  }
  listSMSPacket: { code: string, name: string, price: number }[] = [this.smsPacket]

  loadingPacket: boolean = false
  errorMessage: string[] = []

  dialogQuestion: boolean = false
  dialogSuccess: boolean = false
  dialogError: boolean = false

  isOffer: boolean = false
  offerLink: string = OFFER_LINKS.wifi

  isLoadingConnect: boolean = false

  // Computed
  get getPrice () {
    return Object.keys(this.content.services).reduce((acc, serviceId) => {
      return (acc += Number(this.content.services[serviceId].purchasedPrices.recurrentTotal.value))
    }, 0)
  }

  get getSmsPackets () {
    return [
      'Расчет по фактическому объёму',
      '500 SMS',
      '1000 SMS',
      '2000 SMS',
      'Безлимитный'
    ]
  }

  get getCurrentPacket () {
    return this.content.packets[head(Object.keys(this.content.packets))!]
  }

  get getCurrentPacketOffer () {
    return this.getCurrentPacket.offer
  }

  get isVisibleChangeButton () {
    return this.smsPacket.status !== 'active'
  }

  get offerCheckboxRules () {
    return [
      (v: any) => !!v || 'Необходимо принять условия оферты'
    ]
  }

  get changeData () {
    const firstService = head(Object.values(this.content.services))
    if (!firstService) return null
    return {
      descriptionModal: 'Для смены пакета SMS необходимо сформировать заявку на вашего персонального менеджера',
      addressId: firstService.addressId,
      services: `Смена пакета SMS (${this.smsPacket.name})`,
      fulladdress: firstService.fullAddress,
      type: 'change'
    }
  }

  // Methods
  getPacketOffer () {
    const firstService = head(Object.values(this.content.services))
    this.loadingPacket = true

    this.$store.dispatch('catalog/fetchAllowedOffers', {
      id: this.content.offer.id,
      marketId: firstService!.marketId
    })
      .then((response: ICatalogOffer[]) => {
        this.listSMSPacket = this.transformPacketOffer(response)
      })
      .catch(() => {
        this.errorMessage.push('Произошла ошибка при получении данных с сервера')
      })
      .finally(() => {
        this.loadingPacket = false
      })
  }

  transformPacketOffer (listPacketOffer: ICatalogOffer[]) {
    const offeringRelationships = head(listPacketOffer)!.offeringRelationships
    let offerings
    for (let i = 0; i < offeringRelationships.length; i++) {
      if (offeringRelationships[i].hasOwnProperty('offerings')) {
        offerings = offeringRelationships[i].offerings
        break
      }
    }
    if (!offerings) return []
    return offerings.map(offering => {
      return {
        code: offering.code,
        name: offering.name,
        price: Number(head(offering.prices)?.amount || 0),
        status: offering.code === this.smsPacket.code
          ? 'active' // Подключенный пакет
          : 'available' // Доступные пакеты для подключения
      }
    })
  }

  openDialogQuestion () {
    this.dialogQuestion = true
  }

  closeDialogQuestion () {
    this.dialogQuestion = false
  }

  changeSMSPacket () {
    this._onChangeSMSPacket()
      .then(() => {
        this.$emit('success')
      })
      .catch(() => {
        this.$emit('error')
      })
  }

  _onChangeSMSPacket () {
    return new Promise(async (resolve, reject) => {
      try {
        await this.$store.dispatch('salesOrder/create', {
          locationId: this.content.locationId
        })
        await this.$store.dispatch('salesOrder/addElement', {
          productCode: this.smsPacket.code,
          productId: this.content.id
        })
        await this.$store.dispatch('salesOrder/deleteElement', {
          productId: this.getCurrentPacket.id,
          disconnectDate: this.$moment().format()
        })
        await this.$store.dispatch('salesOrder/save')
        await this.$store.dispatch('salesOrder/send', {
          offerAcceptedOn: this.$moment().format()
        })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }
}
