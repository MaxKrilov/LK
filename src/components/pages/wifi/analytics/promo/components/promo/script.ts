import ErPromo from '@/components/blocks/ErPromo/index.vue'

export default {
  name: 'wifi-analytics-promo',
  extends: ErPromo,
  props: {
    cost: {
      type: String,
      default: ''
    },
    forward: {
      type: Function,
      default: () => {}
    }
  }
}
