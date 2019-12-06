import { LIST_REQUEST_THEME } from '../actions/dictionary'

const state = {
  [LIST_REQUEST_THEME]: [
    { id: 'general_issue', param: 5986, value: 'Общие вопросы' },
    { id: 'technical_issue', param: 5986, value: 'Технические вопросы' },
    { id: 'order_documents', param: 5986, value: 'Заказать документ' },
    { id: 'change_tarif', param: 5986, value: 'Смена тарифного плана' },
    { id: 'restoration_contract', param: 5999, value: 'Восстановление договора' },
    { id: 'restoration_service', param: 5999, value: 'Восстановление услуги' },
    { id: 'point_transfer', param: 6000, value: 'Перенос точки' },
    { id: 'money_transfer', param: 6002, value: 'Перевод денежных средств' },
    { id: 'payment_error', param: 6002, value: 'Ошибочный платёж' },
    { id: 'renewal_contract', param: 5997, value: 'Переоформление договора' },
    { id: 'change_internet_protocol', param: 6009, value: 'Смена Интернет протокола' }
  ]
}

const getters = {
  [LIST_REQUEST_THEME]: state => state[LIST_REQUEST_THEME]
}

export default {
  state,
  getters
}
