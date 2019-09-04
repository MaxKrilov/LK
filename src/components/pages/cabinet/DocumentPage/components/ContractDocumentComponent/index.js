import './_style.scss'

export default {
  name: 'contract-document-component',
  data: () => ({
    pre: 'contract-document-component'
  }),
  props: {},
  methods: {},
  render (h) {
    return (
      <div class={this.pre}>
        <div class={`${this.pre}__content`}>
          <div class={`${this.pre}__head`}>
            <div class={`${this.pre}__head__type`}>Бланк заказа</div>
            <a class={`${this.pre}__head__link`}>Текст документа</a>
            <div class={`${this.pre}__head__triangle`}>
              <div class={`${this.pre}__head__shadow`} />
            </div>
          </div>
          <div class={`${this.pre}__body`}></div>
        </div>
      </div>
    )
  }
}
