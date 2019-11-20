import CommonDocument from '../CommonDocument'
import UploadUserlistDialog from './components/UploadUserlistDialog'
import WarningUserlistDialog from './components/WarningUserlistDialog'

export default {
  props: {
    'document': Object
  },
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
    currentDialog () {
      if (this.document.signed) {
        return 'warning-userlist-dialog'
      } else {
        return 'upload-userlist-dialog'
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