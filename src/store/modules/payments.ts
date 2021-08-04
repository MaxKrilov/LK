import { API } from '@/functions/api'
import {
  IBillingAccount,
  IBillingInfo,
  IBillingPromisePaymentCheck,
  IBillingPromisePaymentInfo,
  IInfoBillAccount,
  IPaymentBill,
  IPaymentCard,
  IPaymentHistory,
  IDocumentViewerDocument,
  INewCardPayment, IPaymentStatus
} from '@/tbapi/payments'
import { ActionContext } from 'vuex'
import { Route } from 'vue-router'
import { Cookie } from '@/functions/storage'

import { head, cloneDeep } from 'lodash'
import moment from 'moment'
import { getFirstElement } from '@/functions/helper'
import { ISaleOrder } from '@/tbapi'

export interface IPaymentHistoryBill {
  title: string
  description: string
  value: number
  timestamp: Number
  chargePeriod: string
  type: string,
  fiscalCheck?: string
}

type IState = typeof state

const api = () => new API()

// todo - вынести в константы
const IS_ENABLED_AUTOPAY = '9149184122213604836'
const FISCAL_CHECK_ATTRIBUTE = 'FISCAL_CHECK'
const ALTERNATE_SOURCE_NAME = 'ALTERNATE_SOURCE_NAME'

const transformHistory = ([history, bill]: [IPaymentHistory[], IPaymentBill[]]) => {
  const result: IPaymentHistoryBill[][] = []

  result.push(...history.reduce((acc, historyItem) => {
    const index = acc.findIndex(accItem => {
      return getFirstElement(accItem) &&
        moment(getFirstElement(accItem).timestamp).format('M') === moment(Number(historyItem.paymentDate)).format('M')
    })

    const resultObject: IPaymentHistoryBill = {
      title: 'Пополнение счёта',
      description: historyItem.paymentAttributes.find(paymentAttribute => paymentAttribute.name === ALTERNATE_SOURCE_NAME)?.value ||
        historyItem.paymentMethod.name,
      value: Math.abs(Number(historyItem.paymentAmount)),
      timestamp: Number(historyItem.paymentDate),
      chargePeriod: '',
      type: 'replenishment'
    }

    const fiscalCheckAttribute = historyItem.paymentAttributes
      .find(paymentAttribute => paymentAttribute.name === FISCAL_CHECK_ATTRIBUTE)

    if (typeof fiscalCheckAttribute !== 'undefined') {
      resultObject.fiscalCheck = fiscalCheckAttribute.value!
    }

    if (index > -1) {
      acc[index].push(resultObject)
    } else {
      acc.push([resultObject])
    }

    return acc
  }, [] as unknown as [IPaymentHistoryBill[]]))

  bill.forEach(billItem => {
    const index = result.findIndex(resultItem => {
      return getFirstElement(resultItem) &&
        moment(getFirstElement(resultItem).timestamp).format('M') === moment(Number(billItem.actualBillDate)).format('M')
    })

    const resultArray = billItem.detail.map(detailItem => {
      return {
        title: detailItem.chargeName,
        description: detailItem.typeCharge,
        value: Number(detailItem.chargeCost),
        timestamp: Number(billItem.actualBillDate),
        chargePeriod: detailItem.chargePeriod,
        type: 'write_off'
      }
    })

    if (index > -1) {
      result[index].push(...resultArray)
    } else {
      result.push(resultArray)
    }
  })

  result.sort((a, b) => Number(head(b)!.timestamp) - Number(head(a)!.timestamp))

  result.forEach(resultItem => {
    resultItem.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
  })

  return result
}

const state = {
  listBillingAccount: [] as IBillingAccount[],
  activeBillingAccount: null as null | IBillingAccount,
  billingInfo: {} as object | IBillingInfo,
  isCanActivatePromisePayment: false,
  reasonCanntActivatePromisePayment: '',
  isHasPromisePayment: false,
  promisePayStart: null as null | moment.Moment,
  promisePayEnd: null as null | moment.Moment,
  promisePaymentOrderId: '',
  listInvoicePayment: [{
    id: '',
    bucket: '',
    fileName: '',
    filePath: '',
    type: { id: '', name: '' }
  }] as IDocumentViewerDocument[],
  // Вынесено во Vuex для избежания вложенности
  cvv: '',
  isValidCVV: true
}

