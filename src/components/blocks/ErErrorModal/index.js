import './_style.scss'
import { ERROR_MODAL } from '../../../store/actions/variables'

export default {
  name: 'er-error-modal',
  data: () => ({
    pre: 'er-error-modal'
  }),
  computed: {
    errorModal: {
      get () {
        return this.$store.state.variables[ERROR_MODAL]
      },
      set (val) {
        this.$store.commit(ERROR_MODAL, val)
      }
    }
  },
  render (h) {
    return (
      <div class={this.pre}>
        <er-dialog vModel={this.errorModal} maxWidth={544}>
          <div class={`${this.pre}__content d--flex flex-column`}>
            <h1 class="fonts--demi ml-auto mr-64 mt-64 mb-12">Что-то пошло не так</h1>
            <p class="ml-auto mr-64">Повторите запрос позднее</p>
            <img src={require('@/assets/images/sad_cat.png')} alt=""/>
          </div>
        </er-dialog>
      </div>
    )
  }
}
