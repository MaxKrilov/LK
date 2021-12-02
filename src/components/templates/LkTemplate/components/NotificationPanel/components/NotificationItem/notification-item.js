import { mapActions } from 'vuex'
import NotificationIcon from '../NotificationIcon/index'
import TimerDisplay from '../TimerDisplay/index'
import PPRText from '../PPRText/index'
import CampaignCustomMessage14 from '../campaign-custom-message-14'
import WifiCampaignMessage from '../campaign-custom-message-wifi'

import {
  isCampaignCustomMessage,
  isCampaignMessage,
  isPPR,
  isSurvey,
  isSurveyReception,
  isSurveyTicket
} from '@/functions/notifications'
import { isMaxPostponedTimes } from '@/functions/survey'

import { dataLayerPush } from '../../../../../../../functions/analytics'

const MAX_DESCRIPTION_LENGTH = 101

export default {
  props: {
    id: String,
    notification: Object
  },
  components: {
    NotificationIcon,
    TimerDisplay,
    CampaignCustomMessage14,
    'ppr-text': PPRText,
    WifiCampaignMessage
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
    infoTooltip () {
      const ct = this.notification.communication_type
      const taskId = this.notification.task_id || ''
      return `communication_type=${ct} ${taskId ? '\n#' + taskId : ''}`
    },
    isLongDescription () {
      return this?.textContent?.length > MAX_DESCRIPTION_LENGTH || this.isCampaignCustomMessage
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
      return isSurvey(this.notification.communication_type)
    },
    isSurveyTicket () {
      return isSurveyTicket(this.notification.communication_type)
    },
    isSurveyReception () {
      return isSurveyReception(this.notification.communication_type)
    },
    isCampaignMessage () {
      return isCampaignMessage(this.notification.communication_type)
    },
    isCampaignCustomMessage () {
      return isCampaignCustomMessage(this.notification.communication_type)
    },
    isPPR () {
      return isPPR(this.notification.communication_type)
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
    },
    getLabel () {
      const { communication_type: communicationType, task_id: taskId, label } = this.notification
      return communicationType === '15' && taskId === '16'
        ? 'Уведомление об индексации'
        : label
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
        .then(() => {
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
        .then(() => {
          this.$emit('hide')
        })
    },
    onRefuse () {
      // Отклик
      this.$store.dispatch('campaign/responseRefuse', this.payload)
        .then(() => {
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
        .then(() => {
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
        .then(() => {
          this.$emit('survey', this.notification.task_id)
        })
    },
    getDateTime () {
      return this.notification.date
    },
    getDate () {
      return this.getDateTime()?.format('DD.MM.YYYY')
    },
    getTime () {
      return this.getDateTime()?.format('HH:mm')
    },
    dataLayerPush
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
