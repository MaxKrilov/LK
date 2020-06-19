import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import Dialog from '../Dialog/index.vue'

export default {
  name: 'wifi-analytics-activation-modal',
  extends: ErActivationModal,
  components: {
    'wifi-analytics-activation-dialog': Dialog
  },
  computed: {
    getMaxWidth: () => null
  },
  methods: {
    on: () => {}
  }
}
