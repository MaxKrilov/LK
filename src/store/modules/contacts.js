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

// Contact id's
// Account id's
const MIDDLE_NAME = '9134317459913190730'
const CONTACT_ROLE_SIGNATORY_AUTH = '9142343507913277484'

const CREATE_CONTACT_ROLE = 'CREATE_CONTACT_ROLE'
const CREATE_CONTACT_ROLE_SUCCESS = 'CREATE_CONTACT_ROLE_SUCCESS'
const CREATE_CONTACT_ROLE_ERROR = 'CREATE_CONTACT_ROLE_ERROR'

const CREATE_CONTACT_ROLE_ID = '9142343507913277484'

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
    content: {
      emails: [],
      phones: [],
      id: '',
      name: '',
      role: '',
      preferredContactMethodId: ''
    },
    isFetching: false,
    isFetched: false
  },
  isRoleFetching: false,
  isRoleFetched: false,
  roleError: null,
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

const getters = {
  getCurrentClientContacts (state) {
    return Object.assign({}, state?.currentClientContacts?.content)
  },
  filteredContactsByName ({ usersQuery }, getters, rootState) {
    // TODO ВЫНЕСТИ В ХЕЛПЕРЫ
    const checkPreferenceContact = (contactObject, value) => {
      if (contactObject.hasOwnProperty('preferredContactMethodId')) {
        return contactObject.preferredContactMethodId === value
      } else {
        return false
      }
    }
    const contacts = rootState.user.clientInfo?.contacts?.map(it => {
      return {
        contactId: it.id,
        firstName: it.firstName || '',
        lastName: it.lastName || '',
        name: it.name,
        middleName: it.extendedMap?.[MIDDLE_NAME]?.singleValue?.attributeValue || '',
        roles: it.roles?.map(roleObj => ({
          id: roleObj.role?.id,
          name: roleObj.role?.name
        })) || [],
        canSign: it.roles?.filter(roleObj => roleObj.role?.id === CONTACT_ROLE_SIGNATORY_AUTH).length > 0,
        phones: it.contactMethods
          .filter(item => item['@type']
            .match(/PhoneNumber/ig))
          .map(field => ({
            value: field.value,
            isPrefer: checkPreferenceContact(it, field.id)
          })) || [],
        emails: it.contactMethods
          .filter(item => item['@type']
            .match(/Email/ig))
          .map(field => ({
            value: field.value,
            isPrefer: checkPreferenceContact(it, field.id)
          })) || []
      }
    })

    if (!usersQuery.length) {
      return contacts
    }
    return contacts.filter(({ firstName, lastName }) => {
      return firstName?.toLowerCase().includes(usersQuery) ||
        lastName?.toLowerCase().includes(usersQuery)
    })
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

  setRemoveContactModalVisibility: ({ commit }, payload) => {
    commit(CONTACTS_REMOVE_MODAL, payload)
  },

  setModalInfoVisibility: ({ commit }, payload) => {
    commit(CONTACTS_INFO_MODAL, payload)
  },

  setModalUserId: ({ commit }, { userId, userPostId }) => {
    commit(CONTACTS_SET_ID, { userId, userPostId })
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

  createContactRole: async ({ commit, dispatch, rootState, rootGetters }, { api }) => {
    commit(CREATE_CONTACT_ROLE)

    const url = '/customer/contact-role/post'
    const contact = rootState['contacts'].createdContact.content
    const user = rootState['user'].clientInfo
    const { toms: clientId } = rootGetters['auth/user']
    try {
      const result = await api
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          contact: {
            id: contact.id,
            name: contact.name
          },
          role: {
            id: CREATE_CONTACT_ROLE_ID,
            name: 'Лицо, имеющее право подписи'
          },
          contactFor: {
            id: user.id,
            name: user.name
          },
          clientId
        })
        .query(url)

      if (result.id) {
        commit(CREATE_CONTACT_ROLE_SUCCESS)
        return true
      }
      commit(CREATE_CONTACT_ROLE_ERROR, `Ошибка создания роли контакта: ${output.message.toString()}`)
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
