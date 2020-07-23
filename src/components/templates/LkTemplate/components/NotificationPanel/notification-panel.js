import { mapGetters } from 'vuex'
import { logError } from '@/functions/logging.ts'
import NotificationItem from './components/NotificationItem/index'

export default {
  name: 'notification-panel',
  components: {
    NotificationItem
  },
  data () {
    return {
      hidden: []
    }
  },
  computed: {
    ...mapGetters({
      count: 'campaign/getCount',
      pprList: 'campaign/getPPRList',
      notificationList: 'campaign/getFilteredList'
    })
  },
  methods: {
    onHideItem (id) {
      this.hidden.push(id)
    },
    onGoToSurvey (id) {
      this.$emit('close')

      this.$router.push({
        name: 'survey',
        params: { id }
      }).catch(err => { logError(err) })
    }
  }
}
