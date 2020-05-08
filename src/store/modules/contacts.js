import { cloneDeep, find } from 'lodash'
import {
  generateUrl,
  eachArray,
  toDefaultPhoneNumber,
  formatPhoneNumber
} from '../../functions/helper'
import { USER_EXISTS_WITH_SAME } from '@/constants/status_response'
import { TYPE_JSON } from '@/constants/type_request'

const CONTACTS_REQUEST = 'CONTACTS_REQUEST'
const CONTACTS_SUCCESS = 'CONTACTS_SUCCESS'
const CONTACTS_ERROR = 'CONTACTS_ERROR'
const CONTACTS_RESET = 'CONTACTS_RESET'
const CONTACTS_SEARCH = 'CONTACTS_SEARCH'
// получение контактов текущего клиента
const CONTACTS_CLIENT_SUCCESS = 'CONTACTS_CLIENT_SUCCESS'
// удалние контакта
const RESET_CURRENT_CONTACTS = 'RESET_CURRENT_CONTACTS'
const SET_CURRENT_CONTACTS = 'SET_CURRENT_CONTACTS'
// удаление контакта
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
const MIDDLE_NAME = '9134317459913190730'
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
    content: {},
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
        phones.push(item)
      }

      if (item['@type'] === 'Email') {
        emails.push(item)
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
    'primaryEmailId'
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
    }
  }
  return extendedData
}

const makeCurrentClientContacts = (data) => {
  let contact = cloneDeep(data)
  contact.secondName = data.extendedMap?.[MIDDLE_NAME]?.singleValue?.attributeValue
  contact.roles = data.roles?.map(roleObj => ({
    id: roleObj.role?.id,
    name: roleObj.role?.name
  })) || []
  // contact.roles = data.roles?.map(roleObj => (roleObj.role?.name)) || []
  const contactMethods = getContactMethods(data.contactMethods)
  contact.phones = contactMethods.phones
  contact.emails = contactMethods.emails
  contact.canSign = data.roles?.filter(roleObj => roleObj.role?.id === CONTACT_ROLE_SIGNATORY_AUTH).length > 0
  contact = removeContactKeys(contact)
  contact = Object.assign(contact, getContactExtendedData(data))
  return contact
}

