import { Vue, Component, Prop } from 'vue-property-decorator'
import './style.scss'

@Component
export default class SlideUpDownWithTitleComponent extends Vue {
  @Prop(String) icon
  @Prop(String) title
  pre = 'slide-up-down-with-title-component'
  isOpen = false

  toggle () {
    this.isOpen = !this.isOpen
  }

  render (h) {
    const pre = this.pre
    return (
      <div class={[pre, { 'open': this.isOpen }]}>
        <div class={`${pre}__content`}>
          <div class={`${pre}__head`}>
            <div class={'icon'}>
              <er-icon name={this.icon}/>
            </div>
            <div class={'title'}>
              {this.title}
            </div>
            <a class={'toggle'} vOn:click_prevent={this.toggle}>
              <er-icon name={'corner_down'} />
            </a>
          </div>
          <er-slide-up-down active={this.isOpen}>
            <div class={`${pre}__body`}>
              {this.$slots.default}
            </div>
          </er-slide-up-down>
        </div>
      </div>
    )
  }
}
