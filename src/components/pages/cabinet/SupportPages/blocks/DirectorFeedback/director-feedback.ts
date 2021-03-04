import { Component, Vue, Watch } from 'vue-property-decorator'
import { SCREEN_WIDTH } from '@/store/actions/variables'

import SlideUpDownWithTitleComponent from '../SlideUpDownWithTitleComponent/index'
import ErTimePickerRange from '@/components/blocks/ErTimePickerRange/index'
import ErTextareaWithFile from '@/components/blocks/ErTextareaWithFile'
import ErPhoneSelect from '@/components/blocks/ErPhoneSelect/index.js'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import { BREAKPOINT_XL } from '@/constants/breakpoint'
import { PATTERN_EMAIL } from '@/constants/regexp'
import { CREATE_REQUEST } from '@/store/actions/request'
import { mapGetters } from 'vuex'
import { StoreGetter } from '@/functions/store'
import { LIST_COMPLAINT_THEME } from '@/store/actions/dictionary'
// import { mapState, mapGetters, mapMutations } from 'vuex'
// import { SCREEN_WIDTH } from '../../../../../../store/actions/variables'
// import { BREAKPOINT_XL } from '../../../../../../constants/breakpoint'
// import { CREATE_REQUEST } from '../../../../../../store/actions/request'
// import { LIST_COMPLAINT_THEME } from '../../../../../../store/actions/dictionary'
// import { PATTERN_EMAIL } from '../../../../../../constants/regexp'

const components = {
  SlideUpDownWithTitleComponent,
  ErTimePickerRange,
  ErPhoneSelect,
  ErActivationModal,
  ErTextareaWithFile
}

interface IFeedbackTheme {
  id: string
  requestName: string
  value: string
}

@Component({
  // @ts-ignore
  components,
  props: {
    value: Boolean
  },
  computed: {
    ...mapGetters('user', [
      'getManagerInfo',
      'getAddressList'
    ])
  }
})
export default class DirectorFeedback extends Vue {
  modelDirectorTheme: IFeedbackTheme = { id: '', requestName: '', value: '' }
  modelDirectorAddress: any = ''
  modelDirectorPhone: string = ''
  modelDirectorEmail: string = ''
  modelDirectorName: string = ''
  modelDirectorPost: string = ''
  modelDirectorComment: string = ''

  ticketName: string = ''

  toDirectorModal: boolean = false
  toDirectorSlideUpDown: boolean = false

  loadingCreating: boolean = false

  searchEmail: string = ''

  isFormVisible: boolean = false

  resultDialogSuccess: boolean = false
  resultDialogError: boolean = false

  requiredRule = [
    (v:any) => !!v || 'Поле обязательно к заполнению'
  ]

  @StoreGetter('user/getListContact')
  getListContact: any

  @StoreGetter(SCREEN_WIDTH)
  screenWidth: any

  get listComplaint () {
    return this.$store.state.dictionary[LIST_COMPLAINT_THEME]
  }

  get isMobileForm () {
    return this.screenWidth < BREAKPOINT_XL
  }

  get isDesktopForm () {
    return this.screenWidth >= BREAKPOINT_XL
  }

  get currentComponent () {
    return this.isMobileForm
      ? 'er-dialog'
      : 'er-slide-up-down'
  }

  get getPhoneList () {
    return this.getListContact.map((item: any) => item.phone?.value)
      .filter((item: any) => !!item)
  }

  get getEmailList () {
    return this.getListContact.map((item: any) => item.email?.value).filter((item: any) => item)
  }

  @Watch('modelDirectorPhone')
  onModelDirectorPhoneChange (val: string) {
    const _val = val.replace(/[\D]+/, '')
    const findingValue = this.getListContact.find((item: any) => item.phone?.value === _val)
    if (findingValue !== undefined && findingValue.firstName && findingValue.name) {
      this.modelDirectorName = findingValue.name
    }
  }

  @Watch('modelDirectorEmail')
  onModelDirectorEmailChange (val: any) {
    if (PATTERN_EMAIL.test(val)) {
      this.$nextTick(() => {
        this.modelDirectorEmail = val
      })
    } else {
      this.$nextTick(() => {
        this.modelDirectorEmail = ''
      })
    }
  }

  openToDirectorModal () {
    this.toDirectorModal = true
  }

  closeToDirectorModal () {
    this.$emit('input', false)
    this.toDirectorModal = false
  }

  openToDirectorSlideUpDown () {
    this.toDirectorSlideUpDown = true
  }

  closeToDirectorSlideUpDown () {
    this.$emit('input', false)
    this.toDirectorSlideUpDown = false
  }

  openToDirector () {
    if (this.screenWidth >= BREAKPOINT_XL) {
      this.openToDirectorSlideUpDown()
    } else {
      this.openToDirectorModal()
    }
  }

  closeToDirector () {
    if (this.screenWidth >= BREAKPOINT_XL) {
      this.closeToDirectorSlideUpDown()
    } else {
      this.closeToDirectorModal()
    }
  }

  writeToDirector () {
    // @ts-ignore
    if (this.$props.value && !this.$refs.director_feedback_form.validate()) return
    this.loadingCreating = true
    const requestName = 'complaint'
    const location = this.modelDirectorAddress.id
    const description = `
      Заявка сформирована из ЛК b2b: «${this.modelDirectorComment}»;
      Адрес: «${this.modelDirectorAddress.value}»;
      Контактный телефонный номер: «${this.modelDirectorPhone}»;
      Адрес электронной почты: «${this.modelDirectorEmail}»;
      Как обращаться к клиенту: «${this.modelDirectorName}»;
      Должность: «${this.modelDirectorPost}».`
    const type = this.modelDirectorTheme.id
    let customerContact = this.getListContact.find(
      (item:any) => item.phone?.value === this.modelDirectorPhone.replace(/[\D]+/g, ''))
    let customerContactId, phoneId
    if (customerContact !== undefined) {
      customerContactId = customerContact.id
      phoneId = customerContact.phone.id
    } else {
      customerContact = this.getListContact.find((item:any) => item.isLPR)
      if (customerContact !== undefined) {
        customerContactId = customerContact.id
        phoneId = customerContact.phone.id
      }
    }
    const emailAddress = this.getListContact.find(
      (item: any) => item.email?.value === this.modelDirectorEmail)?.email.id
    this.$store.dispatch(`request/${CREATE_REQUEST}`, {
      requestName,
      location,
      description,
      complaintTheme: type,
      customerContact: customerContactId,
      phoneNumber: phoneId,
      emailAddress,
      api: this.$api
    })
      .then(result => {
        if (typeof result === 'string' && result !== '') {
          this.ticketName = result
          this.resultDialogSuccess = true
          this.closeToDirector()
        } else {
          this.resultDialogError = true
        }
      })
      .catch(() => {
        this.resultDialogError = true
      })
      .finally(() => {
        this.loadingCreating = false
      })
  }
}
