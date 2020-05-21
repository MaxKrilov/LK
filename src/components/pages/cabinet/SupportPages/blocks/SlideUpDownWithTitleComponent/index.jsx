import { __decorate } from "tslib";
import { Vue, Component } from 'vue-property-decorator';
import './style.scss';
const SlideUpDownWithTitleComponentProp = Vue.extend({
    props: {
        icon: String,
        title: String
    }
});
let SlideUpDownWithTitleComponent = class SlideUpDownWithTitleComponent extends SlideUpDownWithTitleComponentProp {
    constructor() {
        super(...arguments);
        this.pre = 'slide-up-down-with-title-component';
        this.isOpen = false;
    }
    toggle() {
        this.isOpen = !this.isOpen;
    }
    render(h) {
        const pre = this.pre;
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
    </div>);
    }
};
SlideUpDownWithTitleComponent = __decorate([
    Component
], SlideUpDownWithTitleComponent);
export default SlideUpDownWithTitleComponent;
//# sourceMappingURL=index.jsx.map