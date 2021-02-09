import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import CompanyForm from '../../components/CompanyForm'
import LprForm from '../../components/LprForm'
import { GET_CLIENT_INFO, GET_COMPANY_INFO, UPDATE_CLIENT_INFO } from '../../../../../../../../store/actions/user'
import { UPLOAD_FILE, ATTACH_SIGNED_DOCUMENT } from '../../../../../../../../store/actions/documents'
import { validateINN } from '../../../../../../../../functions/helper'

const FILE_DATA_TYPE = '9154452676313182650'
const FILE_DATA_BUCKET = 'customer-docs'

export default {
  name: 'edit-company-form',
  components: {
    CompanyForm,
    LprForm
  },
  data: () => ({
    pre: 'edit-company-form',
    editableCompanyClientObject: {},
    editableSignContactObject: {},
    isSuccess: false,
    somethingWrong: false
  }),
  methods: {
    ...mapActions('user', [GET_CLIENT_INFO, GET_COMPANY_INFO, UPDATE_CLIENT_INFO]),
    ...mapActions('contacts', ['createSignContact', 'createContactRole']),
    ...mapActions('accounts', ['createCompanyClient']),
    async handleResetInn () {
      if (validateINN(this.editableCompanyClientObject.inn)) {
        const response = await this[GET_COMPANY_INFO]({ api: this.$api, inn: this.editableCompanyClientObject.inn })
        if (response) {
          this.editableCompanyClientObject = { ...this.getFnsClientInfo }
        } else {
          this.editableCompanyClientObject = {}
        }
      }
    },
    async validateCompanyForm () {
      this.somethingWrong = false
      this.isSuccess = (this.$refs.companyForm.validate() && this.$refs.lprForm.isFileValid)
      if (this.isSuccess) {
        const [serialNumber, number] = this.editableCompanyClientObject.idSerialNumber.split('-')
        this.editableCompanyClientObject.idSerialNumber = serialNumber
        this.editableCompanyClientObject.idNumber = number
        const responseClient = await this[UPDATE_CLIENT_INFO]({ api: this.$api, formData: this.editableCompanyClientObject })
        if (!responseClient) {
          this.somethingWrong = true
          return
        }

        const responseContact = await this.createSignContact({ api: this.$api, data: this.editableSignContactObject })
        if (!responseContact) {
          this.somethingWrong = true
          return
        }

        const responseContactRole = await this.createContactRole({ api: this.$api })
        if (!responseContactRole) {
          this.somethingWrong = true
          return
        }

        const fileBlob = await (await fetch(this.editableSignContactObject.file)).blob()
        const filePath = moment.utc().format('YYYY-MM-DD_HH:mm') + '/' + this.user.toms
        const fileData = {
          api: this.$api,
          bucket: FILE_DATA_BUCKET,
          file: fileBlob,
          fileName: this.editableSignContactObject.fileName,
          filePath,
          type: FILE_DATA_TYPE,
          relatedTo: this.user.toms
        }
        const sendFile = await this.$store.dispatch('documents/' + UPLOAD_FILE, fileData)
        if (!sendFile) {
          this.somethingWrong = true
          return
        }

        const connectFileToClient = await this.$store.dispatch('documents/' + ATTACH_SIGNED_DOCUMENT, fileData)
        if (!connectFileToClient) {
          this.somethingWrong = true
          return
        }

        this[GET_CLIENT_INFO]({ api: this.$api })
        this.$router.push({ name: 'company-success' })
      } else {
        this.$refs.lprForm.fileInputLabel = 'Скан не загружен'
      }
    }
  },
  computed: {
    hasNoData () {
      return !this.getFnsClientInfo?.inn && !this.getFnsClientInfo?.kpp && !this.getFnsClientInfo?.legalAddress && !this.getFnsClientInfo?.name
    },

    ...mapGetters('user', ['getFnsClientInfo']),
    ...mapGetters('auth', ['user'])
  },
  mounted () {
    if (!this.getFnsClientInfo?.inn) {
      this.$router.push({ name: 'company-inn' })
    }
    this.editableCompanyClientObject = { ...this.getFnsClientInfo }
  },
  updated () {
    if (!this.getFnsClientInfo?.inn) {
      this.$router.push({ name: 'company-inn' })
    }
  }
}
