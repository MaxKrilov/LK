import { Vue, Component } from 'vue-property-decorator'
import ErPhoneSelect from '@/components/blocks/ErPhoneSelect'

const components = {
  ErPhoneSelect
}

const props = {
  active: Boolean
}

@Component({
  // @ts-ignore
  components,
  props
})
export default class RequestDialog extends Vue {
  phoneNumber: string = ''
  userName: string = ''
  requiredRule: any[] = [
    (v: any) => !!v || 'Пожалуйста, заполните поле'
  ]

  onPlug () {
    this.$emit('plug', {
      userName: this.userName,
      phoneNumber: this.phoneNumber
    })
  }

  onCancel () {
    this.$emit('cancel')
  }
}
