import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import { CODE_PACGLOCMIN, CODE_PACGMIN } from '@/constants/product-code'
import ErActivationModal from '@/components/blocks/ErActivationModal/index'

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
    ErActivationModal,
    ErPlugProduct
  },
  data () {
    return {
      pre: 'telephony-plug-page',
      isOpenDescription: false,
      hideButtons: true,
      isOpenStickyButtons: false,
      isConnection: false,
      isTryConnection: false,
      isShowMoneyModal: false,
      availableFunds: false,
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
        return `Выбран пакет: Местные звонки — ${this.localCost} ₽`
      }
      return ''
    },
    selectedPrice () {
      if (this.selectedPackage === 'global') {
        return Number(this.globalCost)
      }
      if (this.selectedPackage === 'local') {
        return Number(this.localCost)
      }
      return 0
    },
    orderData () {
      if (this.selectedPackage === 'local') {
        return {
          locationId: this.local?.locationId,
          bpi: this.local?.bpi,
          marketId: this.local?.marketId,
          productCode: CODE_PACGLOCMIN,
          chars: this.localCost === 500 ? undefined : { 'Стоимость пакета': this.localCost },
          offer: 'telephonya',
          title: 'Вы уверены, что хотите подключить пакет местных минут?'
        }
      }
      if (this.selectedPackage === 'global') {
        return {
          locationId: this.global?.locationId,
          bpi: this.global?.bpi,
          productCode: CODE_PACGMIN,
          marketId: this.global?.marketId,
          chars: this.globalCost === 500 ? undefined : { 'Стоимость пакета': this.globalCost },
          offer: 'telephonya',
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
      this.isTryConnection = true
      this.$store.dispatch('salesOrder/getAvailableFunds')
        .then((response) => {
          this.availableFunds = response.availableFundsAmt
          if (this.availableFunds - this.selectedPrice < 0) {
            this.isShowMoneyModal = true
          } else {
            this.isConnection = true
          }
        })
        .catch(() => {
          this.isConnection = true
        })
        .finally(() => {
          this.isTryConnection = false
        })
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
