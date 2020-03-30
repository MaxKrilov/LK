import { getNotificationType } from '@/functions/notifications'

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
    type: String
  },
  computed: {
    iconName () {
      return getNotificationType(this.type).iconName
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
