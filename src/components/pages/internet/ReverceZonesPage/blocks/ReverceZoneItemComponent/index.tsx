// Styles
import './_style.scss'

import Vue, { CreateElement, VNode } from 'vue'

import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

export default Vue.extend({
  name: 'reverce-zone-item-component',
  components: {
    ErActivationModal
  },
  data () {
    return {
      isOpenQuestion: false,
      isDeleted: false
    }
  },
  props: {
    ip: String,
    reverceZone: String
  },
  methods: {
    openConfirmDialogDelete () {
      this.isOpenQuestion = true
    },
    isDeletedConfirm () {
      this.isOpenQuestion = false
      this.isDeleted = true
      const elementHeight = this.$el.scrollHeight
      this.$el.setAttribute('style', `height: ${elementHeight}px`)
      setTimeout(() => {
        this.$el.setAttribute('style', `height: 0`)
        setTimeout(() => {
          this.$emit('delete')
        }, 400)
      }, 1000)
    }
  },
  render (h: CreateElement): VNode {
    return (
      <div class={['reverce-zone-item-component', { 'deleted': this.isDeleted }]}>
        <div class={['content', 'main-content', 'main-content--h-padding']}>
          <div class={'ip'}>{this.ip}</div>
          <div class={'reverce-zone'}>
            {
              !this.isDeleted && (
                <div class={'caption'}>Обратная зона</div>
              )
            }
            <div class={'value'}>
              {
                this.isDeleted
                  ? 'Обратная зона удалена'
                  : this.reverceZone
              }
            </div>
          </div>
          {
            !this.isDeleted && (
              <div class={'delete'}>
                <button onclick={this.openConfirmDialogDelete}>
                  <er-icon name={'trashbox'}/>
                  <span>
                    Удалить
                  </span>
                </button>
              </div>
            )
          }
        </div>
        <er-activation-modal
          type={'question'}
          title={'Вы уверены, что хотите удалить обратную зону?'}
          actionButtonText={'Удалить'}
          vModel={this.isOpenQuestion}
          onConfirm={this.isDeletedConfirm}
        >
          <template slot={'description'}>
            {this.reverceZone}
          </template>
        </er-activation-modal>
      </div>
    )
  }
})
