import { Vue, Component, Watch } from 'vue-property-decorator'
import PhoneStatistic from './components/PhoneStatistic/index.vue'
import PhoneFolder from './components/PhoneFolder/index.vue'
import ErListPoints from '@/components/blocks/ErListPoints/index.vue'
import { DocumentInterface, ICustomerProduct } from '@/tbapi'
import { getFirstElement } from '@/functions/helper'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import { mapState } from 'vuex'
import FileComponent from './components/FileComponent/index.vue'
import { Cookie } from '@/functions/storage'
import { StoreGetter } from '@/functions/store'
import { ICloudPhone, ICloudPhoneService, IOATSDomain } from '@/interfaces/oats'
import { TOMS_IDS } from '@/constants/oats'
import moment from 'moment'

import { orderBy } from 'lodash'

export interface iOATSPointItem {
  id: string | number,
  fulladdress: string,
  bpi: string | number,
  offerName: string,
  status?: string
  indexOfCurrentDomain: number
}

const components = {
  PhoneFolder,
  PhoneStatistic,
  ErListPoints,
  ErActivationModal,
  FileComponent
}

const isOatsPhoneNumber = (el: ICloudPhoneService) => {
  const CLOUD_PHONE_NUMBERS = [
    TOMS_IDS.CLOUD_PHONE_NUMBER,
    TOMS_IDS.CLOUD_PHONE_NUMBER_LIGHT,
    TOMS_IDS.CLOUD_PHONE_NUMBER_2_0
  ]

  return CLOUD_PHONE_NUMBERS.includes(el?.offer?.tomsId || '')
}

const PHONE_NUMBER_CHAR = 'Номер телефона'

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof OATSStatisticPage>>({
  components,
  props: {
    listPhoneNumbers: {
      type: Object,
      default: () => ({})
    },
    isLoadingProducts: Boolean,
    id: String
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
export default class OATSStatisticPage extends Vue {
  @StoreGetter('oats/domainList')
  domainList!: IOATSDomain[]

  @StoreGetter('payments/getActiveBillingAccount')
  billingAccountId!: any

  @StoreGetter('oats/pointBpiList')
  pointBpiList!: string[]
  // Vuex
  readonly listFile!: (DocumentInterface)[]

  // Props
  readonly listPhoneNumbers!: Record<string, ICustomerProduct> | null
  readonly isLoadingProducts!: boolean
  readonly id!: string

  // Data
  currentPoint: iOATSPointItem | null = null
  isSuccessReport = false
  isErrorReport = false
  countOfPoints: number = 0
  isPointsLoaded: boolean = false

  // Computed
  get listPoint () {
    let result:iOATSPointItem[] = []
    this.domainList.forEach((domain, index) => result.push({
      id: domain.id,
      fulladdress: domain.searchAddress || '',
      bpi: domain.id,
      offerName: domain.chars['Имя в счете'],
      status: domain.status,
      indexOfCurrentDomain: index
    }))
    return result
  }

  get indexOfCurrentDomain () {
    return this.currentPoint?.indexOfCurrentDomain || 0
  }
  get listPhone () {
    const result: { id: string, product: string, value: string }[] = []
    let oatsPhoneNumbersList: ICloudPhoneService[] = []
    let cloudPhones: Record<string, ICloudPhone>[] = []

    cloudPhones.push(this.domainList[this.indexOfCurrentDomain]?.cloudPhones)

    cloudPhones.forEach(cloudPhonesList => {
      for (let key in cloudPhonesList) {
        let oatsPhoneNumbers = cloudPhonesList[key]?.services ? Object.values(cloudPhonesList[key]?.services)?.filter(isOatsPhoneNumber) : []
        if (oatsPhoneNumbers?.length > 0) {
          oatsPhoneNumbersList.push(...oatsPhoneNumbers)
        }
      }
    })

    oatsPhoneNumbersList.map(service => result.push({
      id: service.chars[PHONE_NUMBER_CHAR] as string,
      product: service.id,
      value: (service.chars[PHONE_NUMBER_CHAR] as string)
        .replace(/[\D]+/g, '')
        .replace(/(\d{1})(\d{3})(\d{2})(\d{3})(\d{2})/, '+$1 ($2) $3-$4-$5')
    }))

    return result
  }

  get computedListFile () {
    const result = this.listFile
      .filter(file => this.listPhone
        .find(phone => file.fileName.includes(phone.product) && file.fileName.includes('BPI'))
      )
      .map(file => {
        const regExp = /([А-Яа-я]+)_([A-Za-zА-Яа-я0-9_#()]+)_(BPI[\d]+)_([\d-]+)_([\d-]+)_([A-Za-z0-9]+)/
        const parsed = file.fileName.match(regExp)
        if (parsed == null) return file

        const dateFrom = parsed[4]
        const dateTo = parsed[5]
        const phone = this.listPhone.find(phone => file.fileName.includes(phone.product))?.value?.replace(/[\D]+/g, '')
        const createdDate = moment(file.creationDate).format('DD-MM-YY')

        const fileName = `Статистика_по_ОАТС_за_период_${dateFrom}_-_${dateTo}_по_${!phone ? 'всем_номерам' : `телефону_${phone}`}_от_${createdDate}.csv`

        return {
          ...file,
          fileName
        }
      })

    return orderBy(result, ['creationDate'], ['desc'])
  }

  generateFileStatistic () {
    if (!(this.$refs['file-statistic-form'] as any).validate()) return
    if (this.currentPhone === null) return
    this.isGeneratingFile = true
    this.$store.dispatch('internet/getFileStatistic', {
      fromDate: moment(this.periodDate[0].setHours(0, 0, 0, 0)).format(),
      toDate: moment(this.periodDate[1].setHours(23, 59, 59, 59)).format(),
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

  pullPoints () {
    return this.$store.dispatch('oats/pullPoints')
  }

  fetchData () {
    this.isPointsLoaded = false
    this.pullPoints()
      .then(points => {
        this.countOfPoints = points.length
        if (points.length) {
          this.$store.dispatch('oats/pullDomains', this.pointBpiList)
            .then(() => {
              this.isPointsLoaded = true
            })
        }
      })
  }

  @Watch('billingAccountId')
  onBillingAccountIdChange (value: any) {
    if (value) {
      this.fetchData()
    }
  }

  mounted () {
    if (this.billingAccountId) {
      this.fetchData()
    }
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
