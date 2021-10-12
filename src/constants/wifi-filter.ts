export const PRODUCT_TYPE = 'Wi-Fi'
export const PRODUCT_CODE = 'WIFIKONTFIL'
// export const PRODUCT_CODE = 'CONTENTFIL'
export const PRODUCT_SUB_TYPE = 'Wi-Fi Hot Spot Mono'
export const FILTER_ALLOW_TYPE = 4
export const FILTER_BLOCK_TYPE = 3

export const FILTER_TYPES: Record<number, string> = {
  [FILTER_ALLOW_TYPE]: 'Разрешить доступ',
  [FILTER_BLOCK_TYPE]: 'Запретить доступ'
}

// API контент-фильтрации
export const ACTIONS = {
  /* Функция создания пользовательской подписки
     параметры:
       client_id,
       city_id,
       subscription_name,
       description,
       subscription_type_id,
       public_subscriptions,
       url,
       vlans
   */
  ADD_SUBSCRIPTION: 'add_subscription',
  /* Добавление/закрытие фильтра на влане
     Параметры:
      city_id,
      vlan,
      subscription_id,
      active_from = current_date,
      active_to = 01.01.3000
   */
  ADD_SUBSCRIPTION_TO_VLAN: 'add_subscription_to_vlan',
  /* Функция добавления URL'а в "черный" или "белый" листы подписки
     параметры:
      subscription_id,
      url
   */
  ADD_URL_IN_SUBSCRIPTION: 'add_url_in_subscription',
  /* Функция закрытия фильтра на клиенте
    параметры:
      client_id,
      city_id,
      subscription_id,
      for_day = current_date
  */
  CLOSE_SUBSCRIPTION_ON_CLIENT: 'close_subscription_on_client',
  /* Функция удаления URL'a из "черного" или "белого" списков
    параметры: url_id
   */
  DEL_URL_IN_SUBSCRIPTION: 'del_url_in_subscription',
  /* Функция редактирования пользовательской подписки
    параметры:
      client_id,
      city_id,
      subscription_id,
      subscription_name,
      description,
      public_subscriptions
   */
  EDIT_SUBSCRIPTION: 'edit_subscription',
  /* Функция редактирования URL'а в "черном" или "белом" списках
    Параметры:
      url_id,
      url
   */
  EDIT_URL_IN_SUBSCRIPTION: 'edit_url_in_subscription',
  /* Функция возвращает пользовательские подписки, в которых указанный URL находится в списках
    Параметры: url
  */
  FIND_URL_IN_SUBSCRIPTION: 'find_url_in_subscription',
  /* Функция получения списка подписок, которые можно активировать в ЛК
    без параметров
  */
  GET_ADDIT_PUBLIC_SUBSCRIPTIONS: 'get_addit_public_subscriptions',
  /* Получение списка подписок, которые можно активировать в ЛК (Без параметров) */
  GET_AVAILABLE_SUBSCRIPTIONS: 'get_available_subscriptions',
  /* Функция получения списка фильтров на клиенте
    Параметры:
      client_id,
      city_id
  */
  GET_CLIENT_SUBSCRIPTIONS: 'get_client_subscriptions',
  /* Функция получения списка фильтров, возможных для активации на влане
    (определяется списком пользовательских фильтров, доступных на клиенте)
    Параметры: city_id, vlan */
  GET_CLIENT_SUBSCRS_BY_VLAN: 'get_client_subscrs_by_vlan',
  /* Функция получения данных о фильтре(без списка url)
    Параметры: subscription_id */
  GET_SUBSCR_URL_LIST: 'get_subscr_url_list',
  /* Получение данных о фильтре
     параметры: subscription_id
  */
  GET_SUBSCRIPTION_INFO: 'get_subscription_info'
}
