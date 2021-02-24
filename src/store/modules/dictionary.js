import {
  LIST_CLAIM_THEME,
  LIST_COMPLAINT_THEME,
  LIST_REQUEST_THEME,
  LIST_TECHNICAL_REQUEST_THEME
} from '../actions/dictionary'

const state = {
  [LIST_REQUEST_THEME]: [
    { id: '9154749993013188883', value: 'Перенос точки/услуги', form: 'transfer_point_or_service', requestName: 'request' },
    { id: '9154749993013188882', value: 'Переоформление договора', form: 'renewal_of_the_contract', requestName: 'request' },
    { id: '9154749993013188884', value: 'Смена тарифного плана', form: 'change_of_tariff', requestName: 'request' },
    { id: '9154749993013188888', value: 'Сменить Интернет-протокол', form: 'change_of_internet_protocol', requestName: 'request' },
    { id: '9154749993013188889', value: 'Сменить реквизиты', form: 'change_of_details', requestName: 'request' },
    { id: '9154749993013188890', value: 'Восстановление договора/услуги', form: 'restoring_a_contract_or_service', requestName: 'request' },
    { id: '9154749993013188895', value: 'Приостановление договора/услуги', form: 'suspension_of_a_contract_or_service', requestName: 'request' },
    { id: '9154749993013188896', value: 'Расторжение договора/услуги', form: 'termination_of_a_contract_or_service', requestName: 'request' },
    { id: '9154749993013188872', value: 'Перевод денежных средств', form: 'money_transfer', requestName: 'request' },
    { id: '9154749993013188897', value: 'Ошибочный платеж', form: 'erroneous_payment', requestName: 'request' },
    { id: '9154749993013188885', value: 'Заказать документ', form: 'order_a_document', requestName: 'request' },
    { id: '9154749993013188903', value: 'Общие вопросы', form: 'general_issues', requestName: 'request' },
    { id: '9156211040213279417', value: 'Технические причины', form: 'technical_issues', requestName: 'problem' },
    { id: '9156160182613264494', value: 'Претензия', form: 'complaint', requestName: 'complaint' }
  ],
  [LIST_TECHNICAL_REQUEST_THEME]: [
    { id: '9154741760013186141', value: 'Услуга не работает', requestName: 'problem' },
    { id: '9154786970013205620', value: 'Сниженное качество', requestName: 'problem' },
    { id: '9154786970013205621', value: 'Консультация', requestName: 'problem' }
  ],
  [LIST_COMPLAINT_THEME]: [
    { id: '9154749993013188892', value: 'Идея', requestName: 'complaint' },
    { id: '9154749993013188891', value: 'Благодарность', requestName: 'complaint' },
    { id: '9156211043213279417', value: 'Претензия', requestName: 'complaint' }
  ],
  [LIST_CLAIM_THEME]: [
    { id: '9154741760013186163', value: 'Претензия по подключению' },
    { id: '9154785692113204789', value: 'Претензия по продукту/услуге' },
    { id: '9154785692113204790', value: 'Претензия по заявке' },
    { id: '9154785692113204791', value: 'Претензии по статистике, начислениям' },
    { id: '9154785692113204792', value: 'Претензия по обслуживанию персонального менеджера' },
    { id: '9154785692113204793', value: 'Претензия по обслуживанию техподдержки' },
    { id: '9154785692113204795', value: 'Претензия по продаже' },
    { id: '9154785692113204796', value: 'Претензия по Помощникам по офису' },
    { id: '9154785692113204797', value: 'Прочие претензии' }
  ]
}

const getters = {
  [LIST_REQUEST_THEME]: state => state[LIST_REQUEST_THEME],
  [LIST_TECHNICAL_REQUEST_THEME]: state => state[LIST_TECHNICAL_REQUEST_THEME]
}

export default {
  state,
  getters
}
