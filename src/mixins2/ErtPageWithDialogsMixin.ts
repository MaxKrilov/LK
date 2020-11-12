import { Vue, Component } from 'vue-property-decorator'
import ErrorDialog from '@/components/dialogs/ErrorDialog/index.vue'
import InfoDialog from '@/components/dialogs/InfoDialog/index.vue'

interface IDialogPayload {
  title: string | null
  message: string
}

@Component({
  components: {
    ErrorDialog,
    InfoDialog
  }
})
export class ErtPageWithDialogsMixin extends Vue {
  isInfoMode: boolean = false
  infoMessage: string = ''
  infoTitle: string = 'Внимание'

  isErrorMode: boolean = false
  errorMessage: string = ''
  errorTitle: string | null = 'Ошибка'

  onError (payload: IDialogPayload) {
    this.errorMessage = payload.message
    this.errorTitle = payload.title
    this.isErrorMode = true
  }

  onInfo (payload: any) {
    this.infoMessage = payload.message
    this.infoTitle = payload.title
    this.isInfoMode = true
  }
}
