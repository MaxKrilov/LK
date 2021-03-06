import { DocumentInterface } from '@/tbapi'
import { ActionContext } from 'vuex'
import { API } from '@/functions/api'
import { AxiosError } from 'axios'
import { ERROR_MODAL } from '@/store/actions/variables'
import { logError } from '@/functions/logging.ts'
import { getFirstElement } from '@/functions/helper'
import { CONTRACT, GROUP_CONTRACT } from '@/constants/document'
import {
  isReportDocument,
  isContractDocument,
  isBlankDocument,
  isOtherDocument, isActDocument
} from '@/functions/document'
import { TYPE_FILE, TYPE_JSON } from '@/constants/type_request'
import { ICustomerContract, IOrderContract } from '@/tbapi/fileinfo'

interface IState {
  listDocument: DocumentInterface[],
  listReportDocument: (DocumentInterface | DocumentInterface[])[],
  listContractDocument: (DocumentInterface | DocumentInterface[])[],
  listOtherDocument: (DocumentInterface | DocumentInterface[])[]
}

interface IFile {
  bucket: string
  key: string
}

const $api = new API()

const state: IState = {
  listDocument: [],
  listReportDocument: [],
  listContractDocument: [],
  listOtherDocument: []
}

const getters = {
  /**
   * Получение количества документов и/или пакетов документов со статусом "Готов для клиента"
   * @param state
   */
  getCountUnsignedDocument: (state: IState) =>
    state.listDocument.filter(document => document.contractStatus?.match(new RegExp(CONTRACT.IS_READY, 'ig'))).length,
  /**
   * Получение отчётных документов и/или пакетов документов
   * @param state
   */
  getListReportDocument: (state: IState) => {
    const listReportDocument = JSON.parse(JSON.stringify(state.listReportDocument))
    return listReportDocument.sort((a: any, b: any) => {
      const _a = Array.isArray(a) ? a[0] : a
      const _b = Array.isArray(b) ? b[0] : b
      return _a.creationDate - _b.creationDate
    })
  },
  /**
   * Получение контрактных докуметов и/или пакетов документов
   * @param state
   */
  getListContractDocument: (state: IState) => state.listContractDocument,
  getListOtherDocument: (state: IState) => state.listOtherDocument
}

