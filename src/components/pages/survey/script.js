import SurveyPage from './components/SurveyPage/index'
import { mapGetters, mapState, mapActions } from 'vuex'
import { logError, logInfo } from '@/functions/logging.ts'
import {
  isSurvey,
  isSurveyTicket,
  isSurveyReception
} from '@/functions/notifications'

import {
  questionIsVisibleInSSP,
  questionHasMandatory,
  isTextQuestion,
  surveyStatusIsDone,
  isMaxPostponedTimes,
  isPostponedTillExpired
} from '@/functions/survey.ts'

export default {
  name: 'survey',
  components: {
    SurveyPage
  },
  props: {
    id: String
  },
  data () {
    return {
      currentQuestionIndex: 0,
      done: false,
      isAnswerSelected: false,
      isSurveyLoaded: false,
      showPutOffButton: false,
      bindedCampaign: {},
      surveyDate: ''
    }
  },
  async created () {
    await this.fetchData(this.id)
  },
  watch: {
    id (val) {
      this.fetchData(val)
    },
    survey () {
      this.isSurveyLoaded = true
    }
  },
  computed: {
    ...mapState({
      surveyList: state => state.survey.list,
      notificationList: state => state.campaign.list
    }),
    ...mapGetters({
      survey: 'survey/getSurvey',
      actualSurveyList: 'survey/getActualSurveyList',
      actualSurveyCount: 'survey/getActualSurveyCount',
      allActualSurveyCount: 'survey/getAllActualSurveyCount',
      sortedByOrderNumber: 'survey/getOrderedCurrentQuestionList'
    }),
    async actualSurveyCount () {
      // кол-во актуальных анкет кроме текущей
      const filteredSurveyList = await this.allActualSurveyList
      return filteredSurveyList.filter(
        el => el.id !== this.id
      ).length > 0
    },
    maxPage () {
      const count = this.sortedByOrderNumber.length
      return count
    },
    hasMandatory () {
      return questionHasMandatory(
        this.getCurrentQuestion()
      )
    },
    isQuestionVisibleInSSP () {
      return questionIsVisibleInSSP(this.getCurrentQuestion())
    },
    isNextActive () {
      return this.hasMandatory || this.isAnswerSelected
    },
    isSurvey () {
      const communicationType = this.bindedCampaign.communication_type
      const result = isSurvey(communicationType)
      return result
    },
    isSurveyTicket () {
      const communicationType = this.bindedCampaign.communication_type
      const result = isSurveyTicket(communicationType)
      return result
    },
    isSurveyReception () {
      const communicationType = this.bindedCampaign.communication_type
      const result = isSurveyReception(communicationType)
      return result
    },
    async currentSurveyInSurveyList () {
      const surveyList = await this.surveyList
      return surveyList.filter(el => el.id === this.id)
    },
    async isNextSurveyActive () {
      // есть ещё актуальные анкеты кроме этой
      return await this.actualSurveyCount > 0
    }
  },
  methods: {
    ...mapActions({
      fetchByTaskId: 'campaign/fetchByTaskId',
      getSurvey: 'survey/fetchCurrentSurvey',
      getSurveyByClient: 'survey/fetchSurveyByClient',
      surveyResponseSended: 'survey/responseSended',
      surveyResponseCanceled: 'survey/responseCanceled',
      surveyResponsePutOff: 'survey/responsePutOff',
      surveyRemove: 'survey/remove',
      campaignResponseAnswer: 'campaign/responseAnswer',
      campaignResponsePutOff: 'campaign/responsePutOff',
      campaignDelete: 'campaign/delete'
    }),
    async fetchData (id) {
      this.isSurveyLoaded = false
      this.done = false
      this.showPutOffButton = false

      this.getSurvey({ api: this.$api, id })
        .then(async data => {
          const id = this.id
          const bindedCampaign = await this.fetchByTaskId({ api: this.$api, taskId: id })

          this.bindedCampaign = bindedCampaign
          this.surveyDate = bindedCampaign.req_date

          const postponedTimes = data.postponedTimes
            ? parseInt(data.postponedTimes)
            : 0

          this.showPutOffButton = !isMaxPostponedTimes(postponedTimes)

          if (surveyStatusIsDone(data.surveyStatus)) {
            logInfo('surveyStatusIsDone')
            this.onDone()
          }

          if (this.maxPage === 0) {
            logInfo('survey maxPage = 0')
            this.onDone()
          }

          if (data.postponedTill) {
            const isEnded = isPostponedTillExpired(
              data.postponedTill,
              this.bindedCampaign.communication_end_dttm
            )

            if (isEnded) {
              logInfo('survey isEnded', data.postponedTill, this.bindedCampaign.communication_end_dttm)
              this.onDone()
              this.onNextSurvey()
            }
          }
          return data
        })

      this.getSurveyByClient({ api: this.$api })
    },
    async getCurrentQuestion () {
      const curQuestion = await this.sortedByOrderNumber[this.currentQuestionIndex]
      return curQuestion
    },
    onQuestionSelected (answer) {
      this.isAnswerSelected = true
      this.currentAnswer = answer
    },
    onInputText (value) {
      this.isAnswerSelected = true
      this.currentAnswer = value
    },
    async onNextQuestion () {
      const lastQuestionIndex = (await this.maxPage - 1)
      const isLastQuestion = this.currentQuestionIndex >= lastQuestionIndex
      const currentQuestion = await this.getCurrentQuestion()
      const {
        id,
        name,
        questionText,
        questionType
      } = currentQuestion

      const question = {
        id,
        name,
        questionText,
        questionType
      }

      if (isTextQuestion(questionType)) {
        question.textAnswer = this.currentAnswer
      } else {
        question.listAnswer = {
          id: this.currentAnswer.id,
          answerText: this.currentAnswer.answerText
        }
      }

      const payload = {
        api: this.$api,
        id: this.id,
        surveyQuestion: [question]
      }

      this.surveyResponseSended(payload)
        .then(data => {
          if (data.businessErrorCode !== undefined) {
            logError('survey/responseSended', data.userMessage)
          } else {
            const payload = {
              api: this.$api,
              task_rk: this.bindedCampaign.communication_task_rk,
              task_id: this.bindedCampaign.task_id,
              RoleAccount: this.bindedCampaign.RoleSSOAccount,
              Channel: this.bindedCampaign.Channel,
              type: this.bindedCampaign.communication_type,
              question_ord: currentQuestion.id
            }

            this.campaignResponseAnswer(payload)
              .then(data => {
                if (isLastQuestion) {
                  // Удаление из кампейна
                  const deletePayload = {
                    api: this.$api,
                    id: this.bindedCampaign.id
                  }
                  this.campaignDelete(deletePayload)
                    .then(data => { // hello callback hell
                      logInfo('survey onNextQuestion isLastQuestion')
                      this.onDone()
                    })
                } else { // Продолжаем проходить анкету
                  this.currentQuestionIndex += 1
                }

                this.currentAnswer = null
                this.isAnswerSelected = false
              })
          }
        })
    },
    onNextSurvey () {
      logInfo('onNextSurvey')
      if (this.isNextSurveyActive) {
        const fixDuplicatedIds = this.actualSurveyList.filter(
          el => el.id !== this.survey.id
        )

        const nextSurvey = fixDuplicatedIds[0]
        this.$router.push({
          name: 'survey',
          params: { id: nextSurvey.id }
        }).catch(err => { logError(err) })
      }
    },
    onDone () {
      logInfo('onDone')
      this.currentQuestionIndex = 0
      this.done = true
      this.surveyRemove({ id: this.id })
    },
    async onPutOff () {
      // - campaign PutOff
      const campaignPayload = {
        api: this.$api,
        id: this.survey.id,
        task_rk: this.bindedCampaign.communication_task_rk,
        Channel: this.bindedCampaign.Channel,
        RoleAccount: this.bindedCampaign.RoleSSOAccount,
        type: this.bindedCampaign.communication_type
      }

      this.campaignResponsePutOff(campaignPayload)

      // - survey PutOff
      const postponedTimes = this.survey.postponedTimes
        ? this.survey.postponedTimes + 1
        : 1

      const surveyPayload = {
        id: this.survey.id,
        api: this.$api,
        postponedTimes
      }

      this.surveyResponsePutOff(surveyPayload)
        .then(data => {
          logInfo('survey putOff')
          this.onDone()
        })
    },
    onRefuse () {
      // - Отклик
      const {
        // eslint-disable-next-line camelcase
        communication_type,
        Channel,
        RoleSSOAccount,
        // eslint-disable-next-line camelcase
        communication_task_rk,
        // eslint-disable-next-line camelcase
        task_id
      } = this.bindedCampaign

      const refusePayload = {
        api: this.$api,
        id: this.id,
        type: communication_type,
        Channel,
        RoleAccount: RoleSSOAccount,
        task_rk: communication_task_rk,
        task_id
      }

      this.$store.dispatch('campaign/responseRefuse', refusePayload)
        .then(data => {
          this.$emit('hide')
        })

      // - ТВАРИ
      const surveyPayload = {
        api: this.$api,
        id: this.id
      }
      this.surveyResponseCanceled(surveyPayload)

      // - Удаление
      const deletePayload = {
        api: this.$api,
        id: this.bindedCampaign.id
      }
      this.campaignDelete(deletePayload)
        .then(data => {
          logInfo('survey Refuse')
          this.onDone()
        })
    }
  }
}
