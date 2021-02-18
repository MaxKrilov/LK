// Styles
import './_style.scss'

import Vue, { CreateElement, VNode } from 'vue'

import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import { ErtForm } from '@/components/UI2/ErtForm'

export default Vue.extend({
  name: 'reverce-zone-item-component',
  components: {
    ErActivationModal
  },
  data () {
    return {
      isOpenQuestion: false,
      isOpenDeleteQuestion: false,
      isDeleteRequest: false,
      isDeleted: false,
      isEdited: false,
      isEditing: false,
      isEditRequest: false,
      lazyReverceZone: this.reverceZone,
      isShowLazyReverceZone: false,
      errorMessages: [] as string[]
    }
  },
  props: {
    ip: String,
    reverceZone: String,
    isShowRemoveButton: Boolean
  },
  watch: {
    reverceZone (val) {
      this.lazyReverceZone = val
    }
  },
  methods: {
    openConfirmDialogDelete () {
      this.isOpenQuestion = true
    },
    onEditConfirm () {
      if (!(this.$refs as { form: InstanceType<typeof ErtForm> }).form.validate()) return
      this.isEditRequest = true
      this.isOpenQuestion = false
      this.$store.dispatch('internet/editReverceZone', {
        ip: this.ip,
        domain: this.lazyReverceZone,
        domainOld: this.reverceZone
      })
        .then(() => {
          this.errorMessages = []
          this.isEdited = true
          this.isShowLazyReverceZone = true
          this.$emit('change', this.lazyReverceZone)

          setTimeout(() => {
            this.isEdited = false
          }, 3000)
        })
        .catch(() => {
          this.errorMessages.push('Произошла ошибка при изменении обратной зоны')
        })
        .finally(() => {
          this.isEditing = false
          this.isEditRequest = false
        })
    },
    onDeleteConfirm () {
      this.isDeleteRequest = true
      this.isOpenDeleteQuestion = false

      this.$store.dispatch('internet/deleteReverceZone', {
        ip: this.ip,
        domain: this.reverceZone
      })
        .then(() => {
          this.isDeleted = true
          const elementHeight = this.$el.scrollHeight
          this.$el.setAttribute('style', `height: ${elementHeight}px`)
          setTimeout(() => {
            this.$el.setAttribute('style', `height: 0`)
            setTimeout(() => {
              this.$emit('delete')
            }, 400)
          }, 1000)
        })
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render (h: CreateElement): VNode {
    return (
      <div class={['reverce-zone-item-component', { 'is-edited': this.isEdited, 'deleted': this.isDeleted }]}>
        <div class={['content', 'main-content', 'main-content--h-padding']}>
          <div class={'ip'}>{this.ip}</div>
          <div class={'reverce-zone'}>
            {
              !this.isEdited && !this.isDeleted && (
                <div class={'caption'}>Обратная зона</div>
              )
            }
            <div class={'value mt-0'}>
              {
                this.isEditing
                  ? (
                    <ert-form ref={'form'}>
                      <ert-text-field
                        vModel={this.lazyReverceZone}
                        rules={[
                          (v: string) => !!v || 'Поле обязательно к заполнению',
                          (v: string) => !/[аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ\s]+/.test(v) || 'Недопустимые символы',
                          (v: string) => !/[,;:/\\|=+*'"`~@№$%^&?<>(){}éèêëùüàâöïç\s]/.test(v) || 'Недопустимые символы'
                        ]}
                        errorMessages={this.errorMessages}
                      />
                    </ert-form>)
                  : this.isEdited || this.isDeleted
                    ? this.isEdited ? 'Обратная зона изменена' : 'Обратная зона удалена'
                    : this.isShowLazyReverceZone ? this.lazyReverceZone : this.reverceZone
              }
            </div>
          </div>
          {
            this.isEditing
              ? (
                <div class={'d--flex'}>
                  <div class={'save ml-16'}>
                    <button
                      disabled={this.isEditRequest}
                      onclick={() => {
                        if ((this.$refs as { form: InstanceType<typeof ErtForm> }).form.validate()) {
                          this.isOpenQuestion = true
                        }
                      }}
                    >
                      {
                        this.isEditRequest
                          ? (<ert-progress-circular size={16} width={2} indeterminate={true} />)
                          : (<ert-icon name={'ok'} small={true} />)
                      }
                      <span class={'text'}>Сохранить</span>
                    </button>
                  </div>
                  <div class={'cancel ml-16'}>
                    <button onclick={() => {
                      this.isEditing = false
                    }}
                    disabled={this.isEditRequest}>
                      <ert-icon name={'close'} small={true} />
                      <span class={'text'}>Отменить</span>
                    </button>
                  </div>
                </div>
              )
              : this.isEdited || this.isDeleted
                ? null
                : (
                  <div class={'d--flex'}>
                    <div class={'edit'}>
                      <button
                        onclick={() => {
                          this.isEditing = true
                        }}
                        disabled={this.isDeleteRequest}
                      >
                        <ert-icon name={'edit'} small={true}/>
                        <span class={'text'}>Изменить</span>
                      </button>
                    </div>
                    {
                      this.isShowRemoveButton && (
                        <div class={'remove ml-16'}>
                          <button
                            disabled={this.isDeleteRequest}
                            onclick={() => {
                              this.isOpenDeleteQuestion = true
                            }}
                          >
                            {
                              this.isDeleteRequest
                                ? (<ert-progress-circular size={16} width={2} indeterminate={true} />)
                                : (<ert-icon name={'close'} small={true} />)
                            }
                            <span class={'text'}>Удалить</span>
                          </button>
                        </div>
                      )
                    }
                  </div>
                )
          }
        </div>
        <er-activation-modal
          type={'question'}
          title={'Вы уверены, что хотите изменить обратную зону?'}
          actionButtonText={'Изменить'}
          vModel={this.isOpenQuestion}
          onConfirm={this.onEditConfirm}
        >
          <template slot={'description'}>
            {this.reverceZone} на {this.lazyReverceZone}
          </template>
        </er-activation-modal>

        <er-activation-modal
          type={'question'}
          title={'Вы уверены, что хотите удалить обратную зону?'}
          actionButtonText={'Удалить'}
          vModel={this.isOpenDeleteQuestion}
          onConfirm={this.onDeleteConfirm}
        >
          <template slot={'description'}>
            {this.reverceZone}
          </template>
        </er-activation-modal>
      </div>
    )
  }
})