const actions = {
  /**
   * Получение списка документов
   */
  downloadListDocument (context: ActionContext<IState, any>, payload: { api: API, relatedTo?: string }) {
    const { toms: clientId } = context.rootGetters['auth/user']
    const data: Record<string, string> = { clientId }

    if (payload.hasOwnProperty('relatedTo')) {
      data.relatedTo = payload.relatedTo!
    }
    return new Promise<DocumentInterface[] | void>((resolve, reject) => {
      payload.api
        .setWithCredentials()
        .setData(data)
        .query('/customer/management/fileinfo')
        .then((response: DocumentInterface[]) => {
          if (payload.hasOwnProperty('relatedTo')) { // В этом случае экспортируем
            resolve(response)
          } else {
            context.commit('downloadListDocumentSuccess', response)
            resolve()
          }
        })
        .catch((error: AxiosError) => {
          logError(error)
          context.commit(ERROR_MODAL, true, { root: true })
          reject(error)
        })
        .finally(() => {
          context.commit('loading/loadingDocuments', false, { root: true })
        })
    })
  },
  downloadFile (
    context: ActionContext<IState, any>,
    payload: { api: API, bucket: string, key: string, ext: string, asPdf?: number }
  ) {
    return new Promise<Blob | boolean>((resolve) => {
      payload.api
        .setWithCredentials()
        .setResponseType('blob')
        .setData({
          bucket: payload.bucket,
          key: payload.key,
          asPdf: typeof payload.asPdf === 'undefined' ? 1 : payload.asPdf,
          ext: payload.ext
        })
        .query('/docs/s3/get')
        .then((response: Blob) => {
          resolve(response)
        })
        .catch(() => {
          resolve(false)
        })
    })
  },
  changeContractStatus (context: ActionContext<IState, any>, payload: { api: API, contractId: string, status: number | string }) {
    const { toms: clientId } = context.rootGetters['auth/user']
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        payload.api
          .setWithCredentials()
          .setData({
            clientId,
            contractId: payload.contractId,
            status: payload.status
          })
          .query('/order/contract/edit')
          .then((resp) => { resolve(resp) })
          .catch((err: AxiosError) => {
            reject(err)
          })
      }, 2000)
    })
  },
  uploadFile (context: ActionContext<IState, any>, { api, bucket, file, filePath }: { api: API, bucket: string, file: File, filePath: string }) {
    return new Promise<boolean>((resolve, reject) => {
      api
        .setWithCredentials()
        .setType(TYPE_FILE)
        .setData({
          bucket,
          file,
          key: filePath
          // asPdf: 1
        })
        .query('/docs/s3/set')
        .then(() => resolve(true))
        .catch(() => reject(false))
    })
  },
  sendOnEmail (context: ActionContext<IState, any>, { api, files, email }: { api: API, files: IFile[], email: string }) {
    return new Promise<boolean>((resolve) => {
      api
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          files,
          email
        })
        .query('/docs/s3/send-mail')
        .then(response => resolve(response))
        .catch(() => resolve(false))
    })
  },
  actSigning (
    context: ActionContext<IState, any>,
    { api, documentId, status, reason }: { api: API, documentId: string, status: number, reason: string }
  ) {
    return new Promise((resolve, reject) => {
      const { toms: clientId } = context.rootGetters['auth/user']
      api
        .setWithCredentials()
        .setData({
          id: documentId,
          clientId,
          status,
          rejectReason: reason
        })
        .query('/docs/act/accept')
        .then(response => { resolve(response) })
        .catch(err => { reject(err) })
    })
  },
  getContract (context: ActionContext<IState, any>, { api }: { api: API } = { api: $api }) {
    const { toms: clientId } = context.rootGetters['auth/user']

    return new Promise<ICustomerContract[]>((resolve, reject) => {
      api
        .setWithCredentials()
        .setData({
          clientId
        })
        .query('/order/contract/customer-contracts')
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },

  getOrderContract (context: ActionContext<IState, any>, { salesOrderId }: { salesOrderId: string }) {
    const { toms: clientId } = context.rootGetters['auth/user']

    return new Promise<IOrderContract[]>((resolve, reject) => {
      $api
        .setWithCredentials()
        .setData({
          clientId,
          salesOrderId
        })
        .query('/order/contract/get-contract')
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  logEdo (
    context: ActionContext<IState, any>,
    { api, type, data }: { api: API, type: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', data: any }
  ) {
    const { toms: clientId } = context.rootGetters['auth/user']
    const clientName = context.rootState?.user?.clientInfo?.legalName || ''
    return new Promise((resolve, reject) => {
      api
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          clientId,
          clientName,
          type,
          data
        })
        .query('/docs/edo2/log')
        .then(response => resolve(response))
        .catch(err => { reject(err) })
    })
  }
}

const mutations = {
  /**
   * Группировка:
   * 1. Разделяем контрактные и отчётные документы
   * 2. В контрактной документации группируем только следующие типы документов:
   *    2.1. Договор
   *    2.2. Доп. соглашение
   *    2.3. Акт сдачи/приёмки услуги
   *    2.4. Первичный счёт
   *    2.5. Список пользователей
   */
  downloadListDocumentSuccess (state: IState, payload: DocumentInterface[]) {
    state.listContractDocument = []
    state.listReportDocument = []
    state.listOtherDocument = []
    state.listDocument = []
    payload.forEach(document => {
      state.listDocument.push(document)
      if (isReportDocument(document)) {
        state.listReportDocument.push(document)
      }
      if (
        isContractDocument(document) ||
        isBlankDocument(document)
      ) {
        if (GROUP_CONTRACT.includes(String(document.type.id))) {
          const findIndex = state.listContractDocument.findIndex(_document => {
            return Array.isArray(_document) &&
              getFirstElement(_document)!.relatedTo.id === document.relatedTo.id &&
              GROUP_CONTRACT.includes(getFirstElement(_document).type.id)
          })
          findIndex > -1
            ? (state.listContractDocument[findIndex] as DocumentInterface[]).push(document)
            : state.listContractDocument.push([document])
        } else {
          state.listContractDocument.push([document])
        }
      }
      if (isOtherDocument(document) || isActDocument(document)) {
        state.listOtherDocument.push(document)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
