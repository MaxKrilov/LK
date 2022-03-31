import { Vue, Component, Prop } from 'vue-property-decorator'
import { IOfferingRelationship, IProductOffering } from '@/interfaces/offering'
import { IModuleInfo } from '@/components/pages/tv/tv.d.ts'
import AllowedOffers from '@/mixins/ComponentManageView/AllowedOffers'
type KeyObjectFromSTB = {
  [key: string]: string | undefined
}

@Component({})
export default class ComponentManageViewMixin extends Vue {
  @Prop() readonly line: IModuleInfo | undefined
  isStatusSwitcherAfterSendingOrder: boolean = false
  isSuccessStatusSwitcherAfterSendingOrder: boolean = false
  productAllowedOffers:IOfferingRelationship[] = []
  sManageView: string = 'Управляй просмотром'
  serviceManageView: string = `услугу ${this.sManageView}`
  disconnectOfferingManageView: KeyObjectFromSTB = {}
  availableServiceManageView: Record<string, string> = {}
  getProductServicesAllowedOffers!: <
    P = { api: any, id: string, marketId: number | string },
    R = Promise<IProductOffering>
    >(args: P) => R

  get tariffName () {
    return this.line?.name?.replace('Абонентская линия', '').trim()
  }
  get findServiceManageView (): any {
    return (unit: any) => this.containsServiceManageView(unit)
  }

  get getLineStbAll (): any {
    return this.line?.viewStb || []
  }

  get getLineStbUnitOfferCode () {
    return (code: string) => {
      if ([code].indexOf(this.transformLineStbAll('offerCode')) !== -1) {
        return this.transformLineStbAll('offerCode')
      }
      return code
    }
  }

  get getLineStbUnitOfferName (): string | undefined {
    return this.transformLineStbAll('offerName')
  }

  get getLineStbUnitOfferPrice (): number | string {
    return this.transformLineStbAll('price')
  }

  get getTopicalStatus () {
    return this.getLineStbUnitOfferPrice ? 'Active' : 'Disconnected'
  }

  get offerConnectedOfferingManageView (): any {
    return (code: string, tomsId: string) => {
      const checkOfferConnected = (this.getLineStbAll || [])?.find((stb: any) =>
        stb['tomsId'] === tomsId &&
        stb['status'] === 'Active' &&
        !!stb?.['price'])
      const offerCode = this.getLineStbUnitOfferCode
      if (checkOfferConnected) return checkOfferConnected
      return {
        id: this.transformLineStbAll('id'),
        price: this.getLineStbUnitOfferPrice,
        status: this.getTopicalStatus,
        offerCode: offerCode(code)
      }
    }
  }
  private containsServiceManageView (unit: any) {
    return unit['offerName'].includes(this.sManageView)
  }
  transformLineStbAll (param: string) {
    return (this.getLineStbAll || [])?.find(this.findServiceManageView)?.[param]
  }
  renderSuccessSwitcher (): void {
    this.isSuccessStatusSwitcherAfterSendingOrder = true
  }
  renderCancelOrderSwitcher (): void {
    this.isStatusSwitcherAfterSendingOrder = true
  }
  changeStatusConnection (v:boolean) {
    if (!v) this.isStatusSwitcherAfterSendingOrder = true
    else this.isStatusSwitcherAfterSendingOrder = false
  }
  async mounted () {
    const allAllowedOffers = new AllowedOffers()
    const aProductServicesAllowedOffers = allAllowedOffers.offersGet(async () => this.getProductServicesAllowedOffers({ api: this.$api, id: this.line?.offerId, marketId: this.line?.marketId }))
    const productAllowedOffers: [] = await aProductServicesAllowedOffers.then(r => r)
    this.availableServiceManageView = productAllowedOffers
      .reduce(// подкл услуги "Управляй просмотром" AllowedOffers
        (acc: Record<string, string>, relationships: IOfferingRelationship): {} => {
          const tariffName = this.tariffName
          const childMax = [(+true)].indexOf(+relationships.childMax) !== -1
          const childProductOffering = relationships?.['childProductOffering']
          const viewManage = childMax && childProductOffering?.name.includes(`${this.sManageView} (${tariffName})`)
          const offeringCodeManageView = viewManage && childProductOffering?.code
          const price: number = (offeringCodeManageView && childProductOffering?.prices
            ?.find((amount: any) => amount)?.amount) || 0
          if (offeringCodeManageView) {
            return price && {
              ...acc,
              price,
              'code': offeringCodeManageView,
              'tomsId': childProductOffering['tomsId']
            }
          }
          return acc
        }, {}
      )
    const { code: codeDisconnect, tomsId }: { code?: string, tomsId?: string } = this.availableServiceManageView
    const tomsIdDisconnect = this.offerConnectedOfferingManageView
    this.disconnectOfferingManageView = tomsIdDisconnect(codeDisconnect, tomsId)
  }
}
