import {
  TYPES,
  T_SURVEY,
  T_SURVEY_TICKET,
  T_SURVEY_RECEPTION,
  T_CAMPAIGN_MESSAGE,
  T_PPR,
  T_PPR_CODE
} from '@/constants/campaign.ts'
import { strToTimestampInMs } from '@/functions/date'

function getNotificationType (communicationType) {
  return TYPES[communicationType]
}

function getNotificationIconName (communicationType) {
  const iconName = getNotificationType(communicationType).iconName
  return iconName
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

function isExpiredNotification (notification) {
  return notification.communication_end_dttm.getTime() <= (new Date()).getTime()
}

function campaignShitToNotification (campaign) {
  const notificationType = getNotificationType(campaign.data.communication_type)

  // local function
  const dateConvert = str => {
    const date = new Date(strToTimestampInMs(str))
    return date
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
  campaignShitToNotification,
  pprToNotification,
  isExpiredNotification,
  isPPR
}
