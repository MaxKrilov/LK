import { Vue, Component } from 'vue-property-decorator'

import RedirectionTable from './components/RedirectionTable/index.vue'
import AddRedirectionForm from './components/AddRedirectionForm/index.vue'
import Mockup from './mockupData'

const components = {
  AddRedirectionForm,
  RedirectionTable
}

@Component({
  name: 'telephony-redirection-page',
  components
})
export default class TelephonyRedirectionPage extends Vue {
  currentAddress = 1
  addressList = Mockup.ADDRESS_LIST
  redirectionList = Mockup.PHONE_LIST
  addRedirectionMode = false

  onShowAddForm () {
    this.addRedirectionMode = true
  }

  onHideAddForm () {
    this.addRedirectionMode = false
  }
}
