import { cloneDeep, find, remove } from 'lodash'
import { eachArray, formatPhoneNumber, generateUrl, toDefaultPhoneNumber } from '../../functions/helper'
import { USER_EXISTS_WITH_SAME } from '@/constants/status_response'
import { TYPE_JSON } from '@/constants/type_request'

import isEmpty from 'lodash/isEmpty'
import { LIST_CONTACT_TYPE } from '@/constants/profile'

const CONTACTS_REQUEST = 'CONTACTS_REQUEST'
const CONTACTS_SUCCESS = 'CONTACTS_SUCCESS'
const CONTACTS_ERROR = 'CONTACTS_ERROR'
const CONTACTS_RESET = 'CONTACTS_RESET'
const CONTACTS_SEARCH = 'CONTACTS_SEARCH'
// получение контактов текущего клиента
const CONTACTS_CLIENT_SUCCESS = 'CONTACTS_CLIENT_SUCCESS'

// установка выбранного (создание/изменение) контакта
const RESET_CURRENT_CONTACTS = 'RESET_CURRENT_CONTACTS'
const SET_CURRENT_CONTACTS = 'SET_CURRENT_CONTACTS'

// удаление контакта
const UPDATE_DELETE_CONTACT_STATE = 'UPDATE_DELETE_CONTACT_STATE'
const CONTACT_DELETE_MESSAGE_TIMEOUT = 1500

// создание/изменение контакта
const UPDATE_CREATE_CONTACT_STATE = 'UPDATE_CREATE_CONTACT_STATE'
const CONTACT_CREATE_MESSAGE_TIMEOUT = 1500

// удаление контакта (учетка)
const CONTACTS_REMOVE_MODAL = 'CONTACTS_REMOVE_MODAL'
const CONTACTS_REMOVE_REQUEST = 'CONTACTS_REMOVE_REQUEST'
const CONTACTS_REMOVE_SUCCESS = 'CONTACTS_REMOVE_SUCCESS'
const CONTACTS_REMOVE_ERROR = 'CONTACTS_REMOVE_ERROR'
const CONTACTS_SET_ID = 'CONTACTS_SET_ID'
// модалка вместо хинта на мобильном разрешении
const CONTACTS_INFO_MODAL = 'CONTACTS_INFO_MODAL'

const UPDATE_CONTACT = 'UPDATE_CONTACT'

const CREATE_CONTACT = 'CREATE_CONTACT'
const CREATE_CONTACT_SUCCESS = 'CREATE_CONTACT_SUCCESS'
const CREATE_CONTACT_ERROR = 'CREATE_CONTACT_ERROR'

const EDIT_CONTACT = 'EDIT_CONTACT'
const EDIT_CONTACT_SUCCESS = 'EDIT_CONTACT_SUCCESS'
const EDIT_CONTACT_ERROR = 'EDIT_CONTACT_ERROR'

const CREATE_CONTACT_ROLE = 'CREATE_CONTACT_ROLE'
const CREATE_CONTACT_ROLE_SUCCESS = 'CREATE_CONTACT_ROLE_SUCCESS'
const CREATE_CONTACT_ROLE_ERROR = 'CREATE_CONTACT_ROLE_ERROR'

const CREATE_CONTACT_ROLE_ID = '9142343507913277484'

// Contact id's
const CONTACT_ROLE_SIGNATORY_AUTH = '9142343507913277484'

const CURRENT_CLIENT_CONTACTS = {
  emails: [],
  phones: [],
  id: '',
  name: '',
  firstName: '',
  firstNameGenitive: '',
  secondName: '',
  secondNameGenitive: '',
  lastName: '',
  lastNameGenitive: '',
  jobTitle: '',
  jobTitleGenitive: '',
  roles: [],
  registrationDocument: '',
  preferredContactMethodId: ''
}

