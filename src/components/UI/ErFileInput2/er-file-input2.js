const DEFAULT_MAX_FILE_SIZE = 4 * 1024 * 1024
export default {
  name: 'er-file-input2',
  data: () => ({
    pre: 'er-file-input2',
    file: null,
    percent: 0,
    error: ''
  }),
  props: {
    id: {
      type: String,
      default: function () {
        return `er-file-input__${this._uid}`
      }
    },
    allowedExt: {
      type: Array,
      default: () => []
    },
    allowedSize: {
      type: Number,
      default: DEFAULT_MAX_FILE_SIZE
    },
    label: {
      type: String,
      default: 'Выберите файл'
    },
    value: null,
    isFileLoaded: false
  },
  computed: {
    fileName () {
      return this.file?.name || ''
    }
  },
  methods: {
    onChange (e) {
      this.error = ''
      this.file = e.target.files?.[0]
      if (this.file) {
        if (this.validateFile(this.file)) {
          this.convertToBase64(this.file)
            .then(result => {
              this.$emit('input', result, this.file.name, this.uploadCallback)
            })
        } else {
          this.$emit('input', null, null, this.uploadCallback)
        }
      }
    },
    uploadCallback (data) {
      if (data?.loaded && data?.total) {
        this.percent = data?.loaded / data.total * 100
      }
    },
    validateFile (data) {
      if (data.size >= this.allowedSize) {
        this.error = 'Размер файла превышает допустимый'
        return false
      }

      if (this.allowedExt.length) {
        const fileExt = (data.name).split('.').pop().toLowerCase()
        if (!this.allowedExt.includes(fileExt)) {
          this.error = 'Недопустимый формат файла'
          return false
        }
      }

      return true
    },
    convertToBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },
    cancelDocument () {
      this.$refs[this.id].value = null
      this.file = null
      this.error = ''
      this.$emit('input', null)
    }
  }
}
