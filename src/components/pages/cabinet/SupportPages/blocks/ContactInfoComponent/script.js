import { Vue, Component, Watch } from 'vue-property-decorator'
import SlideUpDownWithTitleComponent from '../SlideUpDownWithTitleComponent'
import ErPhoneSelect from '../../../../../blocks/ErPhoneSelect'
import ErTimePickerRange from '../../../../../blocks/ErTimePickerRange'
import ErTextareaWithFile from '../../../../../blocks/ErTextareaWithFile'
import ErActivationModal from '../../../../../blocks/ErActivationModal/index'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { SCREEN_WIDTH } from '../../../../../../store/actions/variables'
import { BREAKPOINT_XL } from '../../../../../../constants/breakpoint'
import { CREATE_REQUEST } from '../../../../../../store/actions/request'
import { LIST_COMPLAINT_THEME } from '../../../../../../store/actions/dictionary'

@Component({
  components: {
    SlideUpDownWithTitleComponent,
    ErPhoneSelect,
    ErTimePickerRange,
    ErTextareaWithFile,
    ErActivationModal
  },
  methods: {
    ...mapMutations('chat', [
      'openChat'
    ])
  },
  computed: {
    ...mapGetters('user', [
      'getManagerInfo',
      'getListContact',
      'getAddressList'
    ]),
    ...mapState({
      screenWidth: state => state.variables[SCREEN_WIDTH],
      listComplaint: state => state.dictionary[LIST_COMPLAINT_THEME]
    })
  }
})
export default class ContactInfoComponent extends Vue {
  loadingCreating = false

  toDirectorModal = false
  toDirectorSlideUpDown = false

  resultDialogSuccess = false
  resultDialogError = false

  ticketName = ''

  modelDirectorTheme = ''
  modelDirectorAddress = ''
  modelDirectorPhone = ''
  modelDirectorEmail = ''
  modelDirectorName = ''
  modelDirectorPost = ''
  modelDirectorComment = ''

  listTheme = [
    'Идея',
    'Претензия',
    'Благодарность'
  ]

  requiredRule = [
    v => !!v || 'Поле обязательно к заполнению'
  ]

  @Watch('screenWidth')
  onScreenWidthChange (val) {
    if (this.toDirectorModal && val >= BREAKPOINT_XL) {
      this.closeToDirectorModal()
      this.openToDirectorSlideUpDown()
    } else if (this.toDirectorSlideUpDown && val < BREAKPOINT_XL) {
      this.closeToDirectorSlideUpDown()
      this.openToDirectorModal()
    }
  }

  @Watch('modelDirectorPhone')
  onModelDirectorPhoneChange (val) {
    const _val = val.replace(/[\D]+/, '')
    const findingValue = this.getListContact.find(item => item.phone?.value === _val)
    if (findingValue !== undefined && findingValue.firstName && findingValue.name) {
      this.modelDirectorName = findingValue.name
    }
  }

  get getPhoneList () {
    return this.getListContact.map(item => item.phone?.value)
      .filter(item => !!item)
  }

  get getEmailList () {
    return this.getListContact.map(item => item.email?.value).filter(item => item)
  }

  openToDirectorModal () {
    this.toDirectorModal = true
  }

  closeToDirectorModal () {
    this.toDirectorModal = false
  }

  openToDirectorSlideUpDown () {
    this.toDirectorSlideUpDown = true
  }

  closeToDirectorSlideUpDown () {
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
    if (
      (this.toDirectorModal && !this.$refs.director_form_mobile.validate()) ||
      (this.toDirectorSlideUpDown && !this.$refs.director_form_desktop.validate())
    ) return
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
    let customerContact = this.getListContact.find(item => item.phone?.value === this.modelDirectorPhone.replace(/[\D]+/g, ''))
    let customerContactId, phoneId
    if (customerContact !== undefined) {
      customerContactId = customerContact.id
      phoneId = customerContact.phone.id
    } else {
      customerContact = this.getListContact.find(item => item.isLPR)
      if (customerContact !== undefined) {
        customerContactId = customerContact.id
        phoneId = customerContact.phone.id
      }
    }
    const emailAddress = this.getListContact.find(item => item.email?.value === this.modelDirectorEmail)?.email.id
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
      .catch(e => {
        this.resultDialogError = true
      })
      .finally(() => {
        this.loadingCreating = false
      })
  }
}
