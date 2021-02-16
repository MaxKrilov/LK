import SurveyQuestion from './components/SurveyQuestion/index'
import { mapActions, mapGetters, mapState } from 'vuex'
import { logError, logInfo } from '@/functions/logging.ts'
import { isSurvey, isSurveyReception, isSurveyTicket } from '@/functions/notifications'

import {
  isChildQuestion,
  isMaxPostponedTimes,
  isPostponedTillExpired,
  isRequiredQuestion,
  isTextQuestion,
  surveyStatusIsDone
} from '@/functions/survey.ts'
import { Cookie } from '@/functions/storage'

function isNumber (val) {
  return !isNaN(val)
}

export default {
  name: 'SurveyPage',
  components: {
    SurveyQuestion
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
      linkedCampaign: {},
      surveyDate: '',
      prevAnswer: {},
      isNotFound: false
    }
  },
  async created () {
    await this.fetchData(this.id)
  },
  watch: {
    id (value, oldValue) {
      if (value !== oldValue) {
        this.fetchData(value)
      }
    },
    survey (value) {
      if (value) {
        this.isSurveyLoaded = true
        this.currentQuestionIndex = this.survey.surveyQuestion.findIndex(isRequiredQuestion)
      }
    },
    $route () {
      this.isAnswerSelected = false
    }
  },
  computed: {
    ...mapState({
      survey: state => state.survey.current,
      surveyList: state => state.survey.list,
      surveyIsLoaded: state => state.survey.currentIsLoaded,
      notificationList: state => state.campaign.list
    }),
    ...mapGetters({
      actualSurveyList: 'survey/getActualSurveyList',
      actualSurveyCount: 'survey/getActualSurveyCount',
      allActualSurveyCount: 'survey/getAllActualSurveyCount'
    }),
    maxPage () {
      return this.survey.surveyQuestion.length
    },
    isNextActive () {
      const isRequired = this.currentQuestion
        ? isRequiredQuestion(this.currentQuestion)
        : false
      return !isRequired || this.isAnswerSelected
    },
    isSurvey () {
      const communicationType = this.linkedCampaign.communication_type
      return isSurvey(communicationType)
    },
    isSurveyTicket () {
      const communicationType = this.linkedCampaign.communication_type
      return isSurveyTicket(communicationType)
    },
    isSurveyReception () {
      const communicationType = this.linkedCampaign.communication_type
      return isSurveyReception(communicationType)
    },
    isLastRequiredQuestion () {
      const remainsQuestionList = this.survey.surveyQuestion.slice(this.currentQuestionIndex + 1)
      const requiredQuestionList = remainsQuestionList.filter(el => isRequiredQuestion(el))
      return !requiredQuestionList.length
    },
    async currentSurveyInSurveyList () {
      const surveyList = this.surveyList
      return surveyList.filter(el => el.id === this.id)
    },
    isNextSurveyActive () {
      // есть ещё актуальные анкеты кроме этой
      return this.actualSurveyCount > 0
    },
    currentQuestion () {
      return this.survey?.surveyQuestion?.[this.currentQuestionIndex]
    },
    surveyQuestionIdList () {
      return this.survey.surveyQuestion.map(el => el.id)
    },
    currentQuestionChildren () {
      return this.survey.surveyQuestion.filter(isChildQuestion)
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
      this.isNotFound = false

      this.getSurvey({ api: this.$api, id })
        .catch(() => {
          this.isNotFound = true
          this.isSurveyLoaded = true
          this.done = true
        })
        .then(async data => {
          const id = this.id
          const linkedCampaign = await this.fetchByTaskId({ api: this.$api, taskId: id })

          this.linkedCampaign = linkedCampaign
          this.surveyDate = linkedCampaign.req_date

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
              this.linkedCampaign.communication_end_dttm
            )

            if (isEnded) {
              logInfo('survey isEnded', data.postponedTill, this.linkedCampaign.communication_end_dttm)
              this.onDone()
              this.onNextSurvey()
            }
          }

          const storedAnswer = Cookie.get(`survey-${this.id}`)
          if (storedAnswer) {
            this.prevAnswer = JSON.parse(storedAnswer)
          }

          return data
        })

      this.getSurveyByClient({ api: this.$api })
    },
    getCurrentQuestion () {
      const survey = this.survey
      return survey?.surveyQuestion?.[this.currentQuestionIndex]
    },
    allAnswersIsNumber (answerList) {
      return answerList?.every(el => isNumber(el.name)) || false
    },
    backsortAnswers (answerList) {
      return [...answerList]
        .sort(
          (a, b) => parseInt(b.name) - parseInt(a.name)
        )
    },
    sortPossibleAnswers (answers) {
      if (this.allAnswersIsNumber(answers)) {
        return this.backsortAnswers(answers)
      }

      return answers
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
      const lastQuestionIndex = (this.maxPage - 1)
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

        await this.sendQuestionResponse(question)
        this.prevAnswer = { ...this.currentAnswer }
      } else {
        this.prevAnswer = {}
      }

      if (this.isLastRequiredQuestion) {
        // Удаление из кампейна
        const deletePayload = {
          api: this.$api,
          id: this.linkedCampaign.id
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
      if (this.isNextSurveyActive) {
        const fixDuplicatedIds = this.actualSurveyList.filter(
          el => el.id !== this.survey.id
        )

        const nextSurvey = fixDuplicatedIds[0]
        if (nextSurvey) {
          this.$router.push({
            name: 'survey',
            params: { id: nextSurvey.id }
          }).catch(err => { logError(err) })
        }
      }
    },
    async sendQuestionResponse (question) {
      const currentQuestion = await this.getCurrentQuestion()
      const payload = {
        api: this.$api,
        id: this.id,
        surveyQuestion: [question]
      }

      Cookie.set(`survey-${this.id}`, JSON.stringify(question), {})

      return this.surveyResponseSended(payload)
        .then(data => {
          if (data.businessErrorCode !== undefined) {
            logError('survey/responseSended', data.userMessage)
          } else {
            const payload = {
              api: this.$api,
              task_rk: this.linkedCampaign.communication_task_rk,
              task_id: this.linkedCampaign.task_id,
              RoleAccount: this.linkedCampaign.RoleSSOAccount,
              Channel: this.linkedCampaign.Channel,
              type: this.linkedCampaign.communication_type,
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
        task_rk: this.linkedCampaign.communication_task_rk,
        Channel: this.linkedCampaign.Channel,
        RoleAccount: this.linkedCampaign.RoleSSOAccount,
        type: this.linkedCampaign.communication_type
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
      } = this.linkedCampaign

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

      const surveyPayload = {
        api: this.$api,
        id: this.id
      }
      this.surveyResponseCanceled(surveyPayload)

      // - Удаление
      const deletePayload = {
        api: this.$api,
        id: this.linkedCampaign.id
      }
      this.campaignDelete(deletePayload)
        .then(data => {
          logInfo('survey Refuse')
          this.onDone()
        })
    }
  }
}
