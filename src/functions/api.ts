/* eslint-disable */
import axios, { AxiosRequestConfig, Method, ResponseType } from 'axios'
import { TYPE_OBJECT, TYPE_ARRAY, TYPE_JSON, TYPE_FILE } from '@/constants/type_request'
import { eachArray, eachObject, isCombat, isLocalhost, isStaging, wrapHttps } from '@/functions/helper'
import { BACKEND_COMBAT, BACKEND_STAGING, BACKEND_TESTING } from '@/constants/url'
import { API_DADATA } from '@/store/actions/api'
import store from '../store'

import { cloneDeep } from 'lodash'

import * as Sentry from '@sentry/vue'

const BASE_BRANCH = 'web-24642'

export class API {
  private _branch = BASE_BRANCH
  private _type: string = TYPE_OBJECT
  private _method: Method = 'POST'
  private _data: any = null
  private _uploadCallback: any = undefined
  private _withCredentials: boolean = false
  private _responseType: ResponseType = 'json'

  private _token: string = ''

  private static _getUrl (query: string, branch: string): string {
    query = query || '/'
    branch = branch || BASE_BRANCH
    if (isCombat()) {
      return wrapHttps(`${BACKEND_COMBAT}${query}`)
    } else if (isStaging()) {
      return wrapHttps(`${BACKEND_STAGING}${query}`)
    }

    return wrapHttps(`${branch}${BACKEND_TESTING}${query}`)
  }

  private _transformDataForObject = (): URLSearchParams => {
    let dataResult = new URLSearchParams()
    eachObject(this._data, (value: string, key: string) => {
      dataResult.append(key, value)
    })
    const _token = this._getToken()
    !!_token && dataResult.append('_token', _token)
    return dataResult
  }

  private _transformDataForArray = (): string => {
    const dataResult: string[] = []
    eachObject(this._data, (value: string | string[], key: string) => {
      if (Array.isArray(value)) {
        eachArray(value, (item: string) => {
          dataResult.push(`${key}[]=${item}`)
        })
      } else {
        dataResult.push(`${key}=${value}`)
      }
    })
    const _token = this._getToken()
    !!_token && dataResult.push(`_token=${_token}`)
    return dataResult.join('&')
  }

  private _transformDataForJson = (): any => {
    const dataResult = this._data
    const _token = this._getToken()
    if (!!_token && this._data instanceof FormData) {
      dataResult.append('_token', _token)
    } else if (!!_token) {
      dataResult._token = _token
    }
    return dataResult
  }

  private _transformDataForFile = (): any => {
    const fd = new FormData
    eachObject(this._data, (value: any, key: string) => {
      fd.append(key, value)
    })
    const _token = this._getToken()
    !!_token && (fd.append('_token', _token))
    return fd
  }

  private _reset = () => {
    this._branch = BASE_BRANCH
    this._type = TYPE_OBJECT
    this._method = 'POST'
    this._data = null
    this._withCredentials = false
    this._responseType = 'json'
  }

  private _getToken = () => {
    const auth = localStorage.getItem('lkb2b')
    if (typeof auth === 'string') {
      return JSON.parse(auth)?.auth?.accessToken
    }
    return null
  }

  public setBranch = (branch: string): API => {
    this._branch = branch
    return this
  }

  public setUploadCallback = (uploadCallback: any): API => {
    this._uploadCallback = uploadCallback
    return this
  }

  public setType = (type: string): API => {
    if (![TYPE_OBJECT, TYPE_ARRAY, TYPE_JSON, TYPE_FILE].includes(type)) {
      throw new Error('Type must be object, array, json, file')
    }
    this._type = type
    return this
  }

  public setMethod = (method: Method): API => {
    this._method = method
    return this
  }

  public setData = (data: any): API => {
    this._data = data
    return this
  }

  /**
   * @deprecated
   */
  public setWithCredentials = (): API => {
    this._withCredentials = true
    return this
  }

  public setResponseType = (type: ResponseType) => {
    this._responseType = type
    return this
  }

  public query = (query: string): Promise<any> => {
    if (process.env.VUE_APP_USE_SSO_AUTH === 'no') {
      return new Promise(() => {})
    }

    if (!query) {
      throw new Error('Query is required param')
    }
    let config: AxiosRequestConfig = {}
    if ([TYPE_ARRAY, TYPE_OBJECT].includes(this._type)) {
      config.headers = { 'content-type': 'application/x-www-form-urlencoded' }
    }
    if (this._type === TYPE_FILE) {
      config.headers = { 'content-type': 'multipart/form-data' }
    }
    let data
    switch (this._type) {
      case TYPE_OBJECT:
        data = this._transformDataForObject()
        break
      case TYPE_ARRAY:
        data = this._transformDataForArray()
        break
      case TYPE_JSON:
        data = this._transformDataForJson()
        break
      case TYPE_FILE:
        data = this._transformDataForFile()
        break
    }
    config = Object.assign(config, {
      method: this._method,
      responseType: this._responseType,
      data,
      url: API._getUrl(query, this._branch),
      withCredentials: true
    })
    if (this._uploadCallback) {
      config.onUploadProgress = this._uploadCallback
    }
    // Для Sentry
    const _internalData = cloneDeep(this._data)
    return new Promise((resolve, reject) => {
      axios(config)
        .then(response => {
          // Ошибка TBAPI (возвращается 200-ка)
          if (response.data && response.data.businessErrorCode) {
            reject(`Error of TBAPI: ${response.data.businessErrorCode}`)
          }
          resolve(response.data)
        })
        .catch(error => {
          if (!isLocalhost()) {
            Sentry.captureException(new Error(`Ошибка запроса ${config.url}`), scope => {
              scope.setExtra('Request Param', _internalData)
              scope.setExtra('Error Data', error.response.data)
              return scope
            })
          }
          reject(error)
        })
        .finally(() => {
          this._reset()
        })
    })
  }
}

export function apiParallel (arrayAPI: Iterable<any | PromiseLike<any>>): Promise<any[]> {
  return Promise.all(arrayAPI)
}

export function apiDadata (options: any) {
  return new Promise(resolve => {
    const type = options.type || 'address'
    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/' + type)
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Authorization', `Token ${store.state.api[API_DADATA]}`)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(options))
    xhr.onreadystatechange = () => {
      if (!xhr || xhr.readyState !== 4) return
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.response))
      }
    }
  })
}
