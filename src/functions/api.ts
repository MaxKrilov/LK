/* eslint-disable */
import axios, { AxiosRequestConfig, Method } from 'axios'
import { TYPE_OBJECT, TYPE_ARRAY, TYPE_JSON } from '@/constants/type_request'
import { eachArray, eachObject, isCombat, wrapHttps } from '@/functions/helper'
import { BACKEND_COMBAT, BACKEND_TESTING } from '@/constants/url'
import { API_DADATA } from '@/store/actions/api'
import store from '../store'


export class API {
  private _branch = 'master'
  private _type: string = TYPE_OBJECT
  private _method: Method = 'POST'
  private _data: any = null
  private _withCredentials: boolean = false

  private _token: string = ''

  private static _getUrl (query: string, branch: string): string {
    query = query || '/'
    branch = branch || 'master'
    
    if (isCombat()) {
      return wrapHttps(`${BACKEND_COMBAT}${query}`)
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
    !!_token && (dataResult._token = _token)
    return dataResult
  }

  private _reset = () => {
    this._branch = 'master'
    this._type = TYPE_OBJECT
    this._method = 'POST'
    this._data = null
    this._withCredentials = false
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

  public setType = (type: string): API => {
    if (![TYPE_OBJECT, TYPE_ARRAY, TYPE_JSON].includes(type)) {
      throw new Error('Type must be object, array or json')
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

  public setWithCredentials = (): API => {
    this._withCredentials = true
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
    }
    config = Object.assign(config, {
      method: this._method,
      data,
      url: API._getUrl(query, this._branch),
      withCredentials: this._withCredentials
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