const state = {
  contactsList: [],
  createdContact: {
    content: {
      id: '',
      name: ''
    },
    isFetching: false,
    isFetched: false,
    error: null,
    isRoleFetching: false,
    isRoleFetched: false,
    roleError: null
  },
  currentClientContacts: {
    error: null,
    content: Object.assign({}, CURRENT_CLIENT_CONTACTS),
    isFetching: false,
    isFetched: false
  },
  deleteContactState: {
    isFetching: false,
    isFetched: false,
    error: null,
    id: null
  },
  createContactState: {
    isFetching: false,
    isFetched: false,
    error: null,
    id: null,
    type: null
  },
  usersQuery: '',
  sortField: null,
  sortAsc: null,
  isFetching: false,
  isFetched: false,
  error: null,
  modalRemoveContact: {
    userId: '',
    userPostId: '',
    isOpen: false,
    error: undefined,
    message: {}
  },
  removedContactInfo: {
    isFetching: false,
    isFetched: false,
    error: null
  },
  modalContactsInfo: {
    isOpen: false,
    type: 'info',
    msg: ''
  }
}

const getContactMethods = (methods) => {
  let phones = []
  let emails = []
  if (methods) {
    methods.map((item) => {
      if (item['@type'] === 'PhoneNumber') {
        phones.push(
          {
            id: item.id,
            value: formatPhoneNumber(toDefaultPhoneNumber(item.value))
          }
        )
      }

      if (item['@type'] === 'Email') {
        emails.push({
          id: item.id,
          value: item.value
        })
      }
    })
  }

  return {
    phones,
    emails
  }
}

const removeContactKeys = (contact) => {
  const keys = [
    'contactMethods',
    'extendedMap',
    'name',
    'primaryEmailId',
    'status'
  ]

  keys.map((item) => {
    if (contact?.[item]) {
      delete contact[item]
    }
  })

  return contact
}

const getContactExtendedData = (contact) => {
  const extendedMap = contact?.extendedMap
  const extendedData = {}
  const extendedMapKeys = Object.keys(extendedMap)
  for (let i = 0; i < extendedMapKeys.length; i++) {
    let key = extendedMapKeys[i]
    if (Array.isArray(extendedMap[key].singleValue)) {
      continue
    }
    switch (extendedMap[key].attributeName) {
      case 'Second Last Name':
        extendedData.secondName = extendedMap[key].singleValue.attributeValue
        break
      case 'First Name (genitive)':
        extendedData.firstNameGenitive = extendedMap[key].singleValue.attributeValue
        break
      case 'Second Last Name (genitive)':
        extendedData.secondNameGenitive = extendedMap[key].singleValue.attributeValue
        break
      case 'Last Name (genitive)':
        extendedData.lastNameGenitive = extendedMap[key].singleValue.attributeValue
        break
      case 'Job Title (genitive)':
        extendedData.jobTitleGenitive = extendedMap[key].singleValue.attributeValue
        break
      case 'Registration Document':
        extendedData.registrationDocument = extendedMap[key].singleValue.attributeValue
        break
      case 'Contact Type':
        extendedData.contactType = cloneDeep(LIST_CONTACT_TYPE
          .find(contactType => contactType.attributeValue === extendedMap[key].singleValue.attributeValue))
        break
    }
  }
  return extendedData
}

const makeCurrentClientContacts = (data) => {
  let contact = cloneDeep(data)
  contact.roles = data?.roles?.map(roleObj => ({
    id: roleObj.role?.id,
    name: roleObj.role?.name
  })) || []
  const contactMethods = getContactMethods(data.contactMethods)
  contact.phones = contactMethods.phones
  contact.emails = contactMethods.emails
  contact.canSign = data?.roles?.filter(roleObj => roleObj.role?.id === CONTACT_ROLE_SIGNATORY_AUTH).length > 0
  // эта роль в создании/редактировании включается отдельно
  // по ТЗ должна быть исключена из списка
  // здесь убираю чтобы не отображалось в списке ролей
  remove(contact.roles, function (n) {
    return n.id === CREATE_CONTACT_ROLE_ID
  })
  contact = removeContactKeys(contact)
  contact = Object.assign(contact, getContactExtendedData(data))
  return contact
}

