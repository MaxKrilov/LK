import { CyrName } from '../../../../../../../../functions/declination'
import Validators from '@/mixins/ValidatorsMixin'
import Responsive from '@/mixins/ResponsiveMixin'

const ALLOWED_FILE_EXT = ['doc', 'docx', 'pdf', 'csv', 'xls', 'xslx', 'jpeg', 'gif', 'png', 'tiff', 'bmp']

export default {
  name: 'lpr-form',
  mixins: [ Validators, Responsive ],
  props: {
    value: { type: null }
  },
  data: () => ({
    pre: 'lpr-form',
    isMounted: false,
    isFileLoaded: false,
    isFileValid: false,
    cyrNameObj: {},
    fileInputLabel: 'Загрузить скан документа',
    errorFileText: ''
  }),
  computed: {
    docsLabel () {
      if (!this.isMounted) {
        return
      }
      return this.$refs.docsRef.hasFocus || this.value.confirmationDocName ? 'Подтверждающий документ' : 'На основании документа'
    }
  },
  methods: {
    fileTypeValid (filename, allowedExt = ALLOWED_FILE_EXT) {
      const FILE_EXT = filename.split('.').pop().toLowerCase()
      return allowedExt.includes(FILE_EXT)
    },
    handleFileInput (res) {
      const INPUT_DATA = this.$refs.fileInput.file
      if (INPUT_DATA) {
        this.value.file = res
        this.value.fileName = INPUT_DATA.name
        const fileSizeValid = INPUT_DATA.size <= 2097152
        const fileTypeValid = this.fileTypeValid(this.value.fileName)
        if (!fileSizeValid) {
          this.errorFileText = 'Максималный размер файла: 2 МБ'
        } else if (!fileTypeValid) {
          this.errorFileText = 'Допустимый формат файла: .doc, .docx, .pdf, .csv, .xls, .xslx, .jpeg, .jpg, .gif, .png, .tiff, .bmp'
        }
        this.isFileValid = fileSizeValid && fileTypeValid
        this.isFileLoaded = !!res
      } else {
        this.isFileValid = false
        this.isFileLoaded = false
      }
    },
    onBlurFIO () {
      if (this.value.surname !== '' && this.value.name !== '' && this.value.patronymic !== '') {
        const gFio = this.cyrNameObj.Decline(
          this.value.surname,
          this.value.name,
          this.value.patronymic,
          2
        )
        const gFioParse = gFio.split(' ')
        if (gFioParse?.length === 3) {
          this.value.gSurname = gFioParse[0]
          this.value.gName = gFioParse[1]
          this.value.gPatronymic = gFioParse[2]
        }
      }
    },
    onBlurName () {
      if (this.value.name !== '') {
        const gFio = this.cyrNameObj.Decline(
          '',
          this.value.name,
          '',
          2
        )
        const gFioParse = gFio.split(' ')
        this.value.gName = gFioParse[0]
      }
    },
    onBlurSurname () {
      if (this.value.surname !== '') {
        const gFio = this.cyrNameObj.Decline(
          this.value.surname,
          '',
          '',
          2
        )
        const gFioParse = gFio.split(' ')
        this.value.gSurname = gFioParse[0]
      }
    },
    onBlurPatronymic () {
      if (this.value.patronymic !== '') {
        const gFio = this.cyrNameObj.Decline(
          '',
          '',
          this.value.patronymic,
          2
        )
        const gFioParse = gFio.split(' ')
        this.value.gPatronymic = gFioParse[0]
      }
    }
  },
  mounted () {
    this.isMounted = true
    this.cyrNameObj = new CyrName()
    this.value.phoneFrom = '09:00'
    this.value.phoneTo = '18:00'
  }
}
