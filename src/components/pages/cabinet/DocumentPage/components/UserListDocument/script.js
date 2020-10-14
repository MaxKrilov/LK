import CommonDocument from '../CommonDocument'
import UploadUserlistDialog from './components/UploadUserlistDialog'
import WarningUserlistDialog from './components/WarningUserlistDialog'
import { mapGetters } from 'vuex'

const USER_LIST_EXPARIED_DAYS = 1000 * 3600 * 24 * 90

export default {
  components: {
    CommonDocument,
    UploadUserlistDialog,
    WarningUserlistDialog
  },
  data () {
    return {
      openDialog: false
    }
  },
  computed: {
    ...mapGetters({
      userListLoadingDate: 'user/getUserListLoadingDate'
    }),
    isUpdated () {
      if (this.userListLoadingDate) {
        return this.$moment().valueOf() - this.$moment(this.userListLoadingDate, 'DD-MM-YYYY').valueOf() < USER_LIST_EXPARIED_DAYS
      }
      return false
    },
    dateOfUpdate () {
      if (this.userListLoadingDate) {
        return this.$moment(this.userListLoadingDate, 'DD-MM-YYYY').add(90, 'day').format('DD.MM.YYYY')
      }
    }
  },
  methods: {

    onClickQuestion () {
      this.openDialog = true
    },
    onCloseQuestion () {
      this.openDialog = false
    }
  }
}
