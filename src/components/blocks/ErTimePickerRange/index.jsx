import { __decorate } from "tslib";
import './_style.scss';
import { Vue, Component, Prop } from 'vue-property-decorator';
let ErTimePickerRange = class ErTimePickerRange extends Vue {
    constructor() {
        super(...arguments);
        this.disabled = false;
    }
    render(h) {
        return (<div class={'er-time-picker-range'}>
        <div class={'label'}>{this.label}</div>
        <div class={['timepicker', 'mr-8', 'first']}>
          <er-time-picker vModel={this.value[0]} max={this.value[1]} disabled={this.disabled}/>
        </div>
        <div class={'timepicker'}>
          <er-time-picker vModel={this.value[1]} min={this.value[0]} disabled={this.disabled}/>
        </div>
        <div class={['doesnt-matter', 'ml-16']}>
          <er-toggle view={'radio-check'} label={'Не важно'} vModel={this.disabled}/>
        </div>
      </div>);
    }
};
__decorate([
    Prop({ type: String, default: 'Удобное время для звонка' })
], ErTimePickerRange.prototype, "label", void 0);
__decorate([
    Prop({ type: Array, default: () => ([]) })
], ErTimePickerRange.prototype, "value", void 0);
ErTimePickerRange = __decorate([
    Component
], ErTimePickerRange);
export default ErTimePickerRange;
//# sourceMappingURL=index.jsx.map