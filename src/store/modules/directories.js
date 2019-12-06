import { generateUrl } from '../../functions/helper'
import { USER_ROLES } from '@/store/mock/profile'

const DIRECTORY_REQUEST = 'DIRECTORY_REQUEST'
const DIRECTORY_SUCCESS = 'DIRECTORY_SUCCESS'
const DIRECTORY_ERROR = 'DIRECTORY_ERROR'

const SYSTEM_DIRECTORY_REQUEST = 'SYSTEM_DIRECTORY_REQUEST'
const SYSTEM_DIRECTORY_SUCCESS = 'SYSTEM_DIRECTORY_SUCCESS'
const SYSTEM_DIRECTORY_ERROR = 'SYSTEM_DIRECTORY_ERROR'

const ROLES_DIRECTORY_REQUEST = 'ROLES_DIRECTORY_REQUEST'
const ROLES_DIRECTORY_SUCCESS = 'ROLES_DIRECTORY_SUCCESS'
const ROLES_DIRECTORY_ERROR = 'ROLES_DIRECTORY_ERROR'

const INITIAL_STATE = {
  content: {},
  isFetching: false,
  isFetched: false,
  error: false,
  receivedSystemsDirectory: {
    content: {},
    isFetching: false,
    isFetched: false,
    error: false
  },
  receivedRolesDirectory: {
    content: {},
    isFetching: false,
    isFetched: false,
    error: false
  }
}

const state = INITIAL_STATE

const getters = {
  systemsDirectory ({ receivedSystemsDirectory }) {
    const { systems = [] } = receivedSystemsDirectory?.content

    return systems.reduce((prev, curr) => {
      // Remove the condition if you want map all systems
      if (curr.name === 'lkb2b' || curr.name === 'dmp-kc') {
        return {
          ...prev,
          [curr?.name]: {
            id: curr?.id,
            code: curr?.name,
            menu: {
              label: curr?.label,
              icon: 'profile',
              selected: false
            },
            accessRights: [
              {
                id: 1,
                label: 'Есть доступ',
                access: true
              },
              {
                id: 2,
                label: 'Без доступа',
                access: false
              }
            ],
            content: [
              {
                id: 2,
                label: 'Без доступа',
                access: false
              }
            ]
          }
        }
      }
      return { ...prev }
    }, {})
  },
  rolesDirectory ({ receivedRolesDirectory }) {
    const { roles = [] } = receivedRolesDirectory?.content
    return roles.map(item => ({ id: item.id, code: item.name, value: USER_ROLES[item.name].label }))
  }
}

const actions = {
  fetchSystemsDirectory: async ({ commit, dispatch, rootState }, { api }) => {
    commit(SYSTEM_DIRECTORY_REQUEST)
    try {
      await dispatch('auth/checkAuth', { api }, { root: true })
      const { accessToken } = rootState.auth

      const url = generateUrl('getSystems')
      const { success, message, output } = await api
        .setWithCredentials()
        .setData({
          token: accessToken
        })
        .query(url)
      const { results } = output

      if (success) {
        return commit(SYSTEM_DIRECTORY_SUCCESS, {
          ...results
        })
      }

      commit(SYSTEM_DIRECTORY_ERROR, `Ошибка получение справочника систем: ${message.toString()}`)
    } catch (error) {
      commit(SYSTEM_DIRECTORY_ERROR, 'Сервер не отвечает. Попробуйте обновить страницу.')
    }
  },
  fetchRolesDirectory: async ({ commit, dispatch, rootState }, { api }) => {
    commit(ROLES_DIRECTORY_REQUEST)
    try {
      await dispatch('auth/checkAuth', { api }, { root: true })
      const { accessToken } = rootState.auth

      const url = generateUrl('getRoles')
      const { success, message, output } = await api
        .setWithCredentials()
        .setData({
          token: accessToken
        })
        .query(url)

      const { results } = output

      if (success && results) {
        return commit(ROLES_DIRECTORY_SUCCESS, results)
      }

      commit(ROLES_DIRECTORY_ERROR, `Ошибка получение cправочника доступов в системы: ${message.toString()}`)
    } catch (error) {
      commit(ROLES_DIRECTORY_ERROR, 'Сервер не отвечает. Попробуйте обновить страницу.')
    }
  }
}

const mutations = {
  [DIRECTORY_REQUEST]: (state) => {
    state.isFetching = true
    state.isFetched = false
    state.error = null
  },
  [DIRECTORY_SUCCESS]: (state, payload) => {
    state.isFetching = false
    state.isFetched = true
    state.content = payload
  },
  [DIRECTORY_ERROR]: (state, payload) => {
    state.isFetching = false
    state.isFetched = false
    state.error = payload
  },
  [SYSTEM_DIRECTORY_REQUEST]: (state) => {
    state.receivedSystemsDirectory.isFetching = true
    state.receivedSystemsDirectory.isFetched = false
    state.receivedSystemsDirectory.error = null
  },
  [SYSTEM_DIRECTORY_SUCCESS]: (state, payload) => {
    state.receivedSystemsDirectory.isFetching = false
    state.receivedSystemsDirectory.isFetched = true
    state.receivedSystemsDirectory.content = payload
  },
  [SYSTEM_DIRECTORY_ERROR]: (state, payload) => {
    state.receivedSystemsDirectory.isFetching = false
    state.receivedSystemsDirectory.isFetched = false
    state.receivedSystemsDirectory.error = payload
  },
  [ROLES_DIRECTORY_REQUEST]: (state) => {
    state.receivedRolesDirectory.isFetching = true
    state.receivedRolesDirectory.isFetched = false
    state.receivedRolesDirectory.error = null
  },
  [ROLES_DIRECTORY_SUCCESS]: (state, payload) => {
    state.receivedRolesDirectory.isFetching = false
    state.receivedRolesDirectory.isFetched = true
    state.receivedRolesDirectory.content = payload
  },
  [ROLES_DIRECTORY_ERROR]: (state, payload) => {
    state.receivedRolesDirectory.isFetching = false
    state.receivedRolesDirectory.isFetched = false
    state.receivedRolesDirectory.error = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
