import { mapActions, mapState } from 'vuex'
import ResponsiveMixin from '@/mixins/ResponsiveMixin'
import ItemState from './components/State'

export default {
  name: 'contacts-list-item',
  components: { 'item-state': ItemState },
  mixins: [ResponsiveMixin],
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    dataKey: {
      type: String,
      default: null
    },
    expandedId: {
      type: String,
      default: null
    },
    primaryContactId: {
      type: String,
      default: null
    }
  },
  data: () => ({
    pre: 'contacts-list-item'
  }),
  computed: {
    ...mapState('contacts', ['deleteContactState', 'createContactState']),
    actionMessage () {
      let action = {
        leftPos: this.$refs.firstName ? this.$refs.firstName.offsetWidth : 0
      }
      if (this.deleteContactState.isFetched) {
        action.active = true
        action.message = this.isMobile ? 'Удален' : 'Контакт сотрудника удален'
        action.state = 'delete'
        action.id = this.deleteContactState.id
      }
      if (this.createContactState.isFetched) {
        action.active = true
        action.message = this.isMobile ? 'Изменен' : 'Контакт сотрудника изменен'
        action.state = 'change'
        action.id = this.createContactState.id
      }
      return action
    },
    isMobile () {
      return this.isXS || this.isSM
    }
  },
  methods: {
    ...mapActions('contacts', ['deleteContact']),
    handleEditContact () {
      this.$emit('mobileEditContact')
    },
    handleDeleteContact () {
      this.deleteContact({ api: this.$api })
    }
  }
}