const getters = {
  getCurrentClientContacts (state) {
    return Object.assign({}, state?.currentClientContacts?.content)
  },
  filteredContactsByName (state, getters, rootState) {
    let contacts = cloneDeep(rootState.user.clientInfo?.contacts)
    if (!contacts.length) {
      return
    }

    contacts = contacts?.map(it => {
      return makeCurrentClientContacts(it)
    })

    return contacts
  },
  getCreatedContactState (context) {
    const { isFetching, isFetched, error } = context.createdContact
    return {
      isFetching,
      isFetched,
      error
    }
  },
  getUserById: ({ contactsList }) => (id) => {
    return contactsList.find((user) => {
      return user.id === id
    })
  },
  getResourceAccessLabels: ({ contactsList }) => (id) => {
    const tUser = contactsList.find((user) => {
      return user.userPostId === id
    })

    return Object.values(tUser.systems)
      .filter(item => item.content[0].access)
      .map(item => item.menu.label)
  }
}

const actions = {
  getRolesDictionary: async ({ commit, rootGetters, rootState }, { api }) => {
    const url = '/meta/info'
    try {
      const response = await api
        .setWithCredentials()
        .query(url)

      if (response) {
        // eslint-disable-next-line camelcase
        let filteredDict = response?.contact?.contact_roles.filter((item) => {
          if (item.status === 'Активный') {
            delete item.status
            return item
          }
        })
        // эта роль в создании/редактировании включается отдельно
        // по ТЗ должна быть исключена из списка
        // здесь убираю чтобы нельзя было выбрать в списке
        remove(filteredDict, function (n) {
          return n.id === CREATE_CONTACT_ROLE_ID
        })
        return filteredDict
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  },

  searchContactsByName: ({ getters }, query) => {
    let contacts = getters.filteredContactsByName

    if (!query) {
      return contacts
    }

    return contacts.filter(({ firstName, lastName }) => {
      return firstName?.toLowerCase().includes(query) ||
        lastName?.toLowerCase().includes(query)
    })
  },

  createContact: async ({ commit, dispatch, rootState, rootGetters }, { api, data }) => {
    commit(UPDATE_CREATE_CONTACT_STATE, {
      isFetching: true,
      isFetched: false,
      error: null
    })
    const { toms: clientId } = rootGetters['auth/user']
    const url = '/customer/account/edit-contact'

    // если не передан id - создание нового контакта
    const isCreate = !data?.id
    if (isCreate) {
      commit(CREATE_CONTACT)
    } else {
      commit(EDIT_CONTACT)
    }

    // перед отправкой удаляю пустые поля чтобы не было ошибок на беке
    Object.keys(data).map((key) => {
      if ((typeof data[key] === 'object' && isEmpty(data[key])) || !data[key]) {
        delete data[key]
      }
    })

    // если у контакта есть право подписи
    // проверить можно по одному из обязательных полей для этой роли
    let canSignRole = find(data.roles, (o) => { return o.id === CREATE_CONTACT_ROLE_ID })
    let roleCreate = []
    let roleCreateRequests = []
    let roleDeleteRequests = []
    let roleDelete = []
    let existRoles = rootGetters['user/getContactById'](data.id)?.roles || []

    // привожу номера телефонов к формату который принимает бекенд
    // toDefaultPhoneNumber
    if (data?.phones?.length) {
      for (let i = 0; i < data.phones.length; i++) {
        data.phones[i].value = toDefaultPhoneNumber(data.phones[i].value)
      }
    }

    data.clientId = clientId
    // если редактирование контакта
    if (!isCreate) {
      // роли которые надо удалить
      roleDelete = existRoles.filter((item) => {
        return !find(data?.roles, (o) => { return o.id === item.role.id })
      })
      // роли которые надо создать
      roleCreate = data?.roles?.filter((item) => {
        return !find(existRoles, (o) => { return o.role.id === item.id })
      })

      // если удаляется роль ЛПР нужно очистить связанные с ней данные
      if (find(roleDelete, (o) => { return o.role.id === CREATE_CONTACT_ROLE_ID })) {
        data.firstNameGenitive = ''
        data.secondNameGenitive = ''
        data.lastNameGenitive = ''
        data.jobTitleGenitive = ''
        data.registrationDocument = ''
      }
    } else {
      roleCreate = data.roles ? [...data.roles] : roleCreate
      if (canSignRole) {
        roleCreateRequests.push(dispatch('createContactRole', { api: api }))
      }
    }
    delete data?.roles

    try {
      const contactResponse = await api
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData(data)
        .query(url)

      if (contactResponse.id) {
        const contact = {
          id: contactResponse.id,
          name: contactResponse.name
        }
        commit(UPDATE_CREATE_CONTACT_STATE, { id: contact.id })
        commit(CREATE_CONTACT_SUCCESS, contact)

        // создание/изменение набора ролей контакта
        if (roleCreate.length) {
          for (let i = 0; i < roleCreate.length; i++) {
            roleCreateRequests.push(dispatch('createContactRole', { api: api, role: roleCreate[i] }))
          }
        }

        // удаление ролей
        if (roleDelete.length) {
          for (let i = 0; i < roleDelete.length; i++) {
            roleDeleteRequests.push(dispatch('deleteContactRole', { api: api, roleId: roleDelete[i].id }))
          }
        }

        const roleCreateResponse = await Promise.all(roleCreateRequests)
        const roleDeleteResponse = await Promise.all(roleDeleteRequests)
        // т.к. в ТЗ не описан ответ API при ошибке создания роли пока так

        const checkRoleCreateError = roleCreateResponse.filter((item) => {
          return !item.role
        })

        if (!checkRoleCreateError.length) {
          if (isCreate) {
            contactResponse.roles = roleCreateResponse
            // добавить в список контактов на клиенте, без запроса client-info
            dispatch('user/ADD_CLIENT_CONTACTS_STORE', contactResponse, { root: true }).then(() => {
              commit(UPDATE_CREATE_CONTACT_STATE, {
                id: contact.id,
                type: 'created'
              })
              setTimeout(() => {
                commit(UPDATE_CREATE_CONTACT_STATE, {
                  isFetching: false,
                  isFetched: false,
                  id: null
                })
              }, CONTACT_CREATE_MESSAGE_TIMEOUT)
              commit(RESET_CURRENT_CONTACTS)
            })
          } else {
            commit(UPDATE_CREATE_CONTACT_STATE, {
              id: contact.id,
              type: 'updated'
            })

            if (roleDeleteResponse.length) {
              existRoles = existRoles.filter((item) => {
                return !find(roleDelete, function (v) {
                  return item.id === v.id
                })
              })
              contactResponse.roles = [...existRoles]
            }

            if (roleCreateResponse.length) {
              contactResponse.roles = [...roleCreateResponse, ...existRoles]
            }
            // обновить в списке контактов на клиенте, без запроса client-info
            dispatch('user/REPLACE_CLIENT_CONTACTS_STORE', contactResponse, { root: true }).then(() => {
              setTimeout(() => {
                commit(UPDATE_CREATE_CONTACT_STATE, {
                  isFetching: false,
                  isFetched: false,
                  id: null
                })
              }, CONTACT_CREATE_MESSAGE_TIMEOUT)
            })
          }
        } else {
          commit(UPDATE_CREATE_CONTACT_STATE, {
            isFetching: false,
            isFetched: false,
            error: `Ошибка создания роли контакта. Попробуйте позже`
          })
          return false
        }
        return true
      } else {
        commit(UPDATE_CREATE_CONTACT_STATE, {
          isFetching: false,
          isFetched: false,
          error: `Ошибка создания контакта. Попробуйте позже`
        })
        return false
      }
    } catch (e) {
      commit(UPDATE_CREATE_CONTACT_STATE, {
        isFetching: false,
        isFetched: false,
        error: `Ошибка создания контакта. Попробуйте позже`
      })
    } finally {
      commit(UPDATE_CREATE_CONTACT_STATE, {
        isFetching: false,
        isFetched: true
      })
    }
  },

  deleteContact: async ({ state, commit, dispatch, rootGetters, rootState }, { api }) => {
    commit(UPDATE_DELETE_CONTACT_STATE, {
      isFetching: true,
      isFetched: false,
      error: null
    })
    const { id } = state.currentClientContacts.content
    const billingContacts = rootState.user.listBillingContacts

    const billingAccountByContact = billingContacts.filter(billingContact => billingContact.id === id)

    if (billingAccountByContact.length > 0) {
      commit(UPDATE_DELETE_CONTACT_STATE, { isFetching: false })
      return billingAccountByContact
    }

    const toms = rootGetters['auth/getTOMS']
    const contact = rootGetters['user/getContactById'](id)
    const contactRoles = contact?.roles || []
    // удаление ролей
    let roleDeleteRequests = []
    // т.к. нужен id роли контакта, а не id роли
    for (let i = 0; i < contactRoles.length; i++) {
      let item = contactRoles[i]
      // if (roles[i] && item.role.id === roles[i].id) {
      // if (roles.map(el => el.id).include(item.role.id)) {
      roleDeleteRequests.push(dispatch('deleteContactRole', { api: api, roleId: item.id }))
      // }
    }

    const roleDeleteResponse = await Promise.all(roleDeleteRequests)
    if (roleDeleteResponse.includes(false)) {
      commit(UPDATE_DELETE_CONTACT_STATE, {
        isFetching: false,
        isFetched: false,
        error: `Ошибка удаления роли контакта`,
        id: null
      })
      return false
    }
    // удаление контакта
    try {
      let url = '/customer/account/delete-contact'
      const deleteResponse = await api
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          id: id,
          clientId: toms
        })
        .query(url)

      if (deleteResponse === true) {
        commit(UPDATE_DELETE_CONTACT_STATE, { id: id })
        // удалить в списке контактов на клиенте, без запроса client-info
        setTimeout(() => {
          dispatch('user/DELETE_CLIENT_CONTACTS_STORE', id, { root: true })
          commit(UPDATE_DELETE_CONTACT_STATE, {
            isFetching: false,
            isFetched: false,
            id: null
          })
        }, CONTACT_DELETE_MESSAGE_TIMEOUT)
      } else {
        commit(UPDATE_DELETE_CONTACT_STATE, { error: 'Ошибка удаления контакта. Попробуйте позже' })
      }
    } catch (e) {
      commit(UPDATE_DELETE_CONTACT_STATE, { error: 'Ошибка удаления контакта. Попробуйте позже' })
    } finally {
      commit(UPDATE_DELETE_CONTACT_STATE, {
        isFetching: false,
        isFetched: true
      })
    }
  },

  deleteContactRole: async ({ commit, rootGetters }, { api, roleId }) => {
    const toms = rootGetters['auth/getTOMS']
    let url = '/customer/contact-role/delete'

    try {
      const result = await api
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({ id: roleId, clientId: toms })
        .query(url)

      if (result) {
        return result
      }
      commit(CREATE_CONTACT_ROLE_ERROR, `Ошибка удаления роли контакта: ${result?.message?.toString()}`)
      return false
    } catch (error) {
      commit(CREATE_CONTACT_ROLE_ERROR, 'Сервер не отвечает. Попробуйте обновить страницу.')
      return false
    }
  },

  setCurrentClientContacts: ({ commit, rootGetters }, { contactId }) => {
    const contact = rootGetters['user/getContactById'](contactId)
    const currentContact = makeCurrentClientContacts(contact)
    commit(SET_CURRENT_CONTACTS, currentContact)
  },

  resetCurrentClientContacts ({ commit }) {
    commit(RESET_CURRENT_CONTACTS)
  },

  resetCreatedContactState: ({ commit }) => {
    commit(CREATE_CONTACT_ERROR, null)
  },

  // используется в EditCompanyForm
  createSignContact: async ({ commit, dispatch, rootState, rootGetters }, { api, data }) => {
    commit(CREATE_CONTACT)

    const { toms: clientId } = rootGetters['auth/user']
    const phoneContactHours = 'C ' + data.phoneFrom + ' Пн По ' + data.phoneTo + ' Пт'
    const url = '/customer/account/edit-contact'
    try {
      const response = await api
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          clientId,
          jobTitle: data.position,
          jobTitleGenitive: data.gPosition,
          firstName: data.name,
          firstNameGenitive: data.gName,
          lastName: data.surname,
          lastNameGenitive: data.gSurname,
          secondName: data.patronymic,
          secondNameGenitive: data.gPatronymic,
          phones: [{
            value: ('+7(' + data.phone.slice(3, 6) + ')' + data.phone.slice(6)).replace(/[\D]+/g, ''),
            name: data.name
          }],
          phoneContactHours
        })
        .query(url)

      if (response.message && response.message.includes(USER_EXISTS_WITH_SAME)) {
        commit(UPDATE_CONTACT, {
          id: response.id
        })
      }

      if (response.id) {
        commit(CREATE_CONTACT_SUCCESS, {
          id: response.id,
          name: response.name
        })
        return true
      } else {
        commit(CREATE_CONTACT_ERROR, `Ошибка создания нового контакта: ${response.message.toString()}`)
        return false
      }
    } catch (error) {
      commit(CREATE_CONTACT_ERROR, 'Сервер не отвечает. Попробуйте обновить страницу.')
      return false
    }
  },
  // не ЛПР
  editContact: async ({ commit, dispatch, rootState, rootGetters }, { api, data }) => {
    commit(EDIT_CONTACT)

    const { toms: clientId } = rootGetters['auth/user']
    const { contacts } = rootState['contacts'].currentClientContacts.content
    const url = '/customer/account/edit-contact'
    try {
      const response = await api
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          clientId,
          id: contacts.id,
          firstName: data.name,
          lastName: data.surname,
          phones: contacts.phones,
          emails: contacts.emails
        })
        .query(url)

      if (!response.error) {
        commit(EDIT_CONTACT_SUCCESS, {
          id: response.id,
          name: response.name
        })
        return true
      } else {
        commit(EDIT_CONTACT_ERROR, `Ошибка редактирования контакта: ${response.message.toString()}`)
        return false
      }
    } catch (error) {
      commit(EDIT_CONTACT_ERROR, 'Сервер не отвечает. Попробуйте обновить страницу.')
      return false
    }
  },

  resetProfileContacts: ({ commit }) => {
    commit(CONTACTS_RESET)
  },

  searchProfileContacts: ({ commit }, { query }) => {
    commit(CONTACTS_SEARCH, query)
  },
  // не ЛПР редактирование своего контакта
  getCurrentClientContacts: ({ commit, rootGetters }) => {
    const contactData = rootGetters['user/getPrimaryContact'] || {}
    const parsedData = {
      role: rootGetters['auth/realmRoles'],
      emails: [],
      phones: [],
      name: contactData.name,
      id: contactData.id,
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      preferredContactMethodId: contactData.preferredContactMethodId
    }
    // eslint-disable-next-line no-unused-expressions
    contactData?.contactMethods?.forEach(contact => {
      switch (contact['@type']) {
        case 'Email':
          parsedData.emails.push({
            value: contact?.value,
            id: contact.id
          })
          break
        case 'PhoneNumber':
          parsedData.phones.push({
            value: formatPhoneNumber(toDefaultPhoneNumber(contact?.value)),
            id: contact.id
          })
          break
      }
    })
    commit(CONTACTS_CLIENT_SUCCESS, parsedData)
    return true
  },

  updateCurrentClientContacts: ({ commit }, data) => {
    commit(CONTACTS_CLIENT_SUCCESS, data)
  },

  removeProfileContact: async ({ commit, dispatch, rootState }, { api, userPostId }) => {
    commit(CONTACTS_REMOVE_REQUEST)
    try {
      const url = generateUrl('deleteUserPost')
      const { accessToken } = rootState.auth

      const { success, output } = await api
        .setWithCredentials()
        .setData({
          token: accessToken,
          post: userPostId
        })
        .query(url)

      if (success) {
        return commit(CONTACTS_REMOVE_SUCCESS)
      }

      commit(CONTACTS_REMOVE_ERROR, `Ошибка удаления контакта: ${output.message.toString()}`)
    } catch (e) {
      commit(CONTACTS_REMOVE_ERROR, 'Не удалось удалить контакт')
    }
  },

  updateUserContact: ({ commit }, data) => {
    commit(UPDATE_CONTACT, data)
  },

  setRemoveContactModalVisibility: ({ commit }, payload) => {
    commit(CONTACTS_REMOVE_MODAL, payload)
  },

  setModalInfoVisibility: ({ commit }, payload) => {
    commit(CONTACTS_INFO_MODAL, payload)
  },

  setModalUserId: ({ commit }, { userId, userPostId }) => {
    commit(CONTACTS_SET_ID, { userId, userPostId })
  },

  cleanModal: ({ commit }) => {
    commit(CONTACTS_SET_ID, { userId: '', userPostId: '' })
  },

  /**
   * Создание роли контакта
   * @param commit
   * @param dispatch
   * @param rootState
   * @param rootGetters
   * @param api
   * @param role { null | object } role по умолчанию null, если аргумент не передан будет
   * будет создана роль 'Лицо, имеющее право подписи'; object - объект описывающий роль контакта
   * @return {Promise<boolean>}
   */

  createContactRole: async ({ commit, dispatch, state, rootGetters }, { api, role = null }) => {
    commit(CREATE_CONTACT_ROLE)

    const url = '/customer/contact-role/post'
    const { id: contactId, name: contactName } = state.createdContact.content
    const { toms: clientId, name: clientName } = rootGetters['auth/user']
    const roleCreateRequire = {
      contact: {
        id: contactId,
        name: contactName
      },
      contactFor: {
        id: clientId,
        name: clientName
      },
      clientId
    }

    if (!role) {
      role = {
        id: CREATE_CONTACT_ROLE_ID,
        name: 'Лицо, имеющее право подписи'
      }
    }

    role = Object.assign({ role: role }, roleCreateRequire)

    try {
      const result = await api
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData(role)
        .query(url)

      if (result.id) {
        commit(CREATE_CONTACT_ROLE_SUCCESS)
        return result
      }
      commit(UPDATE_CREATE_CONTACT_STATE, {
        isFetching: false,
        isFetched: false,
        error: `Ошибка создания роли контакта. Попробуйте позже`
      })
      return false
    } catch (error) {
      commit(UPDATE_CREATE_CONTACT_STATE, {
        isFetching: false,
        isFetched: false,
        error: `Ошибка создания роли контакта. Попробуйте позже`
      })
      return false
    }
  }
}

