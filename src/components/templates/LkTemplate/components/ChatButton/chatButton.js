import { mapMutations } from 'vuex'
import { dataLayerPush } from '../../../../../functions/analytics'

export default {
  name: 'chat-button',
  data () {
    return {
      isAnimate: true
    }
  },
  mounted () {
    setInterval(() => {
      this.isAnimate = true
      setTimeout(() => {
        this.isAnimate = false
      }, 5000)
    }, 60000)
  },
  methods: {
    ...mapMutations('chat', [
      'openChat'
    ]),
    dataLayerPush
  }
}
