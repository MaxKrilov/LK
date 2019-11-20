import { mapGetters } from 'vuex'
import PersonCard from '../../components/PersonCard/index'
import CompanyCard from '../../components/CompanyCard/index'
import AccountForm from '../../components/AccountForm/index'
import AccountsSection from '../../components/AccountsSection/index'
import ChangePassword from '../../components/ChangePassword/index'
// import RemoveAccount from '../../components/RemoveAccount/index'
import ModalAccountsInfo from '../../components/AccountsInfo/index'

export default {
  name: 'main-profile-page',
  components: {
    PersonCard,
    CompanyCard,
    AccountForm,
    AccountsSection,
    ChangePassword,
    // RemoveAccount,
    ModalAccountsInfo
  },
  data: () => ({
    pre: 'main-profile-page',
    modelCardsSwitch: 'person'
  }),
  computed: {
    ...mapGetters('auth', [
      'isLPR',
      'hasAccess',
      'realmRoles',
      'user',
      'serverErrorMessage'
    ])
  }
}
