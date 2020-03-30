import { mapActions } from 'vuex'
import NotificationIcon from '../NotificationIcon/index'
import TimerDisplay from '../TimerDisplay/index'
import PPRText from '../PPRText/index'
import {
  isSurvey,
  isSurveyReception,
  isSurveyTicket,
  isCampaignMessage,
  isPPR
} from '@/functions/notifications'
import { isMaxPostponedTimes } from '@/functions/survey'

const MAX_DESCRIPTION_LENGHT = 101

export default {
  props: {
    id: String,
    notification: Object
  },
  components: {
    NotificationIcon,
    TimerDisplay,
    'ppr-text': PPRText
  },
  data () {
    return {
      bindedSurvey: null,
      showDescription: true,
      showPutOffButton: false,
      hidden: false
    }
  },
  computed: {
    debugTitle () {
      const ct = this.notification.communication_type
      const taskId = this.notification.task_id || ''
      return `communication_type=${ct}\n#${taskId}`
    },
    isLongDescription () {
      return this.textContent.length > MAX_DESCRIPTION_LENGHT
    },
    hasTimer () {
      return this.notification.expected_resolution_date
    },
    expirationDate () {
      return this.notification.expected_resolution_date
    },
    isCommonSurvey () {
      return this.isSurvey || this.isSurveyTicket || this.isSurveyReception
    },
    isSurvey () {
      const result = isSurvey(this.notification.communication_type)
      return result
    },
    isSurveyTicket () {
      const result = isSurveyTicket(this.notification.communication_type)
      return result
    },
    isSurveyReception () {
      const result = isSurveyReception(this.notification.communication_type)
      return result
    },
    isCampaignMessage () {
      const result = isCampaignMessage(this.notification.communication_type)
      return result
    },
    isPPR () {
      const result = isPPR(this.notification.communication_type)
      return result
    },
    textContent () {
      return this.isCommonSurvey
        ? this.notification.description
        : this.notification.text
    },
    payload () {
      let newPayload = {
        api: this.$api,
        id: this.id
      }

      const reallyIsPPR = isPPR(this.notification.communication_type)
      if (reallyIsPPR) {
        const pprPayload = {
          Channel: 'LK b2b',
          RoleAccount: 'LPR',
          task_id: this.notification.ticket_id,
          type: this.notification.communication_type
        }

        newPayload = Object.assign(pprPayload, newPayload)
      } else {
        const {
          // eslint-disable-next-line camelcase
          communication_type,
          Channel,
          RoleSSOAccount,
          // eslint-disable-next-line camelcase
          communication_task_rk,
          // eslint-disable-next-line camelcase
          task_id
        } = this.notification

        newPayload = {
          ...newPayload,
          type: communication_type,
          Channel,
          RoleAccount: RoleSSOAccount,
          task_rk: communication_task_rk,
          task_id
        }
      }

      return newPayload
    }
  },
  methods: {
    ...mapActions({
      getSurvey: 'survey/fetchSurveyById',
      surveyRemove: 'survey/remove',
      surveyResponseSended: 'survey/responseSended',
      surveyResponseCanceled: 'survey/responseCanceled',
      surveyResponsePutOff: 'survey/responsePutOff',
      campaignResponseAnswer: 'campaign/responseAnswer',
      campaignResponsePutOff: 'campaign/responsePutOff',
      campaignDelete: 'campaign/delete',
      hideItem: 'campaign/hide'
    }),
    onClickAccept () {
      this.$store.dispatch('campaign/responseAccept', this.payload)
        .then(data => {
          // Удаление
          const deletePayload = {
            api: this.$api,
            id: this.notification.id
          }
          this.campaignDelete(deletePayload)

          this.$emit('hide')
        })
    },
    onClickAcceptPPR () {
      const payload = {
        api: this.$api,
        type: this.notification.communication_type,
        id: this.notification.id
      }
      this.$store.dispatch('campaign/responseAccept', payload)
        .then(data => {
          this.$emit('hide')
        })
    },
    onRefuse () {
      // Отклик
      this.$store.dispatch('campaign/responseRefuse', this.payload)
        .then(data => {
          this.$emit('hide')
        })

      // ТВАРИ
      const surveyPayload = {
        api: this.$api,
        id: this.notification.task_id
      }
      this.surveyResponseCanceled(surveyPayload)

      // Удаление
      const deletePayload = {
        api: this.$api,
        id: this.notification.id
      }
      this.campaignDelete(deletePayload)
      this.surveyRemove({ id: this.notification.task_id })
    },
    onPutOff () {
      // - campaign PutOff
      const campaignPayload = {
        api: this.$api,
        id: this.bindedSurvey.id,
        task_id: this.notification.task_id,
        task_rk: this.notification.communication_task_rk,
        Channel: this.notification.Channel,
        RoleAccount: this.notification.RoleSSOAccount,
        type: this.notification.communication_type
      }

      this.campaignResponsePutOff(campaignPayload)

      // - survey PutOff
      const postponedTimes = this.bindedSurvey?.postponedTimes
        ? parseInt(this.bindedSurvey.postponedTimes) + 1
        : 1

      const surveyPayload = {
        id: this.bindedSurvey.id,
        api: this.$api,
        postponedTimes
      }

      this.surveyResponsePutOff(surveyPayload)
        .then(data => {
          this.$emit('hide')
          this.surveyRemove({ id: this.notification.task_id })
        })
    },
    onShowDescription () {
      this.showDescription = !this.showDescription

      if (this.showDescription) {
        this.$store.dispatch('campaign/responseClickForView', this.payload)
      } else {
        this.$store.dispatch('campaign/responseClickToCloseView', this.payload)
      }
    },
    onGoToSurvey () {
      this.$store.dispatch('campaign/responseClickForView', this.payload)
        .then(data => {
          this.$emit('survey', this.notification.task_id)
        })
    },
    getDateTime () {
      const date = this.notification.date
      const moment = this.$moment(date)
      return moment
    },
    getDate () {
      return this.getDateTime().format('DD.MM.YYYY')
    },
    getTime () {
      return this.getDateTime().format('HH:mm')
    }
  },
  created () {
    this.bindedSurvey = this.notification.bindedSurvey || undefined

    if (isSurvey(this.notification.communication_type)) {
      this.showPutOffButton = !isMaxPostponedTimes(
        this.notification.bindedSurvey.postponedTimes
      )
    }
  },
  mounted () {
    if (this.isLongDescription || this.isPPR) {
      this.showDescription = false
    }
  }
}
