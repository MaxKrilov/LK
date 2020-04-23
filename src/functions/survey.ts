import {
  MANDATORY_02,
  SHOW_IN_SSP_RU,
  SHOW_IN_SSP_EN,
  QUESTION_TYPE_TEXT,
  SURVEY_STATUS_DONE,
  SURVEY_MAX_POSTPONED_TIMES,
  QUESTION_IS_REQUIRED
} from '@/constants/survey.ts'

import { ISurveyQuestion } from '@/tbapi'

function questionIsVisibleInSSP (question: ISurveyQuestion): boolean {
  const showInSSP = [SHOW_IN_SSP_RU, SHOW_IN_SSP_EN]
  return showInSSP.includes(question.doNotShowInSSP)
}

function questionHasMandatory (question: ISurveyQuestion): boolean {
  return question.mandatory === MANDATORY_02
}

function isRequiredQuestion (question: ISurveyQuestion): boolean {
  return question.mandatory === QUESTION_IS_REQUIRED
}

function getOrderedQuestionList (questionList: ISurveyQuestion[]): any[] {
  if (questionList) {
    let newList = questionList.slice()
    newList.sort((a, b) => {
      const aOrder = parseInt(a.orderNumber)
      const bOrder = parseInt(b.orderNumber)
      return aOrder - bOrder
    })
    const filteredList = newList.filter(el => questionIsVisibleInSSP(el))
    return filteredList
  }

  return []
}

function isChildQuestion (question: ISurveyQuestion): boolean {
  return !!question.dependencyOnQuestion
}

function getParentQuestionList (questionList: ISurveyQuestion[]): ISurveyQuestion[] {
  return questionList.filter(el => !isChildQuestion(el))
}

function surveyStatusIsDone (surveyStatus: string): boolean {
  return surveyStatus === SURVEY_STATUS_DONE
}

function isTextQuestion (questionType: string): boolean {
  return questionType === QUESTION_TYPE_TEXT
}

function isMaxPostponedTimes (postponedTimes: string): boolean {
  /* отложено максимальное количество раз */
  const times = parseInt(postponedTimes)
  return times >= SURVEY_MAX_POSTPONED_TIMES
}

function isPostponedTillActual (postponedTill: Date, endDate: Date): boolean {
  const tillTimestamp = +postponedTill
  const endTimestamp = +endDate

  const todayDate = new Date()
  const todayTimestamp = +todayDate

  const isActual = endTimestamp >= tillTimestamp
    ? todayTimestamp >= tillTimestamp
    : false

  return isActual
}

function isPostponedTillExpired (postponedTill: Date, endDTTM: Date): boolean {
  return !isPostponedTillActual(postponedTill, endDTTM)
}

function processSurvey (data: any): any {
  data.postponedTill = data.postponedTill
    ? new Date(data.postponedTill)
    : undefined

  data.surveyQuestion = getOrderedQuestionList(data.surveyQuestion)
  return data
}

export {
  questionIsVisibleInSSP,
  questionHasMandatory,
  isRequiredQuestion,
  isChildQuestion,
  getOrderedQuestionList,
  getParentQuestionList,
  isTextQuestion,
  surveyStatusIsDone,
  isMaxPostponedTimes,
  isPostponedTillExpired,
  isPostponedTillActual,
  processSurvey
}
