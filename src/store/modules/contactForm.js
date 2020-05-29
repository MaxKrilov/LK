import { generateUrl } from '../../functions/helper'
import { USER_FOUND_BY_PHONE, USER_EXISTS_WITH_EMAIL } from '@/constants/status_response'

const CONTACT_FORM_MODAL = 'CONTACT_FORM_MODAL'
const CONTACT_FORM_REQUEST = 'CONTACT_FORM_REQUEST'
const CONTACT_FORM_SUCCESS = 'CONTACT_FORM_SUCCESS'
const CONTACT_FORM_ERROR = 'CONTACT_FORM_ERROR'
const CONTACT_FORM_RESET = 'CONTACT_FORM_RESET'

const CREATE_USER_POSITION_REQUEST = 'CREATE_USER_POSITION_REQUEST'
const CREATE_USER_POSITION_SUCCESS = 'CREATE_USER_POSITION_SUCCESS'
const CREATE_USER_POSITION_ERROR = 'CREATE_USER_POSITION_ERROR'

const CREATE_USER_ROLES_REQUEST = 'CREATE_USER_ROLES_REQUEST'
const CREATE_USER_ROLES_SUCCESS = 'CREATE_USER_ROLES_SUCCESS'
const CREATE_USER_ROLES_ERROR = 'CREATE_USER_ROLES_ERROR'

const CHANGE_POSITION_REQUEST = 'CHANGE_POSITION_REQUEST'
const CHANGE_POSITION_SUCCESS = 'CHANGE_POSITION_SUCCESS'
const CHANGE_POSITION_ERROR = 'CHANGE_POSITION_ERROR'

const REMOVE_USER_ROLES_REQUEST = 'REMOVE_USER_ROLES_REQUEST'
const REMOVE_USER_ROLES_SUCCESS = 'REMOVE_USER_ROLES_SUCCESS'
const REMOVE_USER_ROLES_ERROR = 'REMOVE_USER_ROLES_ERROR'

const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST'
const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS'
const UPDATE_USER_ERROR = 'UPDATE_USER_ERROR'

const CHANGE_ATTRIBUTES_REQUEST = 'CHANGE_ATTRIBUTES_REQUEST'
const CHANGE_ATTRIBUTES_SUCCESS = 'CHANGE_ATTRIBUTES_SUCCESS'
const CHANGE_ATTRIBUTES_ERROR = 'CHANGE_ATTRIBUTES_ERROR'

const GET_POST_REQUEST = 'GET_POST_REQUEST'
const GET_POST_SUCCESS = 'GET_POST_SUCCESS'
const GET_POST_ERROR = 'GET_POST_ERROR'

const INITIAL_STATE = {
  isFetching: false,
  isFetched: false,
  error: false,
  createdUserPositionInfo: {
    content: {},
    isFetching: false,
    isFetched: false,
    error: null
  },
  createdUserRolesInfo: {
    content: {},
    isFetching: false,
    isFetched: false,
    error: null
  },
  changedPositionInfo: {
    content: {},
    isFetching: false,
    isFetched: false,
    error: null
  },
  removedUserRolesInfo: {
    content: {},
    isFetching: false,
    isFetched: false,
    error: null
  },
  createdUserInfo: {
    content: {},
    isFetching: false,
    isFetched: false,
    error: null
  },
  updatedUserInfo: {
    content: {},
    isFetching: false,
    isFetched: false,
    error: null
  },
  changedAttributes: {
    content: {},
    isFetching: false,
    isFetched: false,
    error: null
  },
  deletedUserPostInfo: {
    content: {},
    isFetching: false,
    isFetched: false,
    error: null
  },
  deletedRolesInfo: {
    content: {},
    isFetching: false,
    isFetched: false,
    error: null
  },
  gotUserRole: {
    content: {},
    isFetching: false,
    isFetched: false,
    error: null
  },
  gotPost: {
    content: {},
    isFetching: false,
    isFetched: false,
    error: null
  },
  modal: {
    isOpen: false,
    isFetching: false,
    error: undefined,
    message: {}
  }
}

const state = INITIAL_STATE

const getters = {
}

