export const DEFAULT_REQUESTS_PER_PAGE = 10

export const SORT_FIELDS = {
  ASSIGNED_TO_GROUP: 'assigned_to_group',
  TICKET_NAME: 'ticket_name',
  CREATED_WHEN: 'created_when',
  CATEGORY: 'category',
  ASSIGNED_TO_USER: 'assigned_to_user',
  STATUS: 'status'
}

export const REQUEST_STATUS = {
  IN_WORK: 'В работе',
  NOT_WORKING: 'Не работает'
}

export const PROBLEM_REQUEST_TYPE = {
  COMPLIANT: 'complaint', // Претензия
  MASSIVE: 'massive',
  PROBLEM: 'problem', // Инцидент
  REQUEST: 'request', // Запрос на обслуживание
  ALL: 'all'
}
