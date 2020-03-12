import Vue from 'vue'

// Components
import ReverceZoneItemComponent from './blocks/ReverceZoneItemComponent/index'

export default Vue.extend({
  name: 'reverce-zones-page',
  components: {
    ReverceZoneItemComponent
  },
  data () {
    return {
      listReverceZone: [
        {
          ip: '10.95.217.183',
          reverceZone: '10х95х217х183.static-business.ekat.ertelecom.ru'
        },
        {
          ip: '46.146.238.245',
          reverceZone: '46x146x238x245.static-business.ekat.ertelecom.ru'
        },
        {
          ip: '10.95.217.182',
          reverceZone: '10х95х217х182.static-business.ekat.ertelecom.ru'
        },
        {
          ip: '46.146.238.246',
          reverceZone: '46x146x238x246.static-business.ekat.ertelecom.ru'
        }
      ],
      isOpenAdding: false,
      ipList: [
        '46.146.238.245',
        '10.95.217.183'
      ],
      model: {
        ip: '',
        domain: ''
      }
    }
  },
  methods: {
    deleteReverceZone (reverceZone: string) {
      this.listReverceZone.splice(
        this.listReverceZone.findIndex(item => item.reverceZone === reverceZone),
        1
      )
    }
  }
})