const actions = {
  createUserPosition: async (
    { commit, dispatch, rootState, rootGetters },
    { api, userId, roleId }) => {
    commit(CREATE_USER_POSITION_REQUEST)
    try {
      await dispatch('auth/checkAuth', { api }, { root: true })
      const { accessToken } = rootState.auth
      const url = generateUrl('createUserPosition')
      const toms = rootGetters['auth/getTOMS']
      const { success, message, output } = await api
        .setWithCredentials()
        .setData({
          token: accessToken,
          user: userId,
          role: roleId,
          toms: toms
        })
        .query(url)
      const { results } = output

      if (success) {
        return commit(CREATE_USER_POSITION_SUCCESS, {
          id: results.user_post.id,
          toms: results.user_post.toms,
          dmpId: results.user_post.toms,
          userId: results.user_post.userId,
          userRole: results.user_post.userRole
        })
      }

      commit(CREATE_USER_POSITION_ERROR, `Ошибка создания должности пользователя: ${message.toString()}`)
    } catch (error) {
      commit(CREATE_USER_POSITION_ERROR, 'Сервер не отвечает. Попробуйте обновить страницу.')
    }
  },
  createUserRoles: async (
    { commit, dispatch, rootState },
    { api, userPostId, systemRoleId }) => {
    commit(CREATE_USER_ROLES_REQUEST)
    try {
      await dispatch('auth/checkAuth', { api }, { root: true })
      const { accessToken } = rootState.auth
      const url = generateUrl('createUserRoles')
      const { success, message, output } = await api
        .setWithCredentials()
        .setData({
          token: accessToken,
          post: userPostId,
          access: systemRoleId
        })
        .query(url)
      const { results } = output

      if (success) {
        return commit(CREATE_USER_ROLES_SUCCESS, {
          id: results['user-post'].id,
          toms: results['user-post'].toms,
          systemRoles: results['user-post'].systemRoles,
          dmpId: results['user-post'].dmpId,
          userId: results['user-post'].userId,
          userRole: results['user-post'].userRole
        })
      }

      commit(CREATE_USER_ROLES_ERROR, `Ошибка создания прав доступа пользователя: ${message.toString()}`)
    } catch (error) {
      commit(CREATE_USER_ROLES_ERROR, 'Сервер не отвечает. Попробуйте обновить страницу.')
    }
  },
  changePosition: async (
    { commit, dispatch, rootState },
    { api, postId, roleId }) => {
    commit(CHANGE_POSITION_REQUEST)
    try {
      await dispatch('auth/checkAuth', { api }, { root: true })
      const { accessToken } = rootState.auth
      const url = generateUrl('changePosition')
      const { success, message, output } = await api
        .setWithCredentials()
        .setData({
          token: accessToken,
          post: postId,
          role: roleId
        })
        .query(url)

      if (success) {
        return commit(CHANGE_POSITION_SUCCESS, { ...output.results })
      }

      commit(CHANGE_POSITION_ERROR, `Ошибка изменения должности пользователя: ${message.toString()}`)
    } catch (error) {
      commit(CHANGE_POSITION_ERROR, 'Сервер не отвечает. Попробуйте обновить страницу.')
    }
  },
  removeContactRoles: async (
    { commit, dispatch, rootState },
    { api, userPostId, systemRoleId }) => {
    commit(REMOVE_USER_ROLES_REQUEST)
    try {
      await dispatch('auth/checkAuth', { api }, { root: true })
      const url = generateUrl('removeContactRoles')
      const token = rootState.auth.accessToken
      const { success, message, output } = await api
        .setWithCredentials()
        .setData({
          token,
          post: userPostId,
          access: systemRoleId
        })
        .query(url)
      const { results } = output

      if (success) {
        return commit(REMOVE_USER_ROLES_SUCCESS, {
          id: results['user-post'].id,
          toms: results['user-post'].toms,
          dmpId: results['user-post'].dmpId,
          userId: results['user-post'].userId,
          userRole: results['user-post'].userRole
        })
      }

      commit(REMOVE_USER_ROLES_ERROR, `Ошибка удаления прав доступа пользователя: ${message.toString()}`)
    } catch (error) {
      commit(REMOVE_USER_ROLES_ERROR, 'Сервер не отвечает. Попробуйте обновить страницу.')
    }
  },
  updateUser: async (
    { commit, dispatch, rootState },
    { api, userId, fio, email }) => {
    commit(UPDATE_USER_REQUEST)
    try {
      await dispatch('auth/checkAuth', { api }, { root: true })
      const { accessToken } = rootState.auth
      const url = generateUrl('updateUser')
      const { success, message, output } = await api
        .setWithCredentials()
        .setData({
          token: accessToken,
          user: userId,
          fio,
          email
        })
        .query(url)

      if (success) {
        return commit(UPDATE_USER_SUCCESS, { ...output })
      }

      if (output?.errorMessage === USER_EXISTS_WITH_EMAIL) {
        return commit(UPDATE_USER_ERROR, output?.errorMessage)
      }

      commit(UPDATE_USER_ERROR, `Ошибка обновления пользователя: ${message.toString()}`)
    } catch (error) {
      console.log(error)
      commit(UPDATE_USER_ERROR, 'Сервер не отвечает. Попробуйте обновить страницу.')
    }
  },
  changeAttributes: async (
    { commit, dispatch, rootState },
    { api, userId, params }) => {
    commit(CHANGE_ATTRIBUTES_REQUEST)
    try {
      await dispatch('auth/checkAuth', { api }, { root: true })
      const { accessToken } = rootState.auth
      const url = generateUrl('changeAttributes')
      const { success, message, output } = await api
        .setWithCredentials()
        .setData({
          token: accessToken,
          user: userId,
          ...params
        })
        .query(url)

      if (success) {
        return commit(CHANGE_ATTRIBUTES_SUCCESS, {
          ...output.results
        })
      }

      if (output?.message === USER_FOUND_BY_PHONE) {
        return commit(CHANGE_ATTRIBUTES_ERROR, output?.message)
      }

      commit(CHANGE_ATTRIBUTES_ERROR, `Ошибка обновления атрибутов: ${message.toString()}`)
    } catch (error) {
      commit(CHANGE_ATTRIBUTES_ERROR, 'Сервер не отвечает. Попробуйте обновить страницу.')
    }
  },
  getPost: async (
    { commit, dispatch, rootState },
    { api, userPostId }) => {
    commit(GET_POST_REQUEST)
    try {
      await dispatch('auth/checkAuth', { api }, { root: true })
      const { accessToken } = rootState.auth
      const url = generateUrl('getPost')
      const { success, message, output } = await api
        .setWithCredentials()
        .setData({
          token: accessToken,
          post: userPostId
        })
        .query(url)

      if (success) {
        return commit(GET_POST_SUCCESS, {
          userPost: output?.results['user-post']
        })
      }

      commit(GET_POST_ERROR, `Ошибка получения должности: ${message.toString()}`)
    } catch (error) {
      commit(GET_POST_ERROR, 'Сервер не отвечает. Попробуйте обновить страницу.')
    }
  },
  resetToDefault: ({ commit }) => {
    commit(CONTACT_FORM_RESET)
  },
  setConfirmModalVisibility: ({ commit }, payload) => {
    commit(CONTACT_FORM_MODAL, payload)
  },
  sendFormData: ({ commit }) => {
    commit(CONTACT_FORM_REQUEST)
  },
  gotFormData: ({ commit }, payload) => {
    commit(CONTACT_FORM_SUCCESS, payload)
  }
}

