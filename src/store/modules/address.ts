import { ActionContext } from 'vuex'
import { API } from '@/functions/api'
import { AxiosError } from 'axios'

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
  }
}

export default {
  namespaced: true,
  actions
}
