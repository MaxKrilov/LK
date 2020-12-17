import { ActionContext } from 'vuex'
import { API } from '@/functions/api'
import { AxiosError } from 'axios'
import { TYPE_ARRAY } from '@/constants/type_request'
import { ITVPacketRequest, ITVPacketPage, ITVChannel } from '@/components/pages/tv/tv.d.ts'

interface IState {}

const state: IState = {}

const getters = {}

const actions = {

  /**
   * Получение пакетов по ТВ
   */
  packs (context: ActionContext<IState, any>, payload: { api: API }) {
    const { toms: clientId } = context.rootGetters['auth/user']
    const data: any = {
      clientId
    }
    return new Promise<ITVPacketPage[]>((resolve, reject) => {
      payload.api
        .setWithCredentials()
        .setData(data)
        .setType(TYPE_ARRAY)
        .query('/catalog/tv/packs')
        .then((response) => {
          if (response?.error) {
            reject(response.error)
          } else {
            const data :ITVPacketPage[] = response.map((el:ITVPacketRequest) => {
              return {
                id: el?.id,
                title: el?.title,
                price: el?.price,
                description: el?.description,
                ncId: el?.nc_id,
                icon: el?.icon_file,
                count: el?.count,
                background: el?.background,
                background2: el?.background2,
                backgroundMobile: el?.background_mobile,
                productCode: el?.productCode,
                created: el?.created_at,
                updated: el?.updated_at
              }
            })
            resolve(data)
          }
        })
        .catch((err: AxiosError) => reject(err))
    })
  },
  /**
   * Получение списка каналов по ID пакета
   */
  channels (context: ActionContext<IState, any>, payload: { api: API, id:string }) {
    const data: any = {
      packId: payload.id
    }
    return new Promise<ITVChannel[]>((resolve, reject) => {
      payload.api
        .setData(data)
        .setType(TYPE_ARRAY)
        .query('/catalog/tv/pack')
        .then((response: ITVChannel[]) => {
          resolve(response)
        })
        .catch((err: AxiosError) => reject(err))
    })
  }
}

const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
