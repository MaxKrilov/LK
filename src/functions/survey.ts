import {
  MANDATORY_02,
  SHOW_IN_SSP_RU,
  SHOW_IN_SSP_EN,
  QUESTION_TYPE_TEXT,
  SURVEY_STATUS_DONE,
  SURVEY_MAX_POSTPONED_TIMES
} from '@/constants/survey.ts'
import { logInfo } from '@/functions/logging'

function questionIsVisibleInSSP (surveyQuestion: any): boolean {
  const showInSSP = [SHOW_IN_SSP_RU, SHOW_IN_SSP_EN]
  return showInSSP.includes(surveyQuestion.doNotShowInSSP)
}

function questionHasMandatory (surveyQuestion: any): boolean {
  return surveyQuestion.mandatory === MANDATORY_02
}

function surveyStatusIsDone (surveyStatus: string): boolean {
  return surveyStatus === SURVEY_STATUS_DONE
}

function isTextQuestion (questionType: string): boolean {
  return questionType === QUESTION_TYPE_TEXT
}

function isMaxPostponedTimes (postponedTimes: string): boolean {
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

  return data
}

export {
  questionIsVisibleInSSP,
  questionHasMandatory,
  isTextQuestion,
  surveyStatusIsDone,
  isMaxPostponedTimes,
  isPostponedTillExpired,
  isPostponedTillActual,
  processSurvey
}
