import { __decorate } from "tslib";
import { Vue, Component, Prop } from 'vue-property-decorator';
let ErCornerButton = class ErCornerButton extends Vue {
    onClick() {
        this.$emit('input', !this.value);
    }
};
__decorate([
    Prop({ type: Boolean, default: false })
], ErCornerButton.prototype, "value", void 0);
__decorate([
    Prop({ type: Boolean, default: true })
], ErCornerButton.prototype, "activeDown", void 0);
__decorate([
    Prop({ type: Boolean, default: false })
], ErCornerButton.prototype, "reversed", void 0);
ErCornerButton = __decorate([
    Component
], ErCornerButton);
export default ErCornerButton;
//# sourceMappingURL=script.js.map