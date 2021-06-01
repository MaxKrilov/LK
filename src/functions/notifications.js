import {
  T_CAMPAIGN_MESSAGE,
  T_PPR,
  T_PPR_CODE,
  T_SURVEY,
  T_SURVEY_RECEPTION,
  T_CAMPAIGN_CUSTOM_MESSAGE,
  T_CAMPAIGN_CUSTOM_MESSAGE_1,
  T_SURVEY_TICKET,
  TYPES
} from '@/constants/campaign.ts'
import moment from 'moment'
import { strToTimestampInMs } from '@/functions/date'
import { T_CAMPAIGN_CUSTOM_MESSAGE_TYPE } from '../constants/campaign'

function getNotificationType (communicationType) {
  return TYPES[communicationType]
}

function getNotificationIconName (communicationType) {
  return getNotificationType(communicationType).iconName
}

function isSurvey (communicationType) {
  return TYPES[communicationType] === T_SURVEY
}

function isSurveyTicket (communicationType) {
  const survey = getNotificationType(communicationType)
  return survey === T_SURVEY_TICKET
}

function isSurveyReception (communicationType) {
  const survey = getNotificationType(communicationType)
  return survey === T_SURVEY_RECEPTION
}

function isPPR (communicationType) {
  const type = getNotificationType(communicationType)
  return type === T_PPR
}

function isCampaignMessage (communicationType) {
  const type = getNotificationType(communicationType)
  return type === T_CAMPAIGN_MESSAGE
}

function isCampaignCustomMessage (communicationType) {
  const type = getNotificationType(communicationType)
  return [T_CAMPAIGN_CUSTOM_MESSAGE, T_CAMPAIGN_CUSTOM_MESSAGE_1].includes(type)
}

function isExpiredNotification (notification) {
  return notification.communication_end_dttm.getTime() <= (new Date()).getTime()
}

function campaignShitToNotification (campaign) {
  const notificationType = getNotificationType(campaign.data.communication_type)

  // local function
  const dateConvert = str => {
    const mdate = moment(strToTimestampInMs(str))
    mdate.utcOffset(0)
    return mdate
  }

  const { data } = campaign

  // build new shiny notification
  const newEl = {
    id: campaign.id,
    ...data,
    ...notificationType,
    text: data.COMMUNICATION_TEXT,
    description: data.description
  }

  if (campaign.data.communication_type === T_CAMPAIGN_CUSTOM_MESSAGE_TYPE) {
    const offerNumber = campaign.data?.['param_2'] || '%param_2%'
    newEl.label = `${notificationType.label}${offerNumber}`
  }

  newEl.date = dateConvert(data.communication_start_dttm)
  newEl.communication_start_dttm = dateConvert(data.communication_start_dttm)
  newEl.communication_end_dttm = dateConvert(data.communication_end_dttm)

  return newEl
}

function pprToNotification (pprObject) {
  const dateConvert = str => new Date(parseInt(str))

  const newEl = {
    ...T_PPR,
    id: pprObject.ticket_id,
    communication_type: T_PPR_CODE,
    ...pprObject,
    text: pprObject.description,
    data: pprObject
  }

  newEl.created_when = dateConvert(newEl.created_when)

  if (newEl.expected_resolution_date) {
    newEl.expected_resolution_date = dateConvert(newEl.expected_resolution_date)
  }

  return newEl
}

export {
  getNotificationType,
  getNotificationIconName,
  isSurvey,
  isSurveyTicket,
  isSurveyReception,
  isCampaignMessage,
  isCampaignCustomMessage,
  campaignShitToNotification,
  pprToNotification,
  isExpiredNotification,
  isPPR
}