const mutations = {
  [CONTACTS_REQUEST]: (state) => {
    state.isFetching = true
    state.isFetched = false
    state.error = null
  },
  [CONTACTS_SUCCESS]: (state, payload) => {
    state.isFetching = false
    state.isFetched = true
    state.contactsList = payload
  },
  [CONTACTS_ERROR]: (state, payload) => {
    state.isFetching = false
    state.isFetched = false
    state.error = payload
  },
  [CONTACTS_RESET]: (state) => {
    state.isFetching = false
    state.isFetched = false
    state.error = null
  },
  [CONTACTS_SEARCH]: (state, payload) => {
    state.usersQuery = payload
  },
  // КОНТАКТЫ ТЕКУЩЕГО КЛИЕНТА
  [CONTACTS_CLIENT_SUCCESS]: (state, payload) => {
    const { content } = state.currentClientContacts
    state.currentClientContacts.content = Object.assign(content, payload)
  },
  [CREATE_CONTACT]: (state) => {
    state.createdContact.isFetching = true
    state.createdContact.isFetched = false
    state.createdContact.error = null
  },
  [CREATE_CONTACT_SUCCESS]: (state, payload) => {
    state.createdContact.isFetching = false
    state.createdContact.isFetched = true
    state.createdContact.content = payload
  },
  [CREATE_CONTACT_ERROR]: (state, payload) => {
    state.createdContact.isFetching = false
    state.createdContact.isFetched = false
    state.createdContact.error = payload
  },
  [EDIT_CONTACT]: (state) => {
    state.currentClientContacts.isFetching = true
    state.currentClientContacts.isFetched = false
    state.currentClientContacts.error = null
  },
  [EDIT_CONTACT_SUCCESS]: (state, payload) => {
    state.currentClientContacts.isFetching = false
    state.currentClientContacts.isFetched = true
    state.currentClientContacts.content = payload
  },
  [EDIT_CONTACT_ERROR]: (state, payload) => {
    state.currentClientContacts.isFetching = false
    state.currentClientContacts.isFetched = false
    state.currentClientContacts.error = payload
  },
  [CREATE_CONTACT_ROLE]: (state) => {
    state.isRoleFetching = true
    state.isRoleFetched = false
    state.roleError = null
  },
  [CREATE_CONTACT_ROLE_SUCCESS]: (state) => {
    state.isRoleFetching = false
    state.isRoleFetched = true
  },
  [CREATE_CONTACT_ROLE_ERROR]: (state, payload) => {
    state.isRoleFetching = false
    state.isRoleFetched = false
    state.roleError = payload
  },
  [CONTACTS_SET_ID]: (state, payload) => {
  },
  [CONTACTS_INFO_MODAL]: (state, payload) => {
    state.modalContactsInfo = { ...state.modalContactsInfo, ...payload }
  },
  [CONTACTS_REMOVE_MODAL]: (state, payload) => {
    state.modalRemoveContact = { ...state.modalRemoveContact, ...payload }
  },
  [CONTACTS_REMOVE_REQUEST]: (state) => {
    state.removedContactInfo.isFetching = true
    state.removedContactInfo.isFetched = false
    state.removedContactInfo.error = undefined
  },
  [CONTACTS_REMOVE_ERROR]: (state, payload) => {
    state.removedContactInfo.isFetching = false
    state.removedContactInfo.isFetched = false
    state.removedContactInfo.error = payload
  },
  [CONTACTS_REMOVE_SUCCESS]: (state) => {
    state.removedContactInfo.isOpen = false
    state.removedContactInfo.isFetching = false
    state.removedContactInfo.isFetched = true
  },
  [UPDATE_CONTACT]: (state, payload) => {
    const updatedContacts = []
    eachArray(state.contactsList, (value) => {
      if (value.id === payload.id) {
        updatedContacts.push({
          ...value,
          ...payload
        })
      }
      updatedContacts.push(value)
    })
    state.contactsList = updatedContacts
  },
  [SET_CURRENT_CONTACTS]: (state, payload) => {
    state.currentClientContacts.content = Object.assign({}, payload)
  },
  [RESET_CURRENT_CONTACTS]: (state) => {
    state.currentClientContacts.content = Object.assign({}, CURRENT_CLIENT_CONTACTS)
  },
  [UPDATE_DELETE_CONTACT_STATE]: (state, payload) => {
    state.deleteContactState = Object.assign(state.deleteContactState, payload)
  },
  [UPDATE_CREATE_CONTACT_STATE]: (state, payload) => {
    state.createContactState = Object.assign(state.createContactState, payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
