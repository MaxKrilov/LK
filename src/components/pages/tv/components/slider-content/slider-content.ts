import { Vue, Component, Prop } from 'vue-property-decorator'
import { ITVProduct, ITVLine, ITVSTB, ITVPacket, IModuleInfo, ITVDataActivation, tvDataActivation } from '@/components/pages/tv/tv.d.ts'
import { ARRAY_STATUS_SHOWN } from '@/constants/status'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import { useChars } from '@/components/pages/tv/components/useHooks/charsField'

const components = { ErPlugProduct }

@Component({ components })
export default class TvSlider extends Vue {
  @Prop({ type: String }) readonly bpi: string | undefined
  @Prop({ type: String }) readonly fulladdress: string | undefined
  @Prop({ type: String }) readonly addressId: string | undefined
  moduleList: IModuleInfo[] = []
  loading: boolean = true
  date: string = ''
  tvCode: string = ''
  isError: boolean = false
  isConnection: boolean = false
  get requestData () {
    return {
      descriptionModal: 'Для добавления нового модуля нужно сформировать заявку на вашего персонального менеджера',
      addressId: this.addressId,
      services: 'Подключение нового ТВ Модуля',
      type: 'change',
      fulladdress: this.fulladdress
    }
  }
  get isTVC () {
    return this.tvCode === 'TVCROOT'
  }

  mounted () {
    this.$store.dispatch('productnservices/customerTVProducts', {
      api: this.$api,
      parentIds: [this.bpi]
    })
      .then((response:ITVProduct) => {
        // @ts-ignore
        this.tvCode = Object.values(response)?.[0]?.offer.code
        // @ts-ignore
        this.date = Object.values(response)?.[0]?.actualStartDate
        // @ts-ignore
        const data = Object.values(Object.values(response)?.[0].tvLines || Object.values(response)?.[0].tvines || {})
          .filter((line: ITVLine) => ARRAY_STATUS_SHOWN.includes(line?.status))
          .map((line: ITVLine) => {
            const stb: {
              id: string,
              name: string,
              price: number,
              type: string,
              offerCode: string,
              offerName: string,
              guarantee: string,
              status: string,
              model: string,
            }[] = line?.stb ? Object.values(line?.stb).map((stbItem:ITVSTB) => {
              return {
                id: stbItem.id,
                type: stbItem?.chars?.['Способ передачи оборудования'],
                price: Number(stbItem.purchasedPrices.recurrentTotal.value),
                stbName: stbItem.name,
                // @ts-ignore
                guarantee: Object.values(stbItem?.services || {})?.[0]?.chars?.['Гарантийный срок (до)'] || '',
                status: stbItem?.status,
                offerCode: stbItem.offer?.code || '',
                offerName: stbItem.offer?.name || '',
                model: stbItem.chars?.['Модель'],
                name: stbItem.chars?.['Имя оборудования'],
                tomsId: stbItem.offer?.tomsId
              }
            }) : [{
              id: '',
              price: 0,
              type: '',
              status: '',
              guarantee: '',
              offerCode: '',
              offerName: '',
              model: '',
              name: ''
            }]

            const packets: {id: string, name: string, price: number, code: string}[] = line?.packets ? Object.values(line.packets)
              ?.filter((packet:ITVPacket) => packet.status === 'Active')
              ?.map((packet:ITVPacket) => {
                const { 'Дата активации': activeDate, 'Дата отключения': shutDate } : tvDataActivation = packet.chars
                const required = (val: boolean) => !!val
                const { chars } = useChars({
                  chars: {
                    'Дата активации': { required, value: activeDate },
                    'Дата отключения': { required, value: shutDate }
                  }
                }) as ITVDataActivation
                return {
                  id: packet.id,
                  name: packet.name,
                  code: packet.offer.code,
                  price: Number(packet.purchasedPrices.recurrentTotal.value),
                  actualStartDate: packet.actualStartDate,
                  chars
                }
              }) : []
            return {
              id: line.id,
              status: line.status,
              marketId: line.market.id,
              tvType: line?.chars?.['Тип TV'],
              stb: stb,
              price: line.purchasedPrices.recurrentTotal.value,
              name: line.chars['Имя в счете'],
              locationId: line.locationId,
              offerId: line.offer.id,
              addressId: this.addressId || '',
              fulladdress: this.fulladdress || '',
              // code: line?.code,
              packets
            }
          })
        // @ts-ignore
        this.moduleList = this.manageView(data)
        this.loading = false
      })
      .catch((error) => {
        console.error(error)
      })
  }
  manageView (data:IModuleInfo[]) {
    return data.map((line: any) => {
      let stbManage = (el:any) => el?.stbName?.includes('Управляй просмотром') && el
      const stb = line.stb.reduce((cur:number, val:{}) => {
        if (!stbManage(val) && cur === -1) {
          return [val]
        }
        return cur
      }, -1)
      const viewStb = (el:any) => stbManage(el)
      return {
        ...line,
        stb,
        viewStb: line.stb.filter(viewStb)
      }
    })
  }
  openPackages (data: any) {
    this.$router.push({
      name: 'tv-packages',
      params: {
        line: data
      }
    })
  }
  openService () {
    this.$router.push({
      name: 'support',
      query: { form: 'technical_issues' },
      params: {
        bpi: this.bpi || '',
        addressId: this.addressId || ''
      }
    })
  }
}
