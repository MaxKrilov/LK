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
  isRequiredQuestion,
  isChildQuestion,
  isTextQuestion,
  surveyStatusIsDone,
  isMaxPostponedTimes,
  isPostponedTillExpired
} from '@/functions/survey.ts'

function isNumber (val) {
  return !isNaN(val)
}

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
      surveyDate: '',
      prevAnswer: {}
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
    },
    $route () {
      this.isAnswerSelected = false
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
      allActualSurveyCount: 'survey/getAllActualSurveyCount'
    }),
    maxPage () {
      const count = this.survey.surveyQuestion.length
      return count
    },
    async isQuestionVisibleInSSP () {
      const result = await questionIsVisibleInSSP(this.getCurrentQuestion())
      return result
    },
    async isNextActive () {
      const currentQuestion = await this.getCurrentQuestion()
      const isRequired = isRequiredQuestion(currentQuestion)
      return !isRequired || this.isAnswerSelected
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
    isLastRequiredQuestion () {
      const remainsQuestionList = this.survey.surveyQuestion.slice(this.currentQuestionIndex + 1)
      const requiredQuestionList = remainsQuestionList.filter(el => isRequiredQuestion(el))
      return !requiredQuestionList.length
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
      const survey = await this.survey
      return survey.surveyQuestion[this.currentQuestionIndex]
    },
    allAnswersIsNumber (answerList) {
      return answerList.every(el => isNumber(el.name))
    },
    backsortAnswers (answerList) {
      return [...answerList]
        .sort(
          (a, b) => parseInt(b.name) - parseInt(a.name)
        )
    },
    sortPossibleAnswers (answers) {
      if (this.allAnswersIsNumber(answers)) {
        const newAnswerList = this.backsortAnswers(answers)
        logInfo(newAnswerList)
        return newAnswerList
      }

      return [...answers]
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
      const currentQuestion = await this.getCurrentQuestion()
      const lastQuestionIndex = (await this.maxPage - 1)
      const isLastQuestion = this.currentQuestionIndex >= lastQuestionIndex

      if (this.currentAnswer || isRequiredQuestion(currentQuestion)) {
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

        this.sendQuestionResponse(question)
        this.prevAnswer = { ...this.currentAnswer }
      } else {
        this.prevAnswer = {}
      }

      if (this.isLastRequiredQuestion) {
        // Удаление из кампейна
        const deletePayload = {
          api: this.$api,
          id: this.bindedCampaign.id
        }
        this.campaignDelete(deletePayload)
          .then(data => {
            logInfo('survey onNextQuestion isLastQuestion')
          })
      }

      // сбрасываем ответы
      this.currentAnswer = null
      this.isAnswerSelected = false

      if (isLastQuestion) {
        this.onDone()
      } else {
        this.currentQuestionIndex += 1

        const nextQuestion = await this.getCurrentQuestion()

        if (isChildQuestion(nextQuestion)) {
          const depAnswerIdList = nextQuestion.dependencyOnAnswer.map(el => el.id)

          if (!depAnswerIdList.includes(this.prevAnswer.id)) {
            this.currentQuestionIndex += 1

            if (this.currentQuestionIndex > lastQuestionIndex) {
              this.onDone()
            }
          }
        }
      }
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
    async sendQuestionResponse (question) {
      const currentQuestion = await this.getCurrentQuestion()
      const payload = {
        api: this.$api,
        id: this.id,
        surveyQuestion: [question]
      }

      return this.surveyResponseSended(payload)
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
          }

          return data
        })
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
