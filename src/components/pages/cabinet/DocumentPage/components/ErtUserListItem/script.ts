import Vue from 'vue'
import Component from 'vue-class-component'

import ErtActivationModal from '@/components/blocks2/ErtActivationModal/index.vue'

import { mapActions, mapGetters } from 'vuex'

import moment from 'moment'
import { last } from 'lodash'

import { ATTACH_SIGNED_DOCUMENT } from '@/store/actions/documents'
import { API } from '@/functions/api'
import { USER_LIST_TYPE } from '@/constants/document'

const USER_LIST_EXPARIED_DAYS = 1000 * 3600 * 24 * 90

// http://base.garant.ru/12155536/

@Component<InstanceType<typeof ErtUserListItem>>({
  components: {
    ErtActivationModal
  },
  computed: {
    ...mapGetters({
      userListLoadingDate: 'user/getUserListLoadingDate',
      tomsID: 'auth/getTOMS'
    })
  },
  methods: {
    ...mapActions({
      uploadFile: 'fileinfo/uploadFile',
      attachSignedDocument: `documents/${ATTACH_SIGNED_DOCUMENT}`,
      updateClientInfo: 'user/updateClientInfo',
      getClientInfo: 'user/GET_CLIENT_INFO'
    })
  }
})
export default class ErtUserListItem extends Vue {
  /// Data
  isShowDialogUploadFile: boolean = false
  isUpdatingFileUserList: boolean = false
  isUpdatedSuccess: boolean = false
  isUpdatedError: boolean = false

  fileUserList: File | null = null

  errorFileText: string = ''

  /// Vuex getters
  readonly userListLoadingDate!: string | undefined

  readonly tomsID!: string

  /// Computed
  get isUpdated () {
    return typeof this.userListLoadingDate === 'string'
      ? Number(moment().format('x')) - Number(moment(this.userListLoadingDate, 'DD.MM.YYYY')) < USER_LIST_EXPARIED_DAYS
      : false
  }

  get descriptionText () {
    return this.isUpdated
      ? `Обновлён ${this.userListLoadingDate}`
      : 'Необходимо обновить'
  }

  get templatePath () {
    return `${process.env.BASE_URL}documents/template-user-list.csv`
  }

  get issetFile () {
    return this.fileUserList != null
  }

  get fileName () {
    return this.fileUserList && this.fileUserList.name
  }

  /// Vuex actions
  readonly uploadFile!: (payload: {
    bucket: string
    fileName: string
    file: File
    filePath: string
    api: API
  }) => Promise<boolean>

  readonly attachSignedDocument!: (payload: {
    fileName: string
    filePath: string
    api: API
    id?: string
    type: string
    relatedTo: string
  }) => Promise<void>

  readonly updateClientInfo!: (payload: {
    dateOfLoadingUL: string,
    api: API
  }) => Promise<void>

  readonly getClientInfo!: (payload: {
    api: API
  }) => Promise<void>

  /// Methods
  onAddFileHandler () {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.doc, .docx, .pdf, .csv, .xls, .xslx, .jpeg, .jpg, .gif, .png, .tiff, .bmp'

    input.onchange = (e: Event) => {
      const __file = (e.target as HTMLInputElement).files?.[0]

      if (!__file) return

      if (
        !['doc', 'docx', 'pdf', 'csv', 'xls', 'xslx', 'jpeg', 'jpg', 'gif', 'png', 'tiff', 'bmp']
          .includes(last(__file.name.split('.'))!)
      ) {
        this.errorFileText = 'Некорректный формат файла'
        return
      }

      if (__file.size > 2 * 1024 * 1024) {
        this.errorFileText = 'Файл весит более 2 МБ'
        return
      }

      this.errorFileText = ''
      this.fileUserList = __file
    }

    input.click()
  }

  onRemoveFile () {
    this.fileUserList = null
  }

  async onConfirmHandler () {
    if (!this.issetFile || this.errorFileText) return

    this.isUpdatingFileUserList = true

    try {
      const filePath = `${moment().format('MMYYYY')}/${this.tomsID}`

      const uploadFileResponse = await this.uploadFile({
        api: this.$api,
        bucket: 'customer-docs',
        file: this.fileUserList!,
        fileName: this.fileUserList!.name,
        filePath
      })

      if (!uploadFileResponse) {
        this.isUpdatedError = true
        return
      }

      await this.attachSignedDocument({
        fileName: this.fileUserList!.name,
        filePath,
        api: this.$api,
        type: USER_LIST_TYPE,
        relatedTo: this.tomsID
      })

      await this.updateClientInfo({
        api: this.$api,
        dateOfLoadingUL: moment().format('DD.MM.YYYY')
      })

      try {
        await this.getClientInfo({ api: this.$api })
        this.isUpdatedSuccess = true
      } catch (ex) {
        console.error(ex)
      }
    } catch (ex) {
      this.isUpdatedError = true
      console.error(ex)
    } finally {
      this.isShowDialogUploadFile = false
      this.isUpdatingFileUserList = false
    }
  }
}
