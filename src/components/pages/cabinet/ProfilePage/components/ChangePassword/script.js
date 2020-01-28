import { isEmpty, getScreenWidth } from '@/functions/helper'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { PATTERN_LETTERS, PATTERN_HAS_CYRILLIC_LETTERS, PATTERN_NUMBERS, PATTERN_SYMBOLS, PATTERN_BAD_SYMBOLS, PATTERN_PASSWORD } from '@/constants/regexp'
import Responsive from '@/mixins/ResponsiveMixin'

export default {
  name: 'change-password',
  mixins: [ Responsive ],
  data: () => ({
    pre: 'change-password',
    isShowPassword: false,
    isShowConfirm: false,
    passwordNew: '',
    passwordConfirm: ''
  }),
  methods: {
    ...mapActions('modal', ['changePasswordRequest']),
    ...mapMutations('modal', ['setModalVisibility']),
    show () {
      this.setModalVisibility(true)
    },
    close () {
      this.setModalVisibility(false)
      this.clear()
    },
    clear () {
      this.passwordNew = ''
      this.passwordConfirm = ''
      this.$refs.newpass.messages = []
      this.$refs.confirm.messages = []
      this.isShowPassword = false
      this.isShowConfirm = false
    },
    submit () {
      if (this.isPasswordCorrect && this.isConfirmCorrect) {
        const { userId } = this.user

        this.changePasswordRequest({
          api: this.$api,
          password: this.passwordNew,
          userId: userId
        })
      }
    },
    passwordNewRule () {
      if (isEmpty(this.passwordNew)) {
        return 'Обязательное поле'
      }
      return this.isPasswordCorrect || 'Пароль не соответствует требованиям безопасности'
    },
    passwordConfirmRule () {
      if (isEmpty(this.passwordConfirm)) {
        return 'Подтвердите пароль'
      }
      return this.isConfirmCorrect || 'Подтверждение не совпадает с паролем'
    }
  },
  computed: {
    ...mapState('modal',
      {
        stateModalVisibility: (state) => state.isOpen,
        serverError: (state) => state.error,
        isFetched: (state) => state.isFetched
      }
    ),
    ...mapGetters('auth', [
      'user'
    ]),
    calculatedModalSize () {
      return this.getScreenWidth > 960 ? '534' : '484'
    },
    getScreenWidth,
    ruleFunc () {
      return funcName => {
        return [funcName]
      }
    },
    isLettersOk () {
      return !PATTERN_HAS_CYRILLIC_LETTERS.test(this.passwordNew) && PATTERN_LETTERS.test(this.passwordNew)
    },
    isNumbersOk () {
      return PATTERN_NUMBERS.test(this.passwordNew)
    },
    isSymbolsOk () {
      return !PATTERN_BAD_SYMBOLS.test(this.passwordNew) && PATTERN_SYMBOLS.test(this.passwordNew)
    },
    isPasswordCorrect () {
      return !PATTERN_BAD_SYMBOLS.test(this.passwordNew) && !PATTERN_HAS_CYRILLIC_LETTERS.test(this.passwordNew) && PATTERN_PASSWORD.test(this.passwordNew)
    },
    isConfirmCorrect () {
      return this.passwordConfirm === this.passwordNew
    },
    checkEmptyFields () {
      return isEmpty(this.passwordNew) && isEmpty(this.passwordConfirm)
    }
  },
  watch: {
    isFetched (val) {
      this.clear()
    }
  }
}
