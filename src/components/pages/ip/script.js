import ErCornerButton from '@/components/blocks/ErCornerButton/index'
import SubnetExpander from './components/SubnetExpander'
import Price from './components/Price'

const ipAddressList = [
  {
    ip: '46.146.238.243',
    protocol: 'ipv4',
    activationDate: '02.03.2018',
    price: 0
  },
  {
    ip: '46.146.238.245',
    protocol: 'ipv4',
    activationDate: '02.03.2018',
    price: 25
  },
  {
    ip: '46.146.238.246',
    protocol: 'ipv4',
    activationDate: '02.03.2018',
    price: 200
  },
  {
    ip: '198.51.100.0/28',
    protocol: 'ipv4',
    activationDate: '02.03.2018',
    price: 400,
    subnet: [
      '192.51.100.1',
      '192.51.100.1',
      '192.51.100.1',
      '192.51.100.1',
      '192.51.100.1',
      '192.51.100.1',
      '192.51.100.1',
      '192.51.100.1',
      '192.51.100.1',
      '192.51.100.1',
      '192.51.100.1',
      '192.51.100.1',
      '192.51.100.1'
    ]
  },
  {
    ip: '46.146.238.247',
    protocol: 'ipv4',
    activationDate: '02.03.2018',
    price: 200
  },
  {
    ip: '198.51.100.0/28',
    protocol: 'ipv4',
    activationDate: '02.03.2018',
    price: 400,
    subnet: [
      '192.51.100.1'
    ]
  }
]

export default {
  components: {
    ErCornerButton,
    Price,
    SubnetExpander
  },
  data () {
    return {
      userLogin: 'v4023891',
      ipAddressList,
      showAddIpForm: false,
      totalPrice: 1625,
      totalConnections: 4,
      isConnectionsShow: false,
      connectionAddress: 'Березовский Г, Свердловская Обл, Ленинский П. 26 / а',
      connectionIpAddress: '192.2.25.9',
      addProtocol: '',
      addIpCount: '',
      ipCountList: ['1', '2', '4', '8', '16', '32'],
      protocolList: ['ipv4', 'ipv6']
    }
  },
  methods: {
    onShowAddIpForm () {
      this.showAddIpForm = true
    },
    onAddIp () {
      // TODO: add some code
    },
    onCancelAddIp () {
      this.showAddIpForm = false
    },
    onShowConnections () {
      this.isConnectionsShow = true
    },
    onHideConnections () {
      this.isConnectionsShow = false
    },
    onToggleConnections () {
      this.isConnectionsShow = !this.isConnectionsShow
    }
  }
}
