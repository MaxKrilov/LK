import { Vue, Component, Prop } from 'vue-property-decorator'
import { ITVProduct, ITVLine, ITVSTB, ITVPacket, IModuleInfo, ITVLineOfferPrice } from '@/components/pages/tv/tv.d.ts'
import { ARRAY_STATUS_SHOWN } from '@/constants/status'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'

const components = { ErPlugProduct }

@Component({ components })
export default class TvSlider extends Vue {
  @Prop({ type: String }) readonly bpi: string | undefined
  @Prop({ type: String }) readonly fulladdress: string | undefined
  @Prop({ type: String }) readonly addressId: string | undefined
  moduleList: IModuleInfo[] = []
  loading: boolean = true
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

  mounted () {
    this.$store.dispatch('productnservices/customerTVProducts', {
      api: this.$api,
      parentIds: [this.bpi]
    })
      .then((response:ITVProduct) => {
        const data = Object.values(Object.values(response)?.[0].tvlines)
          .filter((line: ITVLine) => ARRAY_STATUS_SHOWN.includes(line?.status))
          .map((line: ITVLine) => {
            const stb: {id: string, name: string, price: number, type: string}[] = line?.stb ? Object.values(line?.stb).map((stbItem:ITVSTB) => {
              return {
                id: stbItem.id,
                type: stbItem.chars['Способ передачи оборудования'],
                price: Number(stbItem.purchasedPrices.recurrentTotal.value),
                name: stbItem.name
              }
            }) : [{
              id: '',
              price: 0,
              type: '',
              name: ''
            }]
            const packets: {id: string, name: string, price: number, code: string}[] = Object.values(line.packets)
              .filter((packet:ITVPacket) => packet.status === 'Active')
              .map((packet:ITVPacket) => {
                return {
                  id: packet.id,
                  name: packet.name,
                  code: packet.offer.code,
                  price: Number(packet.purchasedPrices.recurrentTotal.value)
                }
              })

            const linePrice: string | undefined = Object.values(line.offer.prices)
              .find((el: ITVLineOfferPrice) => el?.chars?.['Тип подключения к IP-сети'] === line?.chars?.['Тип подключения к IP-сети'])?.amount

            return {
              id: line.id,
              status: line.status,
              tvType: line?.chars?.['Тип TV'],
              stb: stb?.[0],
              price: line.purchasedPrices.recurrentTotal.value,
              linePrice,
              name: line.chars['Имя в счете'],
              locationId: line.locationId,
              offerId: line.offer.id,
              addressId: this.addressId || '',
              fulladdress: this.fulladdress || '',
              packets
            }
          })
        this.moduleList = data
        this.loading = false
      })
      .catch(() => {})
  }
  openPackages (data: any) {
    this.$router.push({
      name: 'tv-packages',
      params: {
        line: data
      }
    })
  }
}
