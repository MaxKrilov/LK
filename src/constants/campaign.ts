// "Опрос удовлетворённости"
const T_SURVEY = {
  description: 'Анкета',
  label: 'Анкета',
  iconName: 'question'
}

// "Оценка решения вопроса"
// В ТЗ анкеты с текстом "Работы по вашему обращению ..."
const T_SURVEY_TICKET = {
  msg: 'ticket',
  ...T_SURVEY
}

// "Приёмка"
// В ТЗ анкеты с текстом "Подключение от ..."
const T_SURVEY_RECEPTION = {
  msg: 'connect',
  ...T_SURVEY
}

const T_CAMPAIGN_MESSAGE = {
  description: 'Текст кампейна',
  label: 'Уведомление',
  iconName: 'warning'
}

const T_BANNER = {
  description: 'Баннер',
  label: 'Баннер',
  iconName: 'gift'
}

const T_PPR = {
  description: 'ППР',
  label: 'Проф.работы',
  iconName: 'warning'
}

const T_CAMPAIGN_CUSTOM_MESSAGE = {
  description: 'Уведомление о смене платежных реквизитов',
  label: 'Уведомление о смене платежных реквизитов на договоре №',
  iconName: 'warning'
}

const T_PPR_CODE = '8'
const T_CAMPAIGN_CUSTOM_MESSAGE_TYPE = '15'

const TYPES = {
  '1': T_SURVEY_TICKET,
  '2': T_SURVEY_TICKET,
  '3': T_SURVEY,
  '4': T_SURVEY_RECEPTION,
  '5': T_SURVEY_RECEPTION,
  '6': T_SURVEY_RECEPTION,
  '7': T_CAMPAIGN_MESSAGE,
  [T_PPR_CODE]: T_PPR,
  '11': T_SURVEY_RECEPTION,
  [T_CAMPAIGN_CUSTOM_MESSAGE_TYPE]: T_CAMPAIGN_CUSTOM_MESSAGE
}

const RESPONSE_ACCEPT = 'accept'
const RESPONSE_ANSWER = 'answer'
const RESPONSE_REFUSE = 'refuse'
const RESPONSE_PUTOFF = 'putOff'
const RESPONSE_CLICK_FOR_VIEW = 'clickForView'
const RESPONSE_CLICK_TO_CLOSE_VIEW = 'clickToCloseView'

export {
  TYPES,
  T_SURVEY,
  T_SURVEY_TICKET,
  T_SURVEY_RECEPTION,
  T_PPR,
  T_CAMPAIGN_MESSAGE,
  T_CAMPAIGN_CUSTOM_MESSAGE,
  T_CAMPAIGN_CUSTOM_MESSAGE_TYPE,
  T_BANNER,
  T_PPR_CODE,
  RESPONSE_ACCEPT,
  RESPONSE_ANSWER,
  RESPONSE_REFUSE,
  RESPONSE_PUTOFF,
  RESPONSE_CLICK_FOR_VIEW,
  RESPONSE_CLICK_TO_CLOSE_VIEW
}
