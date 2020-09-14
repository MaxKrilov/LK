import {
  generateUrl,
  eachArray,
  toFullName,
  toDefaultPhoneNumber,
  copyObject } from '../../functions/helper'
import { USER_ROLES } from '@/store/mock/profile'
import { USER_EXISTS_WITH_SAME } from '@/constants/status_response'

const ACCOUNTS_REQUEST = 'ACCOUNTS_REQUEST'
const ACCOUNTS_SUCCESS = 'ACCOUNTS_SUCCESS'
const ACCOUNTS_ERROR = 'ACCOUNTS_ERROR'
const ACCOUNTS_RESET = 'ACCOUNTS_RESET'
const ACCOUNTS_SEARCH = 'ACCOUNTS_SEARCH'
// удалние УЗ
const ACCOUNTS_REMOVE_MODAL = 'ACCOUNTS_REMOVE_MODAL'
const ACCOUNTS_REMOVE_REQUEST = 'ACCOUNTS_REMOVE_REQUEST'
const ACCOUNTS_REMOVE_SUCCESS = 'ACCOUNTS_REMOVE_SUCCESS'
const ACCOUNTS_REMOVE_ERROR = 'ACCOUNTS_REMOVE_ERROR'
const ACCOUNTS_SET_ID = 'ACCOUNTS_SET_ID'
// модалка вместо хинта на мобильном разрешении
const ACCOUNTS_INFO_MODAL = 'ACCOUNTS_INFO_MODAL'

const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT'

const CREATE_USER_LPR_REQUEST = 'CREATE_USER_LPR_REQUEST'
const CREATE_USER_LPR_SUCCESS = 'CREATE_USER_LPR_SUCCESS'
const CREATE_USER_LPR_ERROR = 'CREATE_USER_LPR_ERROR'

const sortByPriorityId = (arr, id) => {
  const oldIndex = arr.findIndex(o => o.id === id)
  arr.splice(0, 0, arr.splice(oldIndex, 1)[0])

  return arr
}

const generateFormattedList = (obj, bSystems) => {
  const getAccessRight = () => {
    return [
      {
        id: 1,
        label: 'Есть доступ',
        access: true
      }
    ]
  }
  return Object.values(obj.reduce((prev, curr) => {
    const baseSystems = copyObject(bSystems)
    const fData = {
      ...curr,
      phone: toDefaultPhoneNumber(curr?.phone),
      ...toFullName(curr?.firstName),
      systems: prev[curr?.userPostId]?.systems || { ...baseSystems },
      role: {
        id: curr?.roleId,
        code: curr?.roleName,
        value: USER_ROLES[curr?.roleName]?.label
      }
    }
    if (curr?.systemName && fData.systems[curr?.systemName]) {
      fData.systems[curr?.systemName].content = getAccessRight()
    }
    return { ...prev, [curr.userPostId]: { ...fData } }
  }, {}))
}

const state = {
  usersInfo: [],
  createdUserLprInfo: {
    content: {},
    isFetching: false,
    isFetched: false,
    error: null
  },
  usersQuery: '',
  sortField: null,
  sortAsc: null,
  isFetching: false,
  isFetched: false,
  error: null,
  modalRemoveAccount: {
    userId: '',
    userPostId: '',
    isOpen: false,
    error: undefined,
    message: {}
  },
  removedAccountInfo: {
    isFetching: false,
    isFetched: false,
    error: null
  },
  modalAccountsInfo: {
    isOpen: false,
    type: 'info',
    msg: ''
  }
}

const getters = {
  filteredAccountsByName ({ usersInfo, usersQuery }) {
    if (!usersQuery.length) {
      return usersInfo
    }
    return usersInfo.filter(({ firstName, lastName }) => {
      return firstName?.toLowerCase().includes(usersQuery) ||
        lastName?.toLowerCase().includes(usersQuery)
    })
  },
  getUserById: ({ usersInfo }) => (id) => {
    return usersInfo.find((user) => {
      return user.id === id
    })
  },
  isDeletableUser: (state, getters, rootState, rootGetters) => (id) => {
    return rootGetters['auth/user']?.userId !== id
  },
  getUserByPostId: ({ usersInfo }) => (postId) => usersInfo.find(
    ({ userPostId }) => userPostId === postId
  ),
  getResourceAccessLabels: ({ usersInfo }, getters) => (id) => {
    const tUser = getters.getUserByPostId(id)

    return Object.values(tUser.systems)
      .filter(item => item.content[0].access)
      .map(item => item.menu.label)
  }
}

