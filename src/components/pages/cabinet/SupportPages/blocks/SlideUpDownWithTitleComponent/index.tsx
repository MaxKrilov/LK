import { Vue, Component } from 'vue-property-decorator'
import './style.scss'
import { CreateElement, VNode } from 'vue'

const SlideUpDownWithTitleComponentProp = Vue.extend({
  props: {
    icon: String,
    title: String
  }
})

@Component
export default class SlideUpDownWithTitleComponent extends SlideUpDownWithTitleComponentProp {
  pre: string = 'slide-up-down-with-title-component'
  isOpen: boolean = false

  toggle () {
    this.isOpen = !this.isOpen
  }
  // eslint-disable-next-line
  render (h: CreateElement): VNode {
    const pre = this.pre
    return (<div class={[pre, { 'open': this.isOpen }]}>
      <div class={`${pre}__content`}>
        <div class={`${pre}__head`}>
          <div class={'icon'}>
            <er-icon name={this.icon}/>
          </div>
          <div class={'title'}>
            {this.title}
          </div>
          <a class={'toggle'} onClick={() => this.toggle()}>
            <er-icon name={'corner_down'}/>
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
