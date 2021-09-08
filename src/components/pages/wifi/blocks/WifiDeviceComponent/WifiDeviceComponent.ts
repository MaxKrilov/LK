import moment from 'moment'
import DeviceComponent from '@/components/blocks/DeviceComponent/DeviceComponent'
import { Component } from 'vue-property-decorator'

@Component
export default class WifiDeviceComponent extends DeviceComponent {
  onSuccessLoadingDevices () {
    this.customerProducts({ api: this.$api, parentIds: [this.productId] })
      .then((response) => {
        const devices = response?.[this.productId]?.slo.filter((slo:any) => this.listOfDevices.includes(slo.offer.tomsId)) || []

        this.devices = devices.map((device: any) => {
          const price:string[] = String(device.purchasedPrices.recurrentTotal.value).split('.')
          const _device: Record<string, string> = {}
          _device['Гарантийный срок'] = moment(device.chars?.['Гарантийный срок (до)']).format('DD.MM.Y') || ''
          _device['Тип оборудования'] = device.chars?.['Тип оборудования'] || 'Точка доступа'
          _device['Модель'] = device.chars['Модель'] || device.chars['Сегмент оборудования']
          _device['Способ передачи оборудования'] = device.chars['Способ передачи оборудования']
          _device['Длительность рассрочки'] = device.chars?.['Длительность рассрочки'] || ''
          _device['Стоимость'] = price[0] + ',' + price[1]
          return _device
        })
      })
      .finally(() => {
        this.toDoAfterLoadingDevices()
      })
  }
}
