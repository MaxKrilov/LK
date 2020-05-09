import BreakpointMixin from '@/mixins/BreakpointMixin'
import ConnectedPhone from '../ConnectedPhone'
import moment from 'moment'

export default {
  name: 'slider-content',
  mixins: [BreakpointMixin],
  components: {
    ConnectedPhone
  },
  props: {
    parentId: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      pre: 'slider-content',
      slo: [],
      tlo: {},
      isLoading: true,
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
    phones () {
      return this.slo.filter(el => el.id === '4557').map(el => {
        return {
          number: el.chars['Номер телефона'],
          price: el?.purchasedPrices?.recurrentTotal?.value
        }
      })
    },
    tariffName () {
      return this.tlo?.offer?.name || ''
    },
    startDate () {
      if (this.tlo?.actualStartDate) {
        return moment(this.tlo?.actualStartDate).format('DD.MM.Y')
      }
      return ''
    },
    isStopped () {
      return this.tlo?.status === 'Suspended'
    }
  },
  mounted () {
    this.$store.dispatch('productnservices/customerProduct', {
      api: this.$api,
      parentId: this.parentId
    }).then(answer => {
      this.isLoading = false
      this.slo = answer?.slo
      this.tlo = answer?.tlo
    }).catch(() => {
      this.isLoading = false
    })
  }
}
