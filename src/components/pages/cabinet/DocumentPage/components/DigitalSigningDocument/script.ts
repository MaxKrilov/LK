/* eslint no-undef: "off",  no-unused-vars: "off" */
import Vue from 'vue'
import Component from 'vue-class-component'
import DigitalSignature, { iCertificate } from '@/functions/digital_signature'
import { Watch } from 'vue-property-decorator'
import { dataURLtoFile, getFirstElement } from '@/functions/helper'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import File from '@/functions/file'
import { ATTACH_SIGNED_DOCUMENT, CHANGE_CONTRACT_STATUS, UPLOAD_FILE } from '@/store/actions/documents'
import { API } from '@/functions/api'
import { DocumentInterface } from '@/tbapi'
import moment from 'moment'
import { mapState } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { BREAKPOINT_MD } from '@/constants/breakpoint'
const mime = require('mime-types')

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
  readonly signingDocument!: DocumentInterface
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
    if (!cadesplugin) return
    DigitalSignature
      .getCertificatesList(cadesplugin as CADESPluginAsync)
      .then((response: iCertificate[]) => {
        this.listCertificate = response
        this.isShowListCertificateDialog = true
        // Хотя бы один сертификат есть, так как при их отсутствии выбрасывается исключение
        this.selectedCertificate = getFirstElement(this.listCertificate)
      })
      .catch(error => this.errorHandler(error.message as string))
  }

  /**
   * Подписание документа
   */
  async signDocument () {
    if (!this.$refs.certificate_form.validate()) return
    this.isSigningDocument = true
    File.getFileByUrl(this.signingDocument.link, async (base64Data: string) => {
      const visibleSignature = DigitalSignature.createVisibleSignature('Пушистый котик', this.selectedCertificate as iCertificate)
      let _signDocument
      try {
        _signDocument = await DigitalSignature
          .signDocument(cadesplugin, base64Data, this.selectedCertificate as iCertificate, visibleSignature)
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
      const _attachResult = await this.$store.dispatch(`documents/${ATTACH_SIGNED_DOCUMENT}`, {
        api: this.$api,
        id: this.signingDocument.id,
        fileName: this.signingDocument.fileName,
        relatedTo: this.signingDocument.relatedTo.id,
        type: this.signingDocument.type.id,
        filePath: _filePath
      })
      if (!_attachResult) {
        this.errorHandler('Ошибка при прикреплении файла в системе')
        return false
      }
      // Смена статуса
      const _changeStatusResult = await this.$store.dispatch(`documents/${CHANGE_CONTRACT_STATUS}`, {
        api: this.$api,
        contractId: this.signingDocument.relatedTo.id,
        status: 1
      })
      if (_changeStatusResult) {
        this.internalValue = false
        this.isSigningDocument = false
        this.linkDownload = `data:${mime.lookup(this.signingDocument.fileName)};base64,${_signDocument}`
        this.isShowListCertificateDialog = false
        this.isSuccess = true
        this.$emit('success')
      } else {
        this.errorHandler('Ошибка при прикреплении файла в системе')
        return false
      }
    }, e => { this.errorHandler(e.message) })
  }
}
