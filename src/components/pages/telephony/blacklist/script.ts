import { Vue, Component } from 'vue-property-decorator'
import { PhoneBlacklist as mockupBlacklist } from './mockupData'
import BlacklistForm from './components/BlacklistForm/index.vue'
import BlacklistRow from './components/BlacklistRow/index.vue'
import { logInfo } from '@/functions/logging'

const components = {
  BlacklistForm,
  BlacklistRow,
  TextLabel: {
    template: `<div>{{ text }}</div>`,
    props: {
      text: String
    }
  }
}
@Component({ components })
export default class TelephonyBlacklistPage extends Vue {
  list = mockupBlacklist
  addMode = false

  onClickAdd () {
    this.addMode = !this.addMode
  }

  onChangePhone (payload: object) {
    logInfo('phone changed', payload)
  }
}
