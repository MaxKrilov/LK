import { __decorate } from "tslib";
import { Vue, Component, Prop } from 'vue-property-decorator';
const components = {};
let BlacklistRow = class BlacklistRow extends Vue {
    onDelete() {
        this.$emit('delete');
    }
    onChange(payload) {
        this.$emit('change', payload);
    }
    onPhoneChange(value) {
        const payload = {
            id: this.id,
            phone: value,
            comment: this.comment
        };
        this.onChange(payload);
    }
    onCommentChange(value) {
        const payload = {
            id: this.id,
            phone: value,
            comment: this.comment
        };
        this.$emit('change', payload);
    }
};
__decorate([
    Prop({ type: String, default: '' })
], BlacklistRow.prototype, "id", void 0);
__decorate([
    Prop({ type: String, default: '' })
], BlacklistRow.prototype, "phone", void 0);
__decorate([
    Prop({ type: String, default: '' })
], BlacklistRow.prototype, "comment", void 0);
BlacklistRow = __decorate([
    Component({ components })
], BlacklistRow);
export default BlacklistRow;
//# sourceMappingURL=script.js.map