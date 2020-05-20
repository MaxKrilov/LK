/* eslint no-undef: "off",  no-unused-vars: "off" */
import Vue from 'vue'
import Component from 'vue-class-component'
import DigitalSignature, { iCertificate } from '@/functions/digital_signature'
import { Watch } from 'vue-property-decorator'
import { dataURLtoFile, getFirstElement } from '@/functions/helper'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import { ATTACH_SIGNED_DOCUMENT, UPLOAD_FILE } from '@/store/actions/documents'
import { API } from '@/functions/api'
import { DocumentInterface } from '@/tbapi'
import moment from 'moment'
import { mapState } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { BREAKPOINT_MD } from '@/constants/breakpoint'
const mime = require('mime-types')

interface IDocument extends DocumentInterface {
  data: string
}

@Component({
  components: {
    ErActivationModal
  },
  props: {
    value: Boolean,
    signingDocument: Object
  },
  computed: {
    ...mapState({
      screenWidth: (state: any) => state.variables[SCREEN_WIDTH]
    })
  }
})
export default class DigitalSigningDocument extends Vue {
  $refs!: {
    // eslint-disable-next-line camelcase
    certificate_form: any
  }
  $api!: API
  readonly value!: boolean
  readonly signingDocument!: IDocument
  readonly screenWidth!: number
  /**
   * Список сертификатов
   */
  listCertificate: iCertificate[] = []
  /**
   * Флаг, отвечающий за показ модального окна со списком сертификатов
   */
  isShowListCertificateDialog: boolean = false
  /**
   * Выбранный сертификат
   */
  selectedCertificate: iCertificate | null = null
  /**
   * Флаг, отвечающий за успешное подписание документа
   */
  isSuccess: boolean = false
  /**
   * Флаг, отвечающий за ошибку во время подписания документа
   */
  isError: boolean = false
  /**
   * Данные для скачивания подписанного документа
   */
  linkDownload: string = ''
  /**
   * Текст ошибки
   */
  errorText: string = ''
  /**
   * Процесс подписания документа
   */
  isSigningDocument: boolean = false

  get internalValue () {
    return this.value
  }
  set internalValue (val: boolean) {
    this.$emit('input', val)
  }
  get getMaxWidthDialog () {
    return this.screenWidth < BREAKPOINT_MD ? undefined : 484
  }
  get fileName () {
    return this.signingDocument?.fileName
  }

  @Watch('internalValue')
  onInternalValueChange (val: boolean) {
    val && this.getListCertificate()
  }

  /**
   * Действия, совершаемые при возникновении ошибки
   * @param message
   */
  errorHandler (message: string) {
    this.internalValue = false
    this.isShowListCertificateDialog = false
    this.isSigningDocument = false
    this.errorText = message
    this.isError = true
  }

  /**
   * Получение списка сертификатов
   */
  getListCertificate () {
    cadesplugin
      .then(() => {
        DigitalSignature
          .getCertificatesList(cadesplugin as CADESPluginAsync)
          .then((response: iCertificate[]) => {
            this.listCertificate = response
            this.isShowListCertificateDialog = true
            // Хотя бы один сертификат есть, так как при их отсутствии выбрасывается исключение
            this.selectedCertificate = getFirstElement(this.listCertificate)
          })
          .catch(error => this.errorHandler(error.message as string))
      })
      .catch(() => {
        this.errorHandler(
          `Плагин недоступен или не установлен! 
            Убедитесь в правильности работы плагина или <a href="https://www.cryptopro.ru/" target="_blank">установите</a> его`
        )
      })
  }

  /**
   * Подписание документа
   */
  async signDocument () {
    if (!this.$refs.certificate_form.validate()) return
    this.isSigningDocument = true
    const visibleSignature = DigitalSignature.createVisibleSignature('Пушистый котик', this.selectedCertificate as iCertificate)
    let _signDocument
    const header = ';base64,'
    const data = this.signingDocument.data.substr(this.signingDocument.data.indexOf(header) + header.length)
    try {
      _signDocument = await DigitalSignature
        .signDocument(cadesplugin, data, this.selectedCertificate as iCertificate, visibleSignature)
    } catch (error) {
      this.errorHandler(error.message)
      return false
    }
    const _binaryFile = dataURLtoFile(_signDocument, this.signingDocument.fileName)
    const _filePath = `${moment().format('MMYYYY')}/${this.signingDocument.id}`
    // Загрузка файла в хранилище
    const _resultUploadedFile = await this.$store.dispatch(`documents/${UPLOAD_FILE}`, {
      api: this.$api,
      file: _binaryFile,
      bucket: this.signingDocument.bucket,
      filePath: _filePath
    })
    if (!_resultUploadedFile) {
      this.errorHandler('Ошибка при отправке файла в хранилище')
      return false
    }
    // Прикрепляем вложение
    await this.$store.dispatch(`documents/${ATTACH_SIGNED_DOCUMENT}`, {
      api: this.$api,
      id: this.signingDocument.id,
      fileName: this.signingDocument.fileName,
      relatedTo: this.signingDocument.relatedTo.id,
      type: this.signingDocument.type.id,
      filePath: _filePath
    })
    // if (!_attachResult) {
    //   this.errorHandler('Ошибка при прикреплении файла в системе')
    //   return false
    // }
    if (this.signingDocument?.letterOfGuarantee?.toLowerCase() === 'yes') {
      this.internalValue = false
      this.isSigningDocument = false
      this.linkDownload = `data:${mime.lookup(this.signingDocument.fileName)};base64,${_signDocument}`
      this.isShowListCertificateDialog = false
      this.isSuccess = true
      this.$emit('success')
      return
    }
    // Смена статуса
    const _changeStatusResult = await this.$store.dispatch(`fileinfo/changeContractStatus`, {
      api: this.$api,
      contractId: this.signingDocument.relatedTo.id,
      status: 1
    })
    if (!_changeStatusResult || _changeStatusResult.submit_statuses) {
      this.errorHandler('Ошибка при прикреплении файла в системе')
      return false
    }
    if (['success', 'not_executed'].includes(_changeStatusResult.submit_statuses.submitStatus.toLowerCase())) {
      this.internalValue = false
      this.isSigningDocument = false
      this.linkDownload = `data:${mime.lookup(this.signingDocument.fileName)};base64,${_signDocument}`
      this.isShowListCertificateDialog = false
      this.isSuccess = true
      this.$emit('success')
    } else {
      this.errorHandler(_changeStatusResult.submit_statuses.submitError)
    }
  }
}
