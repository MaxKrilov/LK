const CN_CHANNEL = '9163354476813337583'
const CN_CATEGORY_AGREEMENT = '9154749926213188766'

export const CN_INVOICE_FOR_PAYMENT = {
  'channel': CN_CHANNEL,
  'category': CN_CATEGORY_AGREEMENT,
  'type': '9154749993013188885',
  'classification_level_one': '9154750483513189073',
  'classification_level_two': '9154802862213212541',
  'classification_level_three': '9154802962813213377',
  'description': 'Запрос счёта на оплату в ЛК',
  'description2': ''
}

export const CN_PROMISED_PAYMENT = {
  'channel': CN_CHANNEL,
  'category': CN_CATEGORY_AGREEMENT,
  'type': '9154749993013188893',
  'classification_level_one': '9154750483513189088',
  'classification_level_two': '9154802862213212587',
  'classification_level_three': '9154802962813213482',
  'description': 'Взят обещанный платеж в ЛК',
  'description2': 'Не удалось подключить ОП'
}

export const CN_CARD_PAYMENT = {
  'channel': CN_CHANNEL,
  'category': CN_CATEGORY_AGREEMENT,
  'type': '9154749993013188879',
  'classification_level_one': '9154750483513189058',
  'classification_level_two': '9154802862213212461',
  'classification_level_three': '9154802962713213157',
  'description': 'Оплата картой в ЛК',
  'description2': 'Не удалось оплатить картой'
}

export const CN_AUTO_PAY = {
  'channel': CN_CHANNEL,
  'category': CN_CATEGORY_AGREEMENT,
  'type': '9154749993013188879',
  'classification_level_one': '9154750483513189058',
  'classification_level_two': '9154802862213212461',
  'classification_level_three': '9154802962713213155',
  'description': 'Клиент подключил автоплатеж в ЛК',
  'description2': 'Не удалось подключить Автоплатеж'
}

export const CN_REPORT_CLOSED_DOCUMENT_FOR_CURRENT = {
  'channel': CN_CHANNEL,
  'category': CN_CATEGORY_AGREEMENT,
  'type': '9154749993013188885',
  'classification_level_one': '9154750483513189073',
  'classification_level_two': '9154802862213212540',
  'classification_level_three': '9154802962813213375',
  'description': 'Получение закрывающих документов в ЛК',
  'description2': ''
}

export const CN_REPORT_CLOSED_DOCUMENT_FOR_LAST = {
  'channel': CN_CHANNEL,
  'category': CN_CATEGORY_AGREEMENT,
  'type': '9154749993013188885',
  'classification_level_one': '9154750483513189073',
  'classification_level_two': '9154802862213212539',
  'classification_level_three': '9154802962813213370',
  'description': 'Получение закрывающих документов в ЛК',
  'description2': ''
}

export const CN_REPORT_DOCUMENT = {
  'channel': CN_CHANNEL,
  'category': CN_CATEGORY_AGREEMENT,
  'type': '9154749993013188885',
  'classification_level_one': '9154750483513189073',
  'classification_level_two': '9154802862213212541',
  'classification_level_three': '9154802962813213380',
  'description': 'Получение счет фактуры/акта в ЛК',
  'description2': ''
}

export const CN_CONTRACT_DOCUMENT_CONTRACT = {
  'channel': CN_CHANNEL,
  'category': CN_CATEGORY_AGREEMENT,
  'type': '9154749993013188887',
  'classification_level_one': '9154750483513189076',
  'classification_level_two': '9154802862213212545',
  'classification_level_three': '9154802962813213388',
  'description': 'Получение договора/доп. согласшения в ЛК',
  'description2': ''
}

export const CN_CONTRACT_ACCEPTANCE_CERTIFICATE = {
  'channel': CN_CHANNEL,
  'category': CN_CATEGORY_AGREEMENT,
  'type': '9154749993013188887',
  'classification_level_one': '9154750483513189076',
  'classification_level_two': '9154802862213212545',
  'classification_level_three': '9154802962813213388',
  'description': 'Получение акта приёмки в ЛК',
  'description2': ''
}

export const CN_CONTRACT_ACY_OF_RECONCILIATION = {
  'channel': CN_CHANNEL,
  'category': CN_CATEGORY_AGREEMENT,
  'type': '9154749993013188885',
  'classification_level_one': '9154750483513189073',
  'classification_level_two': '9154802862213212538',
  'classification_level_three': '9154802962813213365',
  'description': 'Получение акта сверки в ЛК',
  'description2': ''
}

export type typeClosedNotification = 'CN_INVOICE_FOR_PAYMENT' |
  'CN_PROMISED_PAYMENT' |
  'CN_CARD_PAYMENT' |
  'CN_AUTO_PAY' |
  'CN_REPORT_CLOSED_DOCUMENT_FOR_CURRENT' |
  'CN_REPORT_CLOSED_DOCUMENT_FOR_LAST' |
  'CN_REPORT_DOCUMENT' |
  'CN_CONTRACT_DOCUMENT_CONTRACT' |
  'CN_CONTRACT_ACCEPTANCE_CERTIFICATE' |
  'CN_CONTRACT_ACY_OF_RECONCILIATION'
