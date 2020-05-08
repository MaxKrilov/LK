import { mapGetters } from 'vuex'
import PersonCard from '../../components/PersonCard/index'
import CompanyCard from '../../components/CompanyCard/index'
import AccountForm from '../../components/AccountForm/index'
import AccountsSection from '../../components/AccountsSection/index'
import ContactsSection from '../../components/ContactsSection'
import ChangePassword from '../../components/ChangePassword/index'
import ModalAccountsInfo from '../../components/AccountsInfo/index'
import { scrollXTo, scrollXToStart } from '@/functions/helper'
import ResponsiveMixin from '@/mixins/ResponsiveMixin'

const TAB_NAME_PERSON = 'person'
const TAB_NAME_ORG = 'org'
const SCROLL_SPEED = 10
const SCROLL_STEP = 10

const changeOpacity = (elementActive, elementInactive) => {
  elementActive.style.opacity = 1
  elementInactive.style.opacity = 0.5
}

export default {
  name: 'main-profile-page',
  components: {
    PersonCard,
    CompanyCard,
    AccountForm,
    AccountsSection,
    ContactsSection,
    ChangePassword,
    ModalAccountsInfo
  },
  mixins: [ResponsiveMixin],
  data: () => ({
    pre: 'main-profile-page',
    dataCardsSwitch: [
      { label: 'Пользователь', value: TAB_NAME_PERSON },
      { label: 'Организация', value: TAB_NAME_ORG }
    ],
    modelCardsSwitch: 'person'
  }),
  methods: {
    setActiveTab (val) {
      const MARGIN_RIGHT = this.isXS ? 16 : 24
      const target = this.$refs.refCards
      if (target) {
        switch (val) {
          case TAB_NAME_PERSON:
            scrollXToStart(target, target.scrollLeft, SCROLL_SPEED, SCROLL_STEP)
            changeOpacity(target.firstChild, target.lastChild)
            break
          case TAB_NAME_ORG:
            const lInd = target.firstChild.clientWidth + MARGIN_RIGHT
            scrollXTo(target, 'right', SCROLL_SPEED, lInd, SCROLL_STEP)
            changeOpacity(target.lastChild, target.firstChild)
            break
          default:
            scrollXToStart(target, target.scrollLeft, SCROLL_SPEED, SCROLL_STEP)
        }
      }
    }
  },
  watch: {
    modelCardsSwitch (val) {
      this.setActiveTab(val)
    },
    isXS () {
      this.setActiveTab(this.modelCardsSwitch)
    },
    isSM () {
      this.setActiveTab(this.modelCardsSwitch)
    }
  },
  computed: {
    ...mapGetters('user', ['getClientInfo']),
    ...mapGetters('auth', [
      'isLPR',
      'hasAccess',
      'realmRoles',
      'user',
      'serverErrorMessage'
    ])
  }
}
