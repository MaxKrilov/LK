import { Vue, Component, Watch } from 'vue-property-decorator'
import SlideUpDownWithTitleComponent from '../SlideUpDownWithTitleComponent'
import ErPhoneSelect from '../../../../../blocks/ErPhoneSelect'
import ErTimePickerRange from '../../../../../blocks/ErTimePickerRange'
import ErTextareaWithFile from '../../../../../blocks/ErTextareaWithFile'
import { mapState, mapGetters } from 'vuex'
import { SCREEN_WIDTH } from '../../../../../../store/actions/variables'
import { BREAKPOINT_XL } from '../../../../../../constants/breakpoint'

@Component({
  components: {
    SlideUpDownWithTitleComponent,
    ErPhoneSelect,
    ErTimePickerRange,
    ErTextareaWithFile
  },
  computed: {
    ...mapGetters('user', [
      'getManagerInfo',
      'getPhoneList',
      'getAddressList',
      'getEmailList'
    ]),
    ...mapState({
      screenWidth: state => state.variables[SCREEN_WIDTH]
    })
  }
})
export default class ContactInfoComponent extends Vue {
  toDirectorModal = false
  toDirectorSlideUpDown = false

  modelDirectorTheme = ''
  modelDirectorAddress = ''
  modelDirectorPhone = ''
  modelDirectorTime = []
  modelDirectorEmail = ''
  modelDirectorName = ''
  modelDirectorPost = ''
  modelDirectorComment = ''

  listTheme = [
    'Идея',
    'Претензия',
    'Благодарность'
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
}
