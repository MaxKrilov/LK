import { API } from '@/functions/api'
import { AxiosError } from 'axios'
import { ActionContext } from 'vuex'

const api = () => new API()

const actions = {
  getInstructions () {
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({
        })
        .query('/instructions/info/list')
        .then((response) => resolve(response))
        .catch((err: AxiosError) => reject(err))
    })
  },

  getSearchResultOfInstructions (context: ActionContext<any, any>, name: string) {
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({
          name
        })
        .query('/instructions/info/live-search')
        .then((response) => resolve(response))
        .catch((err: AxiosError) => reject(err))
    })
  },

  getInstructionInfoById (context: ActionContext<any, any>, id: string) {
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({
          id
        })
        .query('/instructions/info/content')
        .then((response) => resolve(response))
        .catch((err: AxiosError) => reject(err))
    })
  }

}

export default {
  namespaced: true,
  actions
}
