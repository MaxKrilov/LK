import { ATTACH_SIGNED_DOCUMENT, DOWNLOAD_FILE, UPLOAD_FILE, CHANGE_CONTRACT_STATUS } from '../actions/documents'
import { TYPE_FILE } from '../../constants/type_request'

const actions = {
  [DOWNLOAD_FILE]: async (_, { vm, bucket, key }) => {
    try {
      // В случае успеха возвращаем ссылку на документ
      return await vm.$api
        .setWithCredentials()
        .setData({
          bucket,
          key
        })
        .query('/docs/s3/get')
    } catch (e) {
      return false
    }
  },
  [UPLOAD_FILE]: async (_, { api, bucket, file, filePath, uploadCallback }) => {
    try {
      if (uploadCallback) {
        await api
          .setWithCredentials()
          .setType(TYPE_FILE)
          .setUploadCallback(uploadCallback)
          .setData({
            bucket,
            file,
            key: filePath
          })
          .query('/docs/s3/set')
      } else {
        await api
          .setWithCredentials()
          .setType(TYPE_FILE)
          .setData({
            bucket,
            file,
            key: filePath
          })
          .query('/docs/s3/set')
      }
      return true
    } catch (e) {
      return false
    }
  },
  [ATTACH_SIGNED_DOCUMENT]: async ({ rootGetters }, { api, fileName, bucket, relatedTo, filePath, type }) => {
    bucket = bucket || 'customer-docs'
    filePath = filePath || '/'
    const { toms: clientId } = rootGetters['auth/user']
    try {
      await api
        .setWithCredentials()
        .setData({
          clientId,
          fileName,
          bucket,
          relatedTo,
          filePath,
          type
        })
        .query('/customer/management/addfile')
      return true
    } catch (e) {
      return false
    }
  },
  [CHANGE_CONTRACT_STATUS]: async ({ rootGetters }, { api, contractId, status }) => {
    const { toms: clientId } = rootGetters['auth/user']
    try {
      await api
        .setWithCredentials()
        .setData({
          clientId,
          contractId,
          status
        })
        .query('/order/contract/edit')
      return true
    } catch (e) {
      return false
    }
  }
}

export default {
  namespaced: true,
  actions
}
