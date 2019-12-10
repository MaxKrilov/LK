import AdditionalServicesComponent from '../AdditionalServicesComponent'

export default {
  name: 'point-component',
  components: {
    AdditionalServicesComponent
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      pre: 'point',
      isOpen: false
    }
  }
}