const actions = {
  getProfileAccounts: async ({ commit, dispatch, rootState, rootGetters }, { api }) => {
    commit(ACCOUNTS_REQUEST)
    try {
      await dispatch('auth/checkAuth', { api }, { root: true })
      const { accessToken: token } = rootState.auth

      if (!token) {
        throw new Error('Токен невалидный')
      }
      const toms = rootGetters['auth/getTOMS']
      const { userId } = rootGetters['auth/user']

      const url = !rootState.auth.isManager
        ? generateUrl('getListlk')
        : '/user/list'
      if (!toms) {
        return commit(ACCOUNTS_ERROR, 'Нет toms')
      }
      const result = await api
        .setWithCredentials()
        .setData({
          toms,
          token
        })
        .query(url)

      if (result.success || rootState.auth.isManager) {
        const baseSystems = rootGetters['directories/systemsDirectory']
        const usersInfo = generateFormattedList(
          result?.output?.results['users-info'] || result,
          baseSystems
        )
        return commit(ACCOUNTS_SUCCESS, sortByPriorityId(usersInfo, userId))
      }

      commit(ACCOUNTS_ERROR, result.message)
    } catch (e) {
      commit(ACCOUNTS_ERROR, 'Не удалось получить список УЗ')
    }
  },
  createUserLpr: async (
    { commit, dispatch, rootState },
    { api, email, name, phone }) => {
    commit(CREATE_USER_LPR_REQUEST)
    try {
      await dispatch('auth/checkAuth', { api }, { root: true })
      const { accessToken } = rootState.auth
      const url = generateUrl('createUserLpr')
      const { success, message, output } = await api
        .setWithCredentials()
        .setData({
          token: accessToken,
          email,
          fio: name,
          phone
        })
        .query(url)
      const { results } = output

      if (success) {
        return commit(CREATE_USER_LPR_SUCCESS, {
          userId: results.user_id
        })
      }

      if (output.message.includes(USER_EXISTS_WITH_SAME)) {
        return commit(CREATE_USER_LPR_SUCCESS, {
          userId: results.info.userId
        })
      }

      commit(CREATE_USER_LPR_ERROR, `Ошибка создания ЛПР пользователя: ${message.toString()}`)
    } catch (error) {
      commit(CREATE_USER_LPR_ERROR, 'Сервер не отвечает. Попробуйте обновить страницу.')
    }
  },
  resetProfileAccounts: ({ commit }) => {
    commit(ACCOUNTS_RESET)
  },
  searchProfileAccounts: ({ commit }, { query }) => {
    commit(ACCOUNTS_SEARCH, query)
  },
  removeProfileAccount: async ({ commit, dispatch, rootState }, { api, userPostId }) => {
    commit(ACCOUNTS_REMOVE_REQUEST)
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
        return commit(ACCOUNTS_REMOVE_SUCCESS)
      }

      commit(ACCOUNTS_REMOVE_ERROR, `Ошибка удаления учетной записи: ${output.message.toString()}`)
    } catch (e) {
      console.warn(e)
      commit(ACCOUNTS_REMOVE_ERROR, 'Не удалось удалить пользователя')
    }
  },
  updateUserAccount: ({ commit }, data) => {
    commit(UPDATE_ACCOUNT, data)
  },
  setRemoveAccountModalVisibility: ({ commit }, payload) => {
    commit(ACCOUNTS_REMOVE_MODAL, payload)
  },
  setModalInfoVisibility: ({ commit }, payload) => {
    commit(ACCOUNTS_INFO_MODAL, payload)
  },
  setModalUserId: ({ commit }, { userId, userPostId }) => {
    commit(ACCOUNTS_SET_ID, { userId, userPostId })
  },
  cleanModal: ({ commit }) => {
    commit(ACCOUNTS_SET_ID, { userId: '', userPostId: '' })
  }
}

const mutations = {
  [ACCOUNTS_REQUEST]: (state) => {
    state.isFetching = true
    state.isFetched = false
    state.error = null
  },
  [ACCOUNTS_SUCCESS]: (state, payload) => {
    state.isFetching = false
    state.isFetched = true
    state.usersInfo = payload
  },
  [ACCOUNTS_ERROR]: (state, payload) => {
    state.isFetching = false
    state.isFetched = false
    state.error = payload
  },
  [ACCOUNTS_RESET]: (state) => {
    state.isFetching = false
    state.isFetched = false
    state.error = null
  },
  [ACCOUNTS_SEARCH]: (state, payload) => {
    state.usersQuery = payload
  },
  [CREATE_USER_LPR_REQUEST]: (state) => {
    state.createdUserLprInfo.isFetching = true
    state.createdUserLprInfo.isFetched = false
    state.createdUserLprInfo.error = null
  },
  [CREATE_USER_LPR_SUCCESS]: (state, payload) => {
    state.createdUserLprInfo.isFetching = false
    state.createdUserLprInfo.isFetched = true
    state.createdUserLprInfo.content = payload
  },
  [CREATE_USER_LPR_ERROR]: (state, payload) => {
    state.createdUserLprInfo.isFetching = false
    state.createdUserLprInfo.isFetched = false
    state.createdUserLprInfo.error = payload
  },
  [ACCOUNTS_SET_ID]: (state, payload) => {
  },
  [ACCOUNTS_INFO_MODAL]: (state, payload) => {
    state.modalAccountsInfo = { ...state.modalAccountsInfo, ...payload }
  },
  [ACCOUNTS_REMOVE_MODAL]: (state, payload) => {
    state.modalRemoveAccount = { ...state.modalRemoveAccount, ...payload }
  },
  [ACCOUNTS_REMOVE_REQUEST]: (state) => {
    state.removedAccountInfo.isFetching = true
    state.removedAccountInfo.isFetched = false
    state.removedAccountInfo.error = undefined
  },
  [ACCOUNTS_REMOVE_ERROR]: (state, payload) => {
    state.removedAccountInfo.isFetching = false
    state.removedAccountInfo.isFetched = false
    state.removedAccountInfo.error = payload
  },
  [ACCOUNTS_REMOVE_SUCCESS]: (state) => {
    state.removedAccountInfo.isOpen = false
    state.removedAccountInfo.isFetching = false
    state.removedAccountInfo.isFetched = true
  },
  [UPDATE_ACCOUNT]: (state, payload) => {
    const updatedAccounts = []
    eachArray(state.userInfo, (value) => {
      if (value.id === payload.userId) {
        updatedAccounts.push({
          ...value,
          ...payload
        })
      }
      updatedAccounts.push(value)
    })
    state.userInfo = updatedAccounts
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
