import { DocumentInterface } from '@/tbapi'
import { ActionContext } from 'vuex'
import { API } from '@/functions/api'
import { AxiosError } from 'axios'
import { ERROR_MODAL } from '@/store/actions/variables'
import { logError } from '@/functions/logging.ts'
import { getFirstElement } from '@/functions/helper'
import { CONTRACT, GROUP_CONTRACT } from '@/constants/document'
import { isReportDocument, isContractDocument, isUserListDocument, isBlankDocument } from '@/functions/document'
import { TYPE_ARRAY, TYPE_FILE, TYPE_JSON } from '@/constants/type_request'

interface IState {
  listDocument: (DocumentInterface[])[],
  listReportDocument: (DocumentInterface | DocumentInterface[])[],
  listContractDocument: (DocumentInterface | DocumentInterface[])[]
}

interface IFile {
  bucket: string
  key: string
}

const state: IState = {
  listDocument: [],
  listReportDocument: [],
  listContractDocument: []
}

const getters = {
  /**
   * Получение количества документов и/или пакетов документов со статусом "Готов для клиента"
   * @param state
   */
  getCountUnsignedDocument: (state: IState) =>
    state.listDocument.filter(document => getFirstElement(document)?.contractStatus?.match(new RegExp(CONTRACT.IS_READY, 'ig'))).length,
  /**
   * Получение отчётных документов и/или пакетов документов
   * @param state
   */
  getListReportDocument: (state: IState) => state.listReportDocument,
  /**
   * Получение контрактных докуметов и/или пакетов документов
   * @param state
   */
  getListContractDocument: (state: IState) => state.listContractDocument
}

const actions = {
  /**
   * Получение списка документов
   * @param {ActionContext<IState, {}>} context
   * @param {{ api: API }} payload
   */
  downloadListDocument (context: ActionContext<IState, any>, payload: { api: API }) {
    const { toms: clientId } = context.rootGetters['auth/user']
    const billingAccountId = context.rootGetters['user/getActiveBillingAccount']
    return new Promise<void>((resolve, reject) => {
      payload.api
        .setWithCredentials()
        .setData({
          clientId,
          billingAccountId
        })
        .query('/customer/management/fileinfo')
        .then((data: DocumentInterface[]) => {
          context.commit('downloadListDocumentSuccess', data)
          resolve()
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
  downloadFile (context: ActionContext<IState, any>, payload: { api: API, bucket: string, key: string }) {
    return new Promise<Blob | boolean>((resolve) => {
      payload.api
        .setWithCredentials()
        .setResponseType('blob')
        .setData({
          bucket: payload.bucket,
          key: payload.key
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
          .then(() => { resolve(true) })
          .catch((err: AxiosError) => {
            if (err.message.toLowerCase().match(/заказ не может быть отправлен в исполнение автоматически/ig)) {
              resolve(true)
            } else {
              reject(false)
            }
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
    payload.forEach(document => {
      if (isReportDocument(document)) {
        state.listReportDocument.push(document)
      }
      if ((isContractDocument(document) || isUserListDocument(document) || isBlankDocument(document))) {
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
