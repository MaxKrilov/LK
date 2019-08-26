import axios from 'axios'
import { TYPE_OBJECT, TYPE_ARRAY, TYPE_JSON } from '../constants/type_request'
import { isCombat, wrapHttps, eachObject, eachArray } from './helper'
import { BACKEND_COMBAT, BACKEND_TESTING } from '../constants/url'

/**
 * Класс для работы с API
 * @constructor
 */
export function API () {
  let _branch = 'master'
  let _type = TYPE_OBJECT
  let _method = 'POST'
  let _data = null
  function _getUrl (query, branch) {
    query = query || '/'
    branch = branch || 'master'
    if (isCombat()) {
      return wrapHttps(`${BACKEND_COMBAT}${query}`)
    }
    return wrapHttps(`${branch}${BACKEND_TESTING}${query}`)
  }
  function _transformDataForObject () {
    let dataResult = new URLSearchParams()
    eachObject(_data, (value, key) => {
      dataResult.append(key, value)
    })
    // todo Параметры для всех запросов
    return dataResult
  }
  function _transformDataForArray () {
    const dataResult = []
    eachObject(_data, (value, key) => {
      if (Array.isArray(value)) {
        eachArray(value, item => {
          dataResult.push(`${key}[]=${item}`)
        })
      } else if (typeof value === 'string') {
        dataResult.push(`${key}=${value}`)
      }
    })
    // todo Параметры для всех запросов
    return dataResult.join('&')
  }
  function _transformDataForJson () {
    const dataResult = _data
    // todo Параметры для всех запросов
    return dataResult
  }

  /**
   * Устанавливает заголовок авторизации
   * @param {string} headerAuthorization
   */
  this.setHeaderAuthorization = function (headerAuthorization) {
    axios.defaults.headers.common.Authorization = `Bearer ${headerAuthorization}`
  }
  /**
   * Удаляет заголовок авторизации
   */
  this.removeHeaderAuthorization = function () {
    delete axios.defaults.headers.common.Authorization
  }
  /**
   * Устанавливает ветку
   * @param {string} branch
   * @return {API}
   */
  this.setBranch = function (branch) {
    _branch = branch
    return this
  }
  /**
   * Устанавливает тип передаваемых данных (object, array или json)
   * @param {string} type
   * @return {API}
   */
  this.setType = function (type) {
    if (![TYPE_OBJECT, TYPE_ARRAY, TYPE_JSON].includes(type)) {
      throw new Error('Type must be object, array or json')
    }
    _type = type
    return this
  }
  /**
   * Устанавливает метод запроса (POST, GET, etc)
   * @param {string} method
   * @return {API}
   */
  this.setMethod = function (method) {
    _method = method
    return this
  }
  /**
   * Устанавливает данные запроса
   * @param {object|Array|string} data
   * @return {API}
   */
  this.setData = function (data) {
    _data = data
    return this
  }
  /**
   * Выполняет запрос
   * @param {string} query
   * @return {Promise<any>}
   */
  this.query = function (query) {
    if (!query) {
      throw new Error('Query is required param')
    }
    let config = {}
    if (~[TYPE_ARRAY, TYPE_OBJECT].indexOf(_type)) {
      config.headers = { 'content-type': 'application/x-www-form-urlencoded' }
    }
    const data = _type === TYPE_OBJECT
      ? _transformDataForObject().bind(this)
      : _type === TYPE_ARRAY
        ? _transformDataForArray().bind(this)
        : _transformDataForJson().bind(this)
    config = Object.assign(config, {
      method: _method,
      data,
      url: _getUrl(query, _branch)
    })
    return new Promise((resolve, reject) => {
      axios(config)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
        .finally(() => {
          _reset()
        })
    })
  }
  function _reset () {
    _branch = 'master'
    _type = TYPE_OBJECT
    _method = 'POST'
    _data = null
  }
}