const getters = {
  getActiveBillingAccount: (state: IState) => state.activeBillingAccount?.billingAccountId,
  getActiveBillingAccountNumber: (state: IState) => state.activeBillingAccount?.accountNumber,
  getMarketingBrandId: (state: IState) => (state.billingInfo as IBillingInfo)?.marketingBrandId,
  getBillingAccountsGroupByContract: (state: IState) => state.listBillingAccount.reduce((result, item) => {
    const {
      contractNumber,
      accountNumber,
      billingAccountId,
      accountStatus
    } = item
    if (!result.hasOwnProperty(contractNumber)) {
      result[contractNumber] = []
    }
    result[contractNumber].push({ accountNumber, billingAccountId, accountStatus })
    return result
  }, {} as Record<string, { accountNumber: string, billingAccountId: string, accountStatus: { id: string, name: string } }[]>),
  isEnabledAutoPay: (state: IState) => state.billingInfo.hasOwnProperty('paymentMethod')
    ? (state.billingInfo as IBillingInfo).paymentMethod.id === IS_ENABLED_AUTOPAY
    : false
}

const actions = {
  getListBillingAccount (context: ActionContext<IState, any>, { route }: { route: Route }) {
    const toms = context.rootGetters['auth/getTOMS']
    const allowedListBillingAccount = context.rootState.auth.userInfo
      .personalAccount?.accounts?.map((item: any) => item.value) || []
    if (!toms) {
      throw new Error('No toms ID')
    }

    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({
          id: toms,
          clientId: toms
        })
        .query('/payment/account/list')
        .then((response: IBillingAccount[]) => {
          if (!Array.isArray(response)) {
            throw new Error('Unknown type of request')
          }
          let result = cloneDeep(response)
          // Фильтруем список л/с
          if (allowedListBillingAccount.length > 0) {
            result = result.filter(resultItem => allowedListBillingAccount.includes(resultItem.accountNumber))
          }
          if (result.length === 0) {
            resolve(false)
            return
          }
          context.commit('setListBillingAccount', result)
          // Устанавливаем активный биллинг-аккаунт
          const requestBillingNumber = route.query.billing_account || Cookie.get('ff_billing_account')
          if (requestBillingNumber && typeof requestBillingNumber === 'string') {
            Cookie.remove('ff_billing_account')
            const findingBillingAccount = result.find(billingAccount => billingAccount.accountNumber === requestBillingNumber)
            if (typeof findingBillingAccount !== 'undefined') {
              context.commit('setActiveBillingAccount', findingBillingAccount)
              resolve(true)
              return
            }
          }

          const cookieBillingAccountId = Cookie.get('billingAccountId')
          if (typeof cookieBillingAccountId !== 'undefined') {
            const findingBillingAccount = result.find(billingAccount => billingAccount.billingAccountId === cookieBillingAccountId)
            if (typeof findingBillingAccount !== 'undefined') {
              context.commit('setActiveBillingAccount', findingBillingAccount)
              resolve(true)
              return
            }
          }

          const findingBillingAccount = result.find(billingAccount => !/[A-Za-z]/.test(billingAccount.accountNumber))
          if (typeof findingBillingAccount !== 'undefined') {
            context.commit('setActiveBillingAccount', findingBillingAccount)
          } else {
            context.commit('setActiveBillingAccount', head(result)!)
          }
          resolve(true)
        })
        .catch(error => { reject(error) })
        .finally(() => {
          context.commit('loading/menuComponentBillingAccount', false, { root: true })
        })
    })
  },
  getBillingInfo (context: ActionContext<IState, any>) {
    return new Promise((resolve, reject) => {
      const activeBillingAccount = context.getters.getActiveBillingAccount
      if (!activeBillingAccount) {
        reject('No have active billing account')
        return
      }

      api()
        .setWithCredentials()
        .setData({ id: activeBillingAccount })
        .query('/payment/billing/get-info')
        .then((response: IBillingInfo) => {
          context.commit('setBillingInfo', response)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
        .finally(() => {
          context.commit('loading/menuComponentBalance', false, { root: true })
        })
    })
  },
  getPromisedPaymentInfo (context: ActionContext<IState, any>) {
    return new Promise((resolve, reject) => {
      const clientId = context.rootGetters['auth/getTOMS']
      const activeBillingAccount = context.getters.getActiveBillingAccount

      const infoAboutPromisePayment = new Promise<IBillingPromisePaymentInfo>((resolve, reject) => {
        api()
          .setWithCredentials()
          .setData({
            id: activeBillingAccount,
            clientId
          })
          .query('/billing/promise/index')
          .then((response: IBillingPromisePaymentInfo) => resolve(response))
          .catch(error => reject(error))
      })

      const canBeActivatedPromisePayment = new Promise<IBillingPromisePaymentCheck>((resolve, reject) => {
        api()
          .setWithCredentials()
          .setData({
            id: activeBillingAccount,
            clientId,
            promiseCode: 1
          })
          .query('/payment/billing/check-promise-payment')
          .then((response: IBillingPromisePaymentCheck) => resolve(response))
          .catch(error => reject(error))
      })

      Promise.all([
        infoAboutPromisePayment,
        canBeActivatedPromisePayment
      ])
        .then(response => {
          resolve()
          context.commit('setPromisedPaymentInfo', response)
        })
        .catch(error => {
          reject(error)
        })
        .finally(() => {
          context.commit('loading/loadingPromisedPayment', false, { root: true })
        })
    })
  },
  getPaymentHistory (context: ActionContext<IState, any>, { dateFrom, dateTo }: { dateFrom: moment.Moment, dateTo: moment.Moment }) {
    return new Promise((resolve, reject) => {
      const clientId = context.rootGetters['auth/getTOMS']
      const activeBillingAccountId = context.getters.getActiveBillingAccount

      if (!clientId || !activeBillingAccountId) {
        reject('No toms ID or Billing Account Id')
        return
      }

      context.commit('loading/loadingPaymentHistoryBill', true, { root: true })

      const history = new Promise<IPaymentHistory[]>((resolve, reject) => {
        api()
          .setWithCredentials()
          .setData({
            clientId,
            id: activeBillingAccountId,
            dateFrom: dateFrom.valueOf(),
            dateTo: dateTo.valueOf()
          })
          .query('/payment/billing/history')
          .then((response: IPaymentHistory[]) => resolve(response))
          .catch(error => reject(error))
      })

      const bill = new Promise<IPaymentBill[]>((resolve, reject) => {
        api()
          .setWithCredentials()
          .setData({
            clientId,
            accountId: activeBillingAccountId,
            dateFrom: dateFrom.valueOf(),
            dateTo: dateTo.valueOf()
          })
          .query('/billing/management/bill')
          .then((response: IPaymentBill[]) => resolve(response))
          .catch(error => reject(error))
      })

      Promise.all([ history, bill ])
        .then(response => { resolve(transformHistory(response)) })
        .catch(error => reject(error))
        .finally(() => {
          context.commit('loading/loadingPaymentHistoryBill', false, { root: true })
        })
    })
  },
  createOrderPromisePayment (context: ActionContext<IState, any>, { marketId }: { marketId: string }) {
    return new Promise((resolve, reject) => {
      const clientId = context.rootGetters['auth/getTOMS']
      const activeBillingAccountId = context.getters.getActiveBillingAccount
      const marketingBrandId = (context.state.billingInfo as IBillingInfo).marketingBrandId
      const locationId = (head(context.rootState.user.listProductByAddress) as any)?.id
      const customerCategoryId = context.rootGetters['user/customerCategoryId']
      const distributionChannelId = context.rootGetters['user/distributionChannelId']

      if (
        !clientId ||
        !activeBillingAccountId ||
        !marketingBrandId ||
        !locationId ||
        !customerCategoryId ||
        !distributionChannelId ||
        !marketId
      ) {
        reject('Not all required parameters are filled in')
        return
      }

      api()
        .setWithCredentials()
        .setData({
          clientId,
          marketingBrandId,
          customerCategoryId,
          distributionChannelId,
          marketId
        })
        .query('/order/management/create')
        .then((response: ISaleOrder) => {
          const id = response.id

          api()
            .setWithCredentials()
            .setData({ clientId, billingAccountId: activeBillingAccountId, locationId, id })
            .query('/order/management/promised-payment')
            .then(() => {
              api()
                .setWithCredentials()
                .setData({ clientId, id })
                .query('/order/management/save')
                .then(() => {
                  context.commit('setPromisePaymentOrderId', id)
                  resolve()
                })
                .catch(error => reject(error))
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error))
    })
  },
  sendOrderPromisePayment (context: ActionContext<IState, any>) {
    return new Promise((resolve, reject) => {
      const clientId = context.rootGetters['auth/getTOMS']
      const promisePaymentOrderId = context.state.promisePaymentOrderId

      if (!clientId || !promisePaymentOrderId) {
        reject('No client ID or promise payment order ID')
        return
      }

      api()
        .setWithCredentials()
        .setData({ clientId, id: promisePaymentOrderId })
        .query('/order/management/send-order')
        .then(() => {
          context.commit('setPromisePaymentOrderId', '')
          resolve()
        })
        .catch(error => reject(error))
    })
  },
  cancelOrderPromisePayment (context: ActionContext<IState, any>) {
    return new Promise((resolve, reject) => {
      const clientId = context.rootGetters['auth/getTOMS']
      const promisePaymentOrderId = context.state.promisePaymentOrderId

      if (!clientId || !promisePaymentOrderId) {
        reject('No client ID or promise payment order ID')
        return
      }

      api()
        .setWithCredentials()
        .setData({ clientId, id: promisePaymentOrderId })
        .query('/order/management/send-order')
        .then(() => {
          context.commit('setPromisePaymentOrderId', '')
        })
        .catch(error => reject(error))
    })
  },
  getListPaymentCard (context: ActionContext<IState, any>) {
    return new Promise((resolve, reject) => {
      const activeBillingAccountNumber = context.getters.getActiveBillingAccountNumber

      if (!activeBillingAccountNumber) {
        reject('No Active Billing Account')
        return
      }

      api()
        .setWithCredentials()
        .setData({
          billingAccount: activeBillingAccountNumber
        })
        .query('/acquiring/card/list')
        .then((response: IPaymentCard[]) => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getInvoicePayment (context: ActionContext<IState, any>) {
    return new Promise<IInfoBillAccount>((resolve, reject) => {
      const clientId = context.rootGetters['auth/getTOMS']
      const id = context.getters.getActiveBillingAccount
      if (!clientId || !id) {
        reject('No toms ID or active account ID')
        return
      }

      api()
        .setWithCredentials()
        .setData({ clientId, id })
        .query('/billing/info-bill/index')
        .then(response => {
          context.commit('setInvoicePayment', response)
        })
        .catch(error => reject(error))
    })
  },
  newCardPayment (context: ActionContext<IState, any>, payload: { value: number, save: 0 | 1, email: string, returnUrl: string }) {
    return new Promise<INewCardPayment>((resolve, reject) => {
      const activeBillingAccountNumber = context.getters.getActiveBillingAccountNumber
      if (
        !activeBillingAccountNumber ||
        !payload.value ||
        !payload.email ||
        !payload.returnUrl
      ) {
        reject('One of the required parameters is missing')
        return
      }

      api()
        .setWithCredentials()
        .setData({
          value: payload.value,
          billingAccount: activeBillingAccountNumber,
          save: payload.save || 0,
          email: payload.email,
          returnUrl: payload.returnUrl
        })
        .query('/acquiring/card/pay')
        .then(response => { resolve(response) })
        .catch(error => reject(error))
    })
  },
  checkPaymentStatus (context: ActionContext<IState, any>, { transaction }: { transaction: string }) {
    return new Promise<IPaymentStatus>((resolve, reject) => {
      const activeBillingAccountNumber = context.getters.getActiveBillingAccountNumber
      if (!activeBillingAccountNumber || !transaction) {
        reject('One of the required parameters is missing')
        return
      }

      api()
        .setWithCredentials()
        .setData({
          billingAccount: activeBillingAccountNumber,
          transaction
        })
        .query('/acquiring/card/status')
        .then(response => { resolve(response) })
        .catch(error => reject(error))
    })
  },
  unbindCard (context: ActionContext<IState, any>, { bindingId }: { bindingId: string }) {
    return new Promise((resolve, reject) => {
      const billingAccount = context.getters.getActiveBillingAccountNumber
      if (!billingAccount || !bindingId) {
        reject('One of the required parameters is missing')
        return
      }

      api()
        .setWithCredentials()
        .setData({ billingAccount, bindingId })
        .query('/acquiring/card/unbind')
        .then(response => { resolve(response) })
        .catch(error => reject(error))
    })
  },
  activationDeactivationAutoPay (context: ActionContext<IState, any>, { bindingId, activate }: { bindingId: string, activate: 0 | 1 }) {
    return new Promise((resolve, reject) => {
      const billingAccount = context.getters.getActiveBillingAccountNumber
      if (!billingAccount || !bindingId || typeof activate === 'undefined') {
        reject('One of the required parameters is missing')
        return
      }

      api()
        .setWithCredentials()
        .setData({ billingAccount, bindingId, activate })
        .query('/acquiring/card/autopay')
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  bindCardPayment (context: ActionContext<IState, any>, payload: { bindingId: string, value: number, email: string, cvv: string, returnUrl: string }) {
    return new Promise((resolve, reject) => {
      const billingAccount = context.getters.getActiveBillingAccountNumber
      const { bindingId, value, email, cvv, returnUrl } = payload

      if (!billingAccount || !bindingId || !value || !email || !cvv || !returnUrl) {
        reject('One of the required parameters is missing')
        return
      }

      api()
        .setWithCredentials()
        .setData({ billingAccount, bindingId, value, email, cvv, returnUrl })
        .query('/acquiring/card/bindpay')
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  }
}

const mutations = {
  setListBillingAccount (state: IState, payload: IBillingAccount[]) {
    state.listBillingAccount = payload
  },
  setActiveBillingAccount (state: IState, payload: IBillingAccount) {
    state.activeBillingAccount = payload
  },
  setBillingInfo (state: IState, payload: IBillingInfo) {
    state.billingInfo = cloneDeep(payload)
  },
  setPromisedPaymentInfo (state: IState,
    [infoAboutPromisePaymentResult, canBeActivatedPromisePaymentResult]: [IBillingPromisePaymentInfo, IBillingPromisePaymentCheck]) {
    if (canBeActivatedPromisePaymentResult.paymentCanBeCreated) {
      state.isCanActivatePromisePayment = true
      return
    } else {
      state.reasonCanntActivatePromisePayment = canBeActivatedPromisePaymentResult.reason || ''
    }

    if (!infoAboutPromisePaymentResult.hasOwnProperty('promisePaymentActive')) return
    const { pymtSchdCreateDt, schdPymtDueDt } = infoAboutPromisePaymentResult.promisePaymentActive!.promisePaymentDetails[0] || {}
    if (!pymtSchdCreateDt || !schdPymtDueDt) return
    if (
      Number(new Date()) > Number(new Date(
        moment(schdPymtDueDt, 'YYYYMMDD').toISOString()
      ))
    ) return
    state.isHasPromisePayment = true
    state.promisePayStart = moment(pymtSchdCreateDt, 'YYYYMMDD')
    state.promisePayEnd = moment(schdPymtDueDt, 'YYYYMMDD').add(12, 'hours')
  },
  setPromisePaymentOrderId (state: IState, id: string) {
    state.promisePaymentOrderId = id
  },
  setInvoicePayment (state: IState, payload: IInfoBillAccount) {
    state.listInvoicePayment = [{
      id: payload.id,
      bucket: payload.bucket,
      fileName: `${payload.fileName}.pdf`,
      filePath: payload.filePath,
      type: { id: '0', name: 'Счёт на оплату' }
    }]
  },
  setCVV (state: IState, payload: string) {
    state.cvv = payload
  },
  setValidCVV (state: IState, payload: boolean) {
    state.isValidCVV = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
