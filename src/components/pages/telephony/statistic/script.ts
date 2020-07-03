import { Vue, Component } from 'vue-property-decorator'
import PhoneStatistic from './components/PhoneStatistic/index.vue'
import PhoneFolder from './components/PhoneFolder/index.vue'
import ErListPoints from '@/components/blocks/ErListPoints/index.vue'
import { iPointItem } from '@/components/blocks/ErListPoints/script'
import { DocumentInterface, ICustomerProduct } from '@/tbapi'
import { getFirstElement } from '@/functions/helper'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import { mapState } from 'vuex'
import FileComponent from './components/FileComponent/index.vue'
import { Cookie } from '@/functions/storage'

const components = {
  PhoneFolder,
  PhoneStatistic,
  ErListPoints,
  ErActivationModal,
  FileComponent
}

const PHONE_NUMBER_CHAR = 'Номер телефона'

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof TelephonyStatisticPage>>({
  components,
  props: {
    listPhoneNumbers: {
      type: Object,
      default: () => ({})
    },
    listPoint: {
      type: Array,
      default: () => ([])
    },
    isLoadingPoints: Boolean,
    isLoadingProducts: Boolean
  },
  watch: {
    listPoint (val) {
      val.length > 0 && (this.currentPoint = getFirstElement(val))
    },
    currentPoint (val) {
      this.$emit('change-point', val)
    },
    listPhone (val) {
      val.length !== 0 &&
      (this.currentPhone = val[0] || null)
    }
  },
  computed: {
    ...mapState({
      listFile: (state: any) => state.fileinfo.listOtherDocument
    })
  }
})
export default class TelephonyStatisticPage extends Vue {
  // Vuex
  readonly listFile!: (DocumentInterface)[]

  // Props
  readonly listPoint!: iPointItem[]
  readonly listPhoneNumbers!: Record<string, ICustomerProduct> | null
  readonly isLoadingPoints!: boolean
  readonly isLoadingProducts!: boolean

  // Data
  currentPoint: iPointItem | null = null
  isSuccessReport = false
  isErrorReport = false

  // Computed
  get listPhone () {
    const result: { id: string, product: string, value: string }[] = []

    for (const key in this.listPhoneNumbers) {
      if (!this.listPhoneNumbers.hasOwnProperty(key)) continue
      const product = this.listPhoneNumbers[key]

      product.slo.forEach(slo => {
        if (slo.chars && slo.chars.hasOwnProperty(PHONE_NUMBER_CHAR)) {
          result.push({
            id: slo.chars[PHONE_NUMBER_CHAR] as string,
            product: slo.id,
            value: (slo.chars[PHONE_NUMBER_CHAR] as string)
              .replace(/[\D]+/g, '')
              .replace(/(\d{1})(\d{3})(\d{2})(\d{3})(\d{2})/, '+$1 ($2) $3-$4-$5')
          })
        }
      })
    }

    return result
  }

  get computedListFile () {
    return this.listFile.filter(file => {
      return this.listPhone.find(phone => file.fileName.indexOf(phone.product) > 0) &&
        file.fileName.indexOf('BPI') > 0
    })
  }

  generateFileStatistic () {
    if (!(this.$refs['file-statistic-form'] as any).validate()) return
    if (this.currentPhone === null) return
    this.isGeneratingFile = true
    this.$store.dispatch('internet/getFileStatistic', {
      fromDate: this.periodDate[0].toISOString(),
      toDate: this.periodDate[1].toISOString(),
      productInstance: this.currentPhone.product
    })
      .then((response) => {
        this.isSuccessReport = true
        Cookie.set('is-loading', '1', { expires: 30 * 24 * 60 * 60 })
        Cookie.set('statistic-file', response.fileName, { expires: 30 * 24 * 60 * 60 })
        this.setIntervalForFile()
      })
      .catch(() => {
        this.isErrorReport = true
      })
      .finally(() => {
        this.isGeneratingFile = false
      })
  }

  setIntervalForFile () {
    this.$store.commit('timer/setInterval', {
      id: 'GET_FILE_STATISTIC',
      delay: 5000,
      cb: () => {
        this.$store.dispatch('fileinfo/downloadListDocument', { api: this.$api })
          .then(() => {
            const fileName = Cookie.get('statistic-file')
            const findingDocument = this.computedListFile.find(document =>
              !Array.isArray(document) && document.fileName === fileName)
            if (findingDocument) {
              Cookie.remove('statistic-file')
              Cookie.remove('is-loading')
              this.$store.commit('timer/clearInterval', 'GET_FILE_STATISTIC')
            }
          })
      }
    })
  }

  mounted () {
    const today = new Date()
    const beforeMonth = new Date()
    beforeMonth.setDate(beforeMonth.getDate() - 29)
    this.periodDate = [
      beforeMonth,
      today
    ]
  }

  hasNewFile = false
  showFiles = false
  currentPhone: { id: string, product: string, value: string } | null = null
  periodDate: Date[] = []
  isGeneratingFile = false
  isSuccessGenerated = false
  isErrorGenerated = false

  data = []
}
