import { getNotificationType } from '@/functions/notifications'
import { T_CAMPAIGN_CUSTOM_MESSAGE_TYPE } from '@/constants/campaign'

const TOAST_HIDE_TIMEOUT = 3600

export default {
  name: 'er-toast',
  props: {
    id: String,
    title: {
      type: String,
      default: 'Новое уведомление'
    },
    text: String,
    type: String,
    params: {}
  },
  computed: {
    iconName () {
      return getNotificationType(this.type).iconName
    },
    offerNumber () {
      return this.$props.params?.['param_2'] || '%param_2%'
    },
    isCustomCampaignMessage () {
      return this.$props.type === T_CAMPAIGN_CUSTOM_MESSAGE_TYPE
    }
  },
  mounted () {
    setTimeout(() => {
      this.$emit('timeout')
    }, TOAST_HIDE_TIMEOUT)
  },
  methods: {
    onClick () {
      this.$emit('click', this.id)
    },
    onHide () {
      this.$emit('hide', this.id)
    }
  }
}
