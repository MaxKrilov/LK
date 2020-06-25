import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import { CODE_PACGLOCMIN, CODE_PACGMIN } from '@/constants/product-code'

export default {
  name: 'telephony-plug-page',
  props: {
    local: {
      type: Object
    },
    global: {
      type: Object
    }
  },
  components: {
    ErPlugProduct
  },
  data () {
    return {
      pre: 'telephony-plug-page',
      isOpenDescription: false,
      hideButtons: true,
      isOpenStickyButtons: false,
      isConnection: false,
      globalCost: 500,
      localCost: 500,
      selectedPackage: '',
      shadowIcon: {
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: {
          x: '-4px',
          y: '4px'
        },
        shadowRadius: '4px'
      }
    }
  },
  computed: {
    selectedPackageText () {
      if (this.selectedPackage === 'global') {
        return `Выбран пакет: За границу  — ${this.globalCost} ₽`
      }
      if (this.selectedPackage === 'local') {
        return `Выбран пакет: Местные звноки — ${this.localCost} ₽`
      }
      return ''
    },
    orderData () {
      if (this.selectedPackage === 'local') {
        return {
          locationId: this.local?.locationId,
          bpi: this.local?.bpi,
          productCode: CODE_PACGLOCMIN,
          chars: this.localCost === 500 ? undefined : { 'Стоимость пакета': this.localCost },
          offer: true,
          title: 'Вы уверены, что хотите подключить пакет местных минут?'
        }
      }
      if (this.selectedPackage === 'global') {
        return {
          locationId: this.global?.locationId,
          bpi: this.global?.bpi,
          productCode: CODE_PACGMIN,
          chars: this.globalCost === 500 ? undefined : { 'Стоимость пакета': this.globalCost },
          offer: true,
          title: 'Вы уверены, что хотите подключить пакет звонков за границу и по России?'
        }
      }
      return undefined
    }
  },
  methods: {
    handleScroll: function () {
      if (!this.selectedPackageText) return
      const packets = document.querySelector('#chosen-packets')
      const stickyPackets = document.querySelector('#chosen-packets-sticky')
      const packetsTop = packets.getBoundingClientRect().top
      const stickyPacketsTop = stickyPackets.getBoundingClientRect().top + stickyPackets.getBoundingClientRect().height + 20
      this.hideButtons = packetsTop < stickyPacketsTop
    },
    plusLocal () {
      this.localCost = this.localCost + 500
    },
    minusLocal () {
      if (this.localCost > 500) {
        this.localCost = this.localCost - 500
      }
    },
    plusGlobal () {
      this.globalCost = this.globalCost + 500
    },
    minusGlobal () {
      if (this.globalCost > 500) {
        this.globalCost = this.globalCost - 500
      }
    },
    plug () {
      this.isConnection = true
    },
    selectPackage (val) {
      if (this.selectedPackage === val) {
        this.selectedPackage = ''
      } else {
        this.selectedPackage = val
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed: function () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