const mutations = {
  [CONTACT_FORM_MODAL]: (state, payload) => {
    state.modal = { ...state.modal, ...payload }
  },
  [CONTACT_FORM_REQUEST]: (state) => {
    state.isFetching = true
    state.isFetched = false
    state.error = null
  },
  [CONTACT_FORM_SUCCESS]: (state, payload) => {
    state.isFetching = false
    state.isFetched = true
  },
  [CONTACT_FORM_ERROR]: (state, payload) => {
    state.isFetching = false
    state.isFetched = false
    state.error = payload
  },
  [CONTACT_FORM_RESET]: (state) => {
    state = INITIAL_STATE
  },
  [CREATE_USER_POSITION_REQUEST]: (state) => {
    state.createdUserPositionInfo.isFetching = true
    state.createdUserPositionInfo.isFetched = false
    state.createdUserPositionInfo.error = null
  },
  [CREATE_USER_POSITION_SUCCESS]: (state, payload) => {
    state.createdUserPositionInfo.isFetching = false
    state.createdUserPositionInfo.isFetched = true
    state.createdUserPositionInfo.content = payload
  },
  [CREATE_USER_POSITION_ERROR]: (state, payload) => {
    state.createdUserPositionInfo.isFetching = false
    state.createdUserPositionInfo.isFetched = false
    state.createdUserPositionInfo.error = payload
  },
  [CREATE_USER_ROLES_REQUEST]: (state) => {
    state.createdUserRolesInfo.isFetching = true
    state.createdUserRolesInfo.isFetched = false
    state.createdUserRolesInfo.error = null
  },
  [CREATE_USER_ROLES_SUCCESS]: (state, payload) => {
    state.createdUserRolesInfo.isFetching = false
    state.createdUserRolesInfo.isFetched = true
    state.createdUserRolesInfo.content = payload
  },
  [CREATE_USER_ROLES_ERROR]: (state, payload) => {
    state.createdUserRolesInfo.isFetching = false
    state.createdUserRolesInfo.isFetched = false
    state.createdUserRolesInfo.error = payload
  },
  [CHANGE_POSITION_REQUEST]: (state) => {
    state.changedPositionInfo.isFetching = true
    state.changedPositionInfo.isFetched = false
    state.changedPositionInfo.error = null
  },
  [CHANGE_POSITION_SUCCESS]: (state, payload) => {
    state.changedPositionInfo.isFetching = false
    state.changedPositionInfo.isFetched = true
    state.changedPositionInfo.content = payload
  },
  [CHANGE_POSITION_ERROR]: (state, payload) => {
    state.changedPositionInfo.isFetching = false
    state.changedPositionInfo.isFetched = false
    state.changedPositionInfo.error = payload
  },
  [REMOVE_USER_ROLES_REQUEST]: (state) => {
    state.removedUserRolesInfo.isFetching = true
    state.removedUserRolesInfo.isFetched = false
    state.removedUserRolesInfo.error = null
  },
  [REMOVE_USER_ROLES_SUCCESS]: (state, payload) => {
    state.removedUserRolesInfo.isFetching = false
    state.removedUserRolesInfo.isFetched = true
    state.removedUserRolesInfo.content = payload
  },
  [REMOVE_USER_ROLES_ERROR]: (state, payload) => {
    state.removedUserRolesInfo.isFetching = false
    state.removedUserRolesInfo.isFetched = false
    state.removedUserRolesInfo.error = payload
  },
  [UPDATE_USER_REQUEST]: (state) => {
    state.updatedUserInfo.isFetching = true
    state.updatedUserInfo.isFetched = false
    state.updatedUserInfo.error = null
  },
  [UPDATE_USER_SUCCESS]: (state, payload) => {
    state.updatedUserInfo.isFetching = false
    state.updatedUserInfo.isFetched = true
    state.updatedUserInfo.content = payload
  },
  [UPDATE_USER_ERROR]: (state, payload) => {
    state.updatedUserInfo.isFetching = false
    state.updatedUserInfo.isFetched = false
    state.updatedUserInfo.error = payload
  },
  [CHANGE_ATTRIBUTES_REQUEST]: (state) => {
    state.changedAttributes.isFetching = true
    state.changedAttributes.isFetched = false
    state.changedAttributes.error = null
  },
  [CHANGE_ATTRIBUTES_SUCCESS]: (state, payload) => {
    state.changedAttributes.isFetching = false
    state.changedAttributes.isFetched = true
    state.changedAttributes.content = payload
  },
  [CHANGE_ATTRIBUTES_ERROR]: (state, payload) => {
    state.changedAttributes.isFetching = false
    state.changedAttributes.isFetched = false
    state.changedAttributes.error = payload
  },
  [GET_POST_REQUEST]: (state) => {
    state.gotPost.isFetching = true
    state.gotPost.isFetched = false
    state.gotPost.error = null
  },
  [GET_POST_SUCCESS]: (state, payload) => {
    state.gotPost.isFetching = false
    state.gotPost.isFetched = true
    state.gotPost.content = payload
  },
  [GET_POST_ERROR]: (state, payload) => {
    state.gotPost.isFetching = false
    state.gotPost.isFetched = false
    state.gotPost.error = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
