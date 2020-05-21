/* eslint-disable */
import axios from 'axios';
import { TYPE_OBJECT, TYPE_ARRAY, TYPE_JSON, TYPE_FILE } from '@/constants/type_request';
import { eachArray, eachObject, isCombat, wrapHttps } from '@/functions/helper';
import { BACKEND_COMBAT, BACKEND_TESTING } from '@/constants/url';
import { API_DADATA } from '@/store/actions/api';
import store from '../store';
const BASE_BRANCH = 'master';
export class API {
    constructor() {
        this._branch = BASE_BRANCH;
        this._type = TYPE_OBJECT;
        this._method = 'POST';
        this._data = null;
        this._withCredentials = false;
        this._responseType = 'json';
        this._token = '';
        this._transformDataForObject = () => {
            let dataResult = new URLSearchParams();
            eachObject(this._data, (value, key) => {
                dataResult.append(key, value);
            });
            const _token = this._getToken();
            !!_token && dataResult.append('_token', _token);
            return dataResult;
        };
        this._transformDataForArray = () => {
            const dataResult = [];
            eachObject(this._data, (value, key) => {
                if (Array.isArray(value)) {
                    eachArray(value, (item) => {
                        dataResult.push(`${key}[]=${item}`);
                    });
                }
                else {
                    dataResult.push(`${key}=${value}`);
                }
            });
            const _token = this._getToken();
            !!_token && dataResult.push(`_token=${_token}`);
            return dataResult.join('&');
        };
        this._transformDataForJson = () => {
            const dataResult = this._data;
            const _token = this._getToken();
            !!_token && (dataResult._token = _token);
            return dataResult;
        };
        this._transformDataForFile = () => {
            const fd = new FormData;
            eachObject(this._data, (value, key) => {
                fd.append(key, value);
            });
            const _token = this._getToken();
            !!_token && (fd.append('_token', _token));
            return fd;
        };
        this._reset = () => {
            this._branch = BASE_BRANCH;
            this._type = TYPE_OBJECT;
            this._method = 'POST';
            this._data = null;
            this._withCredentials = false;
            this._responseType = 'json';
        };
        this._getToken = () => {
            const auth = localStorage.getItem('lkb2b');
            if (typeof auth === 'string') {
                return JSON.parse(auth)?.auth?.accessToken;
            }
            return null;
        };
        this.setBranch = (branch) => {
            this._branch = branch;
            return this;
        };
        this.setType = (type) => {
            if (![TYPE_OBJECT, TYPE_ARRAY, TYPE_JSON, TYPE_FILE].includes(type)) {
                throw new Error('Type must be object, array, json, file');
            }
            this._type = type;
            return this;
        };
        this.setMethod = (method) => {
            this._method = method;
            return this;
        };
        this.setData = (data) => {
            this._data = data;
            return this;
        };
        /**
         * @deprecated
         */
        this.setWithCredentials = () => {
            this._withCredentials = true;
            return this;
        };
        this.setResponseType = (type) => {
            this._responseType = type;
            return this;
        };
        this.query = (query) => {
            if (process.env.VUE_APP_USE_SSO_AUTH === 'no') {
                return new Promise(() => { });
            }
            if (!query) {
                throw new Error('Query is required param');
            }
            let config = {};
            if ([TYPE_ARRAY, TYPE_OBJECT].includes(this._type)) {
                config.headers = { 'content-type': 'application/x-www-form-urlencoded' };
            }
            if (this._type === TYPE_FILE) {
                config.headers = { 'content-type': 'multipart/form-data' };
            }
            let data;
            switch (this._type) {
                case TYPE_OBJECT:
                    data = this._transformDataForObject();
                    break;
                case TYPE_ARRAY:
                    data = this._transformDataForArray();
                    break;
                case TYPE_JSON:
                    data = this._transformDataForJson();
                    break;
                case TYPE_FILE:
                    data = this._transformDataForFile();
                    break;
            }
            config = Object.assign(config, {
                method: this._method,
                responseType: this._responseType,
                data,
                url: API._getUrl(query, this._branch),
                withCredentials: true
            });
            return new Promise((resolve, reject) => {
                axios(config)
                    .then(response => {
                    // Ошибка TBAPI (возвращается 200-ка)
                    if (response.data && response.data.businessErrorCode) {
                        reject(`Error of TBAPI: ${response.data.businessErrorCode}`);
                    }
                    resolve(response.data);
                })
                    .catch(error => {
                    reject(error);
                })
                    .finally(() => {
                    this._reset();
                });
            });
        };
    }
    static _getUrl(query, branch) {
        query = query || '/';
        branch = branch || BASE_BRANCH;
        if (isCombat()) {
            return wrapHttps(`${BACKEND_COMBAT}${query}`);
        }
        return wrapHttps(`${branch}${BACKEND_TESTING}${query}`);
    }
}
export function apiParallel(arrayAPI) {
    return Promise.all(arrayAPI);
}
export function apiDadata(options) {
    return new Promise(resolve => {
        const type = options.type || 'address';
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/' + type);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Authorization', `Token ${store.state.api[API_DADATA]}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(options));
        xhr.onreadystatechange = () => {
            if (!xhr || xhr.readyState !== 4)
                return;
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.response));
            }
        };
    });
}
//# sourceMappingURL=api.js.map