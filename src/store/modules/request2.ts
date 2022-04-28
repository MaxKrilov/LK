import { ActionContext } from 'vuex'

import { API } from '@/functions/api'

import * as CN from '@/constants/closed_notification'
import { TYPE_ARRAY } from '@/constants/type_request'

const api = () => new API()

const CHANNEL_OF_NOTIFICATION_VIBER = '9130635331813922067'

const actions = {
  createClosedRequest (context: ActionContext<undefined, any>, typeClosedNotification: CN.typeClosedNotification) {
    const { toms: clientId } = context.rootGetters['auth/user']
    const listAddress = context.rootGetters['user/getAddressList']
    const listContact = context.rootGetters['user/getListContact']

    const {
      channel,
      category,
      type,
      classification_level_one: classificationLevelOne,
      classification_level_two: classificationLevelTwo,
      classification_level_three: classificationLevelThree,
      description
    } = CN[typeClosedNotification]

    const data: Record<string, any> = {}

    data.clientId = clientId
    data.customerAccount = clientId
    data.location = listAddress[0]?.id || ''
    data.channelOfNotification = CHANNEL_OF_NOTIFICATION_VIBER
    data.customerContact = listContact[0]?.id
    data.category = category
    data.type = type
    data.channel = channel
    data.classificationLevelOne = classificationLevelOne
    data.classificationLevelTwo = classificationLevelTwo
    data.classificationLevelThree = classificationLevelThree
    data.description = description
    data.requestName = 'request'
    data.phoneNumber = listContact.find((contact: any) => 'phone' in contact)?.phone?.id || ''

    return new Promise<string | boolean>(async (resolve) => {
      try {
        const response = await api()
          .setWithCredentials()
          .setType(TYPE_ARRAY)
          .setData(data)
          .query('/problem/management/create')

        if ('ticket_id' in response) {
          resolve(response.ticket_id)
        } else {
          resolve(false)
        }
      } catch (ex) {
        resolve(false)
      }
    })
  },
  createOpenedRequest (context: ActionContext<undefined, any>, typeClosedNotification: CN.typeClosedNotification) {
    const { toms: clientId } = context.rootGetters['auth/user']
    const listAddress = context.rootGetters['user/getAddressList']
    const listContact = context.rootGetters['user/getListContact']

    const {
      category,
      type,
      description2
    } = CN[typeClosedNotification]

    const data: Record<string, any> = {}

    data.clientId = clientId
    data.customerAccount = clientId
    data.location = listAddress[0]?.id || ''
    data.channelOfNotification = CHANNEL_OF_NOTIFICATION_VIBER
    data.customerContact = listContact[0]?.id
    data.category = category
    data.type = type
    data.description = description2
    data.requestName = 'request'
    data.phoneNumber = listContact.find((contact: any) => 'phone' in contact)?.phone?.id || ''

    return new Promise<string | boolean>(async (resolve) => {
      try {
        const response = await api()
          .setWithCredentials()
          .setType(TYPE_ARRAY)
          .setData(data)
          .query('/problem/management/create')

        if ('ticket_id' in response) {
          resolve(response.ticket_id)
        } else {
          resolve(false)
        }
      } catch (ex) {
        resolve(false)
      }
    })
  }
}

export default {
  namespaced: true,
  actions
}
