import { API } from '@/functions/api.ts'
import { ActionContext } from 'vuex'
import { IBranch } from '@/interfaces/branch'

const Api = new API()
// mutation
const SET_BRANCH_LOCATION = 'SET_BRANCH_LOCATION'

interface IState {
  id: string
  inn: string
  address: string
  kpp: string
  name: string
  phone: string[]
  companyId: string
  serviceDepartment: string
}

const state: IState = {
  id: '',
  inn: '',
  address: '',
  kpp: '',
  name: '',
  phone: [],
  companyId: '',
  serviceDepartment: ''
}

const actions = {
  pullBranchLocation: ({ commit }: ActionContext<undefined, any>, branchId: string) => {
    // Получение и сохранение адреса филиала
    return Api
      .setData({ branchId })
      .query('/billing/branch/index')
      .then((data: IBranch) => {
        commit(SET_BRANCH_LOCATION, data)
      })
  }
}

const mutations = {
  [SET_BRANCH_LOCATION] (state: IState, payload: IBranch) {
    state.id = payload.branchId
    state.inn = payload.branchInn
    state.kpp = payload.branchKpp
    state.address = payload.branchAddress
    state.name = payload.branchName
    state.phone = payload.branchPhone
    state.companyId = payload.companyId
    state.serviceDepartment = payload.serviceDepartment
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
