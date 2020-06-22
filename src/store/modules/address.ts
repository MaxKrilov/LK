import { ActionContext } from 'vuex'
import { API } from '@/functions/api'
import { AxiosError } from 'axios'
import { TYPE_JSON } from '@/constants/type_request'

const api = () => new API()

const actions = {
  getAddressByFiasId (context: ActionContext<any, never>, payload: { fiasId: string }) {
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({
          fiasId: payload.fiasId
        })
        .query('/address/unit/fias')
        .then((response) => resolve(response))
        .catch((err: AxiosError) => reject(err))
    })
  },
  getAddressUnit (context: ActionContext<any, never>, payload: { ids: string | string[] }) {
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData(payload)
        .setType(TYPE_JSON)
        .query('/address/unit/get')
        .then(answer => resolve(answer))
        .catch((err: AxiosError) => reject(err))
    })
  }

}

export default {
  namespaced: true,
  actions
}