const getters = {
  getCurrentClientContacts (state) {
    return Object.assign({}, state?.currentClientContacts?.content)
  },
  filteredContactsByName ({ usersQuery }, getters, rootState) {
    // TODO ВЫНЕСТИ В ХЕЛПЕРЫ
    // const checkPreferenceContact = (contactObject, value) => {
    //   if (contactObject.hasOwnProperty('preferredContactMethodId')) {
    //     return contactObject.preferredContactMethodId === value
    //   } else {
    //     return false
    //   }
    // }

    let contacts = cloneDeep(rootState.user.clientInfo?.contacts)
    if (!contacts.length) {
      return
    }

    contacts = contacts?.map(it => {
      return makeCurrentClientContacts(it)
    })

    if (!usersQuery.length) {
      return contacts
    }
    return contacts.filter(({ firstName, lastName }) => {
      return firstName?.toLowerCase().includes(usersQuery) ||
        lastName?.toLowerCase().includes(usersQuery)
    })
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
        return response?.contact?.contact_roles.filter((item) => {
          if (item.status === 'Активный') {
            delete item.status
            return item
          }
        })
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  },

  createContact: async ({ commit, dispatch, rootState, rootGetters }, { api, data }) => {
    const { toms: clientId, name: clientName } = rootGetters['auth/user']
    const url = '/customer/account/edit-contact'

    // если не передан id - создание нового контакта
    const isCreate = !data?.id
    console.log('action create? ', isCreate)

    // перед отправкой удаляю пустые поля чтобы не было ошибок на беке
    Object.keys(data).map((item) => {
      if (!data[item].length) {
        delete data[item]
      }
    })
    console.log('del keys', data)
    // дальше нужно забрать что относится к созданию ролей контакта
    let roles = data?.roles || undefined
    delete data.roles
    // теперь собрать обязательные для создания контакта данные
    const contactFor = {
      id: clientId,
      name: clientName
    }
    console.log('contactFor', contactFor)

    // если у контакта есть право подписи
    // проверить можно по одному из обязательных полей для этой роли
    let canSignRole = !!data.registrationDocument
    let roleCreateRequests = []
    console.log('canSignRole? ', canSignRole)
    data.clientId = clientId
    // если редактирование контакта
    if (!isCreate) {
      const existContact = rootGetters['user/getContactById'](data.id)
      const existRoles = existContact.roles
      // if (existRoles) по идее временно, т.к. сейчас есть контакты созданные с ошибками
      if (existRoles) {
        // роли которые надо удалить
        let roleDelete = existRoles.filter((item) => {
          return !find(roles, (o) => { return o.id === item.role.id })
        })
        // роли которые надо создать
        roles = roles.filter((item) => {
          return !find(existRoles, (o) => { return o.role.id === item.id })
        })

        console.log('roleDelete', roleDelete)
        console.log('roleCreate', roles)
      }
    } else {
      if (canSignRole) {
        roleCreateRequests.push(dispatch('createContactRole', { api: api }))
      }
    }

    try {
      const contactResponse = await api
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData(data)
        .query(url)
      console.log('contactResponse', contactResponse)

      if (contactResponse.id) {
        const contact = {
          id: contactResponse.id,
          name: contactResponse.name
        }

        commit(CREATE_CONTACT_SUCCESS, contact)
        // создание/изменение ролей контакта
        if (roles) {
          for (let i = 0; i < roles.length; i++) {
            roleCreateRequests.push(dispatch('createContactRole', { api: api, role: roles[i] }))
          }
        }

        const roleResponse = await Promise.all(roleCreateRequests)
        console.log('roleResponse', roleResponse)
        // т.к. в ТЗ не описан ответ API при ошибке создания роли пока так
        const checkRoleCreateError = roleResponse.filter((item) => {
          return !item.role
        })

        if (!checkRoleCreateError.length) {
          contactResponse.roles = roleResponse
          if (isCreate) {
            commit(RESET_CURRENT_CONTACTS)
          }
          // обновить список контактов на клиенте, без запроса client-info
          commit('user/ADD_CLIENT_CONTACTS_STORE', contactResponse, { root: true })
        } else {
          commit(CREATE_CONTACT_ERROR, `Ошибка создания роли контакта: ${contactResponse?.message?.toString()}`)
          return false
        }
        return true
      } else {
        commit(CREATE_CONTACT_ERROR, `Ошибка сохранения контакта: ${contactResponse?.message?.toString()}`)
        return false
      }
    } catch (e) {
      console.log(e)
      commit(CREATE_CONTACT_ERROR, 'Сервер не отвечает. Попробуйте обновить страницу.')
    }
  },

  deleteContact: async ({ state, dispatch, rootGetters }, { api }) => {
    const toms = rootGetters['auth/getTOMS']
    const { id, roles } = state.currentClientContacts.content
    console.log('delete for', id, roles)
    // удаление ролей
    /* let roleDeleteRequests = []
    for (let i = 0; i < roles.length; i++) {
      roleDeleteRequests.push(dispatch('deleteContactRole', { api: api, roleId: roles[i].id }))
    }
    console.log(444, roleDeleteRequests)
    const roleDeleteResponse = await Promise.all(roleDeleteRequests)
    console.log(555, roleDeleteResponse) */

    // удаление контакта
    try {
      let url = '/customer/account/delete-contact'
      const result = await api
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({ id: id, clientId: toms })
        .query(url)

      console.log(777, result)
      return result
    } catch (e) {
      console.log(e)
    }
  },

  deleteContactRole: async ({ commit }, { api, roleId }) => {
    let url = `/customerManagement/contactRole/` + roleId

    try {
      const result = await api
        .setWithCredentials()
        // .setData({ id: roleId })
        .setMethod('DELETE')
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
    console.log(contact)
    const currentContact = makeCurrentClientContacts(contact)
    console.log(currentContact)
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
            value: '+7(' + data.phone.slice(3, 6) + ')' + data.phone.slice(6),
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
  // не ЛПР редактирование контактов
  getCurrentClientContacts: ({ commit, rootGetters }) => {
    const contactData = rootGetters['user/getPrimaryContact']
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
    contactData.contactMethods.forEach(contact => {
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
      await dispatch('auth/checkAuth', { api }, { root: true })
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
      console.warn(e)
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

  createContactRole: async ({ commit, dispatch, rootState, rootGetters }, { api, role = null }) => {
    commit(CREATE_CONTACT_ROLE)

    const url = '/customer/contact-role/post'
    const contact = rootState['contacts'].createdContact.content
    const { toms: clientId, name: clientName } = rootGetters['auth/user']
    const roleCreateRequire = {
      contact: {
        id: contact.id,
        name: contact.name
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

    console.log('add role', role)

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
      commit(CREATE_CONTACT_ROLE_ERROR, `Ошибка создания роли контакта: ${result?.message?.toString()}`)
      return false
    } catch (error) {
      commit(CREATE_CONTACT_ROLE_ERROR, 'Сервер не отвечает. Попробуйте обновить страницу.')
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
