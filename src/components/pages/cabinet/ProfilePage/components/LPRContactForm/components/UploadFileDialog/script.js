import { mapGetters } from 'vuex'
import { ATTACH_SIGNED_DOCUMENT, UPLOAD_FILE } from '@/store/actions/documents'
import { formatBytes, generateFilePath } from '@/functions/helper'

const ALLOWED_FILE_EXT = ['doc', 'docx', 'pdf', 'csv', 'xls', 'xslx', 'jpeg', 'gif', 'png', 'tiff', 'bmp']
const ALLOWED_FILE_SIZE = 2097152
const FILE_DATA_TYPE = '9154452676313182650'
const FILE_DATA_BUCKET = 'customer-docs'

export default {
  name: 'upload-file-dialog',
  data: () => ({
    pre: 'upload-file-dialog',
    isFileLoaded: false,
    isFileValid: false,
    fileInputLabel: 'Загрузить скан документа',
    value: {},
    checkFileError: {
      size: 'Файл не загружен. Превышен максимальный размер файла 2 Мб',
      type: 'Файл не загружен. Недопустимый формат файла.',
      current: null
    },
    fileSaveState: {
      add: false,
      save: false,
      progressAdd: false,
      progressSave: false,
      error: false
    },
    fileData: {}
  }),
  computed: {
    ...mapGetters('auth', ['getTOMS'])
  },
  methods: {
    closeUploadDialog () {
      const state = this.fileSaveState.save ? 'ok' : 'cancel'
      this.$emit('closeUploadDialog', state)
      this.resetState()
    },
    validateFile (data) {
      let result = true

      result = data.size >= ALLOWED_FILE_SIZE
      if (result) {
        this.checkFileError.current = this.checkFileError.size
        return !result
      }

      const fileExt = (data.name).split('.').pop().toLowerCase()
      result = ALLOWED_FILE_EXT.includes(fileExt)
      if (!result) {
        this.checkFileError.current = this.checkFileError.type
        return result
      }

      this.checkFileError.current = null
      return result
    },
    handleFileInput (res) {
      const INPUT_DATA = this.$refs.fileInput.file
      if (INPUT_DATA) {
        this.value.file = res
        this.value.fileName = INPUT_DATA.name
        this.value.size = formatBytes(INPUT_DATA.size)
        this.isFileValid = this.validateFile(INPUT_DATA)
        this.isFileLoaded = !!res
      } else {
        this.resetState()
      }
    },
    async addFile () {
      const fileBlob = await (await fetch(this.value.file)).blob()
      const filePath = generateFilePath(this.getTOMS)
      this.fileData = {
        api: this.$api,
        bucket: FILE_DATA_BUCKET,
        file: fileBlob,
        fileName: this.value.fileName,
        filePath,
        type: FILE_DATA_TYPE,
        relatedTo: this.getTOMS
      }

      try {
        this.fileSaveState.progressAdd = true
        const sendFile = await this.$store.dispatch('documents/' + UPLOAD_FILE, this.fileData)
        this.fileSaveState.error = !sendFile
        if (sendFile) {
          this.fileSaveState.add = true
          this.fileSaveState.progressAdd = false
        }
      } catch (e) {
        this.fileSaveState.error = true
        this.fileSaveState.progressAdd = false
      }
    },
    async saveFile () {
      try {
        this.fileSaveState.progressSave = true
        const connectFileToClient = await this.$store.dispatch('documents/' + ATTACH_SIGNED_DOCUMENT, this.fileData)
        this.fileSaveState.error = !connectFileToClient
        if (connectFileToClient) {
          this.fileSaveState.save = true
          setTimeout(() => {
            this.closeUploadDialog('ok')
          }, 1500)
        }
      } catch (e) {
        this.fileSaveState.error = true
        this.fileSaveState.progressSave = false
      }
    },
    repeatSaveFile () {
      this.fileSaveState.error = false
    },
    resetState () {
      // не могу вызвать cancelDocument т.к. приводит к рекурсии
      // а file очищать надо
      this.$refs.fileInput.file = null
      this.isFileValid = false
      this.isFileLoaded = false
      this.checkFileError.current = null
      this.fileSaveState = {
        add: false,
        save: false,
        error: false
      }
      this.value = {}
    }
  }
}
