import { ActionContext } from 'vuex'
import { API } from '@/functions/api'
import { AxiosError } from 'axios'
import { TYPE_JSON } from '@/constants/type_request'
import { GET_ORGANISATION_INFO } from '@/store/actions/address'
import { IAddressUnitByFias, IOrganisationInfo } from '@/tbapi/address'

const api = () => new API()

const actions = {
  getAddressByFiasId (context: ActionContext<undefined, any>, payload: { fiasId: string }) {
    return new Promise<IAddressUnitByFias>((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({
          fiasId: payload.fiasId
        })
        .query('/address/unit/fias')
        .then((response: IAddressUnitByFias) => resolve(response))
        .catch((err: AxiosError) => reject(err))
    })
  },
  getAddressUnit (context: ActionContext<undefined, any>, payload: { ids: string | string[] }) {
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData(payload)
        .setType(TYPE_JSON)
        .query('/address/unit/get')
        .then(answer => resolve(answer))
        .catch((err: AxiosError) => reject(err))
    })
  },
  [GET_ORGANISATION_INFO] (
    context: ActionContext<undefined, any>,
    payload: { inn: string }
  ) {
    return new Promise<IOrganisationInfo>((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({ inn: payload.inn })
        .query('/customer/account/get-organization-info')
        .then((response: IOrganisationInfo) => { resolve(response) })
        .catch(error => reject(error))
    })
  }
}

export default {
  namespaced: true,
  actions
}
