import { Vue, Component } from 'vue-property-decorator'
import ServiceFolder from '../blocks/ServiceFolder/index.vue'

const props = {}
const components = {
  ServiceFolder
}
@Component({ props, components })
export default class ServiceListMixin extends Vue {
  /* Миксин загружает и сохраняет данные, если данные не загружены, отображает индикатор загрузки */
  dataRecord: any = {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchData (key: string): Promise<string> {
    throw new Error('Метод ServiceListMixin.fetchData должен быть реализован')
  }

  isItemLoaded (key: string) {
    return this.dataRecord?.[key] || false
  }

  onLoadService (key: any) {
    if (!this.isItemLoaded(key)) {
      this.fetchData(key)
        // @ts-ignore
        .then((data: any) => {
          this.dataRecord = { ...this.dataRecord, [key]: data }
        })
    }
  }
}
